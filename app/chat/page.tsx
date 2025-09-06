import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle, Clock, User } from "lucide-react"
import Link from "next/link"
import { formatTimeAgo, getTimeRemaining } from "@/lib/chat"
import { useAuth } from "@/lib/auth-context"
import { getConversationsForMentee } from "@/lib/conversations-repo"

export default function ChatListPage() {
  const { user } = useAuth()
  const conversations = user && user.role === "mentee" ? getConversationsForMentee(user.id) : []

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Conversations</h1>
          <p className="text-muted-foreground">
            Connect with your mentors and continue building meaningful relationships
          </p>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{conversation.mentorName}</CardTitle>
                      <CardDescription>
                        {conversation.status === "active" ? "Active conversation" : "Pending connection"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={conversation.status === "active" ? "default" : "secondary"}>
                      {conversation.status}
                    </Badge>
                    {conversation.expiresAt && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {getTimeRemaining(conversation.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {conversation.lastMessage && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      <span className="font-medium">{conversation.lastMessage.senderName}:</span>
                    </p>
                    <p className="text-sm line-clamp-2">{conversation.lastMessage.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTimeAgo(conversation.lastMessage.timestamp)}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href={`/chat/${conversation.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {conversation.status === "active" ? "Continue Chat" : "Start Conversation"}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/mentors/${conversation.mentorId}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!user || conversations.length === 0) && (
          <Card>
            <CardContent className="text-center py-16">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{user ? "No conversations yet" : "Please log in"}</h3>
              {user ? (
                <>
                  <p className="text-muted-foreground mb-4">Start connecting with mentors to begin meaningful conversations about your career.</p>
                  <Button asChild>
                    <Link href="/mentors">Find Mentors</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">You need to be logged in to view conversations.</p>
                  <Button asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
