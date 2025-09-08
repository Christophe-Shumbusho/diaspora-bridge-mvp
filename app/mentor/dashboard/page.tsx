"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageCircle, Clock, User, Search, Filter } from "lucide-react"
import Link from "next/link"
import { formatTimeAgo, getTimeRemaining } from "@/lib/chat"
import { useAuth } from "@/lib/auth-context"
import { getConversationsForCurrentUser, approveConversation, declineConversation } from "@/lib/conversation-service"

export default function MentorDashboardPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "closed">("all")
  const [conversations, setConversations] = useState(getConversationsForCurrentUser())

  const handleApprove = (conversationId: string) => {
    approveConversation(conversationId)
    setConversations(getConversationsForCurrentUser())
  }

  const handleDecline = (conversationId: string) => {
    declineConversation(conversationId)
    setConversations(getConversationsForCurrentUser())
  }

  // Filter conversations for this mentor
  const mentorConversations = conversations

  const filteredConversations = mentorConversations.filter(conv => {
    const matchesSearch = conv.menteeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "pending": return "bg-yellow-500"
      case "closed": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default">Active</Badge>
      case "pending": return <Badge variant="secondary">Pending</Badge>
      case "closed": return <Badge variant="outline">Closed</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Dashboard</h1>
              <p className="text-muted-foreground">Manage your mentoring relationships and conversations</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Mentor Portal
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mentorConversations.length}</p>
                  <p className="text-sm text-muted-foreground">Total Conversations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentorConversations.filter(c => c.status === "active").length}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentorConversations.filter(c => c.status === "pending").length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentorConversations.filter(c => c.status === "closed").length}</p>
                  <p className="text-sm text-muted-foreground">Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search mentees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "closed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("closed")}
                >
                  Closed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversations */}
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <Card key={conversation.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{conversation.menteeName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Started {formatTimeAgo(conversation.createdAt)}
                      </p>
                      {conversation.expiresAt && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {getTimeRemaining(conversation.expiresAt)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(conversation.status)}
                    {conversation.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(conversation.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDecline(conversation.id)}>
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <Button asChild>
                        <Link href={`/mentor/chat/${conversation.id}`}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "You don't have any mentoring conversations yet."
                }
              </p>
              <Button asChild>
                <Link href="/mentors">Browse Mentors</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}




