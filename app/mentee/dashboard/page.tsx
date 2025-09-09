"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageCircle, Users, Clock, Star, RefreshCw, Send } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { db, type Conversation, type MentorshipRequest } from "@/lib/database"

export default function MenteeDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "mentee") {
      router.push("/")
      return
    }

    loadData()
  }, [user, router])

  const loadData = () => {
    if (!user) return
    
    // Load conversations
    const convs = db.getConversationsForUser(user.id)
    setConversations(convs)
    
    // Load mentorship requests
    const requests = db.getMentorshipRequestsForMentee(user.id)
    setMentorshipRequests(requests)
    
    setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const approvedRequests = mentorshipRequests.filter(r => r.status === "approved")
  const pendingRequests = mentorshipRequests.filter(r => r.status === "pending")

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Continue your mentorship journey and build meaningful connections</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{conversations.length}</p>
                  <p className="text-sm text-muted-foreground">Active Chats</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{approvedRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Approved Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{mentorshipRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Conversations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Conversations</CardTitle>
                <CardDescription>Chat with your approved mentors</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversations.length > 0 ? (
                conversations.map((conversation) => {
                  const mentor = db.getUserById(conversation.mentorId)
                  const lastMessage = conversation.messages[conversation.messages.length - 1]
                  
                  return (
                    <div
                      key={conversation.id}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{mentor?.name || "Unknown Mentor"}</p>
                        <p className="text-sm text-muted-foreground">
                          {lastMessage 
                            ? `${lastMessage.content.substring(0, 50)}${lastMessage.content.length > 50 ? '...' : ''}`
                            : "No messages yet"
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lastMessage ? formatTimeAgo(lastMessage.timestamp) : formatTimeAgo(conversation.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={conversation.status === "active" ? "default" : "secondary"}>
                          {conversation.status}
                        </Badge>
                        <Button size="sm" asChild>
                          <Link href={`/chat/${conversation.id}`}>
                            <MessageCircle className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No active conversations yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once a mentor approves your request, you'll be able to start chatting here.
                  </p>
                  <Button asChild>
                    <Link href="/matches">Find Mentors</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mentorship Requests Status */}
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Requests</CardTitle>
              <CardDescription>Track your mentor applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentorshipRequests.length > 0 ? (
                mentorshipRequests.map((request) => {
                  const mentor = db.getUserById(request.mentorId)
                  
                  return (
                    <div
                      key={request.id}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Send className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{mentor?.name || "Unknown Mentor"}</p>
                        <p className="text-sm text-muted-foreground">
                          Sent {formatTimeAgo(request.createdAt)}
                        </p>
                        {request.message && (
                          <p className="text-xs text-muted-foreground mt-1">
                            "{request.message.substring(0, 60)}..."
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            request.status === "approved" ? "default" : 
                            request.status === "pending" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                        {request.status === "approved" && (
                          <Button size="sm" asChild>
                            <Link href={`/chat/${conversations.find(c => c.mentorId === request.mentorId)?.id || ''}`}>
                              Chat
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No mentorship requests yet</p>
                  <Button asChild>
                    <Link href="/matches">Browse Mentors</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Continue your mentorship journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 flex-col gap-2">
                <Link href="/matches">
                  <Users className="h-6 w-6" />
                  <span>Find New Mentors</span>
                  <span className="text-xs opacity-80">Discover mentors in your field</span>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2 bg-transparent">
                <Link href="/chat">
                  <MessageCircle className="h-6 w-6" />
                  <span>View All Chats</span>
                  <span className="text-xs opacity-80">Access all conversations</span>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2 bg-transparent">
                <Link href="/profile">
                  <Star className="h-6 w-6" />
                  <span>Update Profile</span>
                  <span className="text-xs opacity-80">Improve your matching</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
