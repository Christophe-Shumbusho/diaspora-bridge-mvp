export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface NotificationData {
  mentorName: string
  menteeName: string
  mentorField: string
  conversationId: string
  messageContent?: string
  expiresAt?: Date
}

// Import mentors for matching
import { SAMPLE_MENTORS } from "./mentors"

export function generateMatchNotificationEmail(data: NotificationData): EmailTemplate {
  const { mentorName, menteeName, mentorField, conversationId, expiresAt } = data

  const subject = `🎉 You've been matched with ${mentorName}!`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Mentor Match - Diaspora Bridge</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #059669; color: white; padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 32px 24px; }
        .mentor-card { background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin: 24px 0; }
        .mentor-name { font-size: 20px; font-weight: bold; color: #059669; margin-bottom: 8px; }
        .mentor-field { color: #6b7280; margin-bottom: 16px; }
        .cta-button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 16px 0; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 14px; }
        .expiry-notice { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 16px; margin: 16px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Great News, ${menteeName}!</h1>
          <p>You've been matched with an amazing mentor</p>
        </div>
        
        <div class="content">
          <p>We're excited to connect you with a mentor who aligns perfectly with your career goals and interests.</p>
          
          <div class="mentor-card">
            <div class="mentor-name">${mentorName}</div>
            <div class="mentor-field">${mentorField}</div>
            <p>This mentor is ready to share their experience and help guide your career journey.</p>
          </div>
          
          ${
            expiresAt
              ? `
          <div class="expiry-notice">
            <strong>⏰ Important:</strong> You have 48 hours to start a conversation with your mentor. 
            This connection expires on ${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString()}.
          </div>
          `
              : ""
          }
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/chat/${conversationId}" class="cta-button">
              Start Your Conversation
            </a>
          </div>
          
          <p>Don't wait - meaningful mentorship relationships start with that first message. Your mentor is looking forward to hearing from you!</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
          
          <h3>Tips for Your First Message:</h3>
          <ul>
            <li>Introduce yourself and your background</li>
            <li>Share what you're hoping to learn or achieve</li>
            <li>Ask specific questions about their career journey</li>
            <li>Be genuine and show your enthusiasm</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>This email was sent by Diaspora Bridge - Connecting Rwandan youth with diaspora mentors</p>
          <p>If you have any questions, please contact us at support@diasporabridge.com</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Great News, ${menteeName}!
    
    You've been matched with ${mentorName}, a professional in ${mentorField}.
    
    ${expiresAt ? `Important: You have 48 hours to start a conversation. This connection expires on ${expiresAt.toLocaleDateString()}.` : ""}
    
    Start your conversation: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/chat/${conversationId}
    
    Tips for your first message:
    - Introduce yourself and your background
    - Share what you're hoping to learn
    - Ask specific questions about their career
    - Be genuine and enthusiastic
    
    Best regards,
    The Diaspora Bridge Team
  `

  return { subject, html, text }
}

export function generateMessageNotificationEmail(data: NotificationData): EmailTemplate {
  const { mentorName, menteeName, messageContent, conversationId } = data

  const subject = `💬 New message from ${mentorName}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Message - Diaspora Bridge</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #059669; color: white; padding: 24px; text-align: center; }
        .content { padding: 32px 24px; }
        .message-preview { background-color: #f1f5f9; border-left: 4px solid #059669; padding: 16px; margin: 16px 0; font-style: italic; }
        .cta-button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 16px 0; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 New Message</h1>
          <p>You have a new message from your mentor</p>
        </div>
        
        <div class="content">
          <p>Hi ${menteeName},</p>
          <p><strong>${mentorName}</strong> has sent you a new message:</p>
          
          ${
            messageContent
              ? `
          <div class="message-preview">
            "${messageContent.length > 150 ? messageContent.substring(0, 150) + "..." : messageContent}"
          </div>
          `
              : ""
          }
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/chat/${conversationId}" class="cta-button">
              Reply to Message
            </a>
          </div>
          
          <p>Keep the conversation going! Your mentor is invested in your success and looking forward to your response.</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by Diaspora Bridge</p>
          <p>To manage your notification preferences, visit your account settings</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Hi ${menteeName},
    
    You have a new message from ${mentorName}:
    
    ${messageContent ? `"${messageContent}"` : "View the full message in your conversation."}
    
    Reply here: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/chat/${conversationId}
    
    Best regards,
    The Diaspora Bridge Team
  `

  return { subject, html, text }
}

export function generateExpiryReminderEmail(data: NotificationData): EmailTemplate {
  const { mentorName, menteeName, conversationId, expiresAt } = data

  const subject = `⏰ Reminder: Your connection with ${mentorName} expires soon`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Connection Expiry Reminder - Diaspora Bridge</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #f59e0b; color: white; padding: 24px; text-align: center; }
        .content { padding: 32px 24px; }
        .urgency-notice { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 16px; margin: 16px 0; text-align: center; }
        .cta-button { display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 16px 0; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Don't Miss Out!</h1>
          <p>Your mentorship connection is about to expire</p>
        </div>
        
        <div class="content">
          <p>Hi ${menteeName},</p>
          
          <div class="urgency-notice">
            <strong>Your connection with ${mentorName} expires ${expiresAt ? `on ${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString()}` : "soon"}!</strong>
          </div>
          
          <p>You haven't started a conversation yet, and time is running out. This is a valuable opportunity to connect with an experienced professional who can help guide your career.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/chat/${conversationId}" class="cta-button">
              Start Conversation Now
            </a>
          </div>
          
          <p><strong>Why reach out now?</strong></p>
          <ul>
            <li>Your mentor has already committed time to help you</li>
            <li>First impressions matter - show your initiative</li>
            <li>The sooner you start, the more you can learn</li>
            <li>This opportunity won't come again soon</li>
          </ul>
          
          <p>Even a simple introduction can lead to life-changing guidance. Don't let this chance slip away!</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by Diaspora Bridge</p>
          <p>We're here to help you succeed - don't hesitate to reach out if you need support</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Hi ${menteeName},
    
    Your connection with ${mentorName} expires ${expiresAt ? `on ${expiresAt.toLocaleDateString()}` : "soon"}!
    
    You haven't started a conversation yet. This is a valuable opportunity to connect with an experienced professional.
    
    Start your conversation now: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/chat/${conversationId}
    
    Why reach out now?
    - Your mentor has committed time to help you
    - First impressions matter
    - The sooner you start, the more you can learn
    - This opportunity won't come again soon
    
    Don't let this chance slip away!
    
    Best regards,
    The Diaspora Bridge Team
  `

  return { subject, html, text }
}

// Email sending function (would integrate with email service in production)
export async function sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
  try {
    console.log("[v0] Sending email to:", to)
    console.log("[v0] Subject:", template.subject)
    console.log("[v0] Email content preview:", template.text.substring(0, 100) + "...")

    // In a real application, this would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    // For demo purposes, we'll just log the email
    return true
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    return false
  }
}

// Notification scheduling functions
export async function scheduleMatchNotification(menteeEmail: string, data: NotificationData): Promise<void> {
  const template = generateMatchNotificationEmail(data)
  await sendEmail(menteeEmail, template)
}

export async function scheduleMessageNotification(menteeEmail: string, data: NotificationData): Promise<void> {
  const template = generateMessageNotificationEmail(data)
  await sendEmail(menteeEmail, template)
}

export async function scheduleExpiryReminder(
  menteeEmail: string,
  data: NotificationData,
  hoursBeforeExpiry = 6,
): Promise<void> {
  // In a real app, this would schedule the email to be sent at the right time
  console.log(`[v0] Scheduling expiry reminder for ${hoursBeforeExpiry} hours before expiry`)

  const template = generateExpiryReminderEmail(data)

  // For demo, send immediately
  await sendEmail(menteeEmail, template)
}

// Auto-notification system
export async function sendMentorMatchNotification(menteeEmail: string, mentorId: string, menteeData: {
  name: string
  careerField: string
  goals: string
  location: string
}) {
  // In a real app, this would integrate with an email service like SendGrid, Resend, etc.
  console.log(`📧 Sending mentor match notification to ${menteeEmail}`)
  
  // Simulate email sending
  const notificationData: NotificationData = {
    mentorName: "Dr. Aline Uwimana", // This would be fetched from mentor data
    menteeName: menteeData.name,
    mentorField: menteeData.careerField,
    conversationId: "conv-1",
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
  }

  const emailTemplate = generateMatchNotificationEmail(notificationData)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log("✅ Email sent successfully:", emailTemplate.subject)
  return emailTemplate
}

export async function sendMentorRequestNotification(mentorEmail: string, menteeData: {
  name: string
  email: string
  careerField: string
  goals: string
  experience: string
}) {
  console.log(`📧 Sending mentor request notification to ${mentorEmail}`)
  
  // Simulate email sending
  const notificationData: NotificationData = {
    mentorName: "Dr. Aline Uwimana", // This would be the actual mentor
    menteeName: menteeData.name,
    mentorField: menteeData.careerField,
    conversationId: "conv-1",
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  }

  const emailTemplate = generateMentorRequestEmail(notificationData)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log("✅ Mentor notification sent:", emailTemplate.subject)
  return emailTemplate
}

// Enhanced matching function that sends notifications
export async function createMentorMenteeMatch(menteeData: {
  name: string
  email: string
  careerField: string
  goals: string
  experience: string
  location: string
}) {
  console.log("🔍 Finding best mentor match for:", menteeData.name)
  
  // Find matching mentors (this would be more sophisticated in a real app)
  const matchingMentors = SAMPLE_MENTORS.filter(mentor => 
    mentor.field === menteeData.careerField && mentor.availability === "available"
  )
  
  if (matchingMentors.length === 0) {
    console.log("❌ No available mentors found for field:", menteeData.careerField)
    return null
  }
  
  // Select the best match (in a real app, this would use ML algorithms)
  const selectedMentor = matchingMentors[0]
  
  console.log("✅ Selected mentor:", selectedMentor.name)
  
  // Send notifications to both parties
  await Promise.all([
    sendMentorMatchNotification(menteeData.email, selectedMentor.id, menteeData),
    sendMentorRequestNotification(selectedMentor.email || "mentor@example.com", menteeData)
  ])
  
  return {
    mentor: selectedMentor,
    conversationId: `conv-${Date.now()}`,
    status: "pending"
  }
}