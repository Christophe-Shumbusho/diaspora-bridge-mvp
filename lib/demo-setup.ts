"use client"

import { addMenteeRequest } from "./mentee-requests-repo"
import { upsertConversation } from "./conversations-repo"

// Demo data setup for testing the mentor approval system
export function setupDemoData() {
  console.log("🎭 Setting up demo data for mentor approval system...")

  // Add a sample mentee request
  const sampleRequest = {
    id: `req-${Date.now()}`,
    menteeName: "Alice Uwimana",
    menteeEmail: "alice.uwimana@example.com",
    mentorId: "1", // Dr. Aline Uwimana
    mentorName: "Dr. Aline Uwimana",
    field: "Technology & Software",
    careerQuestion: "How can I transition from a computer science student to a software engineer at a top tech company? I'm particularly interested in backend development and system design.",
    experience: "I'm a final year computer science student at University of Rwanda. I've completed several programming projects in Python and Java, and I'm currently learning about databases and web development.",
    goals: "I want to land a software engineering internship or entry-level position at a tech company, preferably in backend development. I'm also interested in learning about system design and scaling applications.",
    status: "pending" as const,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 46 * 60 * 60 * 1000), // 46 hours from now
  }

  addMenteeRequest(sampleRequest)

  // Add another sample request
  const sampleRequest2 = {
    id: `req-${Date.now() + 1}`,
    menteeName: "David Nzeyimana",
    menteeEmail: "david.nzeyimana@example.com",
    mentorId: "4", // Patrick Rwigema
    mentorName: "Patrick Rwigema",
    field: "Business & Entrepreneurship",
    careerQuestion: "I have a business idea for a fintech startup in Rwanda. How do I validate the market, find investors, and build a sustainable business model?",
    experience: "I have a business degree and 2 years of experience working in banking. I've been learning about fintech trends and have some basic knowledge of mobile app development.",
    goals: "I want to launch my fintech startup within the next 6 months, secure initial funding, and build a team. I'm particularly interested in mobile payments and financial inclusion.",
    status: "pending" as const,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    expiresAt: new Date(Date.now() + 47 * 60 * 60 * 1000), // 47 hours from now
  }

  addMenteeRequest(sampleRequest2)

  console.log("✅ Demo data setup complete!")
  console.log("📋 Added 2 sample mentee requests:")
  console.log("   - Alice Uwimana (Technology & Software)")
  console.log("   - David Nzeyimana (Business & Entrepreneurship)")
  console.log("")
  console.log("🎯 Next steps:")
  console.log("   1. Go to /mentor/dashboard to see pending requests")
  console.log("   2. Approve or decline requests")
  console.log("   3. Test the chat system after approval")
  console.log("   4. Check email notifications (logged to console)")
}

// Auto-setup demo data when this module is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setupDemoData()
}

