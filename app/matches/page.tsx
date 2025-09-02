"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { getMatchingMentors, type Mentor } from "@/lib/mentors"

export default function MatchesPage() {
  const [matches, setMatches] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate getting user's preferences from signup
    // In a real app, this would come from user session/database
    const userField = "Technology & Software" // This would be from user's signup data
    const userGoals = "Learn software engineering" // This would be from user's signup data

    const matchedMentors = getMatchingMentors(userField, userGoals)
    setMatches(matchedMentors)
    setLoading(false)
  }, [])

  const refreshMatches = () => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const userField = "Technology & Software"
      const userGoals = "Learn software engineering"
      const matchedMentors = getMatchingMentors(userField, userGoals)
      setMatches(matchedMentors)
      setLoading(false)
    }, 1000)
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

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Matches</h1>
              <p className="text-muted-foreground">
                We found {matches.length} mentors that match your interests and goals
              </p>
            </div>
            <Button variant="outline" onClick={refreshMatches} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Matches */}
        <div className="space-y-6">
          {matches.map((mentor, index) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={mentor.imageUrl || "/placeholder.svg"}
                    alt={mentor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{mentor.name}</CardTitle>
                        <CardDescription className="text-base">{mentor.title}</CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">{mentor.company}</p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        Match #{index + 1}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button asChild>
                    <Link href={`/chat/${mentor.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Conversation
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/mentors/${mentor.id}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {matches.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <h3 className="text-lg font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any available mentors matching your criteria right now.
              </p>
              <Button asChild>
                <Link href="/mentors">Browse All Mentors</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
