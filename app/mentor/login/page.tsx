"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { AuthService } from "@/lib/auth-service"
import { db, type MentorApplication } from "@/lib/database"

export default function MentorLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await AuthService.login({
        email: formData.email,
        password: formData.password
      })

      if (result.success && result.user) {
        if (result.user.role !== "mentor") {
          setError("This login is for mentors only. Please use the regular login.")
          setIsSubmitting(false)
          return
        }

        // Get the latest mentor data from database
        const mentorData = db.getUserById(result.user.id) as MentorApplication
        if (!mentorData) {
          setError("Mentor account not found. Please contact support.")
          setIsSubmitting(false)
          return
        }

        login(mentorData)
        
        // Redirect based on mentor status
        if (mentorData.status === "active") {
          router.push("/mentor/dashboard")
        } else if (mentorData.status === "pending") {
          router.push("/mentor/application-submitted")
        } else {
          setError("Your mentor application was not approved. Please contact support.")
        }
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Mentor Login</CardTitle>
            <CardDescription>
              Access your mentor dashboard to connect with mentees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use the password you created when applying as a mentor
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Don't have an account?</p>
              <Link href="/apply-mentor" className="text-primary hover:underline">
                Apply to become a mentor
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}