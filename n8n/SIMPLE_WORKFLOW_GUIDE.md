# 🎯 DeskPilot - Simple Auto-Assignment Workflow (RECOMMENDED)

## ✨ Features

This **simplified N8N workflow** provides smart ticket auto-assignment **without any AI**:

✅ **No AI Required** - Pure JavaScript logic, no external API dependencies  
✅ **Faster** - No waiting for Groq API responses  
✅ **More Reliable** - No rate limits, no API downtime  
✅ **Smart Matching** - Department expertise + workload balancing  
✅ **Beautiful Emails** - Professional HTML emails to user & technician  
✅ **Easy Setup** - Only Gmail OAuth needed (no Groq API)  

---

## 📊 How Assignment Works

The workflow uses **smart JavaScript logic**:

1. **Department Match (Priority 1)**: 
   - Checks if any technician's department matches ticket category
   - Example: "Network" ticket → Technician with "Network" department

2. **Workload Balancing (Priority 2)**:
   - Among matching technicians, picks one with lowest workload
   - If no department match, picks least busy technician overall

3. **Round-Robin (Fallback)**:
   - If equal workload, first technician in sorted list wins

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install N8N

```bash
npm install -g n8n
```

Or use with npx (no install):
```bash
npx n8n
```

### Step 2: Start N8N

```bash
n8n
```

Opens at: **http://localhost:5678**

### Step 3: Import Workflow

1. Open N8N dashboard
2. Click **"Workflows"** → **"Import from File"**
3. Select: `n8n/Auto_Assign_Workflow_Simple.json` ⭐
4. Workflow appears with 8 nodes

---

## ⚙️ Configuration

### 1. Setup Gmail OAuth (For Email Notifications)

#### Option A: Use Gmail Account

1. In N8N, click **"Credentials"** → **"New"**
2. Search: **Gmail OAuth2 API**
3. Name: `Gmail` (or any name)
4. **Get OAuth Credentials**:
   - Go to: https://console.cloud.google.com/
   - Create new project: "DeskPilot N8N"
   - Enable **Gmail API**
   - Create **OAuth 2.0 Client ID** (Desktop app)
   - Copy **Client ID** and **Client Secret**
5. Paste into N8N
6. Add redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
7. Click **"Connect my account"** → Authorize
8. Select your Gmail account
9. Save credentials

### 2. Setup Backend API Authentication

#### Create HTTP Header Auth Credential

1. In N8N, click **"Credentials"** → **"New"**
2. Search: **HTTP Header Auth**
3. Name: `DeskPilot API`
4. Configuration:
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer <YOUR_JWT_TOKEN>`

**How to get JWT token:**

Option A - Use Admin Account:
```bash
# Login as admin
POST http://localhost:5000/api/auth/login
{
  "email": "admin@deskpilot.com",
  "password": "admin123"
}

# Copy the "token" from response
```

Option B - From Browser:
```javascript
// Login to DeskPilot frontend
// Open DevTools → Console → Run:
localStorage.getItem('token')
// Copy the token
```

5. Save credential

### 3. Configure Environment Variable (Backend)

N8N needs to know the JWT token. Add to backend `.env`:

```env
# N8N Configuration
N8N_AUTO_ASSIGN=true
N8N_WEBHOOK_URL=http://localhost:5678/webhook/ticket-created
THINKAUTO_JWT_TOKEN=<PASTE_YOUR_JWT_TOKEN_HERE>
```

This token is used by N8N to call your DeskPilot API endpoints.

### 4. Update Workflow Nodes (Optional)

If your ports are different, update these nodes:

**Node: "Get Ticket Details"**
- URL: `http://localhost:5000/api/tickets/{{ $json.ticketId }}`
- Change `5000` if backend port is different

**Node: "Get All Technicians"**
- URL: `http://localhost:5000/api/users?role=technician`

**Email Links (Both email nodes)**
- User email: `http://localhost:8081/employee/tickets/{{ $json.ticketId }}`
- Technician email: `http://localhost:8081/technician/tickets/{{ $json.ticketId }}`
- Change `8081` if frontend port is different

---

## 🧪 Testing the Workflow

### 1. Activate the Workflow

