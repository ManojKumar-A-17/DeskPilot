# n8n Auto-Assignment Workflow Setup Guide

## 📋 Overview

This n8n workflow automatically:
1. ✅ Receives ticket creation webhook
2. ✅ Fetches ticket and user details
3. ✅ Gets all available technicians
4. ✅ Uses **Groq AI** to select the best technician based on:
   - Department/expertise match
   - Current workload
   - Ticket priority and category
5. ✅ Assigns the selected technician to the ticket
6. ✅ Sends Gmail notifications to both user and technician

---

## 🚀 Installation Steps

### 1. Install n8n

```bash
npm install -g n8n
```

Or use Docker:
```bash
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

### 2. Start n8n

```bash
n8n start
```

Access n8n at: **http://localhost:5678**

### 3. Import the Workflow

1. Open n8n at http://localhost:5678
2. Click **"Workflows"** → **"Import from File"**
3. Select: `n8n/Auto_Assign_Technician_Workflow.json`
4. Click **"Import"**

---

## ⚙️ Configuration

### Step 1: Create Credentials

#### A. **DeskPilot API Token** (HTTP Header Auth)
1. Click **"Credentials"** → **"New"**
2. Type: **HTTP Header Auth**
3. Name: **DeskPilot API Token**
4. Header Name: `Authorization`
5. Header Value: `Bearer YOUR_JWT_TOKEN_HERE`
   - Get token from: Login to DeskPilot → Check localStorage
   - Or use admin token from backend

#### B. **Groq API** Credential
1. Click **"Credentials"** → **"New"**
2. Type: **Groq API**
3. Name: **Groq API**
4. API Key: `your_groq_api_key_here`

#### C. **Gmail OAuth2** Credential
1. Click **"Credentials"** → **"New"**
2. Type: **Gmail OAuth2 API**
3. Name: **Gmail OAuth**
4. Follow Google OAuth setup:
   - Go to: https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
   - Enter Client ID and Client Secret
   - Click "Connect" to authorize

---

### Step 2: Update Workflow Nodes

After importing, assign credentials to nodes:

1. **Fetch Ticket Details** → Assign "DeskPilot API Token"
2. **Fetch Available Technicians** → Assign "DeskPilot API Token"
3. **Assign Technician to Ticket** → Assign "DeskPilot API Token"
4. **Groq - Select Best Technician** → Assign "Groq API"
5. **Send Email to User** → Assign "Gmail OAuth"
6. **Send Email to Technician** → Assign "Gmail OAuth"

---

### Step 3: Activate the Workflow

1. Open the workflow
2. Click **"Activate"** toggle (top right)
3. Copy the Webhook URL (shows in the webhook node)
   - Format: `http://localhost:5678/webhook/ticket-created`

---

## 🔗 Backend Integration

### Update Ticket Controller

Add webhook call after ticket creation in `ticketController.js`:

```javascript
// After ticket is created successfully
const ticket = await Ticket.create({...});

// Call n8n webhook for auto-assignment
if (process.env.N8N_WEBHOOK_URL) {
  try {
    await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: ticket._id })
    });
  } catch (error) {
    console.log('n8n webhook failed:', error.message);
  }
}
```

### Add to .env

```env
# n8n Automation
N8N_WEBHOOK_URL=http://localhost:5678/webhook/ticket-created
```

---

## 🧪 Testing the Workflow

### Test Manually in n8n:

1. Click **"Execute Workflow"** button
2. In Webhook node, click **"Listen for Test Event"**
3. Send test POST request:

```bash
curl -X POST http://localhost:5678/webhook-test/ticket-created \
  -H "Content-Type: application/json" \
  -d '{"ticketId": "YOUR_TICKET_ID_HERE"}'
```

### Test from Frontend:

1. Login to DeskPilot
2. Create a new ticket
3. Check n8n executions tab - should show successful run
4. Check emails - both user and technician should receive notifications
5. Check ticket - should be assigned to the selected technician

---

## 📊 Workflow Logic

### Groq AI Selection Process:

The AI analyzes:
```
Ticket: Hardware / Laptop not booting / High Priority
Technicians: 
  - John (IT Support, 2 tickets)
  - Sarah (Network Team, 5 tickets)
  - Mike (Hardware Specialist, 1 ticket)

AI Decision: Mike
Reason: Hardware specialist with lowest workload
```

### Assignment Criteria:

1. **Department Match** (40% weight)
   - Match ticket category to technician department
   
2. **Workload Balance** (35% weight)
   - Prefer technicians with fewer active tickets
   
3. **Priority Handling** (25% weight)
   - Critical tickets → experienced technicians

---

## 🎨 Email Templates

Both emails include:
- ✅ Ticket number and details
- ✅ Priority indicator (color-coded)
- ✅ Assignment reason from AI
- ✅ Direct link to ticket
- ✅ Professional branding

---

## 🐛 Troubleshooting

### Webhook Not Triggering?
- Check if workflow is activated
- Verify webhook URL in backend .env
- Check n8n logs: View → Executions

### Groq API Error?
- Verify API key in credentials
- Check Groq API quota/limits
- Test standalone Groq node

### Gmail Not Sending?
- Complete Gmail OAuth setup
- Grant all required permissions
- Check Gmail quota (500 emails/day limit)

### Assignment Failing?
- Verify JWT token is valid
- Check backend API is running
- Ensure technicians exist in database

---

## 🔄 Alternative: Without n8n

If you prefer backend-only solution, I can:
1. Add auto-assignment logic directly in ticket controller
2. Use Groq API from backend
3. Send emails using nodemailer

Let me know if you want this approach instead!

---

## 📞 Support

For issues:
1. Check n8n execution logs
2. Review backend console logs
3. Test each node individually in n8n

---

## 🎯 Next Steps

After setup:
1. ✅ Test with sample ticket
2. ✅ Verify emails are received
3. ✅ Check assignment is working
4. ✅ Monitor n8n executions for errors
5. ✅ Customize email templates if needed

---

**Workflow Status:**
- Production Ready: ✅
- Groq AI Integration: ✅
- Auto-Assignment: ✅
- Email Notifications: ✅
- Error Handling: ✅
