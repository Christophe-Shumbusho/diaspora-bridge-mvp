"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getConversationsForMentor, upsertConversation } from "@/lib/conversations-repo"
import { useAuth } from "@/lib/auth-context"
import { type Conversation } from "@/lib/chat"
import Link from "next/link"

export default function MentorRequestsPage() {
  const { user } = useAuth()
  const [pending, setPending] = useState<Conversation[]>([])

  useEffect(() => {
    if (!user) return
    const list = getConversationsForMentor(user.id).filter(c => c.status === "pending")
    setPending(list)
  }, [user])

  const approve = (conv: Conversation) => {
    const updated: Conversation = { ...conv, status: "active" }
    upsertConversation(updated)
    setPending(prev => prev.filter(c => c.id !== conv.id))
  }

  const decline = (conv: Conversation) => {
    const updated: Conversation = { ...conv, status: "closed" }
    upsertConversation(updated)
    setPending(prev => prev.filter(c => c.id !== conv.id))
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Connection Requests</CardTitle>
            <CardDescription>Review mentees who want to start a conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pending.length === 0 && (
                <div className="text-sm text-muted-foreground">No pending requests.</div>
              )}
              {pending.map((conv) => (
                <div key={conv.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium">{conv.menteeName}</div>
                    <div className="text-sm text-muted-foreground">Requested connection</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Pending</Badge>
                    <Button size="sm" onClick={() => approve(conv)}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => decline(conv)}>Decline</Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/mentor/chat/${conv.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





