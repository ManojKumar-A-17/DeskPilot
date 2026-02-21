# Email Notification Setup Guide

## Overview
The ThinkAuto HelpDesk system now sends automatic email notifications when new tickets are created.

## Features
✅ Automatic email on ticket creation  
✅ Beautiful HTML email template  
✅ Ticket details included (number, title, priority, category)  
✅ Direct link to view ticket  

## Configuration Steps

### 1. Set up Gmail App Password (Recommended)

If you're using Gmail, you need to create an App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left menu
3. Enable **2-Step Verification** if not already enabled
4. After enabling 2-Step, go back to Security
5. Search for **App passwords**
6. Click on **App passwords**
7. Select app: **Mail**
8. Select device: **Other (Custom name)** → Type "ThinkAuto HelpDesk"
9. Click **Generate**
10. Copy the 16-character password (remove spaces)

### 2. Update .env File

Open `thinkauto_backend/.env` and update these values:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
# Email Notifications - Who receives ticket creation emails
NOTIFICATION_EMAIL=aamanojkumar190@gmail.com
```

**Example:**
```env
EMAIL_USER=helpdesk@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
NOTIFICATION_EMAIL=aamanojkumar190@gmail.com
```

### 3. Multiple Recipients (Optional)

To send emails to multiple people, separate emails with commas:

```env
NOTIFICATION_EMAIL=aamanojkumar190@gmail.com,admin@example.com,manager@example.com
```

### 4. Using Other Email Services

#### Outlook/Hotmail
```env
service: 'hotmail'
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Custom SMTP Server
Edit `config/email.js` and replace the transporter configuration:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.yourserver.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### 5. Restart Backend Server

After updating .env, restart your backend server:

```bash
cd thinkauto_backend
npm run dev
```

## Email Template

The email includes:
- Ticket Number
- Title
- Priority (color-coded)
- Category
- Creator information
- Full description
- Direct link to view ticket

## Testing

1. Make sure your backend is running
2. Go to the frontend: http://localhost:8081
3. Create a new ticket
4. Check the email inbox at `aamanojkumar190@gmail.com`

## Troubleshooting

### Email not sending?

1. **Check Console Logs**: Look for email errors in backend terminal
2. **Verify Credentials**: Make sure EMAIL_USER and EMAIL_PASSWORD are correct
3. **App Password**: For Gmail, you MUST use App Password, not regular password
4. **2-Step Verification**: Gmail requires 2-Step Verification to use App Passwords
5. **Check Spam Folder**: Sometimes emails land in spam

### Common Errors

**"Invalid login"**
- Double-check your email and password
- For Gmail, make sure you're using App Password

**"Connection timeout"**
- Check your internet connection
- Some networks block SMTP ports

**"Authentication failed"**
- Verify 2-Step Verification is enabled (Gmail)
- Regenerate App Password

## Customization

### Change Email Template

Edit `config/email.js` → `getNewTicketEmailTemplate()` function to customize:
- HTML structure
- Colors and styling
- Email content
- Add company logo

### Add More Notification Types

You can add emails for:
- Ticket assignment
- Status changes
- Comments added
- Ticket resolution

Just call `sendEmail()` in the respective controller actions.

## Security Notes

⚠️ **Never commit .env file to Git**  
⚠️ **Keep App Passwords secure**  
⚠️ **Use environment variables in production**  

## Support

If you need help setting up email notifications, please contact the development team.
