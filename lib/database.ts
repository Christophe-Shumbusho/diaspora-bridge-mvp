// Simple in-memory database simulation for the hackathon
// In production, this would be replaced with a real database

export interface User {
  id: string
  name: string
  email: string
  password: string // In production, this would be hashed
  role: "mentee" | "mentor" | "admin"
  status: "active" | "pending" | "rejected"
  createdAt: Date
  updatedAt: Date
}

export interface MenteeProfile extends User {
  role: "mentee"
  profile: {
    careerField: string
    careerGoal: string
    experienceLevel: string
    interests: string[]
    location: string
    currentEducation?: string
    preferredMentorGender?: "male" | "female" | "any"
  }
}

export interface MentorApplication extends User {
  role: "mentor"
  title: string
  company: string
  field: string
  location: string
  yearsOfExperience: number
  bio: string
  expertise: string[]
  availability: "available" | "busy" | "unavailable"
  imageUrl?: string
  conversationStarters: string[]
  linkedinUrl?: string
  websiteUrl?: string
  whyMentor: string
  achievements: string[]
}

export interface MentorshipRequest {
  id: string
  menteeId: string
  mentorId: string
  status: "pending" | "approved" | "rejected"
  message: string
  createdAt: Date
  approvedAt?: Date
}

export interface Conversation {
  id: string
  menteeId: string
  mentorId: string
  messages: Message[]
  status: "active" | "ended"
  createdAt: Date
  lastMessageAt: Date
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
}

// In-memory storage (replace with real database in production)
class Database {
  private users: Map<string, User> = new Map()
  private mentorshipRequests: Map<string, MentorshipRequest> = new Map()
  private conversations: Map<string, Conversation> = new Map()

  constructor() {
    // Initialize with admin user
    this.createUser({
      id: "admin-1",
      name: "Admin User",
      email: "admin@diasporabridge.com",
      password: "admin123", // In production, this would be hashed
      role: "admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  // User operations
  createUser(userData: Omit<User, 'id'> & { id?: string }): User {
    const user: User = {
      id: userData.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date()
    }
    this.users.set(user.id, user)
    return user
  }

  getUserByEmail(email: string): User | null {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id)
    if (!user) return null

    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  getAllMentors(): MentorApplication[] {
    return Array.from(this.users.values())
      .filter(user => user.role === "mentor") as MentorApplication[]
  }

  getApprovedMentors(): MentorApplication[] {
    return this.getAllMentors().filter(mentor => mentor.status === "active")
  }

  getPendingMentors(): MentorApplication[] {
    return this.getAllMentors().filter(mentor => mentor.status === "pending")
  }

  // Authentication
  authenticateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email)
    if (user && user.password === password) {
      return user
    }
    return null
  }

  // Mentorship requests
  createMentorshipRequest(data: Omit<MentorshipRequest, 'id' | 'createdAt'>): MentorshipRequest {
    const request: MentorshipRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date()
    }
    this.mentorshipRequests.set(request.id, request)
    return request
  }

  getMentorshipRequestsForMentor(mentorId: string): MentorshipRequest[] {
    return Array.from(this.mentorshipRequests.values())
      .filter(req => req.mentorId === mentorId)
  }

  getMentorshipRequestsForMentee(menteeId: string): MentorshipRequest[] {
    return Array.from(this.mentorshipRequests.values())
      .filter(req => req.menteeId === menteeId)
  }

  updateMentorshipRequest(id: string, updates: Partial<MentorshipRequest>): MentorshipRequest | null {
    const request = this.mentorshipRequests.get(id)
    if (!request) return null

    const updatedRequest = { ...request, ...updates }
    if (updates.status === "approved") {
      updatedRequest.approvedAt = new Date()
    }
    this.mentorshipRequests.set(id, updatedRequest)
    return updatedRequest
  }

