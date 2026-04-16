import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

const CATEGORY_KEYWORDS = {
  Network: ['vpn', 'network', 'wifi', 'wi-fi', 'internet', 'router', 'lan', 'wan', 'dns', 'proxy', 'firewall'],
  Hardware: ['laptop', 'desktop', 'monitor', 'printer', 'keyboard', 'mouse', 'projector', 'device', 'server', 'hardware'],
  Software: ['software', 'application', 'app', 'install', 'license', 'crash', 'update', 'patch', 'windows', 'office'],
  'Access & Permissions': ['password', 'login', 'access', 'permission', 'account', 'unlock', 'role', 'privilege', 'mfa', 'otp'],
  Email: ['email', 'mail', 'outlook', 'smtp', 'inbox', 'signature', 'calendar', 'attachment']
};

const PRIORITY_KEYWORDS = {
  Critical: ['critical', 'urgent', 'down', 'outage', 'production', 'security breach', 'cannot work', 'complete failure'],
  High: ['blocked', 'not working', 'failed', 'failure', 'unable', 'deadline', 'high priority'],
  Medium: ['slow', 'issue', 'problem', 'error', 'request'],
  Low: ['question', 'minor', 'cosmetic', 'when possible', 'low priority']
};

const PRIORITY_WEIGHT = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

const normalize = (value = '') => value.toString().toLowerCase();

const countKeywordMatches = (text, keywords) => (
  keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0)
);

export const classifyTicketText = ({ title, description, category, priority }) => {
  const text = normalize(`${title} ${description}`);

  const categoryScores = Object.entries(CATEGORY_KEYWORDS).map(([name, keywords]) => ({
    name,
    score: countKeywordMatches(text, keywords)
  }));
  categoryScores.sort((a, b) => b.score - a.score);

  const priorityScores = Object.entries(PRIORITY_KEYWORDS).map(([name, keywords]) => ({
    name,
    score: countKeywordMatches(text, keywords)
  }));
  priorityScores.sort((a, b) => b.score - a.score);

  const suggestedCategory = categoryScores[0]?.score > 0 ? categoryScores[0].name : category || 'Other';
  const suggestedPriority = priorityScores[0]?.score > 0 ? priorityScores[0].name : priority || 'Medium';

  return {
    category: suggestedCategory,
    priority: suggestedPriority,
    confidence: Math.min(0.95, 0.55 + ((categoryScores[0]?.score || 0) * 0.12))
  };
};

const getTechnicianWorkloads = async () => {
  const technicians = await User.find({ role: 'technician', isActive: true }).select('name email department');

  const workloads = await Ticket.aggregate([
    {
      $match: {
        assignedTo: { $ne: null },
        status: { $in: ['Open', 'In Progress', 'On Hold'] }
      }
    },
    {
      $group: {
        _id: '$assignedTo',
        activeTickets: { $sum: 1 }
      }
    }
  ]);

  const workloadMap = new Map(workloads.map((item) => [item._id.toString(), item.activeTickets]));

  return technicians.map((technician) => ({
    technician,
    activeTickets: workloadMap.get(technician._id.toString()) || 0
  }));
};

const scoreTechnician = ({ technician, activeTickets }, classification) => {
  const profile = normalize(`${technician.name} ${technician.department}`);
  const categoryTerms = CATEGORY_KEYWORDS[classification.category] || [];
  const specialtyMatches = countKeywordMatches(profile, [
    classification.category,
    ...categoryTerms
  ]);

  const specialtyScore = specialtyMatches > 0 ? 30 : 0;
  const workloadPenalty = activeTickets * 4;
  const urgencyBoost = PRIORITY_WEIGHT[classification.priority] || 2;

  return specialtyScore + urgencyBoost - workloadPenalty;
};

export const findBestTechnician = async (classification) => {
  const technicianWorkloads = await getTechnicianWorkloads();

  if (technicianWorkloads.length === 0) {
    return null;
  }

  const ranked = technicianWorkloads
    .map((item) => ({
      ...item,
      score: scoreTechnician(item, classification)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.activeTickets - b.activeTickets;
    });

  return ranked[0];
};

export const automateTicket = async (ticket) => {
  const classification = classifyTicketText(ticket);
  const shouldAutoAssign = process.env.AUTO_ASSIGN_TICKETS !== 'false';
  const bestMatch = shouldAutoAssign ? await findBestTechnician(classification) : null;

  ticket.aiSuggestions = {
    suggestedTechnician: bestMatch?.technician?._id || null,
    confidence: classification.confidence,
    category: classification.category
  };

  if (bestMatch?.technician) {
    ticket.assignedTo = bestMatch.technician._id;
    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }
  }

  await ticket.save();

  return {
    classification,
    assignedTechnician: bestMatch?.technician || null,
    activeTickets: bestMatch?.activeTickets ?? null
  };
};
