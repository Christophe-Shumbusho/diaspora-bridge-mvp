"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Clock, User, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { db, type Conversation, type Message } from "@/lib/database"

interface ConversationPageProps {
  params: Promise<{ id: string }>
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load conversation
    const conv = db.getConversation(resolvedParams.id)
    if (!conv) {
      setIsLoading(false)
      return
    }

    // Check if user has access to this conversation
    if (conv.menteeId !== user.id && conv.mentorId !== user.id) {
      router.push("/")
      return
    }

    setConversation(conv)
    setMessages(conv.messages)
    setIsLoading(false)
  }, [resolvedParams.id, user, router])

  // Separate effect for message polling to avoid infinite loops
  useEffect(() => {
    if (!conversation) return

    const interval = setInterval(() => {
      const updatedConv = db.getConversation(resolvedParams.id)
      if (updatedConv) {
        setMessages(updatedConv.messages)
      }
    }, 2000) // Check for new messages every 2 seconds

    return () => clearInterval(interval)
  }, [conversation, resolvedParams.id])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation || !user) return
    
    const message = db.addMessage(conversation.id, user.id, newMessage)
    if (message) {
      const updatedConv = db.getConversation(conversation.id)
      if (updatedConv) {
        setMessages(updatedConv.messages)
      }
    }
    setNewMessage("")
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading conversation...</p>
        </div>
      </div>
    )
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

  // Get the other participant's name
  const otherParticipant = conversation.menteeId === user?.id 
    ? db.getUserById(conversation.mentorId)
    : db.getUserById(conversation.menteeId)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={user?.role === "mentor" ? "/mentor/dashboard" : "/matches"} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold">{otherParticipant?.name || "Unknown User"}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${conversation.status === "active" ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className="capitalize">{conversation.status}</span>
                  <span>•</span>
                  <span>Started {formatTimeAgo(conversation.createdAt)}</span>
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
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start the conversation</h3>
              <p className="text-muted-foreground">
                {user?.role === "mentee" 
                  ? "Introduce yourself and share what you'd like to learn!"
                  : "Welcome your mentee and ask how you can help them grow!"
                }
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.senderId === user?.id
              const sender = db.getUserById(message.senderId)
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1 text-xs opacity-80">
                        {!isCurrentUser && <User className="h-3 w-3" />}
                        <span className="font-medium">{sender?.name || "Unknown"}</span>
                      </div>
                      <span className="text-xs opacity-60">{formatTimeAgo(message.timestamp)}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    {!message.read && !isCurrentUser && (
                      <div className="text-xs opacity-60 mt-1">Delivered</div>
                    )}
                  </div>
                </div>
              )
            })
          )}
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


