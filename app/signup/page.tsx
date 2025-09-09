"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, CheckCircle, Users, Briefcase, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { AuthService, type MenteeSignupData, type MentorSignupData } from "@/lib/auth-service"

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

const MENTEE_INTERESTS = [
  "Career Planning", "Skill Development", "Leadership Training", "Networking",
  "Job Search Strategy", "Interview Preparation", "Resume Building", "Personal Branding",
  "Industry Insights", "Work-Life Balance", "Salary Negotiation", "Career Transition",
  "Entrepreneurship", "Startup Advice", "Business Development", "Product Management",
  "Technical Skills", "Coding & Programming", "Data Analysis", "Digital Marketing",
  "Public Speaking", "Communication Skills", "Team Management", "Project Management"
]

const MENTOR_EXPERTISE = [
  "Software Development", "Data Science", "AI/Machine Learning", "Cybersecurity",
  "Business Strategy", "Startup Founding", "Product Management", "Sales & Marketing",
  "Investment Banking", "Financial Planning", "Accounting", "Consulting",
  "Medical Practice", "Research", "Public Health", "Healthcare Administration",
  "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Software Engineering",
  "Teaching", "Academic Research", "Educational Leadership", "Curriculum Development",
  "Digital Marketing", "Content Creation", "Brand Management", "Public Relations",
  "Corporate Law", "International Law", "Human Rights", "Legal Research",
  "Graphic Design", "Creative Writing", "Film Production", "Art Direction",
  "Non-profit Management", "Social Entrepreneurship", "Community Development", "Policy Making"
]

