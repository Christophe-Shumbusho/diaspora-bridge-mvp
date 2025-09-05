import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Briefcase, MessageCircle, Star } from "lucide-react"
import Link from "next/link"
import { SAMPLE_MENTORS } from "@/lib/mentors"
import { notFound } from "next/navigation"

interface MentorProfilePageProps {
  params: {
    id: string
  }
}

export default function MentorProfilePage({ params }: MentorProfilePageProps) {
  const mentor = SAMPLE_MENTORS.find((m) => m.id === params.id)

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
                    {mentor.experience} years
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
                    <Link href={`/chat/start/${mentor.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Conversation
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
