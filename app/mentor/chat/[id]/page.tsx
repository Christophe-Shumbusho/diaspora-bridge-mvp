"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Clock, User, MessageCircle, CheckCircle, XCircle, Calendar, Video } from "lucide-react"
import Link from "next/link"
import { SAMPLE_CONVERSATIONS, formatTimeAgo, getTimeRemaining, type Conversation } from "@/lib/chat"
import { getMessages, sendMessage, type ChatMessage } from "@/lib/messages-repo"
import { createMeeting, generateZoomLink, generateGoogleMeetLink, type Meeting } from "@/lib/meetings"
import { useAuth } from "@/lib/auth-context"

interface MentorChatPageProps {
  params: Promise<{ id: string }>
}

export default function MentorChatPage({ params }: MentorChatPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduledMeetings, setScheduledMeetings] = useState<Meeting[]>([])
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    description: "",
    type: "video" as "video" | "phone" | "in-person",
    duration: "60",
    scheduledAt: "",
    meetingLink: "",
    location: ""
  })

  // Find conversations where this mentor is involved
  const mentorConversations = SAMPLE_CONVERSATIONS.filter(conv => conv.mentorId === resolvedParams.id)

  useEffect(() => {
    if (mentorConversations.length > 0) {
      const conv = mentorConversations[0] // For demo, use first conversation
      setConversation(conv)
      setMessages(getMessages(conv.id))
    }
  }, [resolvedParams.id])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation) return
    const saved = sendMessage({
      conversationId: conversation.id,
      senderId: conversation.mentorId,
      senderName: conversation.mentorName,
      senderType: "mentor",
      content: newMessage,
    })
    setMessages((prev) => [...prev, saved])
    setNewMessage("")
  }

  const handleApproveConversation = () => {
    if (!conversation) return
    setConversation(prev => prev ? { ...prev, status: "active" } : null)
  }

  const handleDeclineConversation = () => {
    if (!conversation) return
    setConversation(prev => prev ? { ...prev, status: "closed" } : null)
  }

  const handleCreateMeeting = () => {
    if (!conversation || !user) return

    // Generate meeting link based on type
    let meetingLink = ""
    if (meetingForm.type === "video") {
      meetingLink = meetingForm.meetingLink || generateZoomLink()
    }

    const newMeeting = createMeeting({
      mentorId: conversation.mentorId,
      menteeId: conversation.menteeId,
      mentorName: conversation.mentorName,
      menteeName: conversation.menteeName,
      title: meetingForm.title,
      description: meetingForm.description,
      type: meetingForm.type,
      duration: parseInt(meetingForm.duration),
      scheduledAt: new Date(meetingForm.scheduledAt),
      meetingLink: meetingLink,
      location: meetingForm.location
    })

    setScheduledMeetings(prev => [...prev, newMeeting])
    setShowScheduleModal(false)
    setMeetingForm({
      title: "",
      description: "",
      type: "video",
      duration: "60",
      scheduledAt: "",
      meetingLink: "",
      location: ""
    })

    // Add a message about the scheduled meeting
    const meetingMessage: ChatMessage = {
      id: `msg-meeting-${Date.now()}`,
      conversationId: conversation.id,
      senderId: conversation.mentorId,
      senderName: conversation.mentorName,
      senderType: "mentor",
      content: `📅 I've scheduled a ${meetingForm.type} meeting: "${meetingForm.title}" for ${new Date(meetingForm.scheduledAt).toLocaleDateString()}. ${meetingLink ? `Join here: ${meetingLink}` : ""}`,
      timestamp: new Date().toISOString(),
      read: false,
    }
    setMessages(prev => [...prev, meetingMessage])
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Conversations Found</h2>
          <p className="text-muted-foreground mb-4">You don't have any active conversations yet.</p>
          <Button asChild>
            <Link href="/mentors">Browse Mentors</Link>
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
              <Link href="/mentors" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold">Mentoring: {conversation.menteeName}</h1>
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
            <div className="flex items-center gap-2">
              <Badge variant="outline">Mentor View</Badge>
              {conversation.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleApproveConversation}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDeclineConversation}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderType === "mentor" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderType === "mentor"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1 text-xs opacity-80">
                    {message.senderType === "mentee" && <User className="h-3 w-3" />}
                    <span className="font-medium">{message.senderName}</span>
                  </div>
                  <span className="text-xs opacity-60">{formatTimeAgo(message.timestamp)}</span>
                </div>
                <p className="text-sm">{message.content}</p>
                {!message.read && message.senderType === "mentor" && (
                  <div className="text-xs opacity-60 mt-1">Sent</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        {conversation.status === "active" && (
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your wisdom and guidance..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Mentor Actions */}
        {conversation.status === "active" && (
          <div className="border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Schedule One-on-One Session</CardTitle>
              <CardDescription>Plan a dedicated mentoring session with {conversation.menteeName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meeting-title">Meeting Title</Label>
                <Input
                  id="meeting-title"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Career Guidance Session"
                />
              </div>
              
              <div>
                <Label htmlFor="meeting-description">Description</Label>
                <Input
                  id="meeting-description"
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What will we discuss?"
                />
              </div>
              
              <div>
                <Label htmlFor="meeting-type">Meeting Type</Label>
                <Select value={meetingForm.type} onValueChange={(value: any) => setMeetingForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call (Zoom/Google Meet)</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="in-person">In-Person Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="meeting-duration">Duration</Label>
                <Select value={meetingForm.duration} onValueChange={(value) => setMeetingForm(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="meeting-datetime">Date & Time</Label>
                <Input
                  id="meeting-datetime"
                  type="datetime-local"
                  value={meetingForm.scheduledAt}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                />
              </div>
              
              {meetingForm.type === "video" && (
                <div>
                  <Label htmlFor="meeting-link">Meeting Link (optional)</Label>
                  <Input
                    id="meeting-link"
                    value={meetingForm.meetingLink}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                    placeholder="https://zoom.us/j/... (leave empty to auto-generate)"
                  />
                </div>
              )}
              
              {meetingForm.type === "in-person" && (
                <div>
                  <Label htmlFor="meeting-location">Location</Label>
                  <Input
                    id="meeting-location"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Coffee shop, office, etc."
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCreateMeeting} className="flex-1" disabled={!meetingForm.title || !meetingForm.scheduledAt}>
                  Schedule Meeting
                </Button>
                <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