const EXPERIENCE_LEVELS = [
  "Student/Recent Graduate",
  "Entry Level (0-2 years)",
  "Mid-Level (3-5 years)",
  "Senior Level (6-10 years)",
  "Executive Level (10+ years)"
]

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [userType, setUserType] = useState<"mentee" | "mentor" | null>(null)
  const [step, setStep] = useState(0) // 0 = user type selection, then 1-4 for forms
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Mentee specific
    careerField: "",
    goals: "",
    experience: "",
    interests: [] as string[],
    location: "",
    currentEducation: "",
    preferredMentorGender: "any" as "male" | "female" | "any",
    
    // Mentor specific (for mentor application)
    title: "",
    company: "",
    field: "",
    yearsOfExperience: 0,
    bio: "",
    expertise: [] as string[],
    conversationStarters: [] as string[],
    linkedinUrl: "",
    websiteUrl: "",
    whyMentor: "",
    achievements: [] as string[],
  })

  const handleUserTypeSelect = (type: "mentee" | "mentor") => {
    setUserType(type)
    setStep(1)
  }

  const handleNext = () => {
    const maxSteps = userType === "mentee" ? 4 : 5
    if (step < maxSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
    if (step === 1) {
      setUserType(null)
      setStep(0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      if (userType === "mentee") {
        const menteeData: MenteeSignupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "mentee",
          careerField: formData.careerField,
          goals: formData.goals,
          experience: formData.experience,
          interests: formData.interests,
          location: formData.location,
          currentEducation: formData.currentEducation,
          preferredMentorGender: formData.preferredMentorGender as "male" | "female" | "any" | undefined,
        }

        const result = await AuthService.signupMentee(menteeData)
        if (result.success && result.user) {
          // Log in the user and redirect to matching page
          await login({ email: formData.email, password: formData.password })
          router.push("/matches")
        } else {
          setError(result.error || "Account creation failed")
        }
      } else if (userType === "mentor") {
        const mentorData: MentorSignupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "mentor" as const,
          title: formData.title,
          company: formData.company,
          field: formData.careerField,
          location: formData.location,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          bio: formData.bio,
          expertise: formData.expertise,
          conversationStarters: formData.conversationStarters,
          linkedinUrl: formData.linkedinUrl,
          websiteUrl: formData.websiteUrl,
          whyMentor: formData.whyMentor,
          achievements: formData.achievements,
        }

        const result = await AuthService.signupMentor(mentorData)
        if (result.success) {
          // Mentor application goes to admin for approval
          router.push("/mentor/application-submitted")
        } else {
          setError(result.error || "Application submission failed")
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const toggleExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }))
  }

  // User type selection screen
  if (step === 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-4">Join Diaspora Bridge</h1>
            <p className="text-xl text-muted-foreground">Choose how you'd like to participate in our community</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary" onClick={() => handleUserTypeSelect("mentee")}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">I'm looking for mentorship</CardTitle>
                <CardDescription className="text-base">
                  Connect with experienced Rwandan professionals to guide your career journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Get matched with mentors in your field</li>
                  <li>• Receive personalized career guidance</li>
                  <li>• Access to exclusive networking opportunities</li>
                  <li>• Free to join and use</li>
                </ul>
                <Button className="w-full mt-6" size="lg">
                  Join as Mentee
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary" onClick={() => handleUserTypeSelect("mentor")}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">I want to mentor others</CardTitle>
                <CardDescription className="text-base">
                  Share your expertise and help the next generation of Rwandan professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Give back to the Rwandan community</li>
                  <li>• Share your professional experience</li>
                  <li>• Flexible mentoring schedule</li>
                  <li>• Application review process</li>
                </ul>
                <Button className="w-full mt-6" size="lg" variant="outline">
                  Apply as Mentor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4 p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {userType === "mentee" ? "Join as Mentee" : "Apply as Mentor"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {userType === "mentee" 
              ? "Complete your profile to get matched with the perfect mentor" 
              : "Submit your application to become a verified mentor"
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {Array.from({ length: userType === "mentee" ? 4 : 5 }, (_, i) => i + 1).map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {num}
              </div>
              {num < (userType === "mentee" ? 4 : 5) && <div className={`w-12 h-0.5 mx-2 ${step > num ? "bg-primary" : "bg-muted"}`} />}
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

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Account Information"}
              {step === 2 && (userType === "mentee" ? "Career Goals" : "Professional Background")}
              {step === 3 && (userType === "mentee" ? "Interests & Preferences" : "Expertise & Experience")}
              {step === 4 && (userType === "mentee" ? "Additional Details" : "Mentoring Details")}
              {step === 5 && "Application Details"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Create your account with email and password"}
              {step === 2 && (userType === "mentee" ? "Tell us about your career aspirations" : "Share your professional background")}
              {step === 3 && (userType === "mentee" ? "Select your interests and preferences" : "Highlight your areas of expertise")}
              {step === 4 && (userType === "mentee" ? "Complete your profile" : "How you'll help mentees")}
              {step === 5 && "Final application details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Account Information */}
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Mentee Steps */}
            {userType === "mentee" && step === 2 && (
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

            {userType === "mentee" && step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Areas of Interest (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {MENTEE_INTERESTS.map((interest: string) => (
                        <Button
                          key={interest}
                          type="button"
                          variant={formData.interests.includes(interest) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleInterest(interest)}
                          className="justify-start text-left h-auto py-2 px-3"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {userType === "mentee" && step === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="experience">Current Situation & Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about your current situation - are you a student, recent graduate, or working professional? What's your educational background?"
                    value={formData.experience}
                    onChange={(e) => updateFormData("experience", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentEducation">Current Education (Optional)</Label>
                  <Input
                    id="currentEducation"
                    placeholder="University, degree program, etc."
                    value={formData.currentEducation}
                    onChange={(e) => updateFormData("currentEducation", e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Mentor Steps */}
            {userType === "mentor" && step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google, Microsoft, etc."
                    value={formData.company}
                    onChange={(e) => updateFormData("company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field">Professional Field</Label>
                  <Select value={formData.field} onValueChange={(value) => updateFormData("field", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your professional field" />
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
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.yearsOfExperience}
                    onChange={(e) => updateFormData("yearsOfExperience", parseInt(e.target.value) || 0)}
                  />
                </div>
              </>
            )}

            {userType === "mentor" && step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your professional journey, key achievements, and what makes you passionate about your field..."
                    value={formData.bio}
                    onChange={(e) => updateFormData("bio", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Areas of Expertise (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {MENTOR_EXPERTISE.map((expertise: string) => (
                      <div key={expertise} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={expertise}
                          checked={formData.expertise.includes(expertise)}
                          onChange={() => toggleExpertise(expertise)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={expertise} className="text-sm cursor-pointer">
                          {expertise}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {userType === "mentor" && step === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your professional journey, key achievements, and what makes you passionate about your field..."
                    value={formData.bio}
                    onChange={(e) => updateFormData("bio", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whyMentor">Why do you want to mentor?</Label>
                  <Textarea
                    id="whyMentor"
                    placeholder="What motivates you to give back to the Rwandan community? How do you hope to help mentees?"
                    value={formData.whyMentor}
                    onChange={(e) => updateFormData("whyMentor", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conversationStarters">Conversation Starters (one per line)</Label>
                  <Textarea
                    id="conversationStarters"
                    placeholder="What programming languages should I focus on as a beginner?&#10;How do I prepare for technical interviews?&#10;What's the best way to build a strong portfolio?"
                    value={formData.conversationStarters.join('\n')}
                    onChange={(e) => updateFormData("conversationStarters", e.target.value.split('\n').filter(s => s.trim()))}
                    rows={4}
                  />
                </div>
              </>
            )}

            {userType === "mentor" && step === 5 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinUrl}
                    onChange={(e) => updateFormData("linkedinUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Personal Website (Optional)</Label>
                  <Input
                    id="websiteUrl"
                    placeholder="https://yourwebsite.com"
                    value={formData.websiteUrl}
                    onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements (one per line)</Label>
                  <Textarea
                    id="achievements"
                    placeholder="Led a team of 10 engineers at Google&#10;Published 5 research papers in AI&#10;Raised $2M for my startup"
                    value={formData.achievements.join('\n')}
                    onChange={(e) => updateFormData("achievements", e.target.value.split('\n').filter(s => s.trim()))}
                    rows={4}
                  />
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {step < (userType === "mentee" ? 4 : 5) ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (userType === "mentee" ? "Creating Account..." : "Submitting Application...") : (userType === "mentee" ? "Create Account" : "Submit Application")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
