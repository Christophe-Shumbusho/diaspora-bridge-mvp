import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Briefcase, MessageCircle, Star } from "lucide-react"
import Link from "next/link"
import { SAMPLE_MENTORS, getApprovedMentors } from "@/lib/mentors"
import { db, type MentorApplication } from "@/lib/database"
import { notFound } from "next/navigation"

interface MentorProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default function MentorProfilePage({ params }: MentorProfilePageProps) {
  const { id } = use(params)
  
  // Try to find mentor from multiple sources
  let mentor = null
  
  console.log(`Looking for mentor ID: ${id}`)
  
  // First check database for approved mentors
  const dbMentor = db.getUserById(id) as MentorApplication
  console.log(`Database mentor found:`, dbMentor)
  
  if (dbMentor && dbMentor.role === "mentor" && dbMentor.status === "active") {
    console.log(`Using database mentor: ${dbMentor.name}`)
    mentor = {
      id: dbMentor.id,
      name: dbMentor.name,
      email: dbMentor.email,
      role: dbMentor.role,
      title: dbMentor.title || "Software Developer", // Default value
      company: dbMentor.company || "Tech Company", // Default value
      field: dbMentor.field || "Technology", // Default value
      location: dbMentor.location || "Remote", // Default value
      experience: dbMentor.yearsOfExperience || 3, // Default value
      bio: dbMentor.bio || "Experienced professional ready to mentor.", // Default value
      expertise: dbMentor.expertise || ["General"], // Default value
      availability: dbMentor.availability || "available", // Default value
      imageUrl: dbMentor.imageUrl || "/placeholder.svg",
      conversationStarters: dbMentor.conversationStarters || [
        "What are your career goals?",
        "What challenges are you facing in your field?",
        "How can I help you grow professionally?"
      ]
    }
  }
  
  // If not found in database, check approved mentors list
  if (!mentor) {
    console.log(`Database mentor not found, checking approved mentors list`)
    const allMentors = getApprovedMentors()
    console.log(`All approved mentors:`, allMentors.map(m => ({ id: m.id, name: m.name })))
    mentor = allMentors.find((m) => m.id === id)
    if (mentor) {
      console.log(`Found mentor in approved list: ${mentor.name}`)
    } else {
      console.log(`Mentor not found in approved list either`)
      console.log(`Available mentor IDs:`, allMentors.map(m => m.id))
    }
  }

  if (!mentor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/mentors" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mentors
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <img
                  src={mentor.imageUrl || "/placeholder.svg"}
                  alt={mentor.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <CardTitle className="text-xl">{mentor.name}</CardTitle>
                <CardDescription>{mentor.title}</CardDescription>
                <p className="text-sm font-medium text-foreground">{mentor.company}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {mentor.location}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {(mentor as any).experience || (mentor as any).yearsOfExperience} years
                  </div>
                </div>

                <div className="flex items-center justify-between">
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

                <Button
                  className="w-full"
                  size="lg"
                  disabled={mentor.availability !== "available"}
                  asChild={mentor.availability === "available"}
                >
                  {mentor.availability === "available" ? (
                    <Link href={`/request-mentorship/${mentor.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Request Mentorship
                    </Link>
                  ) : (
                    <>Currently Unavailable</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {mentor.name.split(" ")[0]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conversation Starters */}
            <Card>
              <CardHeader>
                <CardTitle>Great Questions to Ask</CardTitle>
                <CardDescription>
                  Here are some conversation starters that {mentor.name.split(" ")[0]} loves discussing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mentor.conversationStarters.map((starter, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{starter}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
