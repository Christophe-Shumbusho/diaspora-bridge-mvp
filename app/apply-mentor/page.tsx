"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addApplication, type MentorApplication } from "@/lib/applications-repo"
import { saveCredential } from "@/lib/credentials"

const CAREER_FIELDS = [
  "Technology & Software",
  "Business & Entrepreneurship",
  "Healthcare & Medicine",
  "Engineering",
  "Finance & Banking",
  "Education & Research",
  "Marketing & Communications",
  "Law & Legal Services",
  "Arts & Creative Industries",
  "Non-profit & Social Impact",
  "Other",
]

export default function ApplyMentorPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    company: "",
    field: "",
    location: "",
    experience: "",
    bio: "",
    expertise: "",
    password: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const submit = () => {
    const app: MentorApplication = {
      id: `app-${Date.now()}`,
      name: form.name,
      email: form.email,
      title: form.title,
      company: form.company,
      field: form.field,
      location: form.location,
      experience: parseInt(form.experience || "0"),
      bio: form.bio,
      expertise: form.expertise.split(",").map(s => s.trim()).filter(Boolean),
      passwordHash: btoa(form.password),
      createdAt: new Date(),
      status: "pending",
    }
    addApplication(app)
    if (form.email && form.password) {
      saveCredential({ email: form.email, role: "mentor", passwordHash: btoa(form.password) })
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Application Submitted</CardTitle>
            <CardDescription>Our admin team will review your application and get back to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You will receive an email once approved.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Become a Mentor</CardTitle>
            <CardDescription>Submit your application to join Diaspora Bridge as a mentor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div>
                <Label>Company</Label>
                <Input value={form.company} onChange={(e) => update("company", e.target.value)} />
              </div>
              <div>
                <Label>Field</Label>
                <Select value={form.field} onValueChange={(v) => update("field", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREER_FIELDS.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>
              <div>
                <Label>Experience (years)</Label>
                <Input type="number" value={form.experience} onChange={(e) => update("experience", e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Password (for mentor login)</Label>
                <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
              </div>
              <div className="text-xs text-muted-foreground flex items-end">
                Use a strong password. You’ll use this to access your dashboard.
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} />
            </div>
            <div>
              <Label>Expertise (comma-separated)</Label>
              <Input value={form.expertise} onChange={(e) => update("expertise", e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button onClick={submit} disabled={!form.name || !form.email || !form.field}>Submit Application</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



