"use client"

import { SAMPLE_MENTORS, type Mentor } from "./mentors"
import { readJson, writeJson } from "./storage"

const KEY = "db_mentors"

export function getAllMentors(): Mentor[] {
  const stored = readJson<Mentor[] | null>(KEY, null)
  if (stored && stored.length) return stored
  // seed storage once
  writeJson(KEY, SAMPLE_MENTORS)
  return SAMPLE_MENTORS
}

export function saveMentors(mentors: Mentor[]): void {
  writeJson(KEY, mentors)
}

export function addMentor(newMentor: Mentor): void {
  const list = getAllMentors()
  writeJson(KEY, [...list, newMentor])
}

export function updateMentor(updated: Mentor): void {
  const list = getAllMentors().map((m) => (m.id === updated.id ? updated : m))
  writeJson(KEY, list)
}

export function deleteMentor(id: string): void {
  const list = getAllMentors().filter((m) => m.id !== id)
  writeJson(KEY, list)
}



