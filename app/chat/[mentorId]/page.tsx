"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SAMPLE_CONVERSATIONS } from "@/lib/chat"

interface StartChatPageProps {
  params: {
    mentorId: string
  }
}

export default function StartChatPage({ params }: StartChatPageProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if conversation already exists with this mentor
    const existingConversation = SAMPLE_CONVERSATIONS.find((conv) => conv.mentorId === params.mentorId)

    if (existingConversation) {
      // Redirect to existing conversation
      router.push(`/chat/${existingConversation.id}`)
    } else {
      // In a real app, this would create a new conversation
      // For now, we'll simulate creating a conversation and redirect
      console.log("[v0] Creating new conversation with mentor:", params.mentorId)

      // Simulate API call delay
      setTimeout(() => {
        // For demo purposes, redirect to the first sample conversation
        router.push("/chat/conv-1")
      }, 1000)
    }
  }, [params.mentorId, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Starting your conversation...</p>
      </div>
    </div>
  )
}
