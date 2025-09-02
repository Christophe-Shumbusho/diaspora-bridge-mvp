import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageCircle, Users, Clock, Star } from "lucide-react"
import Link from "next/link"
import { DashboardStats } from "@/components/dashboard-stats"
import { getConversationsForUser, formatTimeAgo } from "@/lib/chat"
import { getAllAvailableMentors } from "@/lib/mentors"

export default function DashboardPage() {
  // In a real app, these would be fetched based on user session
  const conversations = getConversationsForUser("user-1").slice(0, 3)
  const featuredMentors = getAllAvailableMentors().slice(0, 3)

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Continue building meaningful connections with your mentors</p>
        </div>

        {/* Stats */}
        <DashboardStats />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Conversations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>Your latest mentor interactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/chat">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{conversation.mentorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {conversation.lastMessage
                          ? formatTimeAgo(conversation.lastMessage.timestamp)
                          : "No messages yet"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={conversation.status === "active" ? "default" : "secondary"}>
                        {conversation.status}
                      </Badge>
                      <Button size="sm" asChild>
                        <Link href={`/chat/${conversation.id}`}>
                          <MessageCircle className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No conversations yet</p>
                  <Button asChild>
                    <Link href="/mentors">Find Mentors</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Mentors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Featured Mentors</CardTitle>
                <CardDescription>Discover new mentors in your field</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/mentors">
                  Browse All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={mentor.imageUrl || "/placeholder.svg"}
                    alt={mentor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{mentor.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-muted-foreground">{mentor.experience}y</span>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/mentors/${mentor.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to help you make the most of your mentorship journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 flex-col gap-2">
                <Link href="/matches">
                  <Users className="h-6 w-6" />
                  <span>View Your Matches</span>
                  <span className="text-xs opacity-80">See personalized mentor recommendations</span>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2 bg-transparent">
                <Link href="/chat">
                  <MessageCircle className="h-6 w-6" />
                  <span>Continue Conversations</span>
                  <span className="text-xs opacity-80">Keep building relationships</span>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2 bg-transparent">
                <Link href="/notifications">
                  <Clock className="h-6 w-6" />
                  <span>Manage Notifications</span>
                  <span className="text-xs opacity-80">Control your email preferences</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
