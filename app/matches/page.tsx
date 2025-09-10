"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MessageCircle, RefreshCw, Send, Heart, MapPin, Briefcase, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { db, findMatchingMentors, type MentorApplication, type MenteeProfile } from "@/lib/database"

export default function MatchesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [matches, setMatches] = useState<MentorApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMentor, setSelectedMentor] = useState<MentorApplication | null>(null)
  const [requestMessage, setRequestMessage] = useState("")
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "mentee") {
      router.push("/")
      return
    }

    // Get matching mentors based on user profile
    const menteeProfile = user as MenteeProfile
    const matchedMentors = findMatchingMentors(menteeProfile)
    setMatches(matchedMentors)
    setLoading(false)
  }, [user, router])

  const refreshMatches = () => {
    if (!user || user.role !== "mentee") return
    
    setLoading(true)
    setTimeout(() => {
      const menteeProfile = user as MenteeProfile
      const matchedMentors = findMatchingMentors(menteeProfile)
      setMatches(matchedMentors)
      setLoading(false)
    }, 1000)
  }

  const handleSendRequest = async (mentor: MentorApplication) => {
    if (!user || !requestMessage.trim()) return

    setIsSubmittingRequest(true)
    try {
      // Create mentorship request
      const requestId = `req-${Date.now()}-${user.id}-${mentor.id}`
      const request = {
        id: requestId,
        menteeId: user.id,
        mentorId: mentor.id,
        status: "pending" as const,
        message: requestMessage.trim(),
        specificGoals: requestMessage.trim(),
        timeCommitment: "1 hour per week",
        preferredFrequency: "weekly" as const,
        createdAt: new Date(),
        menteeInfo: {
          name: user.name,
          email: user.email,
          careerField: (user as MenteeProfile).profile?.careerField || "General",
          currentEducation: (user as MenteeProfile).profile?.currentEducation || "Not specified",
          location: (user as MenteeProfile).profile?.location || "Not specified",
          goals: requestMessage.trim(),
          experience: (user as MenteeProfile).profile?.experienceLevel || "Entry Level",
          interests: (user as MenteeProfile).profile?.interests || []
        }
      }
      db.createMentorshipRequest(request)

      // Send notification email to mentor (simulated)
      console.log(`📧 Mentorship request sent to ${mentor.email}`)
      
      // Reset form
      setSelectedMentor(null)
      setRequestMessage("")
      
      // Show success message (you could add a toast notification here)
      alert(`Your mentorship request has been sent to ${mentor.name}! They will receive an email notification and can approve your request from their dashboard.`)
      
    } catch (error) {
      console.error("Failed to send mentorship request:", error)
      alert("Failed to send request. Please try again.")
    } finally {
      setIsSubmittingRequest(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Mentor Matches</h1>
              <p className="text-muted-foreground">
                We found {matches.length} mentors that match your interests in {(user as MenteeProfile).profile?.careerField || "your field"}
              </p>
            </div>
            <Button variant="outline" onClick={refreshMatches} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Matches
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Matches List */}
          <div className="lg:col-span-2 space-y-6">
            {matches.map((mentor, index) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img
                      src={mentor.imageUrl || "/placeholder.svg"}
                      alt={mentor.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-muted"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{mentor.name}</CardTitle>
                          <CardDescription className="text-base font-medium">{mentor.title}</CardDescription>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {mentor.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {mentor.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {mentor.yearsOfExperience} years
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary">
                            Match #{index + 1}
                          </Badge>
                          <Badge 
                            variant={mentor.availability === "available" ? "default" : "outline"}
                            className={mentor.availability === "available" ? "bg-green-100 text-green-800" : ""}
                          >
                            {mentor.availability}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 5).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 5} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={() => setSelectedMentor(mentor)}
                      disabled={mentor.availability === "unavailable"}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Request Mentorship
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/mentors/${mentor.id}`}>View Full Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {matches.length === 0 && (
              <Card>
                <CardContent className="text-center py-16">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any available mentors matching your criteria right now. Try expanding your interests or check back later.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={refreshMatches}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Matches
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/mentors">Browse All Mentors</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Request Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Send Request
                </CardTitle>
                <CardDescription>
                  {selectedMentor ? `Send a mentorship request to ${selectedMentor.name}` : "Select a mentor to send a request"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMentor ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={selectedMentor.imageUrl || "/placeholder.svg"}
                          alt={selectedMentor.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{selectedMentor.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedMentor.title}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requestMessage">Your Message</Label>
                      <Textarea
                        id="requestMessage"
                        placeholder="Hi! I'm interested in your mentorship. I'm currently working on..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Introduce yourself and explain why you'd like this mentor's guidance.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => handleSendRequest(selectedMentor)}
                        disabled={!requestMessage.trim() || isSubmittingRequest}
                        className="w-full"
                      >
                        {isSubmittingRequest ? "Sending..." : "Send Request"}
                        <Send className="h-4 w-4 ml-2" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedMentor(null)
                          setRequestMessage("")
                        }}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">What happens next?</p>
                      <ul className="space-y-1">
                        <li>• Your request will be sent to {selectedMentor.name}</li>
                        <li>• They'll receive an email notification</li>
                        <li>• You'll be notified when they respond</li>
                        <li>• If approved, you can start chatting!</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a mentor from the list to send them a mentorship request</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