  // Conversations
  createConversation(menteeId: string, mentorId: string): Conversation {
    const conversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      menteeId,
      mentorId,
      messages: [],
      status: "active",
      createdAt: new Date(),
      lastMessageAt: new Date()
    }
    this.conversations.set(conversation.id, conversation)
    return conversation
  }

  getConversation(id: string): Conversation | null {
    return this.conversations.get(id) || null
  }

  getConversationsForUser(userId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter(conv => conv.menteeId === userId || conv.mentorId === userId)
  }

  addMessage(conversationId: string, senderId: string, content: string): Message | null {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return null

    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      content,
      timestamp: new Date(),
      read: false
    }

    conversation.messages.push(message)
    conversation.lastMessageAt = new Date()
    this.conversations.set(conversationId, conversation)
    return message
  }
}

// Export singleton instance
export const db = new Database()

// Add some sample approved mentors for testing
const mentor1: MentorApplication = {
  id: "mentor-1",
  name: "Sarah Johnson",
  email: "sarah@example.com",
  password: "password123",
  role: "mentor",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "Senior Software Engineer",
  company: "Tech Corp",
  field: "Technology & Software",
  location: "Kigali, Rwanda",
  yearsOfExperience: 8,
  bio: "Passionate software engineer with 8 years of experience in full-stack development. I love mentoring junior developers and helping them grow their careers.",
  expertise: ["Software Engineering", "Web Development", "JavaScript", "React", "Node.js", "Career Development"],
  availability: "available",
  conversationStarters: ["What programming languages are you interested in?", "Tell me about your coding journey so far"],
  whyMentor: "I want to give back to the community and help the next generation of developers",
  achievements: ["Led team of 5 developers", "Built 3 successful web applications"]
}

const mentor2: MentorApplication = {
  id: "mentor-2", 
  name: "David Uwimana",
  email: "david@example.com",
  password: "password123",
  role: "mentor",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "Business Development Manager",
  company: "StartupHub Rwanda",
  field: "Business & Entrepreneurship",
  location: "Kigali, Rwanda",
  yearsOfExperience: 6,
  bio: "Experienced business development professional helping startups scale and grow. I specialize in strategy, partnerships, and market expansion.",
  expertise: ["Business Development", "Entrepreneurship", "Strategic Planning", "Partnership Development", "Market Analysis"],
  availability: "available",
  conversationStarters: ["What business challenges are you facing?", "Tell me about your entrepreneurial goals"],
  whyMentor: "I believe in empowering young entrepreneurs to build successful businesses",
  achievements: ["Helped 15+ startups raise funding", "Built partnerships worth $2M+"]
}

const mentor3: MentorApplication = {
  id: "mentor-3",
  name: "Dr. Grace Mukamana", 
  email: "grace@example.com",
  password: "password123",
  role: "mentor",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "Medical Doctor & Public Health Specialist",
  company: "Rwanda Health Ministry",
  field: "Healthcare & Medicine",
  location: "Kigali, Rwanda", 
  yearsOfExperience: 12,
  bio: "Medical doctor with expertise in public health and healthcare administration. Passionate about improving healthcare access and quality in Rwanda.",
  expertise: ["Medical Practice", "Public Health", "Healthcare Administration", "Research", "Policy Development"],
  availability: "busy",
  conversationStarters: ["What interests you about healthcare?", "Are you considering medical school?"],
  whyMentor: "I want to inspire the next generation of healthcare professionals",
  achievements: ["Published 10+ research papers", "Led COVID-19 response team"]
}

// Add mentors to database using the public createUser method
db.createUser(mentor1)
db.createUser(mentor2)  
db.createUser(mentor3)

