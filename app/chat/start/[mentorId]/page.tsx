"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SAMPLE_CONVERSATIONS } from "@/lib/chat"
import { upsertConversation, findConversationByMentor } from "@/lib/conversations-repo"
import { getAllMentors } from "@/lib/mentors-repo"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, User } from "lucide-react"

interface StartChatPageProps {
  params: Promise<{ mentorId: string }>
}

export default function StartChatPage({ params }: StartChatPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { user } = useAuth()
  const [step, setStep] = useState<"checking" | "pending" | "approved">("checking")

  useEffect(() => {
    const existingConversation = findConversationByMentor(resolvedParams.mentorId)

    if (existingConversation) {
      // If conversation exists, go directly to it
      router.push(`/chat/${existingConversation.id}`)
    } else {
      // Create a pending conversation in the repo
      if (user) {
        const mentor = getAllMentors().find(m => m.id === resolvedParams.mentorId)
        const newConvId = `conv-${Date.now()}`
        upsertConversation({
          id: newConvId,
          mentorId: resolvedParams.mentorId,
          mentorName: mentor?.name || "",
          menteeId: user.id,
          menteeName: user.name,
          status: "pending",
          createdAt: new Date(),
        })
      }
      setTimeout(() => setStep("pending"), 500)
    }
  }, [resolvedParams.mentorId, router])

  const handleSimulateApproval = () => {
    setStep("approved")
    setTimeout(() => {
      router.push("/chat/conv-1")
    }, 1500)
  }

  if (step === "checking") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking conversation status...</p>
        </div>
      </div>
    )
  }

  if (step === "pending") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle>Waiting for Mentor Approval</CardTitle>
            <p className="text-muted-foreground text-sm">
              Your conversation request has been sent to the mentor. They'll review and respond within 24 hours.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">What happens next?</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mentor receives email notification</li>
                <li>• They review your profile and goals</li>
                <li>• They can accept or decline the request</li>
                <li>• You'll be notified of their decision</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => router.push("/matches")}>
                Browse Other Mentors
              </Button>
              <Button className="flex-1" onClick={handleSimulateApproval}>
                Simulate Approval
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "approved") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Request Approved!</CardTitle>
            <p className="text-muted-foreground text-sm">
              The mentor has accepted your conversation request. Redirecting to your chat...
            </p>
          </CardHeader>
          <CardContent>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
