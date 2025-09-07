"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { getAllApplications } from "@/lib/applications-repo"
import { useAuth } from "@/lib/auth-context"

export default function MentorLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setError("")
    setIsLoading(true)
    try {
      const apps = getAllApplications()
      const app = apps.find(a => a.email.toLowerCase() === email.toLowerCase() && a.status === "approved")
      if (!app || !app.passwordHash) {
        setError("Account not found or not approved yet.")
        setIsLoading(false)
        return
      }

      const ok = app.passwordHash === btoa(password)
      if (!ok) {
        setError("Invalid credentials.")
        setIsLoading(false)
        return
      }

      login({
        id: `mentor-${app.id}`,
        name: app.name,
        email: app.email,
        role: "mentor",
        createdAt: new Date(),
      })

      router.push("/mentor/dashboard")
    } catch (e) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mentor Login</CardTitle>
            <CardDescription>Enter your email and password to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button className="w-full" onClick={handleLogin} disabled={isLoading || !email || !password}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/mentor/reset-password" className="underline">Forgot password?</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



