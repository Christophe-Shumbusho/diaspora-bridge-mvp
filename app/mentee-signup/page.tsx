"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addMenteeRequest, canMenteeRequestAgain, type MenteeRequest } from "@/lib/mentee-requests-repo"
import { getAllMentors } from "@/lib/mentors-repo"
import { sendMentorRequestNotification } from "@/lib/email"

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

export default function MenteeSignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    field: "",
    careerQuestion: "",
    experience: "",
    goals: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState("")

  const mentors = getAllMentors()
  const availableMentors = mentors.filter(m => m.availability === "available")

  const submit = async () => {
    if (!selectedMentor) {
      alert("Please select a mentor")
      return
    }

    // Check if mentee can request again
    if (!canMenteeRequestAgain(form.email)) {
      alert("You have a recent declined request. Please wait 7 days before requesting again.")
      return
    }

    const mentor = mentors.find(m => m.id === selectedMentor)
    if (!mentor) {
      alert("Selected mentor not found")
      return
    }

    const request: MenteeRequest = {
      id: `req-${Date.now()}`,
      menteeName: form.name,
      menteeEmail: form.email,
      mentorId: mentor.id,
      mentorName: mentor.name,
      field: form.field,
      careerQuestion: form.careerQuestion,
      experience: form.experience,
      goals: form.goals,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    }

    addMenteeRequest(request)

    // Send notification to mentor
    await sendMentorRequestNotification(mentor.email || "mentor@example.com", {
      name: form.name,
      email: form.email,
      careerField: form.field,
      goals: form.goals,
      experience: form.experience
    })

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Request Submitted</CardTitle>
            <CardDescription>
              Your mentorship request has been sent to the mentor. 
              They have 48 hours to approve your request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You will receive an email notification once the mentor responds.
            </p>
            <Button asChild className="w-full">
              <a href="/">Return to Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const filteredMentors = availableMentors.filter(m => 
    !form.field || m.field === form.field
  )

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Request a Mentor</CardTitle>
            <CardDescription>
              Fill out the form below to request mentorship from a diaspora professional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={form.name} 
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <Label>Career Field</Label>
              <Select value={form.field} onValueChange={(v) => update("field", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your field of interest" />
                </SelectTrigger>
                <SelectContent>
                  {CAREER_FIELDS.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Your Career Question</Label>
              <Textarea 
                rows={3} 
                value={form.careerQuestion} 
                onChange={(e) => update("careerQuestion", e.target.value)}
                placeholder="What specific career guidance are you looking for?"
              />
            </div>

            <div>
              <Label>Your Experience Level</Label>
              <Textarea 
                rows={2} 
                value={form.experience} 
                onChange={(e) => update("experience", e.target.value)}
                placeholder="Briefly describe your current experience and background"
              />
            </div>

            <div>
              <Label>Your Goals</Label>
              <Textarea 
                rows={2} 
                value={form.goals} 
                onChange={(e) => update("goals", e.target.value)}
                placeholder="What are your career goals and what you hope to achieve?"
              />
            </div>

            {form.field && (
              <div>
                <Label>Select a Mentor</Label>
                <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a mentor in your field" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMentors.map(mentor => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{mentor.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {mentor.title} at {mentor.company}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filteredMentors.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No available mentors found in this field. Try selecting a different field.
                  </p>
                )}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your request will be sent to the selected mentor</li>
                <li>• The mentor has 48 hours to approve or decline</li>
                <li>• You'll receive an email notification with their response</li>
                <li>• If approved, you can start chatting immediately</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={submit} 
                disabled={!form.name || !form.email || !form.field || !selectedMentor || !form.careerQuestion}
                className="w-full md:w-auto"
              >
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

