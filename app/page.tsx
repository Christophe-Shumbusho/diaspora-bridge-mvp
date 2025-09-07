import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, MessageCircle, Globe, Star, CheckCircle, Sparkles, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5" />
        <div className="max-w-5xl mx-auto text-center relative">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Trusted by 500+ young professionals
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 text-balance leading-tight">
            Connect with Rwandan
            <span className="gradient-primary bg-clip-text text-transparent block">Diaspora Mentors</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
            Bridge the gap between ambition and opportunity. Get personalized career guidance from successful Rwandan
            professionals around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-4 shadow-glow hover:shadow-lg transition-all duration-300"
            >
              <Link href="/mentee-signup">
                Find Your Mentor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 border-2 hover:bg-muted/50 bg-transparent"
              asChild
            >
              <Link href="/mentors">Browse Mentors</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>95% success rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span>200+ verified mentors</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Secure & private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              How it works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Simple. Effective. Transformative.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Three simple steps to unlock your potential with world-class mentorship
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-soft hover:shadow-glow transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-3">Quick Signup</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Answer 3 simple questions about your career goals and interests to get started
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-glow transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <Globe className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl mb-3">Smart Matching</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Get matched with mentors based on your field, goals, and background using our AI algorithm
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-glow transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <MessageCircle className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl mb-3">Start Conversations</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Connect directly with mentors through our secure messaging platform with guided conversation starters
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Success stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Real Impact, Real Results</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              See how our platform has transformed careers and opened doors for ambitious young professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <Card className="shadow-soft hover:shadow-glow transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-6">
                  <img
                    src="/placeholder.svg?height=80&width=80&text=Sarah"
                    alt="Sarah Mukamana"
                    className="w-20 h-20 rounded-2xl shadow-soft"
                  />
                  <div>
                    <CardTitle className="text-xl mb-1">Sarah Mukamana</CardTitle>
                    <CardDescription className="text-base">Software Engineering Student</CardDescription>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Tech Industry
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  "Through Diaspora Bridge, I connected with Dr. Aline who helped me land my first internship at a tech
                  company. Her guidance on technical interviews was invaluable."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">5.0 rating</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-glow transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-6">
                  <img
                    src="/placeholder.svg?height=80&width=80&text=David"
                    alt="David Nzeyimana"
                    className="w-20 h-20 rounded-2xl shadow-soft"
                  />
                  <div>
                    <CardTitle className="text-xl mb-1">David Nzeyimana</CardTitle>
                    <CardDescription className="text-base">Business Graduate</CardDescription>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Entrepreneurship
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  "Patrick's mentorship helped me validate my startup idea and connect with investors. I'm now running
                  my own fintech company serving East African markets."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">5.0 rating</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">Why Choose Diaspora Bridge?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Verified Mentors</h3>
                  <p className="text-muted-foreground">
                    All mentors are verified professionals with proven track records in their fields.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">48-Hour Connections</h3>
                  <p className="text-muted-foreground">
                    Focused time windows ensure meaningful conversations and committed engagement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Smart Matching</h3>
                  <p className="text-muted-foreground">
                    Our algorithm matches you with mentors based on your goals, field, and background.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Global Network</h3>
                  <p className="text-muted-foreground">
                    Connect with Rwandan professionals across North America, Europe, and beyond.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Free Platform</h3>
                  <p className="text-muted-foreground">
                    Access to mentorship opportunities at no cost - our mission is to empower Rwandan youth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Conversation Starters</h3>
                  <p className="text-muted-foreground">
                    Get suggested questions and topics to help you make the most of your mentorship conversations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Join the movement
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-balance leading-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
            Join hundreds of young Rwandans who have found guidance and opportunities through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="text-lg px-12 py-4 shadow-glow hover:shadow-lg transition-all duration-300"
            >
              <Link href="/mentee-signup">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-12 py-4 border-2 hover:bg-muted/50 bg-transparent"
              asChild
            >
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            ✨ Free forever • No credit card required • Get matched in 24 hours
          </p>
        </div>
      </section>
    </div>
  )
}
