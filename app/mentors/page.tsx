import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Briefcase, Clock, MessageCircle } from "lucide-react"
import Link from "next/link"
import { getAllAvailableMentors } from "@/lib/mentors"

export default function MentorsPage() {
  const mentors = getAllAvailableMentors()

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

        {/* Mentors Grid */}
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
                  {mentor.expertise.slice(0, 3).map((skill) => (
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
      </div>
    </div>
  )
}
