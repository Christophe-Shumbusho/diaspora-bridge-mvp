"use client"

import { readJson, writeJson } from "./storage"

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderType: "mentee" | "mentor"
  content: string
  timestamp: string
  read: boolean
}

const KEY = "db_messages"

function loadAll(): ChatMessage[] {
  return readJson<ChatMessage[]>(KEY, [])
}

function saveAll(list: ChatMessage[]) {
  writeJson(KEY, list)
}

export function getMessages(conversationId: string): ChatMessage[] {
  return loadAll()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export function sendMessage(input: Omit<ChatMessage, "id" | "timestamp" | "read">): ChatMessage {
  const message: ChatMessage = {
    ...input,
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false,
  }
  const all = loadAll()
  all.push(message)
  saveAll(all)
  return message
}

export function markRead(conversationId: string, readerType: "mentee" | "mentor"): void {
  const all = loadAll().map((m) =>
    m.conversationId === conversationId && m.senderType !== readerType ? { ...m, read: true } : m,
  )
  saveAll(all)
}





