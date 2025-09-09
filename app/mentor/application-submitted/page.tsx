"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function MentorApplicationSubmittedPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-16">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Application Submitted Successfully!</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Thank you for applying to become a mentor on Diaspora Bridge. Your application is now under review by our admin team.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold mb-2">What happens next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Our admin team will review your application within 2-3 business days</li>
                    <li>• You'll receive an email notification once your application is approved</li>
                    <li>• After approval, you can log in and start connecting with mentees</li>
                    <li>• We may contact you if we need additional information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold mb-2">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email to your registered email address. Please keep an eye on your inbox for updates about your application status.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/">
                  Back to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/mentor/login">Try Login Later</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Have questions? Contact us at <a href="mailto:support@diasporabridge.com" className="text-primary hover:underline">support@diasporabridge.com</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
