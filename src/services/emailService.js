const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Use environment variables for email configuration
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"SkillLink" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  // Welcome email
  welcome: (name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Welcome to SkillLink!</h1>
      <p>Hi ${name},</p>
      <p>Welcome to SkillLink by Semicolon. We're excited to have you on board!</p>
      <p>Get started by:</p>
      <ul>
        <li>Joining a cohort</li>
        <li>Viewing your assignments</li>
        <li>Connecting with your peers</li>
      </ul>
      <p>Happy learning!</p>
      <p style="color: #666; font-size: 12px;">- The SkillLink Team</p>
    </div>
  `,
  
  // Cohort invitation
  cohortInvite: (name, cohortName, inviteCode) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">You're Invited to Join ${cohortName}!</h1>
      <p>Hi ${name},</p>
      <p>You've been invited to join the <strong>${cohortName}</strong> cohort on SkillLink.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">Your invite code:</p>
        <h2 style="margin: 10px 0; color: #EF4444; letter-spacing: 2px;">${inviteCode}</h2>
      </div>
      <p>Use this code to join the cohort in SkillLink.</p>
      <p style="color: #666; font-size: 12px;">- The SkillLink Team</p>
    </div>
  `,
  
  // New assignment
  newAssignment: (name, assignmentTitle, dueDate, cohortName) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">New Assignment: ${assignmentTitle}</h1>
      <p>Hi ${name},</p>
      <p>A new assignment has been posted in <strong>${cohortName}</strong>.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Assignment:</strong> ${assignmentTitle}</p>
        <p style="margin: 10px 0 0 0;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
      </div>
      <p>Log in to SkillLink to view the details and submit your work.</p>
      <p style="color: #666; font-size: 12px;">- The SkillLink Team</p>
    </div>
  `,
  
  // Assignment graded
  assignmentGraded: (name, assignmentTitle, grade, feedback) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Your Assignment Has Been Graded</h1>
      <p>Hi ${name},</p>
      <p>Your submission for <strong>${assignmentTitle}</strong> has been graded.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Grade:</strong> ${grade}/100</p>
        ${feedback ? `<p style="margin: 10px 0 0 0;"><strong>Feedback:</strong> ${feedback}</p>` : ''}
      </div>
      <p>Log in to SkillLink to view the full details.</p>
      <p style="color: #666; font-size: 12px;">- The SkillLink Team</p>
    </div>
  `,
  
  // Deadline reminder
  deadlineReminder: (name, assignmentTitle, dueDate, hoursLeft) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">⏰ Assignment Deadline Approaching</h1>
      <p>Hi ${name},</p>
      <p>This is a reminder that <strong>${assignmentTitle}</strong> is due soon.</p>
      <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
        <p style="margin: 0;"><strong>Due:</strong> ${new Date(dueDate).toLocaleString()}</p>
        <p style="margin: 10px 0 0 0; color: #F59E0B;"><strong>${hoursLeft} hours remaining</strong></p>
      </div>
      <p>Don't forget to submit your work before the deadline!</p>
      <p style="color: #666; font-size: 12px;">- The SkillLink Team</p>
    </div>
  `,
  
  // Password reset
  passwordReset: (name, resetToken) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Password Reset Request</h1>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <div style="margin: 20px 0;">
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}" 
           style="background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="color: #666; font-size: 12px;">- The SkillLink Team</p>
    </div>
  `
};

// Specific email functions
const emailService = {
  sendWelcomeEmail: async (email, name) => {
    await sendEmail(email, 'Welcome to SkillLink!', emailTemplates.welcome(name));
  },
  
  sendCohortInvite: async (email, name, cohortName, inviteCode) => {
    await sendEmail(
      email,
      `You're invited to join ${cohortName}`,
      emailTemplates.cohortInvite(name, cohortName, inviteCode)
    );
  },
  
  sendNewAssignmentNotification: async (email, name, assignmentTitle, dueDate, cohortName) => {
    await sendEmail(
      email,
      `New Assignment: ${assignmentTitle}`,
      emailTemplates.newAssignment(name, assignmentTitle, dueDate, cohortName)
    );
  },
  
  sendGradeNotification: async (email, name, assignmentTitle, grade, feedback) => {
    await sendEmail(
      email,
      `Your assignment "${assignmentTitle}" has been graded`,
      emailTemplates.assignmentGraded(name, assignmentTitle, grade, feedback)
    );
  },
  
  sendDeadlineReminder: async (email, name, assignmentTitle, dueDate, hoursLeft) => {
    await sendEmail(
      email,
      `⏰ Reminder: ${assignmentTitle} due soon`,
      emailTemplates.deadlineReminder(name, assignmentTitle, dueDate, hoursLeft)
    );
  },
  
  sendPasswordResetEmail: async (email, name, resetToken) => {
    await sendEmail(
      email,
      'Password Reset Request',
      emailTemplates.passwordReset(name, resetToken)
    );
  }
};

module.exports = emailService;
