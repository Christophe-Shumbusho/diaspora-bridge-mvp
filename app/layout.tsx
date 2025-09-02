import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Diaspora Bridge - Connect with Rwandan Mentors",
  description:
    "A mentorship platform connecting Rwandan youth with successful diaspora professionals for career guidance and growth.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
