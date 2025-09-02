"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Clock, User, AlertCircle, MessageCircle } from "lucide-react"
import Link from "next/link"
import {
  getConversationMessages,
  formatTimeAgo,
  getTimeRemaining,
  SAMPLE_CONVERSATIONS,
  type Message,
} from "@/lib/chat"
import { SAMPLE_MENTORS } from "@/lib/mentors"

interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = SAMPLE_CONVERSATIONS.find((c) => c.id === params.id)
  const mentor = conversation ? SAMPLE_MENTORS.find((m) => m.id === conversation.mentorId) : null

  useEffect(() => {
    // Simulate loading messages
    const loadMessages = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const conversationMessages = getConversationMessages(params.id)
      setMessages(conversationMessages)
      setLoading(false)
    }

    loadMessages()
  }, [params.id])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: "user-1",
      senderName: "John Doe",
      senderType: "mentee",
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate mentor response after a delay
    setTimeout(() => {
      const mentorResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: conversation?.mentorId || "1",
        senderName: conversation?.mentorName || "Mentor",
        senderType: "mentor",
        content: "Thanks for your message! I'll get back to you with a detailed response soon.",
        timestamp: new Date(),
        read: false,
      }
      setMessages((prev) => [...prev, mentorResponse])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!conversation || !mentor) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-16">
              <h3 className="text-lg font-semibold mb-2">Conversation not found</h3>
              <p className="text-sm text-muted-foreground">
                This conversation doesn't exist or you don't have access to it.
              </p>
              <Button asChild>
                <Link href="/chat">Back to Conversations</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto flex flex-col h-screen">
        {/* Header */}
        <div className="px-4 py-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/chat" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">{mentor.name}</h2>
                  <p className="text-sm text-muted-foreground">{mentor.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={conversation.status === "active" ? "default" : "secondary"}>{conversation.status}</Badge>
              {conversation.expiresAt && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {getTimeRemaining(conversation.expiresAt)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connection Notice */}
        {conversation.status === "pending" && (
          <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">This is a new connection. You have 48 hours to start a meaningful conversation.</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Start the conversation</h3>
              <p className="text-muted-foreground mb-4">
                Send your first message to {mentor.name.split(" ")[0]} to begin this mentorship connection.
              </p>
              {mentor.conversationStarters && mentor.conversationStarters.length > 0 && (
                <div className="max-w-md mx-auto">
                  <p className="text-sm font-medium mb-2">Suggested questions:</p>
                  <div className="space-y-2">
                    {mentor.conversationStarters.slice(0, 2).map((starter, index) => (
                      <button
                        key={index}
                        onClick={() => setNewMessage(starter)}
                        className="block w-full text-left p-2 text-sm bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderType === "mentee" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.senderType === "mentee" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderType === "mentee" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {formatTimeAgo(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="px-4 py-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