// Helper functions for matching
export function findMatchingMentors(mentee: MenteeProfile): MentorApplication[] {
  const approvedMentors = db.getApprovedMentors()
  
  // Score mentors based on field match and expertise overlap
  const scored = approvedMentors.map(mentor => {
    let score = 0
    
    // Field match (high priority)
    if (mentor.field === mentee.profile.careerField) {
      score += 10
    }
    
    // Expertise overlap with interests - improved matching
    const mentorExpertise = mentor.expertise.map((e: string) => e.toLowerCase())
    const menteeInterests = mentee.profile.interests.map((i: string) => i.toLowerCase())
    
    // Enhanced expertise matching with technology-specific terms
    const techTerms = ['software', 'programming', 'coding', 'development', 'engineering', 'tech', 'javascript', 'react', 'node', 'web', 'app', 'system', 'database', 'api']
    const businessTerms = ['business', 'entrepreneurship', 'startup', 'management', 'strategy', 'marketing', 'sales', 'finance', 'leadership', 'planning']
    const healthTerms = ['health', 'medical', 'medicine', 'healthcare', 'research', 'clinical', 'public health', 'doctor', 'nursing']
    
    // Direct expertise-interest matches
    for (const interest of menteeInterests) {
      for (const expertise of mentorExpertise) {
        // Exact or partial matches
        if (expertise.includes(interest) || interest.includes(expertise)) {
          score += 8
        }
        
        // Technology field matching
        if (mentee.profile.careerField.toLowerCase().includes('technology') || mentee.profile.careerField.toLowerCase().includes('software')) {
          for (const techTerm of techTerms) {
            if ((interest.includes(techTerm) && expertise.includes(techTerm)) ||
                (interest.includes(techTerm) && expertise.includes('software')) ||
                (interest.includes('development') && expertise.includes('engineering'))) {
              score += 6
            }
          }
        }
        
        // Business field matching
        if (mentee.profile.careerField.toLowerCase().includes('business') || mentee.profile.careerField.toLowerCase().includes('entrepreneur')) {
          for (const businessTerm of businessTerms) {
            if (interest.includes(businessTerm) && expertise.includes(businessTerm)) {
              score += 6
            }
          }
        }
        
        // Healthcare field matching
        if (mentee.profile.careerField.toLowerCase().includes('health') || mentee.profile.careerField.toLowerCase().includes('medical')) {
          for (const healthTerm of healthTerms) {
            if (interest.includes(healthTerm) && expertise.includes(healthTerm)) {
              score += 6
            }
          }
        }
        
        // General keyword matching
        const interestWords = interest.split(' ')
        const expertiseWords = expertise.split(' ')
        for (const iWord of interestWords) {
          for (const eWord of expertiseWords) {
            if (iWord.length > 3 && eWord.length > 3 && 
                (iWord.includes(eWord) || eWord.includes(iWord))) {
              score += 3
            }
          }
        }
      }
    }
    
    // Career field alignment bonus
    const careerFieldWords = mentee.profile.careerField.toLowerCase().split(' ')
    for (const expertise of mentorExpertise) {
      for (const fieldWord of careerFieldWords) {
        if (fieldWord.length > 3 && expertise.includes(fieldWord)) {
          score += 3
        }
      }
    }
    
    // Location preference (bonus points for same location)
    if (mentor.location === mentee.profile.location) {
      score += 2
    }
    
    // Availability
    if (mentor.availability === "available") {
      score += 5
    } else if (mentor.availability === "busy") {
      score += 2
    }
    
    // Experience level consideration
    if (mentor.yearsOfExperience >= 5) {
      score += 1
    }
    
    return { mentor, score }
  })
  
  // Sort by score and return top matches
  return scored
    .filter(item => item.score > 0) // Only return mentors with some relevance
    .sort((a, b) => b.score - a.score)
    .slice(0, 10) // Increased to show more matches
    .map(item => item.mentor)
}

export function sendEmail(to: string, subject: string, content: string): Promise<boolean> {
  // Simulate email sending (in production, integrate with email service)
  console.log(`📧 Email sent to ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Content: ${content}`)
  return Promise.resolve(true)
}
