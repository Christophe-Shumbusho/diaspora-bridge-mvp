"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { AuthService, type MenteeSignupData } from "@/lib/auth-service"
import { db, type MentorApplication } from "@/lib/database"
import { SAMPLE_MENTORS, getApprovedMentors } from "@/lib/mentors"
import { notFound } from "next/navigation"

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

const INTERESTS = [
  "Software Development", "Web Development", "Mobile Development", "Data Science", 
  "Machine Learning", "Cybersecurity", "Cloud Computing", "DevOps",
  "Entrepreneurship", "Startup Strategy", "Business Development", "Marketing",
  "Product Management", "Project Management", "Leadership", "Finance",
  "Career Transition", "Networking", "Personal Branding", "Work-Life Balance"
]

interface RequestMentorshipPageProps {
  params: Promise<{
    mentorId: string
  }>
}

export default function RequestMentorshipPage({ params }: RequestMentorshipPageProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  // Unwrap params using React.use()
  const { mentorId } = use(params)
  
  // Try to find mentor from multiple sources
  let mentor = null
  
  // First check database for approved mentors
  const dbMentor = db.getUserById(mentorId) as MentorApplication
  if (dbMentor && dbMentor.role === "mentor" && dbMentor.status === "active") {
    mentor = {
      id: dbMentor.id,
      name: dbMentor.name,
      email: dbMentor.email,
      role: dbMentor.role,
      title: dbMentor.title,
      company: dbMentor.company,
      field: dbMentor.field,
      location: dbMentor.location,
      experience: dbMentor.yearsOfExperience,
      bio: dbMentor.bio,
      expertise: dbMentor.expertise,
      availability: dbMentor.availability,
      imageUrl: dbMentor.imageUrl || "/placeholder.svg",
      conversationStarters: dbMentor.conversationStarters || [
        "What are your career goals?",
        "What challenges are you facing in your field?",
        "How can I help you grow professionally?"
      ]
    }
  }
  
  // If not found in database, check approved mentors list
  if (!mentor) {
    const allMentors = getApprovedMentors()
    mentor = allMentors.find(m => m.id === mentorId)
  }
  
  if (!mentor) {
    notFound()
  }

  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Career Info
    careerField: "",
    currentEducation: "",
    location: "",
    goals: "",
    experience: "",
    interests: [] as string[],
    
    // Mentorship Request
    whyThisMentor: "",
    specificGoals: "",
    timeCommitment: "",
    preferredMeetingFrequency: "weekly" as "weekly" | "biweekly" | "monthly",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only submit on step 2
    if (step !== 2) {
      return
    }
    
    setIsSubmitting(true)
    setError("")

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsSubmitting(false)
        return
      }

      // Create mentee account
      const signupData: MenteeSignupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "mentee",
        careerField: "General", // Simplified - no field selection needed
        currentEducation: formData.currentEducation,
        location: formData.location,
        goals: formData.whyThisMentor, // Use mentor request as goals
        experience: "Student/Entry Level", // Simplified
        interests: [], // Simplified - no interests selection
        preferredMentorGender: "any"
      }

      const result = await AuthService.signupMentee(signupData)

      if (result.success && result.user) {
        // Auto-login the new user
        login(result.user)
        
        // Create mentorship request
        const requestId = `req-${Date.now()}-${result.user.id}-${mentorId}`
        const mentorshipRequest = {
          id: requestId,
          menteeId: result.user.id,
          mentorId: mentorId,
          status: "pending" as const,
          message: formData.whyThisMentor,
          specificGoals: formData.whyThisMentor, // Simplified - same as message
          timeCommitment: "1 hour per week", // Default value
          preferredFrequency: "weekly" as const,
          createdAt: new Date(),
          menteeInfo: {
            name: formData.name,
            email: formData.email,
            careerField: "General",
            currentEducation: formData.currentEducation,
            location: formData.location,
            goals: formData.whyThisMentor,
            experience: "Student/Entry Level",
            interests: []
          }
        }
        
        // Save request to database
        db.createMentorshipRequest(mentorshipRequest)
        
        // Add a small delay to ensure data is saved
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Redirect to mentee dashboard
        router.push(`/mentee/dashboard`)
      } else {
        setError(result.error || "Failed to create account")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const nextStep = () => {
    if (step < 2) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href={`/mentors/${mentorId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {mentor.name}'s Profile
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Request Mentorship</h1>
          <p className="text-muted-foreground mt-2">
            Create your account and send a mentorship request to {mentor.name}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle className="h-4 w-4" /> : i}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-0.5 ${
                    i < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="flex items-center gap-2 py-4">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>
                  Let's start with your basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      autoComplete="address-level2"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentEducation">Current Education *</Label>
                    <Input
                      id="currentEducation"
                      name="currentEducation"
                      autoComplete="organization"
                      placeholder="University, High School, etc."
                      value={formData.currentEducation}
                      onChange={(e) => updateFormData("currentEducation", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whyThisMentor">Why do you want {mentor.name} as your mentor? *</Label>
                  <Textarea
                    id="whyThisMentor"
                    name="whyThisMentor"
                    placeholder={`Tell ${mentor.name} why you'd like them as your mentor and what you hope to achieve...`}
                    value={formData.whyThisMentor}
                    onChange={(e) => updateFormData("whyThisMentor", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.location || !formData.currentEducation || !formData.whyThisMentor}
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Review & Submit */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Request</CardTitle>
                <CardDescription>
                  Confirm your information and send your mentorship request to {mentor.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Your Information:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">{formData.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Education:</span>
                      <p className="font-medium">{formData.currentEducation}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Your Message to {mentor.name}:</h4>
                  <p className="text-sm text-muted-foreground italic">"{formData.whyThisMentor}"</p>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? "Sending Request..." : "Send Mentorship Request"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}
