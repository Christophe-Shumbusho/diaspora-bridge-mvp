"use client"

import { use, useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Clock, User, MessageCircle } from "lucide-react"
import Link from "next/link"
import { formatTimeAgo, getTimeRemaining } from "@/lib/chat"
import { getMessages, sendMessage, type ChatMessage } from "@/lib/messages-repo"
import { useAuth } from "@/lib/auth-context"
import { getAllConversations } from "@/lib/conversations-repo"

interface ConversationPageProps {
  params: Promise<{ id: string }>
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // Use useMemo to prevent recreation on every render
  const conversation = useMemo(() => {
    return getAllConversations().find((conv) => conv.id === resolvedParams.id)
  }, [resolvedParams.id])

  // Now use conversation.id instead of conversation object
  useEffect(() => {
    if (conversation?.id) {
      setMessages(getMessages(conversation.id))
    }
  }, [conversation?.id]) // Only depend on the id, not the whole object

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation || !user) return
    const saved = sendMessage({
      conversationId: conversation.id,
      senderId: user.id,
      senderName: user.name,
      senderType: "mentee",
      content: newMessage,
    })
    setMessages((prev) => [...prev, saved])
    setNewMessage("")
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Conversation Not Found</h2>
          <p className="text-muted-foreground mb-4">This conversation doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/chat">Back to Conversations</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/chat" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold">{conversation.mentorName}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${conversation.status === "active" ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className="capitalize">{conversation.status}</span>
                  {conversation.expiresAt && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeRemaining(conversation.expiresAt)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Badge variant="outline">Mentoring Session</Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderType === "mentee" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderType === "mentee"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1 text-xs opacity-80">
                    {message.senderType === "mentor" && <User className="h-3 w-3" />}
                    <span className="font-medium">{message.senderName}</span>
                  </div>
                  <span className="text-xs opacity-60">{formatTimeAgo(message.timestamp)}</span>
                </div>
                <p className="text-sm">{message.content}</p>
                {!message.read && message.senderType === "mentor" && (
                  <div className="text-xs opacity-60 mt-1">Delivered</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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


