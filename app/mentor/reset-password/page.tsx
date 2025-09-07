"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { sendEmail } from "@/lib/email"

export default function MentorResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    // Demo: send an email log
    await sendEmail(email, {
      subject: "Reset your Diaspora Bridge mentor password",
      html: `<p>Click the link to reset your password: <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/mentor/reset-password">Reset</a></p>`,
      text: "Reset your password",
    })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>We sent a password reset link if the email exists.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/mentor/login">Back to login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Enter your mentor email. We'll send reset instructions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <Button className="w-full" onClick={handleReset} disabled={!email}>Send reset link</Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link className="underline" href="/mentor/login">Back to login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



