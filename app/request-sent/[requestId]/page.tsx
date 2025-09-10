"use client"

import { useEffect, useState, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageCircle, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/database"
import { SAMPLE_MENTORS } from "@/lib/mentors"
import { notFound } from "next/navigation"

interface RequestSentPageProps {
  params: Promise<{
    requestId: string
  }>
}

export default function RequestSentPage({ params }: RequestSentPageProps) {
  const { requestId } = use(params)
  const request = db.getMentorshipRequest(requestId)
  
  if (!request) {
    notFound()
  }
  
  const mentor = SAMPLE_MENTORS.find(m => m.id === request.mentorId)
  
  if (!mentor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Request Sent Successfully!</CardTitle>
            <CardDescription className="text-lg">
              Your mentorship request has been sent to {mentor.name}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Mentor Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <img
                src={mentor.imageUrl || "/placeholder.svg"}
                alt={mentor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{mentor.name}</h3>
                <p className="text-sm text-muted-foreground">{mentor.title}</p>
                <p className="text-sm text-muted-foreground">{mentor.company}</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                What happens next?
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Review Period</p>
                    <p className="text-sm text-muted-foreground">
                      {mentor.name} will review your request and profile within 2-3 business days
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Response</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email notification when {mentor.name} responds to your request
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Start Mentorship</p>
                    <p className="text-sm text-muted-foreground">
                      If approved, you'll be able to start chatting and schedule your first session
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Your Request Summary</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Field:</span> {request.menteeInfo.careerField}
                </div>
                <div>
                  <span className="text-muted-foreground">Goals:</span> {request.specificGoals}
                </div>
                <div>
                  <span className="text-muted-foreground">Time Commitment:</span> {request.timeCommitment}
                </div>
                <div>
                  <span className="text-muted-foreground">Meeting Frequency:</span> {request.preferredFrequency}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/mentee/dashboard">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/mentors">
                  Browse More Mentors
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Questions? Contact us at{" "}
                <a href="mailto:support@diasporabridge.com" className="text-primary hover:underline">
                  support@diasporabridge.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
