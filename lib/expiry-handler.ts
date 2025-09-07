"use client"

import { getExpiredRequests, expireMenteeRequest, getAllMenteeRequests } from "./mentee-requests-repo"
import { sendEmail, generateExpiredConnectionEmail } from "./email"

export interface ExpiredConnectionData {
  menteeName: string
  menteeEmail: string
  mentorName: string
  mentorEmail: string
  field: string
  requestId: string
}

export function generateExpiredConnectionEmail(data: ExpiredConnectionData): any {
  const { menteeName, menteeEmail, mentorName, mentorEmail, field } = data

  const subject = "Connection Window Closed - Diaspora Bridge"

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Connection Expired - Diaspora Bridge</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #dc2626; color: white; padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 32px 24px; }
        .notice { background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 16px; margin: 16px 0; }
        .cta-button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 16px 0; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Connection Window Closed</h1>
          <p>The 48-hour connection window has expired</p>
        </div>
        
        <div class="content">
          <p>Hi ${menteeName},</p>
          
          <div class="notice">
            <strong>Connection Expired:</strong> The 48-hour window to connect with ${mentorName} in ${field} has closed.
          </div>
          
          <p>Don't worry! This is a normal part of our matching process. Here's what happens next:</p>
          
          <h3>For Mentees:</h3>
          <ul>
            <li>You can sign up again after 7 days</li>
            <li>We'll help you find other available mentors</li>
            <li>Your profile and preferences are saved for future matches</li>
          </ul>
          
          <h3>For Mentors:</h3>
          <ul>
            <li>You're back in the available mentor pool</li>
            <li>You can receive new mentee requests</li>
            <li>Your availability status remains active</li>
          </ul>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/mentee-signup" class="cta-button">
              Request Another Mentor
            </a>
          </div>
          
          <p>Thank you for being part of the Diaspora Bridge community. We're committed to connecting you with the right mentor for your career journey.</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by Diaspora Bridge</p>
          <p>Questions? Contact us at support@diasporabridge.com</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Hi ${menteeName},
    
    The 48-hour window to connect with ${mentorName} in ${field} has closed.
    
    For Mentees:
    - You can sign up again after 7 days
    - We'll help you find other available mentors
    - Your profile is saved for future matches
    
    For Mentors:
    - You're back in the available mentor pool
    - You can receive new mentee requests
    - Your availability remains active
    
    Request another mentor: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/mentee-signup
    
    Thank you for being part of Diaspora Bridge!
    
    Best regards,
    The Diaspora Bridge Team
  `

  return { subject, html, text }
}

export async function processExpiredRequests(): Promise<void> {
  console.log("🕐 Processing expired requests...")
  
  const expiredRequests = getExpiredRequests()
  
  if (expiredRequests.length === 0) {
    console.log("✅ No expired requests found")
    return
  }
  
  console.log(`📋 Found ${expiredRequests.length} expired requests`)
  
  for (const request of expiredRequests) {
    try {
      // Mark request as expired
      expireMenteeRequest(request.id)
      
      // Send expiry notification to mentee
      const menteeEmailData: ExpiredConnectionData = {
        menteeName: request.menteeName,
        menteeEmail: request.menteeEmail,
        mentorName: request.mentorName,
        mentorEmail: "mentor@example.com", // This would be fetched from mentor data
        field: request.field,
        requestId: request.id
      }
      
      const menteeEmailTemplate = generateExpiredConnectionEmail(menteeEmailData)
      await sendEmail(request.menteeEmail, menteeEmailTemplate)
      
      // Send notification to mentor (optional)
      const mentorEmailData: ExpiredConnectionData = {
        menteeName: request.menteeName,
        menteeEmail: request.menteeEmail,
        mentorName: request.mentorName,
        mentorEmail: "mentor@example.com",
        field: request.field,
        requestId: request.id
      }
      
      const mentorEmailTemplate = generateExpiredConnectionEmail(mentorEmailData)
      await sendEmail("mentor@example.com", mentorEmailTemplate)
      
      console.log(`✅ Processed expired request: ${request.id}`)
      
    } catch (error) {
      console.error(`❌ Failed to process expired request ${request.id}:`, error)
    }
  }
  
  console.log(`✅ Completed processing ${expiredRequests.length} expired requests`)
}

export function canMenteeRequestAgain(menteeEmail: string): boolean {
  const requests = getAllMenteeRequests().filter(r => r.menteeEmail === menteeEmail)
  const recentDeclined = requests.find(r => 
    r.status === "declined" && 
    r.declinedAt && 
    (Date.now() - r.declinedAt.getTime()) < 7 * 24 * 60 * 60 * 1000 // 7 days
  )
  
  return !recentDeclined
}

export function getTimeUntilExpiry(expiresAt: Date): string {
  const now = new Date()
  const diffInHours = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours <= 0) return "Expired"
  if (diffInHours < 24) return `${diffInHours}h remaining`
  
  const days = Math.floor(diffInHours / 24)
  const hours = diffInHours % 24
  return `${days}d ${hours}h remaining`
}

// Auto-run expiry check (in a real app, this would be a cron job or scheduled task)
export function startExpiryChecker(): void {
  // Check every hour
  setInterval(() => {
    processExpiredRequests()
  }, 60 * 60 * 1000)
  
  // Also run immediately
  processExpiredRequests()
}

