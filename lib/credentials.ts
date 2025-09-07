"use client"

import { readJson, writeJson } from "./storage"

export interface CredentialRecord {
  email: string
  role: "mentee" | "mentor" | "admin"
  passwordHash: string
  twoFactorEnabled?: boolean
}

const KEY = "db_credentials"

export function getAllCredentials(): CredentialRecord[] {
  return readJson<CredentialRecord[]>(KEY, [])
}

export function saveCredential(record: CredentialRecord): void {
  const list = getAllCredentials()
  const next = list.filter(r => r.email.toLowerCase() !== record.email.toLowerCase())
  writeJson(KEY, [...next, record])
}

export function findCredential(email: string): CredentialRecord | undefined {
  return getAllCredentials().find(r => r.email.toLowerCase() === email.toLowerCase())
}

export function enableTwoFactor(email: string, enabled: boolean): void {
  const rec = findCredential(email)
  if (!rec) return
  saveCredential({ ...rec, twoFactorEnabled: enabled })
}