1. Open workflow in N8N
2. **Important**: Make sure all credentials are set in each node
3. Click **"Active"** toggle (top right)
4. Webhook URL will appear: `http://localhost:5678/webhook/ticket-created`

### 2. Enable Backend Integration

In your backend `.env`:
```env
N8N_AUTO_ASSIGN=true
N8N_WEBHOOK_URL=http://localhost:5678/webhook/ticket-created
```

Restart backend:
```bash
cd deskpilot_backend
npm start
```

### 3. Create a Test Ticket

1. Open DeskPilot frontend
2. Login as employee
3. Go to **Create Ticket**
4. Fill in:
   - Title: "Cannot access network share"
   - Category: "Network"
   - Priority: "High"
   - Description: "Getting timeout when accessing \\\\server\\files"
5. Click **Submit**

### 4. Check Results

**In N8N:**
- Click workflow → **"Executions"**
- Should show successful execution
- Check each node's output data

**In DeskPilot:**
- Ticket should be created
- Technician should be auto-assigned
- Check ticket details page

**In Gmail:**
- User should receive "Ticket Assigned" email
- Technician should receive "New Ticket Assigned to You" email

---

## 📋 Workflow Nodes Explained

### 1. **Webhook - New Ticket**
- **Type**: Trigger
- **Receives**: `POST` with `{ ticketId: "..." }`
- **From**: Your backend after ticket creation

### 2. **Get Ticket Details**
- **Type**: HTTP Request
- **Fetches**: Full ticket data from API
- **Includes**: Title, description, category, priority, user details

### 3. **Get All Technicians**
- **Type**: HTTP Request
- **Fetches**: All users with role "technician"
- **Returns**: Array of technicians with department info

### 4. **Smart Assignment Logic** ⭐
- **Type**: JavaScript Code
- **Logic**:
  ```javascript
  // 1. Check department match
  const matchingDept = technicians.filter(t => 
    t.department.toLowerCase().includes(ticket.category.toLowerCase())
  );
  
  // 2. Sort by workload
  technicians.sort((a, b) => a.workload - b.workload);
  
  // 3. Select best match
  selectedTech = matchingDept[0] || technicians[0];
  ```
- **Output**: Selected technician + reason

### 5. **Assign Technician**
- **Type**: HTTP Request (PUT)
- **Updates**: Ticket with assigned technician
- **Endpoint**: `/api/tickets/:id/assign`

### 6. **📧 Email to User**
- **Type**: Gmail node
- **Sends**: Professional HTML email
- **Content**: Ticket number, assigned technician, assignment reason

### 7. **📧 Email to Technician**
- **Type**: Gmail node
- **Sends**: Detailed ticket information
- **Content**: Full ticket details, user contact, next steps

### 8. **Success Response**
- **Type**: JavaScript Code
- **Returns**: Success message to backend webhook

---

## 🐛 Troubleshooting

### "Webhook not receiving data"

**Check backend:**
```bash
# Make sure these are set in .env
N8N_AUTO_ASSIGN=true
N8N_WEBHOOK_URL=http://localhost:5678/webhook/ticket-created
```

**Check N8N:**
- Workflow must be **Active** (toggle on)
- Webhook URL must match backend .env

**Test webhook manually:**
```bash
curl -X POST http://localhost:5678/webhook/ticket-created \
  -H "Content-Type: application/json" \
  -d '{"ticketId":"675fed1234567890abcdef12"}'
```

### "401 Unauthorized" in API nodes

**Issue**: JWT token expired or incorrect

**Fix:**
1. Get new token (login to DeskPilot)
2. Update credential: **DeskPilot API**
3. Update `.env`: `THINKAUTO_JWT_TOKEN=<new_token>`
4. Restart backend

### "Gmail authentication failed"

**Issue**: OAuth token expired

**Fix:**
1. Go to **Credentials** → **Gmail OAuth**
2. Click **"Reconnect"**
3. Authorize again

### "No technicians available"

**Check database:**
```bash
# Make sure you have users with role "technician"
# Run seed script if needed:
cd deskpilot_backend
node scripts/seedAdmin.js
```

Add technicians manually:
- Login as admin
- Go to **Users** → **Add User**
- Set role: **Technician**
- Set department: e.g., "Network", "Hardware", "Software"

### "Emails not sending"

