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

  const conversations = getAllConversations()
  
  if (user.role === "mentor") {
    return conversations.filter(c => c.mentorId === user.id)
  } else if (user.role === "mentee") {
    return conversations.filter(c => c.menteeId === user.id)
  }
  
  return []
}
