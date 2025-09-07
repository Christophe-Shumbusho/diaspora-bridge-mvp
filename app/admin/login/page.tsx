"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Shield, Users } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { createMentorProfile } from "@/lib/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Simple admin credentials (in a real app, this would be secure authentication)
  const ADMIN_CREDENTIALS = {
    email: "admin@diasporabridge.com",
    password: "admin123"
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (credentials.email === ADMIN_CREDENTIALS.email && credentials.password === ADMIN_CREDENTIALS.password) {
      // Create admin user profile
      const adminProfile = createMentorProfile({
        name: "Admin User",
        email: credentials.email,
        title: "Platform Administrator",
        company: "Diaspora Bridge",
        field: "Platform Management",
        location: "Global",
        experience: 5,
        bio: "Platform administrator managing mentors and system operations.",
        expertise: ["Platform Management", "User Administration", "System Operations"],
        availability: "available",
        imageUrl: "/placeholder.svg",
        conversationStarters: ["How can I help you today?"]
      })

      // Override role to admin
      const adminUser = { ...adminProfile, role: "admin" as const }
      
      login(adminUser)
      router.push("/admin/mentors")
    } else {
      setError("Invalid credentials. Use admin@diasporabridge.com / admin123")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Access the mentor management system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Administrator Access
            </CardTitle>
            <CardDescription>
              Enter your admin credentials to manage mentors and platform settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@diasporabridge.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Demo Credentials:</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> admin@diasporabridge.com<br />
                <strong>Password:</strong> admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




