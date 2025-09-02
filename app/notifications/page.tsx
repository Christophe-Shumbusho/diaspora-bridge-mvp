"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, MessageCircle, Clock, Bell } from "lucide-react"
import Link from "next/link"
import {
  generateMatchNotificationEmail,
  generateMessageNotificationEmail,
  generateExpiryReminderEmail,
  type NotificationData,
} from "@/lib/email"

export default function NotificationsPage() {
  const [emailPreferences, setEmailPreferences] = useState({
    newMatches: true,
    newMessages: true,
    expiryReminders: true,
    weeklyDigest: false,
  })

  const [previewType, setPreviewType] = useState<"match" | "message" | "expiry">("match")

  const sampleData: NotificationData = {
    mentorName: "Dr. Aline Uwimana",
    menteeName: "John Doe",
    mentorField: "Technology & Software",
    conversationId: "conv-1",
    messageContent:
      "Hi! I'm excited to connect with you. I saw that you're interested in software engineering. What specific areas are you most curious about?",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }

  const getPreviewTemplate = () => {
    switch (previewType) {
      case "match":
        return generateMatchNotificationEmail(sampleData)
      case "message":
        return generateMessageNotificationEmail(sampleData)
      case "expiry":
        return generateExpiryReminderEmail(sampleData)
      default:
        return generateMatchNotificationEmail(sampleData)
    }
  }

  const updatePreference = (key: keyof typeof emailPreferences, value: boolean) => {
    setEmailPreferences((prev) => ({ ...prev, [key]: value }))
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Email Notifications</h1>
          <p className="text-muted-foreground">Manage your email preferences and preview notification templates</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preferences */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose which email notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="new-matches" className="text-sm font-medium">
                      New Mentor Matches
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when you're matched with a new mentor</p>
                  </div>
                  <Switch
                    id="new-matches"
                    checked={emailPreferences.newMatches}
                    onCheckedChange={(checked) => updatePreference("newMatches", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="new-messages" className="text-sm font-medium">
                      New Messages
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when mentors send you messages</p>
                  </div>
                  <Switch
                    id="new-messages"
                    checked={emailPreferences.newMessages}
                    onCheckedChange={(checked) => updatePreference("newMessages", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="expiry-reminders" className="text-sm font-medium">
                      Connection Expiry Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">Get reminded before your mentor connections expire</p>
                  </div>
                  <Switch
                    id="expiry-reminders"
                    checked={emailPreferences.expiryReminders}
                    onCheckedChange={(checked) => updatePreference("expiryReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="weekly-digest" className="text-sm font-medium">
                      Weekly Digest
                    </Label>
                    <p className="text-sm text-muted-foreground">Weekly summary of your mentorship activities</p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={emailPreferences.weeklyDigest}
                    onCheckedChange={(checked) => updatePreference("weeklyDigest", checked)}
                  />
                </div>

                <Button className="w-full">Save Preferences</Button>
              </CardContent>
            </Card>

            {/* Email Types */}
            <Card>
              <CardHeader>
                <CardTitle>Email Types</CardTitle>
                <CardDescription>Different types of emails you'll receive from Diaspora Bridge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Match Notifications</p>
                    <p className="text-sm text-muted-foreground">When you're paired with a new mentor</p>
                  </div>
                  <Badge variant="secondary">Instant</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Message Alerts</p>
                    <p className="text-sm text-muted-foreground">When mentors send you messages</p>
                  </div>
                  <Badge variant="secondary">Real-time</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Expiry Reminders</p>
                    <p className="text-sm text-muted-foreground">Before connections expire (6h warning)</p>
                  </div>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <CardDescription>See how our email notifications look</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={previewType === "match" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewType("match")}
                  >
                    Match
                  </Button>
                  <Button
                    variant={previewType === "message" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewType("message")}
                  >
                    Message
                  </Button>
                  <Button
                    variant={previewType === "expiry" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewType("expiry")}
                  >
                    Expiry
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="text-sm font-medium mb-2">Subject:</div>
                  <div className="text-sm text-muted-foreground mb-4">{getPreviewTemplate().subject}</div>

                  <div className="text-sm font-medium mb-2">Preview:</div>
                  <div
                    className="text-sm bg-white border rounded p-4 max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: getPreviewTemplate().html }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
