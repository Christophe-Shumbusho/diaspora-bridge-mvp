import { db, type User, type MenteeProfile, type MentorApplication } from './database'
import { sendEmail } from './database'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  role: "mentee" | "mentor"
}

export interface MenteeSignupData extends SignupData {
  role: "mentee"
  careerField: string
  goals: string
  experience: string
  interests: string[]
  location: string
  currentEducation?: string
  preferredMentorGender?: "male" | "female" | "any"
}

export interface MentorSignupData extends SignupData {
  role: "mentor"
  title: string
  company: string
  field: string
  location: string
  yearsOfExperience: number
  bio: string
  expertise: string[]
  conversationStarters: string[]
  linkedinUrl?: string
  websiteUrl?: string
  whyMentor: string
  achievements: string[]
}

export class AuthService {
  private static readonly USER_KEY = "diaspora_user"
  private static readonly SESSION_KEY = "diaspora_session"

  // Authentication
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const user = db.authenticateUser(credentials.email, credentials.password)
      
      if (!user) {
        return { success: false, error: "Invalid email or password" }
      }

      if (user.role === "mentor" && user.status === "pending") {
        return { success: false, error: "Your mentor application is still under review. You'll receive an email once approved." }
      }

      if (user.status === "rejected") {
        return { success: false, error: "Your application has been rejected. Please contact support for more information." }
      }

      this.saveUser(user)
      return { success: true, user }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  static async signupMentee(data: MenteeSignupData): Promise<{ success: boolean; user?: MenteeProfile; error?: string }> {
    try {
      // Check if email already exists
      const existingUser = db.getUserByEmail(data.email)
      if (existingUser) {
        return { success: false, error: "An account with this email already exists" }
      }

      // Create mentee profile
      const menteeData: Omit<MenteeProfile, 'id'> = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "mentee",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          careerField: data.careerField,
          careerGoal: data.goals,
          experienceLevel: data.experience,
          interests: data.interests,
          location: data.location,
          currentEducation: data.currentEducation,
          preferredMentorGender: data.preferredMentorGender
        }
      }

      const user = db.createUser(menteeData) as MenteeProfile
      this.saveUser(user)

      // Send welcome email
      await sendEmail(
        user.email,
        "Welcome to Diaspora Bridge! 🎉",
        `Hi ${user.name},\n\nWelcome to Diaspora Bridge! Your account has been created successfully.\n\nYou can now browse and connect with mentors who match your career interests in ${user.profile.careerField}.\n\nBest regards,\nThe Diaspora Bridge Team`
      )

      return { success: true, user }
    } catch (error) {
      return { success: false, error: "Signup failed. Please try again." }
    }
  }

  static async signupMentor(data: MentorSignupData): Promise<{ success: boolean; user?: MentorApplication; error?: string }> {
    try {
      // Check if email already exists
      const existingUser = db.getUserByEmail(data.email)
      if (existingUser) {
        return { success: false, error: "An account with this email already exists" }
      }

      // Create mentor application
      const mentorData: Omit<MentorApplication, 'id'> = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "mentor",
        status: "pending", // Mentors start as pending approval
        title: data.title,
        company: data.company,
        field: data.field,
        location: data.location,
        yearsOfExperience: data.yearsOfExperience,
        bio: data.bio,
        expertise: data.expertise,
        availability: "available",
        conversationStarters: data.conversationStarters,
        linkedinUrl: data.linkedinUrl,
        websiteUrl: data.websiteUrl,
        whyMentor: data.whyMentor,
        achievements: data.achievements,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const user = db.createUser(mentorData) as MentorApplication

      // Send application confirmation email
      await sendEmail(
        user.email,
        "Mentor Application Received - Diaspora Bridge",
        `Hi ${user.name},\n\nThank you for applying to become a mentor on Diaspora Bridge!\n\nYour application is now under review by our admin team. You'll receive an email notification once your application has been approved.\n\nWe appreciate your willingness to give back to the Rwandan community.\n\nBest regards,\nThe Diaspora Bridge Team`
      )

      return { success: true, user }
    } catch (error) {
      return { success: false, error: "Mentor application failed. Please try again." }
    }
  }

  // Session management
  static saveUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({ 
        userId: user.id, 
        timestamp: Date.now() 
      }))
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    
    try {
      const userData = localStorage.getItem(this.USER_KEY)
      const sessionData = localStorage.getItem(this.SESSION_KEY)
      
      if (!userData || !sessionData) return null
      
      const user = JSON.parse(userData) as User
      const session = JSON.parse(sessionData)
      
      // Check if session is still valid (24 hours)
      const isSessionValid = Date.now() - session.timestamp < 24 * 60 * 60 * 1000
      
      if (!isSessionValid) {
        this.logout()
        return null
      }

      // Refresh user data from database to get latest status
      const currentUser = db.getUserById(user.id)
      if (currentUser && currentUser.status === "active") {
        return currentUser
      }
      
      return null
    } catch {
      return null
    }
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.USER_KEY)
      localStorage.removeItem(this.SESSION_KEY)
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  static getUserRole(): "mentee" | "mentor" | "admin" | null {
    const user = this.getCurrentUser()
    return user?.role || null
  }

  static requireAuth(allowedRoles?: ("mentee" | "mentor" | "admin")[]): User | null {
    const user = this.getCurrentUser()
    
    if (!user) {
      return null
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return null
    }

    return user
  }

  // Admin functions
  static async approveMentor(mentorId: string): Promise<{ success: boolean; error?: string }> {
    try {
      db.approveMentor(mentorId)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to approve mentor" }
    }
  }

  static async rejectMentor(mentorId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      db.rejectMentor(mentorId)
      const mentor = db.getUserById(mentorId)
      if (!mentor || mentor.role !== "mentor") {
        return { success: false, error: "Mentor not found" }
      }

      const updatedMentor = db.updateUser(mentorId, { status: "rejected" })
      if (!updatedMentor) {
        return { success: false, error: "Failed to reject mentor" }
      }

      // Send rejection email
      const reasonText = reason ? `\n\nReason: ${reason}` : ""
      await sendEmail(
        mentor.email,
        "Update on Your Mentor Application - Diaspora Bridge",
        `Hi ${mentor.name},\n\nThank you for your interest in becoming a mentor on Diaspora Bridge.\n\nAfter careful review, we are unable to approve your application at this time.${reasonText}\n\nIf you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nThe Diaspora Bridge Team`
      )

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to reject mentor" }
    }
  }
}
