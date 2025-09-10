export interface User {
  id: string
  name: string
  email: string
  role: "mentee" | "mentor" | "admin"
  careerField?: string
  goals?: string
  experience?: string
  createdAt: Date
}

export interface MenteeProfile extends User {
  role: "mentee"
  careerField: string
  goals: string
  experience: string
  interests: string[]
  location: string
}

export interface MentorProfile extends User {
  role: "mentor",
  title: string,
  company: string,
  field: string,
  location: string,
  experience: string,
  bio: string,
  expertise: string[],
  availability: "available" | "busy" | "unavailable",
  imageUrl: string,
  conversationStarters: string[]
}

// Sample users for demo
export const SAMPLE_USERS: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "mentee",
    careerField: "Technology & Software",
    goals: "Learn software engineering",
    experience: "Beginner",
    createdAt: new Date(),
  },
  {
    id: "mentor-1",
    name: "Dr. Aline Uwimana",
    email: "aline@example.com",
    role: "mentor",
    createdAt: new Date(),
  },
]

// Session management
export class AuthService {
  private static readonly USER_KEY = "diaspora_user"
  private static readonly SESSION_KEY = "diaspora_session"

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
      
      return isSessionValid ? user : null
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
}

// User creation helpers
export function createMenteeProfile(data: {
  name: string
  email: string
  careerField: string
  goals: string
  experience: string
  interests: string[]
  location: string
}): MenteeProfile {
  return {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: "mentee",
    careerField: data.careerField,
    goals: data.goals,
    experience: data.experience,
    interests: data.interests,
    location: data.location,
    createdAt: new Date(),
  }
}

export function createMentorProfile(data: {
  name: string
  email: string
  title: string
  company: string
  field: string
  location: string
  experience: string
  bio: string
  expertise: string[]
  availability: "available" | "busy" | "unavailable"
  imageUrl: string
  conversationStarters: string[]
}): MentorProfile {
  return {
    id: `mentor-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: "mentor",
    title: data.title,
    company: data.company,
    field: data.field,
    location: data.location,
    experience: data.experience,
    bio: data.bio,
    expertise: data.expertise,
    availability: data.availability,
    imageUrl: data.imageUrl,
    conversationStarters: data.conversationStarters,
    createdAt: new Date(),
  }
}




