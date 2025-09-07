"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { createMenteeProfile } from "@/lib/auth"
import { scheduleMatchNotification } from "@/lib/email"

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

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    careerField: "",
    goals: "",
    background: "",
    location: "",
    interests: [] as string[],
  })

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    console.log("[v0] Signup form submitted:", formData)

    try {
      // Create mentee profile
      const menteeProfile = createMenteeProfile({
        name: formData.name,
        email: formData.email,
        careerField: formData.careerField,
        goals: formData.goals,
        experience: formData.background,
        interests: formData.interests,
        location: formData.location,
      })

      // Save user to auth system
      login(menteeProfile)

      // Store credentials (demo)
      try {
        const { saveCredential } = await import("@/lib/credentials")
        if (formData.email && formData.password) {
          saveCredential({ email: formData.email, role: "mentee", passwordHash: btoa(formData.password) })
        }
      } catch {}

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Send match notification email
      await scheduleMatchNotification(formData.email, {
        mentorName: "Dr. Aline Uwimana",
        menteeName: formData.name,
        mentorField: formData.careerField,
        conversationId: "conv-1",
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      })

      setIsComplete(true)
      
      // Redirect to matches after 2 seconds
      setTimeout(() => {
        router.push("/matches")
      }, 2000)
      
    } catch (error) {
      console.error("[v0] Signup error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-16">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Welcome to Diaspora Bridge!</h1>
              <p className="text-muted-foreground mb-6">
                Your account has been created successfully. We've found some great mentor matches for you and sent a
                notification to your email.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/matches">View Your Matches</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Join Diaspora Bridge</h1>
          <p className="text-muted-foreground mt-2">Answer 3 quick questions to get matched with the perfect mentor</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {num}
              </div>
              {num < 3 && <div className={`w-12 h-0.5 mx-2 ${step > num ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "Career Goals"}
              {step === 3 && "Background & Experience"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Let's start with your basic details"}
              {step === 2 && "Tell us about your career aspirations"}
              {step === 3 && "Share your current situation and experience"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="careerField">Career Field of Interest</Label>
                  <Select value={formData.careerField} onValueChange={(value) => updateFormData("careerField", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your field of interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAREER_FIELDS.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goals">Career Goals</Label>
                  <Textarea
                    id="goals"
                    placeholder="What are your main career goals? What do you hope to achieve in the next 2-3 years?"
                    value={formData.goals}
                    onChange={(e) => updateFormData("goals", e.target.value)}
                    rows={4}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <Label htmlFor="background">Current Situation & Background</Label>
                <Textarea
                  id="background"
                  placeholder="Tell us about your current situation - are you a student, recent graduate, or working professional? What's your educational background?"
                  value={formData.background}
                  onChange={(e) => updateFormData("background", e.target.value)}
                  rows={5}
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {step < 3 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Complete Signup"}
                </Button>
              )}
            </div>
            <div className="pt-4 text-center text-sm text-muted-foreground">
              Are you a mentor? <Link className="underline" href="/mentor/login">Login here</Link>
              <br />
              Already matched? <Link className="underline" href="/dashboard">Go to your mentee dashboard</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
