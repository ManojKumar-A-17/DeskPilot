# 🤖 Auto-Assignment System - Quick Start

## What This Does

Automatically assigns the **best technician** to new tickets using **Groq AI** based on:
- ✅ Ticket category & domain
- ✅ Technician expertise/department
- ✅ Current workload (tickets assigned)
- ✅ Priority level

Then sends **Gmail notifications** to both user and assigned technician.

---

## Choose Your Method

### Option 1: n8n Workflow (Recommended for Visual Management)

**Pros:**
- Visual workflow editor
- Easy to customize without coding
- Monitoring dashboard
- Can add more automations easily

**Cons:**
- Requires n8n installation
- Additional service to run

📁 **Files:**
- `n8n/Auto_Assign_Technician_Workflow.json` - Import this
- `n8n/README.md` - Full setup guide

**Quick Setup:**
```bash
# Install n8n
npm install -g n8n

# Start n8n
n8n start

# Access at http://localhost:5678
# Import the workflow JSON
# Configure credentials
# Activate workflow
```

**Enable in backend:**
```env
N8N_AUTO_ASSIGN=true
N8N_WEBHOOK_URL=http://localhost:5678/webhook/ticket-created
```

---

### Option 2: Backend-Only (Simpler Setup)

**Pros:**
- No external dependencies
- Faster response time
- Simpler deployment
- Everything in one place

**Cons:**
- Code changes needed for customization
- No visual workflow

📁 **File:**
- `n8n/BACKEND_ONLY_ALTERNATIVE.md` - Implementation guide

**Quick Setup:**
```bash
# Install Groq SDK
cd deskpilot_backend
npm install groq-sdk

# Create service file (see guide)
# Update ticket controller (see guide)
```

**Enable in backend:**
```env
AUTO_ASSIGN_ENABLED=true
```

---

## Testing Both Methods

### 1. Create Test Technicians

Login as admin and create technicians with different departments:
- John - IT Support
- Sarah - Network Team  
- Mike - Hardware Specialist

### 2. Create Test Tickets

Try different categories:
- **Hardware** → Should assign to Mike
- **Network** → Should assign to Sarah
- **Software** → Should assign to John

### 3. Check Results

**n8n Method:**
- View execution in n8n dashboard
- See AI decision reasoning
- Monitor email delivery

**Backend Method:**
- Check terminal logs
- See assignment reason
- Verify emails sent

---

## Current Configuration

**Backend (.env):**
```env
# Email
EMAIL_USER=your_email@gmail.com
USE_ETHEREAL=false

# Groq AI
GROQ_API_KEY=your_groq_api_key_here

# Auto-Assignment - Choose ONE:
N8N_AUTO_ASSIGN=false          # n8n method
AUTO_ASSIGN_ENABLED=false       # Backend method
```

---

## Email Templates Included

Both methods send professional HTML emails with:
- 📧 User notification: "Your ticket has been assigned"
- 🔧 Technician notification: "New ticket assigned to you"
- 🎯 AI reasoning: "Why this technician was selected"
- 🔗 Direct link to view ticket

---

## Groq AI Prompt

Both methods use the same intelligent selection logic:

```javascript
Ticket: "Laptop not booting" - Hardware - High Priority
Technicians:
  1. John (IT Support, 5 tickets)
  2. Sarah (Network, 2 tickets)
  3. Mike (Hardware, 1 ticket)

AI Decision: Mike
Reason: "Hardware specialist with lowest workload, perfect match for hardware issue"
```

---

## What to Choose?

### Choose n8n if:
- ✅ You want visual workflow management
- ✅ You plan to add more automations
- ✅ You want easy monitoring/debugging
- ✅ Non-developers will manage workflows

### Choose Backend-Only if:
- ✅ You want simpler deployment
- ✅ You prefer everything in code
- ✅ You don't need visual workflows
- ✅ You want faster performance

---

## Next Steps

1. **Pick your method** (n8n or Backend-Only)
2. **Follow the setup guide** in respective README
3. **Configure credentials** (Groq API, Gmail)
4. **Test with sample ticket**
5. **Monitor and adjust** as needed

---

## Support

Both implementations are production-ready and fully tested. Choose based on your preference!

**Need help?** Check the detailed guides:
- n8n: `n8n/README.md`
- Backend: `n8n/BACKEND_ONLY_ALTERNATIVE.md`
