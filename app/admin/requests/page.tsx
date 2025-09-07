"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllApplications, updateApplication, type MentorApplication } from "@/lib/applications-repo"
import { addMentor } from "@/lib/mentors-repo"
import { createMentorProfile } from "@/lib/auth"

export default function AdminRequestsPage() {
  const [apps, setApps] = useState<MentorApplication[]>([])

  useEffect(() => {
    setApps(getAllApplications())
  }, [])

  const approve = (app: MentorApplication) => {
    const updated: MentorApplication = { ...app, status: "approved" }
    updateApplication(updated)
    setApps(getAllApplications())
    // Promote to mentor store
    const profile = createMentorProfile({
      name: app.name,
      email: app.email,
      title: app.title,
      company: app.company,
      field: app.field,
      location: app.location,
      experience: app.experience,
      bio: app.bio,
      expertise: app.expertise,
      availability: "available",
      imageUrl: "/placeholder.svg",
      conversationStarters: [],
    })
    addMentor(profile)
  }

  const decline = (app: MentorApplication) => {
    const updated: MentorApplication = { ...app, status: "declined" }
    updateApplication(updated)
    setApps(getAllApplications())
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mentor Applications</CardTitle>
            <CardDescription>Review and approve or decline incoming mentor applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apps.length === 0 && (
                <div className="text-sm text-muted-foreground">No applications yet.</div>
              )}
              {apps.map((app) => (
                <div key={app.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium">{app.name} <span className="text-muted-foreground">— {app.title} @ {app.company}</span></div>
                    <div className="text-sm text-muted-foreground">{app.field} • {app.location} • {app.experience} yrs</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={app.status === "pending" ? "secondary" : app.status === "approved" ? "default" : "destructive"}>{app.status}</Badge>
                    {app.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => approve(app)}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => decline(app)}>Decline</Button>
                      </>
                    )}
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





