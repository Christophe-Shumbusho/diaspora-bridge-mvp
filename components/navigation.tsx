"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, MessageCircle, Users, Bell, Home, Search, LogOut, User, Shield, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/database"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const [mentorPendingCount, setMentorPendingCount] = useState(0)
  const [adminPendingCount, setAdminPendingCount] = useState(0)

  // Get navigation items based on user role
  const getNavItems = () => {
    if (!isAuthenticated || !user) {
      return [
        { href: "/", label: "Home", icon: Home },
      ]
    }

    switch (user.role) {
      case "mentee":
        const menteeNavItems = [
          { href: "/mentee/dashboard", label: "Dashboard", icon: Home },
          { href: "/matches", label: "Find Mentors", icon: Search },
          { href: "/chat", label: "Conversations", icon: MessageCircle },
        ]
        return [
          ...menteeNavItems,
          { href: "/", label: "Home", icon: Home },
        ]
      case "mentor":
        return [
          { href: "/", label: "Home", icon: Home },
          { href: "/mentor/dashboard", label: "Dashboard", icon: Users },
        ]
      case "admin":
        return [
          { href: "/", label: "Home", icon: Home },
          { href: "/admin/dashboard", label: "Admin Dashboard", icon: Settings },
        ]
      default:
        return [
          { href: "/", label: "Home", icon: Home },
        ]
    }
  }

  const currentNavItems = getNavItems()

  useEffect(() => {
    if (user?.role === "mentor") {
      const requests = db.getMentorshipRequestsForMentor(user.id).filter(r => r.status === "pending")
      setMentorPendingCount(requests.length)
    } else {
      setMentorPendingCount(0)
    }

    if (user?.role === "admin") {
      const pendingMentors = db.getPendingMentors()
      setAdminPendingCount(pendingMentors.length)
    } else {
      setAdminPendingCount(0)
    }
  }, [user])

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DB</span>
            </div>
            <span className="font-bold text-xl">Diaspora Bridge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {currentNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            
            {user?.role === "mentor" && mentorPendingCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-xs">
                {mentorPendingCount} pending
              </Badge>
            )}
            {user?.role === "admin" && adminPendingCount > 0 && (
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                {adminPendingCount} pending
              </Badge>
            )}
            
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="text-muted-foreground">{user.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <Shield className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/mentors">Browser mentors</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {currentNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  
                  {!isAuthenticated && (
                    <div className="space-y-2 mt-4">
                      <Button asChild className="w-full">
                        <Link href="/mentors" onClick={() => setIsOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                    </div>
                  )}
                  
                  {isAuthenticated && user && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 mb-4 p-3">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{user.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <Button variant="outline" onClick={logout} className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
