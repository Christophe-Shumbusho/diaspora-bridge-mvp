"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageCircle, Clock, User, Search, Filter, Check, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import { SAMPLE_CONVERSATIONS, formatTimeAgo, getTimeRemaining } from "@/lib/chat"
import { SAMPLE_MEETINGS, getUpcomingMeetings, formatMeetingTime } from "@/lib/meetings"
import { useAuth } from "@/lib/auth-context"
import { 
  getPendingMenteeRequestsForMentor, 
  approveMenteeRequest, 
  declineMenteeRequest,
  type MenteeRequest 
} from "@/lib/mentee-requests-repo"
import { upsertConversation, type Conversation } from "@/lib/conversations-repo"
import { scheduleMatchNotification } from "@/lib/email"
import "@/lib/demo-setup" // Auto-setup demo data
import UploadForm from "@/components/mentor/UploadForm"

export default function MentorDashboardPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "closed">("all")
  const [activeTab, setActiveTab] = useState<"requests" | "conversations" | "sessions" | "knowledge">("requests")

  const mentorId = "1" // In a real app, this would be user.id

  // Get pending requests for this mentor
  const pendingRequests = getPendingMenteeRequestsForMentor(mentorId)

  // Filter conversations for this mentor
  const mentorConversations = SAMPLE_CONVERSATIONS.filter(conv => 
    conv.mentorId === mentorId
  )
  const upcoming = getUpcomingMeetings(mentorId, "mentor").slice(0, 3)

  const filteredConversations = mentorConversations.filter(conv => {
    const matchesSearch = conv.menteeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApproveRequest = async (request: MenteeRequest) => {
    const conversationId = `conv-${Date.now()}`
    
    // Create conversation
    const conversation: Conversation = {
      id: conversationId,
      mentorId: request.mentorId,
      mentorName: request.mentorName,
      menteeId: `mentee-${request.id}`,
      menteeName: request.menteeName,
      status: "active",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }
    
    upsertConversation(conversation)
    
    // Approve the request
    approveMenteeRequest(request.id, conversationId)
    
    // Send notification to mentee
    await scheduleMatchNotification(request.menteeEmail, {
      mentorName: request.mentorName,
      menteeName: request.menteeName,
      mentorField: request.field,
      conversationId,
      expiresAt: conversation.expiresAt
    })
    
    // Refresh the page to show updated data
    window.location.reload()
  }

  const handleDeclineRequest = async (request: MenteeRequest) => {
    declineMenteeRequest(request.id)
    
    // Send decline notification to mentee
    // This would be implemented in the email system
    
    // Refresh the page to show updated data
    window.location.reload()
  }

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
                <AlertCircle className="h-5 w-5 text-orange-500" />
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
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentorConversations.filter(c => c.status === "closed").length}</p>
                  <p className="text-sm text-muted-foreground">Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "requests" ? "default" : "outline"}
            onClick={() => setActiveTab("requests")}
            className="flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Pending Requests ({pendingRequests.length})
          </Button>
          <Button
            variant={activeTab === "conversations" ? "default" : "outline"}
            onClick={() => setActiveTab("conversations")}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Conversations ({mentorConversations.length})
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Upcoming Sessions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map(m => (
                <div key={m.id} className="text-sm">
                  <div className="font-medium">{m.title}</div>
                  <div className="text-muted-foreground">{formatMeetingTime(m.scheduledAt)}</div>
                </div>
              ))}
              {upcoming.length === 0 && <div className="text-sm text-muted-foreground">No upcoming sessions</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">New mentee requests will appear here.</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Resources Shared</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Track downloads and views (coming soon).</CardContent>
          </Card>
        </div>

        {/* Filters - only show for conversations tab */}
        {activeTab === "conversations" && (
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
        )}

        {/* Content based on active tab */}
        {activeTab === "requests" ? (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{request.menteeName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {request.menteeEmail} • {request.field}
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium mb-1">Career Question:</p>
                          <p className="text-sm text-gray-700">{request.careerQuestion}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Experience:</p>
                            <p className="text-muted-foreground">{request.experience}</p>
                          </div>
                          <div>
                            <p className="font-medium">Goals:</p>
                            <p className="text-muted-foreground">{request.goals}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                          <Clock className="h-3 w-3" />
                          Requested {formatTimeAgo(request.createdAt)} • Expires {getTimeRemaining(request.expiresAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeclineRequest(request)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(request)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {pendingRequests.length === 0 && (
              <Card>
                <CardContent className="text-center py-16">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any pending mentorship requests at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : activeTab === "conversations" ? (
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
                      <Button asChild>
                        <Link href={`/mentor/chat/${conversation.id}`}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {conversation.status === "pending" ? "Review" : "Chat"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
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
                </CardContent>
              </Card>
            )}
          </div>
        ) : activeTab === "sessions" ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">Calendar and reschedule flow coming soon.</CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <UploadForm mentorId={mentorId} />
          </div>
        )}
      </div>
    </div>
  )
}


