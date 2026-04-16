import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import {
  sendEmail,
  getNewTicketEmailTemplate,
  getTicketAssignmentEmailTemplate
} from '../config/email.js';
import { automateTicket, classifyTicketText } from '../services/ticketAutomationService.js';

const sendTicketEmail = (to, subject, html, logContext) => {
  if (!to) return;

  sendEmail(to, subject, html)
    .then(emailResult => {
      if (emailResult.disabled) {
        console.log(`Email notifications disabled for ${logContext}`);
      } else if (emailResult.success) {
        console.log(`Email sent successfully for ${logContext}`);
        if (emailResult.previewUrl) {
          console.log(`Email preview: ${emailResult.previewUrl}`);
        }
      } else {
        console.log(`Email failed for ${logContext}: ${emailResult.error}`);
      }
    })
    .catch(err => {
      console.error(`Email error for ${logContext}:`, err.message);
    });
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private (Employee, Technician, Admin)
export const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const initialClassification = classifyTicketText({ title, description, category, priority });

    const count = await Ticket.countDocuments();
    const ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;

    const ticket = await Ticket.create({
      ticketNumber,
      title,
      description,
      category: category || initialClassification.category,
      priority: priority || initialClassification.priority,
      createdBy: req.user._id
    });

    const automation = await automateTicket(ticket);

    await ticket.populate([
      { path: 'createdBy', select: 'name email role' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'aiSuggestions.suggestedTechnician', select: 'name email role' }
    ]);

    if (process.env.NOTIFICATION_EMAIL) {
      const emailHtml = getNewTicketEmailTemplate(ticket, ticket.createdBy);

      sendTicketEmail(
        process.env.NOTIFICATION_EMAIL,
        `New Ticket Created: ${ticket.ticketNumber} - ${ticket.title}`,
        emailHtml,
        `ticket ${ticket.ticketNumber}`
      );
    }

    if (automation.assignedTechnician?.email) {
      const assignmentHtml = getTicketAssignmentEmailTemplate(
        ticket,
        automation.assignedTechnician,
        'DeskPilot Automation'
      );

      sendTicketEmail(
        automation.assignedTechnician.email,
        `Ticket Assigned: ${ticket.ticketNumber} - ${ticket.title}`,
        assignmentHtml,
        `assignment ${ticket.ticketNumber}`
      );
    }

    res.status(201).json({
      success: true,
      message: automation.assignedTechnician
        ? 'Ticket created and auto-assigned successfully'
        : 'Ticket created successfully',
      data: {
        ticket,
        automation: {
          classification: automation.classification,
          assignedTechnician: automation.assignedTechnician,
          activeTickets: automation.activeTickets
        }
      }
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ticket',
      error: error.message
    });
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'employee') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'technician') {
      query.$or = [
        { assignedTo: req.user._id },
        { assignedTo: null }
      ];
    }

    const { status, priority, category } = req.query;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: { tickets }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
      error: error.message
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email role department phoneNumber')
      .populate('assignedTo', 'name email role department phoneNumber')
      .populate('comments.user', 'name email role')
      .populate('aiSuggestions.suggestedTechnician', 'name email role department')
      .populate('resolution.resolvedBy', 'name email role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (req.user.role === 'employee' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket'
      });
    }

    res.status(200).json({
      success: true,
      data: { ticket }
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private (Technician, Admin)
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (
      req.user.role === 'technician' &&
      ticket.assignedTo &&
      ticket.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this ticket'
      });
    }

    const { status, priority, assignedTo } = req.body;

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;

    if (status === 'Resolved' && !ticket.resolution.resolvedAt) {
      ticket.resolution.resolvedBy = req.user._id;
      ticket.resolution.resolvedAt = new Date();
    }

    await ticket.save();
    await ticket.populate([
      { path: 'createdBy', select: 'name email role' },
      { path: 'assignedTo', select: 'name email role' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: { ticket }
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ticket',
      error: error.message
    });
  }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date()
    });

    await ticket.save();
    await ticket.populate('comments.user', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: { comments: ticket.comments }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// @desc    Assign ticket to technician
// @route   PUT /api/tickets/:id/assign
// @access  Private (Admin)
export const assignTicket = async (req, res) => {
  try {
    const { technicianId } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (technicianId) {
      const technician = await User.findById(technicianId);
      if (!technician || technician.role !== 'technician') {
        return res.status(400).json({
          success: false,
          message: 'Invalid technician ID'
        });
      }
    }

    ticket.assignedTo = technicianId || null;
    if (technicianId && ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    await ticket.save();
    await ticket.populate([
      { path: 'createdBy', select: 'name email role' },
      { path: 'assignedTo', select: 'name email role' }
    ]);

    if (technicianId && ticket.assignedTo?.email) {
      const assignmentHtml = getTicketAssignmentEmailTemplate(
        ticket,
        ticket.assignedTo,
        req.user.name || req.user.email || 'Admin'
      );

      sendTicketEmail(
        ticket.assignedTo.email,
        `Ticket Assigned: ${ticket.ticketNumber} - ${ticket.title}`,
        assignmentHtml,
        `assignment ${ticket.ticketNumber}`
      );
    }

    res.status(200).json({
      success: true,
      message: technicianId ? 'Ticket assigned successfully' : 'Ticket unassigned successfully',
      data: { ticket }
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning ticket',
      error: error.message
    });
  }
};

// @desc    Get ticket statistics
// @route   GET /api/tickets/stats
// @access  Private (Admin)
export const getTicketStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });

    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalTickets,
        byStatus: {
          open: openTickets,
          inProgress: inProgressTickets,
          resolved: resolvedTickets,
          closed: closedTickets
        },
        byPriority: priorityStats,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
