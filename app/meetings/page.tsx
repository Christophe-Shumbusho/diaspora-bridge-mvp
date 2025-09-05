"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, Clock, Video, Phone, MapPin, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"
import { 
  SAMPLE_MEETINGS, 
  getMeetingsForUser, 
  getUpcomingMeetings, 
  formatMeetingTime, 
  getMeetingTimeRemaining,
  type Meeting 
} from "@/lib/meetings"
import { useAuth } from "@/lib/auth-context"

export default function MeetingsPage() {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "scheduled" | "completed" | "cancelled">("all")

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-muted-foreground mb-4">You need to be logged in to view meetings.</p>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    )
  }

  const userMeetings = getMeetingsForUser(user.id, user.role as "mentor" | "mentee")
  const upcomingMeetings = getUpcomingMeetings(user.id, user.role as "mentor" | "mentee")

  const filteredMeetings = userMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.role === "mentor" ? meeting.menteeName : meeting.mentorName).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-500"
      case "completed": return "bg-green-500"
      case "cancelled": return "bg-red-500"
      case "rescheduled": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled": return <Badge variant="default">Scheduled</Badge>
      case "completed": return <Badge variant="secondary">Completed</Badge>
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>
      case "rescheduled": return <Badge variant="outline">Rescheduled</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />
      case "phone": return <Phone className="h-4 w-4" />
      case "in-person": return <MapPin className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Meetings & Sessions</h1>
              <p className="text-muted-foreground">Manage your one-on-one mentoring sessions</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {user.role === "mentor" ? "Mentor" : "Mentee"} Portal
              </Badge>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{userMeetings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Meetings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{userMeetings.filter(m => m.status === "completed").length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{userMeetings.filter(m => m.type === "video").length}</p>
                  <p className="text-sm text-muted-foreground">Video Calls</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        {upcomingMeetings.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Meetings
              </CardTitle>
              <CardDescription>Your next scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.slice(0, 3).map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {getMeetingIcon(meeting.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          with {user.role === "mentor" ? meeting.menteeName : meeting.mentorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatMeetingTime(meeting.scheduledAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getMeetingTimeRemaining(meeting.scheduledAt)}</Badge>
                      {meeting.meetingLink && (
                        <Button size="sm" asChild>
                          <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Join
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Meetings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Meetings</CardTitle>
                <CardDescription>Complete history of your mentoring sessions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <div className="flex gap-1">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "scheduled" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("scheduled")}
                  >
                    Scheduled
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("completed")}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {getMeetingIcon(meeting.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        with {user.role === "mentor" ? meeting.menteeName : meeting.mentorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatMeetingTime(meeting.scheduledAt)} • {meeting.duration} minutes
                      </p>
                      {meeting.description && (
                        <p className="text-xs text-muted-foreground mt-1">{meeting.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(meeting.status)}
                    {meeting.meetingLink && meeting.status === "scheduled" && (
                      <Button size="sm" asChild>
                        <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Join
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredMeetings.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No meetings found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "You don't have any meetings scheduled yet."
                }
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Your First Meeting
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