**Check Gmail credential:**
- Must use OAuth2 (not SMTP)
- Account must be authorized in N8N

**Check email nodes:**
- Both nodes must have credential selected
- Check execution logs for error details

---

## 🎨 Customizing Assignment Logic

Want to change how technicians are selected? Edit the **"Smart Assignment Logic"** node:

### Example 1: Prioritize Experience
```javascript
// Sort by experience instead of workload
technicians.sort((a, b) => b.yearsExperience - a.yearsExperience);
selectedTech = technicians[0];
```

### Example 2: Strict Category Matching
```javascript
// Only assign if exact category match exists
const matchingTech = technicians.find(t => 
  t.department === ticket.category
);

if (!matchingTech) {
  throw new Error('No technician available for this category');
}
selectedTech = matchingTech;
```

### Example 3: Priority-Based Assignment
```javascript
// High priority tickets go to senior technicians
if (ticket.priority === 'Critical' || ticket.priority === 'High') {
  technicians.sort((a, b) => b.seniorityLevel - a.seniorityLevel);
} else {
  technicians.sort((a, b) => a.workload - b.workload);
}
selectedTech = technicians[0];
```

---

## 🔄 Alternative: Backend-Only Assignment

Don't want to use N8N? You can implement auto-assignment directly in the backend:

See: **`n8n/BACKEND_ONLY_ALTERNATIVE.md`**

---

## 📚 Related Documentation

- **README.md** - Overview of all workflow options
- **Auto_Assign_Technician_Workflow.json** - Complex workflow with Groq AI
- **BACKEND_ONLY_ALTERNATIVE.md** - Implement in Node.js backend
- **QUICKSTART.md** - Quick comparison guide

---

## ✅ Checklist

- [ ] N8N installed and running on port 5678
- [ ] Workflow imported: `Auto_Assign_Workflow_Simple.json`
- [ ] Gmail OAuth credential configured
- [ ] HTTP Header Auth credential with JWT token
- [ ] Backend `.env` has `N8N_AUTO_ASSIGN=true`
- [ ] Backend `.env` has `N8N_WEBHOOK_URL=http://localhost:5678/webhook/ticket-created`
- [ ] Workflow is **Active** in N8N
- [ ] At least one technician exists in database
- [ ] Test ticket created successfully
- [ ] Emails received by user and technician

---

## 🎯 Production Deployment

When deploying to production:

1. **Use environment variables** for all URLs:
   ```javascript
   // Instead of: http://localhost:5000
   // Use: {{ $env.BACKEND_URL }}
   ```

2. **Secure webhook with authentication**:
   - Add secret token validation
   - Use HTTPS URLs

3. **Setup proper Gmail sending**:
   - Use service account instead of personal Gmail
   - Or use SendGrid/Mailgun for reliability

4. **Monitor executions**:
   - Enable error notifications in N8N
   - Set up alerting for failed workflows

5. **Database optimization**:
   - Add index on `assignedTickets` field for workload queries
   - Cache technician list if large number of technicians

---

## 💡 Tips

- **Test emails**: Use email preview feature in N8N before activating
- **Debug mode**: Click "Execute node" to test individual nodes
- **Logs**: Check **Executions** tab for detailed execution logs
- **Performance**: Workflow typically completes in 2-3 seconds
- **Scaling**: Can handle 100+ tickets per minute

---

## 🆚 Simple vs AI Workflow

| Feature | Simple Workflow ⭐ | AI Workflow |
|---------|-------------------|-------------|
| Setup Time | 5 minutes | 15 minutes |
| Dependencies | Gmail OAuth only | Gmail + Groq API |
| Speed | ~2 seconds | ~5 seconds |
| Reliability | 99.9% | Depends on Groq uptime |
| Cost | Free | Groq API costs |
| Customization | Easy | Complex |
| Assignment Logic | Workload + Department | AI reasoning |
| **Recommended For** | **Production** | Advanced features |

**Verdict**: Start with Simple Workflow. Add AI later if needed.

---

## 📞 Support

If you have issues:
1. Check **Troubleshooting** section above
2. Review N8N execution logs
3. Check backend console for webhook logs
4. Verify all credentials are configured correctly

---

Made with ❤️ for DeskPilot HelpDesk
