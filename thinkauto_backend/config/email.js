import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const createTransporter = async () => {
  // For testing: Use Ethereal Email (fake SMTP service)
  // Create a test account if USE_ETHEREAL is true
  if (process.env.USE_ETHEREAL === 'true') {
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('📧 Using Ethereal Email for testing');
    console.log('📧 Ethereal account:', testAccount.user);
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    return transporter;
  }
  
  // For production: Use Gmail with port 465 (SSL) - more reliable than 587
  console.log('📧 Using Gmail SMTP (SSL - Port 465)');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
  
  return transporter;
};

// Send email function
export const sendEmail = async (to, subject, html) => {
  // Skip email if disabled
  if (process.env.USE_ETHEREAL === 'disabled') {
    console.log('📧 Email notifications are disabled');
    console.log('📧 Would have sent:', subject);
    return { success: true, messageId: 'disabled', disabled: true };
  }

  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `ThinkAuto HelpDesk <${process.env.EMAIL_USER || 'noreply@thinkauto.com'}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
    // If using Ethereal, log the preview URL
    if (process.env.USE_ETHEREAL === 'true') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🌐 Preview email at: ' + previewUrl);
        console.log('👆 Copy this URL to your browser to view the email');
      }
    }
    
    return { success: true, messageId: info.messageId, previewUrl: process.env.USE_ETHEREAL === 'true' ? nodemailer.getTestMessageUrl(info) : null };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

// Email template for new ticket creation
export const getNewTicketEmailTemplate = (ticket, creator) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .ticket-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .ticket-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #FF6B35; }
        .priority { padding: 4px 12px; border-radius: 5px; display: inline-block; font-size: 12px; font-weight: bold; }
        .priority-high { background: #ff4444; color: white; }
        .priority-medium { background: #ffa500; color: white; }
        .priority-low { background: #4CAF50; color: white; }
        .priority-critical { background: #d32f2f; color: white; }
        .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎫 New Ticket Created</h1>
          <p style="margin: 5px 0 0 0;">ThinkAuto AI HelpDesk</p>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>A new support ticket has been created and requires attention.</p>
          
          <div class="ticket-info">
            <div class="ticket-row">
              <span class="label">Ticket Number:</span> ${ticket.ticketNumber}
            </div>
            <div class="ticket-row">
              <span class="label">Title:</span> ${ticket.title}
            </div>
            <div class="ticket-row">
              <span class="label">Priority:</span> 
              <span class="priority priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span>
            </div>
            <div class="ticket-row">
              <span class="label">Category:</span> ${ticket.category}
            </div>
            <div class="ticket-row">
              <span class="label">Created By:</span> ${creator.name} (${creator.email})
            </div>
            <div class="ticket-row">
              <span class="label">Description:</span><br/>
              ${ticket.description}
            </div>
          </div>
          
          <p>Please log in to the ThinkAuto HelpDesk to view and manage this ticket.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:8081" style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              View Ticket
            </a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from ThinkAuto AI HelpDesk</p>
          <p>© ${new Date().getFullYear()} ThinkAuto. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default { sendEmail, getNewTicketEmailTemplate };
