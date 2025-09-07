"use client"

import { SAMPLE_CONVERSATIONS, type Conversation } from "./chat"
import { readJson, writeJson } from "./storage"

const KEY = "db_conversations"

export function getAllConversations(): Conversation[] {
  const stored = readJson<Conversation[] | null>(KEY, null)
  if (stored) return stored.map(c => ({ ...c, createdAt: new Date(c.createdAt), expiresAt: c.expiresAt ? new Date(c.expiresAt) : undefined }))
  writeJson(KEY, SAMPLE_CONVERSATIONS)
  return SAMPLE_CONVERSATIONS
}

export function saveConversations(list: Conversation[]): void {
  writeJson(KEY, list)
}

export function upsertConversation(conv: Conversation): void {
  const list = getAllConversations()
  const idx = list.findIndex(c => c.id === conv.id)
  const next = idx >= 0 ? list.map(c => (c.id === conv.id ? conv : c)) : [...list, conv]
  writeJson(KEY, next)
}

export function findConversationByMentor(mentorId: string): Conversation | undefined {
  return getAllConversations().find(c => c.mentorId === mentorId && c.status !== "closed")
}

export function findConversationById(id: string): Conversation | undefined {
  return getAllConversations().find(c => c.id === id)
}

export function getConversationsForMentee(menteeId: string): Conversation[] {
  return getAllConversations().filter(c => c.menteeId === menteeId)
}

export function getConversationsForMentor(mentorId: string): Conversation[] {
  return getAllConversations().filter(c => c.mentorId === mentorId)
}





