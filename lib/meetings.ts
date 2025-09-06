export interface Meeting {
  id: string
  mentorId: string
  menteeId: string
  mentorName: string
  menteeName: string
  title: string
  description?: string
  type: "video" | "phone" | "in-person"
  duration: number // in minutes
  scheduledAt: Date
  meetingLink?: string
  location?: string
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  createdAt: Date
  updatedAt: Date
}

export interface MeetingInvitation {
  id: string
  meetingId: string
  mentorId: string
  menteeId: string
  status: "pending" | "accepted" | "declined"
  sentAt: Date
  respondedAt?: Date
}

// Sample meetings data
export const SAMPLE_MEETINGS: Meeting[] = [
  {
    id: "meeting-1",
    mentorId: "1",
    menteeId: "user-1",
    mentorName: "Dr. Aline Uwimana",
    menteeName: "John Doe",
    title: "Career Guidance Session",
    description: "Discussing software engineering career path and technical interview preparation",
    type: "video",
    duration: 60,
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    meetingLink: "https://zoom.us/j/123456789",
    status: "scheduled",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "meeting-2",
    mentorId: "1",
    menteeId: "user-1",
    mentorName: "Dr. Aline Uwimana",
    menteeName: "John Doe",
    title: "Technical Interview Prep",
    description: "Mock interview and coding practice session",
    type: "video",
    duration: 90,
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
]

export const SAMPLE_MEETING_INVITATIONS: MeetingInvitation[] = [
  {
    id: "invite-1",
    meetingId: "meeting-1",
    mentorId: "1",
    menteeId: "user-1",
    status: "accepted",
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: "invite-2",
    meetingId: "meeting-2",
    mentorId: "1",
    menteeId: "user-1",
    status: "pending",
    sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
]

// Meeting management functions
export function createMeeting(data: {
  mentorId: string
  menteeId: string
  mentorName: string
  menteeName: string
  title: string
  description?: string
  type: "video" | "phone" | "in-person"
  duration: number
  scheduledAt: Date
  meetingLink?: string
  location?: string
}): Meeting {
  const meeting: Meeting = {
    id: `meeting-${Date.now()}`,
    ...data,
    status: "scheduled",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // In a real app, this would save to database
  SAMPLE_MEETINGS.push(meeting)
  
  return meeting
}

export function getMeetingsForUser(userId: string, userRole: "mentor" | "mentee"): Meeting[] {
  if (userRole === "mentor") {
    return SAMPLE_MEETINGS.filter(meeting => meeting.mentorId === userId)
  } else {
    return SAMPLE_MEETINGS.filter(meeting => meeting.menteeId === userId)
  }
}

export function getUpcomingMeetings(userId: string, userRole: "mentor" | "mentee"): Meeting[] {
  const userMeetings = getMeetingsForUser(userId, userRole)
  const now = new Date()
  
  return userMeetings.filter(meeting => 
    meeting.scheduledAt > now && meeting.status === "scheduled"
  ).sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
}

export function formatMeetingTime(date: Date): string {
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

export function getMeetingTimeRemaining(date: Date): string {
  const now = new Date()
  const diffInMs = date.getTime() - now.getTime()
  
  if (diffInMs <= 0) return "Meeting time has passed"
  
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffInDays > 0) {
    return `${diffInDays}d ${diffInHours}h remaining`
  } else if (diffInHours > 0) {
    return `${diffInHours}h ${diffInMinutes}m remaining`
  } else {
    return `${diffInMinutes}m remaining`
  }
}

// Video meeting platform helpers
export function generateZoomLink(): string {
  // In a real app, this would integrate with Zoom API
  const meetingId = Math.random().toString(36).substring(2, 15)
  return `https://zoom.us/j/${meetingId}`
}

export function generateGoogleMeetLink(): string {
  // In a real app, this would integrate with Google Meet API
  const meetingCode = Math.random().toString(36).substring(2, 15)
  return `https://meet.google.com/${meetingCode}`
}

export function generateTeamsLink(): string {
  // In a real app, this would integrate with Microsoft Teams API
  const meetingId = Math.random().toString(36).substring(2, 15)
  return `https://teams.microsoft.com/l/meetup-join/${meetingId}`
}


