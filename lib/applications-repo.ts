"use client"

import { readJson, writeJson } from "./storage"

export interface MentorApplication {
  id: string
  name: string
  email: string
  title: string
  company: string
  field: string
  location: string
  experience: number
  bio: string
  expertise: string[]
  passwordHash?: string
  createdAt: Date
  status: "pending" | "approved" | "declined"
}

const KEY = "db_mentor_applications"

export function getAllApplications(): MentorApplication[] {
  const stored = readJson<MentorApplication[] | null>(KEY, null)
  if (!stored) return []
  return stored.map(a => ({ ...a, createdAt: new Date(a.createdAt) }))
}

export function addApplication(app: MentorApplication): void {
  const list = getAllApplications()
  writeJson(KEY, [...list, app])
}

export function updateApplication(app: MentorApplication): void {
  const next = getAllApplications().map(a => (a.id === app.id ? app : a))
  writeJson(KEY, next)
}



