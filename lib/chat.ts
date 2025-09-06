export interface Message {
  id: string
  senderId: string
  senderName: string
  senderType: "mentee" | "mentor"
  content: string
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  mentorId: string
  mentorName: string
  menteeId: string
  menteeName: string
  status: "active" | "pending" | "closed"
  lastMessage?: Message
  createdAt: Date
  expiresAt?: Date
}

// Sample conversation data
export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    mentorId: "1",
    mentorName: "Dr. Aline Uwimana",
    menteeId: "user-1",
    menteeName: "John Doe",
    status: "active",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    id: "conv-2",
    mentorId: "4",
    mentorName: "Patrick Rwigema",
    menteeId: "user-1",
    menteeName: "John Doe",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 46 * 60 * 60 * 1000), // 46 hours from now
  },
]

export const SAMPLE_MESSAGES: Message[] = [
  {
    id: "msg-1",
    senderId: "1",
    senderName: "Dr. Aline Uwimana",
    senderType: "mentor",
    content:
      "Hi! I'm excited to connect with you. I saw that you're interested in software engineering. What specific areas are you most curious about?",
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "msg-2",
    senderId: "user-1",
    senderName: "John Doe",
    senderType: "mentee",
    content:
      "Thank you so much for connecting! I'm really interested in backend development and system design. I've been learning Python and want to understand how to build scalable applications.",
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "msg-3",
    senderId: "1",
    senderName: "Dr. Aline Uwimana",
    senderType: "mentor",
    content:
      "That's fantastic! Backend development is such a rewarding field. Python is a great choice to start with. Have you worked with any frameworks like Django or FastAPI yet?",
    timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "msg-4",
    senderId: "user-1",
    senderName: "John Doe",
    senderType: "mentee",
    content:
      "I've done some basic Django tutorials, but I'm still learning. What would you recommend as the next steps to get better at system design?",
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    read: false,
  },
]

export function getConversationMessages(conversationId: string): Message[] {
  // In a real app, this would fetch from a database
  if (conversationId === "conv-1") {
    return SAMPLE_MESSAGES
  }
  return []
}

export function getConversationsForUser(userId: string): Conversation[] {
  // In a real app, this would fetch user's conversations from database
  return SAMPLE_CONVERSATIONS.map((conv) => ({
    ...conv,
    lastMessage: getConversationMessages(conv.id).slice(-1)[0],
  }))
}

export function formatTimeAgo(dateLike: Date | string): string {
  const date = typeof dateLike === "string" ? new Date(dateLike) : dateLike
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString()
}

export function getTimeRemaining(expiresAt: Date): string {
  const now = new Date()
  const diffInHours = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60))

  if (diffInHours <= 0) return "Expired"
  if (diffInHours < 24) return `${diffInHours}h remaining`

  const days = Math.floor(diffInHours / 24)
  const hours = diffInHours % 24
  return `${days}d ${hours}h remaining`
}
