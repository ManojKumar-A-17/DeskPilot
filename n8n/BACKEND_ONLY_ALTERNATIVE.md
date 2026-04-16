# Alternative: Backend-Only Auto-Assignment (Without n8n)

If you prefer not to use n8n, here's how to implement auto-assignment directly in your backend.

## Implementation

### 1. Create Auto-Assignment Service

Create file: `deskpilot_backend/services/autoAssign.js`

```javascript
import Groq from 'groq-sdk';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import { sendEmail } from '../config/email.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const autoAssignTechnician = async (ticketId) => {
  try {
    console.log(`🤖 Starting auto-assignment for ticket: ${ticketId}`);
    
    // 1. Fetch ticket with full details
    const ticket = await Ticket.findById(ticketId)
      .populate('createdBy', 'name email role department');
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // 2. Get available technicians
    const technicians = await User.find({ 
      role: 'technician',
      isActive: true 
    }).select('name email department');

    if (technicians.length === 0) {
      console.log('⚠️ No technicians available');
      return;
    }

    // Get ticket counts for each technician
    const technicianWorkload = await Promise.all(
      technicians.map(async (tech) => {
        const count = await Ticket.countDocuments({
          assignedTo: tech._id,
          status: { $in: ['Open', 'In Progress'] }
        });
        return { ...tech.toObject(), assignedTickets: count };
      })
    );

    // 3. Use Groq AI to select best technician
    const prompt = `You are an IT helpdesk AI that assigns technicians based on ticket details.

Ticket Information:
- Title: ${ticket.title}
- Description: ${ticket.description}
- Category: ${ticket.category}
- Priority: ${ticket.priority}

Available Technicians:
${technicianWorkload.map((tech, idx) => 
  `${idx + 1}. ${tech.name} - Department: ${tech.department || 'General'} - Workload: ${tech.assignedTickets} tickets`
).join('\\n')}

Analyze the ticket and select the BEST technician based on:
1. Department match (if ticket category matches technician department)
2. Current workload (prefer less busy technicians)
3. Expertise area

Respond with ONLY a JSON object in this exact format:
{
  "selectedTechnicianIndex": 0,
  "reason": "Brief reason for selection"
}

Do not include any other text, just the JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 200
    });

    // 4. Parse AI response
    const aiResponse = completion.choices[0].message.content;
    const jsonMatch = aiResponse.match(/\\{[^{}]*\\}/);
    const aiDecision = JSON.parse(jsonMatch[0]);
    
    const selectedTech = technicianWorkload[aiDecision.selectedTechnicianIndex];

    // 5. Assign technician to ticket
    ticket.assignedTo = selectedTech._id;
    await ticket.save();
    await ticket.populate('assignedTo', 'name email');

    console.log(`✅ Ticket ${ticket.ticketNumber} assigned to ${selectedTech.name}`);
    console.log(`🎯 Reason: ${aiDecision.reason}`);

    // 6. Send email to user
    const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #FF6B35; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎫 Technician Assigned</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${ticket.createdBy.name}</strong>,</p>
      <p>Your support ticket has been assigned to a technician.</p>
      <div class="info-box">
        <p><strong>Ticket:</strong> ${ticket.ticketNumber}</p>
        <p><strong>Technician:</strong> ${selectedTech.name}</p>
        <p><strong>Reason:</strong> ${aiDecision.reason}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    await sendEmail(
      ticket.createdBy.email,
      `Ticket ${ticket.ticketNumber} - Assigned to Technician`,
      userEmailHtml
    );

    // 7. Send email to technician
    const techEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔧 New Ticket Assigned</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${selectedTech.name}</strong>,</p>
      <p><strong>Ticket:</strong> ${ticket.ticketNumber}</p>
      <p><strong>Title:</strong> ${ticket.title}</p>
      <p><strong>Priority:</strong> ${ticket.priority}</p>
      <p><strong>Why you?</strong> ${aiDecision.reason}</p>
    </div>
  </div>
</body>
</html>`;

    await sendEmail(
      selectedTech.email,
      `New Ticket Assigned: ${ticket.ticketNumber}`,
      techEmailHtml
    );

    return {
      success: true,
      assignedTo: selectedTech.name,
      reason: aiDecision.reason
    };

  } catch (error) {
    console.error('❌ Auto-assignment failed:', error);
    return { success: false, error: error.message };
  }
};
```

### 2. Install Groq SDK

```bash
cd deskpilot_backend
npm install groq-sdk
```

### 3. Update Ticket Controller

In `ticketController.js`, add after ticket creation:

```javascript
import { autoAssignTechnician } from '../services/autoAssign.js';

// After creating ticket...
if (process.env.AUTO_ASSIGN_ENABLED === 'true') {
  // Run in background
  autoAssignTechnician(ticket._id).then(result => {
    if (result.success) {
      console.log(`✅ Auto-assigned: ${result.assignedTo}`);
    }
  });
}
```

### 4. Update .env

```env
# Auto-Assignment (Backend Only)
AUTO_ASSIGN_ENABLED=true
```

### 5. Usage

Just create a ticket - it will automatically:
- ✅ Select best technician using Groq AI
- ✅ Assign to ticket
- ✅ Send emails to both parties

## Comparison: n8n vs Backend-Only

| Feature | n8n Workflow | Backend-Only |
|---------|--------------|--------------|
| Setup Complexity | Medium | Easy |
| Visual Workflow | ✅ Yes | ❌ No |
| External Dependency | ✅ Need n8n | ❌ None |
| Customization | Easy drag-drop | Code changes |
| Monitoring | n8n Dashboard | Backend logs |
| Performance | Slightly slower | Faster |

## Recommendation

- **Use n8n** if you want visual workflow management
- **Use Backend-Only** if you want simpler deployment

Both use the same Groq AI logic for intelligent assignment!
