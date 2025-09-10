"use client"

import { type Conversation } from "./chat"
import { upsertConversation, getAllConversations } from "./conversations-repo"
import { getMentorById } from "./mentors-repo"
import { AuthService } from "./auth"

export interface CreateConversationRequest {
  mentorId: string
  menteeId: string
  menteeName: string
}

export function createConversation(request: CreateConversationRequest): Conversation {
  const mentor = getMentorById(request.mentorId)
  if (!mentor) {
    throw new Error("Mentor not found")
  }

  const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  const conversation: Conversation = {
    id: conversationId,
    mentorId: request.mentorId,
    mentorName: mentor.name,
    menteeId: request.menteeId,
    menteeName: request.menteeName,
    status: "pending",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
  }

  upsertConversation(conversation)
  return conversation
}

export function approveConversation(conversationId: string): void {
  const conversations = getAllConversations()
  const conversation = conversations.find(c => c.id === conversationId)
  
  if (!conversation) {
    throw new Error("Conversation not found")
  }

  const updatedConversation: Conversation = {
    ...conversation,
    status: "active",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  }

  upsertConversation(updatedConversation)
}

export function declineConversation(conversationId: string): void {
  const conversations = getAllConversations()
  const conversation = conversations.find(c => c.id === conversationId)
  
  if (!conversation) {
    throw new Error("Conversation not found")
  }

  const updatedConversation: Conversation = {
    ...conversation,
    status: "closed",
  }

  upsertConversation(updatedConversation)
}

export function getConversationsForCurrentUser(): Conversation[] {
  const user = AuthService.getCurrentUser()
  if (!user) return []

  // Use database conversations instead of separate repo
  const { db } = require('./database')
  const conversations = db.getConversationsForUser(user.id)
  
  return conversations.map((conv: any) => ({
    id: conv.id,
    mentorId: conv.mentorId,
    mentorName: db.getUserById(conv.mentorId)?.name || "Unknown Mentor",
    menteeId: conv.menteeId,
    menteeName: db.getUserById(conv.menteeId)?.name || "Unknown Mentee",
    status: conv.status,
    createdAt: conv.createdAt,
    lastMessageAt: conv.lastMessageAt,
    lastMessage: conv.messages.length > 0 ? {
      content: conv.messages[conv.messages.length - 1].content,
      timestamp: conv.messages[conv.messages.length - 1].timestamp,
      senderName: db.getUserById(conv.messages[conv.messages.length - 1].senderId)?.name || "Unknown"
    } : undefined
  }))
}
