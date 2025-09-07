"use client"

import { readJson, writeJson } from "./storage"

export interface MenteeRequest {
  id: string
  menteeName: string
  menteeEmail: string
  mentorId: string
  mentorName: string
  field: string
  careerQuestion: string
  experience: string
  goals: string
  status: "pending" | "approved" | "declined" | "expired"
  createdAt: Date
  expiresAt: Date
  approvedAt?: Date
  declinedAt?: Date
  conversationId?: string
}

const KEY = "db_mentee_requests"

export function getAllMenteeRequests(): MenteeRequest[] {
  const stored = readJson<MenteeRequest[] | null>(KEY, null)
  if (!stored) return []
  return stored.map(r => ({ 
    ...r, 
    createdAt: new Date(r.createdAt),
    expiresAt: new Date(r.expiresAt),
    approvedAt: r.approvedAt ? new Date(r.approvedAt) : undefined,
    declinedAt: r.declinedAt ? new Date(r.declinedAt) : undefined
  }))
}

export function addMenteeRequest(request: MenteeRequest): void {
  const list = getAllMenteeRequests()
  writeJson(KEY, [...list, request])
}

export function updateMenteeRequest(updated: MenteeRequest): void {
  const list = getAllMenteeRequests().map(r => (r.id === updated.id ? updated : r))
  writeJson(KEY, list)
}

export function getMenteeRequestsForMentor(mentorId: string): MenteeRequest[] {
  return getAllMenteeRequests().filter(r => r.mentorId === mentorId)
}

export function getPendingMenteeRequestsForMentor(mentorId: string): MenteeRequest[] {
  return getMenteeRequestsForMentor(mentorId).filter(r => r.status === "pending")
}

export function getMenteeRequestById(id: string): MenteeRequest | undefined {
  return getAllMenteeRequests().find(r => r.id === id)
}

export function approveMenteeRequest(requestId: string, conversationId: string): MenteeRequest | null {
  const request = getMenteeRequestById(requestId)
  if (!request || request.status !== "pending") return null
  
  const updated = {
    ...request,
    status: "approved" as const,
    approvedAt: new Date(),
    conversationId
  }
  
  updateMenteeRequest(updated)
  return updated
}

export function declineMenteeRequest(requestId: string): MenteeRequest | null {
  const request = getMenteeRequestById(requestId)
  if (!request || request.status !== "pending") return null
  
  const updated = {
    ...request,
    status: "declined" as const,
    declinedAt: new Date()
  }
  
  updateMenteeRequest(updated)
  return updated
}

export function expireMenteeRequest(requestId: string): MenteeRequest | null {
  const request = getMenteeRequestById(requestId)
  if (!request || request.status !== "pending") return null
  
  const updated = {
    ...request,
    status: "expired" as const
  }
  
  updateMenteeRequest(updated)
  return updated
}

export function getExpiredRequests(): MenteeRequest[] {
  const now = new Date()
  return getAllMenteeRequests().filter(r => 
    r.status === "pending" && r.expiresAt < now
  )
}

export function canMenteeRequestAgain(menteeEmail: string): boolean {
  const requests = getAllMenteeRequests().filter(r => r.menteeEmail === menteeEmail)
  const recentDeclined = requests.find(r => 
    r.status === "declined" && 
    r.declinedAt && 
    (Date.now() - r.declinedAt.getTime()) < 7 * 24 * 60 * 60 * 1000 // 7 days
  )
  
  return !recentDeclined
}

