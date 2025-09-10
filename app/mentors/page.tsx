"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Briefcase, Clock, MessageCircle } from "lucide-react"
import Link from "next/link"
import { getApprovedMentors, SAMPLE_MENTORS, type Mentor } from "@/lib/mentors"
import { db } from "@/lib/database"

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load mentors only on client side to avoid hydration mismatch
    try {
      const loadedMentors = getApprovedMentors()
      console.log("MentorsPage - Raw approved mentors:", loadedMentors)
      
      // If no approved mentors from database, fall back to sample mentors for demo
      if (loadedMentors.length === 0) {
        console.log("No approved mentors found, using sample mentors for demo")
        const sampleMentors = SAMPLE_MENTORS.filter((m: Mentor) => m.availability === "available")
        setMentors(sampleMentors)
      } else {
        setMentors(loadedMentors)
      }
      
      setIsLoaded(true)
      console.log("MentorsPage - Final mentors set:", loadedMentors.length > 0 ? loadedMentors : SAMPLE_MENTORS.filter((m: Mentor) => m.availability === "available"))
    } catch (error) {
      console.error("Error loading mentors:", error)
      // Fallback to sample mentors on error
      const sampleMentors = SAMPLE_MENTORS.filter((m: Mentor) => m.availability === "available")
      setMentors(sampleMentors)
      setIsLoaded(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Mentors</h1>
          <p className="text-muted-foreground">Connect with successful Rwandan professionals from around the world</p>
        </div>

        {/* Debug Info */}
        {isLoaded && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Total mentors found: {mentors.length}</p>
            <p>Check browser console for detailed logs</p>
            {mentors.length > 0 && (
              <div className="mt-2">
                <p>Mentor names: {mentors.map((m: any) => m.name).join(", ")}</p>
              </div>
            )}
            <div className="mt-4 flex gap-2">
            <Button 
              onClick={() => {
                // Create a test mentor
                const testMentor = db.createUser({
                  id: `test-mentor-${Date.now()}`,
                  name: "Test Mentor",
                  email: "test@mentor.com",
                  password: "test123",
                  role: "mentor",
                  status: "pending",
                  ...{
                    title: "Senior Developer",
                    company: "Tech Corp",
                    field: "Software Engineering",
                    location: "Kigali, Rwanda",
                    yearsOfExperience: 5,
                    bio: "Experienced software developer passionate about mentoring.",
                    expertise: ["JavaScript", "React", "Node.js"],
                    availability: "available",
                    conversationStarters: ["What programming languages interest you?"],
                    linkedinUrl: "",
                    websiteUrl: "",
                    whyMentor: "To give back to the community",
                    achievements: []
                  }
                } as any)
                console.log("Created test mentor:", testMentor)
                const loadedMentors = getApprovedMentors()
                setMentors(loadedMentors)
              }}
              variant="outline"
              size="sm"
            >
              Create Test Mentor
            </Button>
            <Button 
              onClick={() => {
                // Approve all pending mentors
                const pending = db.getPendingMentors()
                pending.forEach(mentor => {
                  db.approveMentor(mentor.id)
                  console.log("Approved mentor:", mentor.name)
                })
                const loadedMentors = getApprovedMentors()
                setMentors(loadedMentors)
              }}
              variant="outline"
              size="sm"
            >
              Approve All Pending
            </Button>
            <Button 
              onClick={() => {
                // Clear localStorage
                localStorage.removeItem('diaspora-bridge-users')
                localStorage.removeItem('diaspora-bridge-requests')
                localStorage.removeItem('diaspora-bridge-conversations')
                setMentors([])
              }}
              variant="destructive"
              size="sm"
            >
              Clear Data
            </Button>
            </div>
          </div>
        )}

        {/* Mentors Grid */}
        {mentors.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Mentors Available Yet</h2>
            <p className="text-muted-foreground mb-4">
              We're currently reviewing mentor applications. Check back soon!
            </p>
            <Button asChild>
              <Link href="/apply-mentor">Apply to be a Mentor</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={mentor.imageUrl || "/placeholder.svg"}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight">{mentor.name}</CardTitle>
                    <CardDescription className="text-sm">{mentor.title}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">{mentor.company}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {mentor.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {mentor.experience}y exp
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{mentor.field}</Badge>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        mentor.availability === "available" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground capitalize">{mentor.availability}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">{mentor.bio}</p>

                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.slice(0, 3).map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {mentor.expertise.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.expertise.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full"
                  disabled={mentor.availability !== "available"}
                  asChild={mentor.availability === "available"}
                >
                  {mentor.availability === "available" ? (
                    <Link href={`/mentors/${mentor.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Connect
                    </Link>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Currently Busy
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}
