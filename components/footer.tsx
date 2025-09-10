import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DB</span>
              </div>
              <span className="font-bold text-lg">Diaspora Bridge</span>
            </div>
            <p className="text-sm text-black/60">
              Connecting Rwandan youth with successful diaspora professionals for meaningful career mentorship.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/mentors" className="block text-sm text-black/60 hover:text-foreground">
                Browse Mentors
              </Link>
              <Link href="/matches" className="block text-sm text-black/60 hover:text-foreground">
                Your Matches
              </Link>
              <Link href="/apply-mentor" className="block text-sm text-black/60 hover:text-foreground">
                apply to be a mentor
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-black/60">
                <Mail className="h-4 w-4" />
                support@diasporabridge.com
              </div>
              <div className="flex items-center gap-2 text-sm text-black/60">
                <Phone className="h-4 w-4" />
                +250 784702015
              </div>
              <div className="flex items-center gap-2 text-sm text-black/60">
                <MapPin className="h-4 w-4" />
                Kigali, Rwanda
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-black/60">
              Get the latest mentorship opportunities and success stories.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-black/60">© 2024 Diaspora Bridge. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-black/60 hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-black/60 hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
