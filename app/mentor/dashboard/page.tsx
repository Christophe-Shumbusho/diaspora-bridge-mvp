"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageCircle, Clock, User, Search, CheckCircle, XCircle, Mail, Heart } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { db, sendEmail, type MentorshipRequest, type MentorApplication } from "@/lib/database"

export default function MentorDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "mentor") {
      router.push("/")
      return
    }

    // Check if mentor is approved (active status)
    const mentorData = db.getUserById(user.id) as MentorApplication
    if (!mentorData || mentorData.status !== "active") {
      router.push("/mentor/application-submitted")
      return
    }

    // Load mentorship requests for this mentor
    loadMentorshipRequests()
    loadConversations()
  }, [user, router])

  const loadMentorshipRequests = () => {
    if (!user) return
    const requests = db.getMentorshipRequestsForMentor(user.id)
    setMentorshipRequests(requests)
  }

  const loadConversations = () => {
    if (!user) return
    const convs = db.getConversationsForUser(user.id)
    setConversations(convs)
  }

  const handleApproveRequest = async (requestId: string) => {
    setIsProcessing(true)
    try {
      const request = mentorshipRequests.find(r => r.id === requestId)
      if (!request) return

      // Update request status
      db.updateMentorshipRequest(requestId, { status: "approved" })

      // Create conversation
      const conversation = db.createConversation(request.menteeId, request.mentorId)

      // Get mentee details for email
      const mentee = db.getUserById(request.menteeId)
      if (mentee) {
        await sendEmail(
          mentee.email,
          "Your mentorship request has been approved! 🎉",
          `Hi ${mentee.name},\n\nGreat news! ${user?.name} has approved your mentorship request.\n\nYou can now start chatting with your mentor. Log in to your account and go to your conversations to begin.\n\nBest regards,\nThe Diaspora Bridge Team`
        )
      }

      loadMentorshipRequests()
      loadConversations()
    } catch (error) {
      console.error("Failed to approve request:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    setIsProcessing(true)
    try {
      const request = mentorshipRequests.find(r => r.id === requestId)
      if (!request) return

      // Update request status
      db.updateMentorshipRequest(requestId, { status: "rejected" })

      // Get mentee details for email
      const mentee = db.getUserById(request.menteeId)
      if (mentee) {
        await sendEmail(
          mentee.email,
          "Update on your mentorship request",
          `Hi ${mentee.name},\n\nThank you for your interest in mentorship with ${user?.name}.\n\nUnfortunately, they are unable to take on new mentees at this time. We encourage you to explore other mentors who might be a great fit for your goals.\n\nBest regards,\nThe Diaspora Bridge Team`
        )
      }

      loadMentorshipRequests()
    } catch (error) {
      console.error("Failed to reject request:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredRequests = mentorshipRequests.filter(request => {
    const mentee = db.getUserById(request.menteeId)
    const matchesSearch = mentee?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "pending": return <Badge variant="secondary">Pending</Badge>
      case "rejected": return <Badge variant="outline">Rejected</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!user || user.role !== "mentor") {
    return null
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
              <p className="text-muted-foreground">Welcome back, {user.name}! Manage your mentorship requests and conversations.</p>
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
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mentorshipRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentorshipRequests.filter(r => r.status === "pending").length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentorshipRequests.filter(r => r.status === "approved").length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{conversations.length}</p>
                  <p className="text-sm text-muted-foreground">Active Chats</p>
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
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={statusFilter === "rejected" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("rejected")}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentorship Requests */}
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const mentee = db.getUserById(request.menteeId)
            if (!mentee) return null

            return (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{mentee.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {mentee.email} • Requested {formatTimeAgo(request.createdAt)}
                        </p>
                        {request.message && (
                          <div className="bg-muted p-3 rounded-lg mb-3">
                            <p className="text-sm">{request.message}</p>
                          </div>
                        )}
                        {(mentee as any).profile && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Career Goal:</span> {(mentee as any).profile.careerGoal} • 
                            <span className="font-medium ml-2">Experience:</span> {(mentee as any).profile.experienceLevel}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(request.status)}
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveRequest(request.id)}
                            disabled={isProcessing}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={isProcessing}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {request.status === "approved" && (
                        <Button asChild>
                          <Link href={`/chat/${request.id}`}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Start Chat
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Active Conversations */}
        {conversations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Active Conversations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {conversations.map((conversation) => {
                const mentee = db.getUserById(conversation.menteeId)
                if (!mentee) return null

                return (
                  <Card key={conversation.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{mentee.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Started {formatTimeAgo(conversation.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/chat/${conversation.id}`}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No mentorship requests found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "You don't have any mentorship requests yet. Mentees will find you through our matching system!"
                }
              </p>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}




