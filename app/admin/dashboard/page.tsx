"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Mail,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AuthService } from "@/lib/auth-service"
import { db, type MentorApplication } from "@/lib/database"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [pendingMentors, setPendingMentors] = useState<MentorApplication[]>([])
  const [approvedMentors, setApprovedMentors] = useState<MentorApplication[]>([])
  const [selectedMentor, setSelectedMentor] = useState<MentorApplication | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    // Load mentor data
    loadMentorData()
  }, [user, router])

  const loadMentorData = () => {
    setPendingMentors(db.getPendingMentors())
    setApprovedMentors(db.getApprovedMentors())
  }

  const handleApproveMentor = async (mentorId: string) => {
    setIsProcessing(true)
    try {
      const result = await AuthService.approveMentor(mentorId)
      if (result.success) {
        loadMentorData()
        setSelectedMentor(null)
      }
    } catch (error) {
      console.error("Failed to approve mentor:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectMentor = async (mentorId: string) => {
    setIsProcessing(true)
    try {
      const result = await AuthService.rejectMentor(mentorId, rejectionReason)
      if (result.success) {
        loadMentorData()
        setSelectedMentor(null)
        setRejectionReason("")
      }
    } catch (error) {
      console.error("Failed to reject mentor:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-black/60 mt-2">
            Manage mentor applications and platform oversight
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-black/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingMentors.length}</div>
              <p className="text-xs text-black/60">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Mentors</CardTitle>
              <Users className="h-4 w-4 text-black/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedMentors.length}</div>
              <p className="text-xs text-black/60">
                Approved and active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-black/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingMentors.length + approvedMentors.length}</div>
              <p className="text-xs text-black/60">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-black/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingMentors.length + approvedMentors.length > 0 
                  ? Math.round((approvedMentors.length / (pendingMentors.length + approvedMentors.length)) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-black/60">
                Success rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Applications ({pendingMentors.length})
                </CardTitle>
                <CardDescription>
                  Review and approve mentor applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingMentors.length === 0 ? (
                  <div className="text-center py-8 text-black/60">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending applications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingMentors.map((mentor) => (
                      <Card key={mentor.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{mentor.name}</h3>
                                <Badge variant="outline">{mentor.field}</Badge>
                              </div>
                              <p className="text-sm text-black/60 mb-2">
                                {mentor.title} at {mentor.company}
                              </p>
                              <p className="text-sm text-black/60 mb-2">
                                📍 {mentor.location} • {mentor.yearsOfExperience} years experience
                              </p>
                              <p className="text-sm line-clamp-2">{mentor.bio}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMentor(mentor)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Review Panel */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Application Review</CardTitle>
                <CardDescription>
                  {selectedMentor ? "Review application details" : "Select an application to review"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMentor ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedMentor.name}</h3>
                      <p className="text-sm text-black/60">{selectedMentor.email}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Position</Label>
                      <p className="text-sm">{selectedMentor.title} at {selectedMentor.company}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Field & Experience</Label>
                      <p className="text-sm">{selectedMentor.field} • {selectedMentor.yearsOfExperience} years</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm">{selectedMentor.location}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Bio</Label>
                      <p className="text-sm">{selectedMentor.bio}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Why Mentor?</Label>
                      <p className="text-sm">{selectedMentor.whyMentor}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Expertise</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMentor.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedMentor.linkedinUrl && (
                      <div>
                        <Label className="text-sm font-medium">LinkedIn</Label>
                        <a 
                          href={selectedMentor.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline block"
                        >
                          View Profile
                        </a>
                      </div>
                    )}

                    <div className="pt-4 space-y-3">
                      <Button
                        onClick={() => handleApproveMentor(selectedMentor.id)}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Application
                      </Button>

                      <div className="space-y-2">
                        <Label htmlFor="rejectionReason">Rejection Reason (Optional)</Label>
                        <Textarea
                          id="rejectionReason"
                          placeholder="Provide a reason for rejection..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Button
                        variant="destructive"
                        onClick={() => handleRejectMentor(selectedMentor.id)}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Application
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-black/60">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select an application to review details and take action</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Mentors */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Active Mentors ({approvedMentors.length})
            </CardTitle>
            <CardDescription>
              Currently approved and active mentors on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {approvedMentors.length === 0 ? (
              <div className="text-center py-8 text-black/60">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active mentors yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedMentors.map((mentor) => (
                  <Card key={mentor.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{mentor.name}</h3>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-black/60 mb-1">
                        {mentor.title} at {mentor.company}
                      </p>
                      <p className="text-sm text-black/60">
                        📍 {mentor.location} • {mentor.field}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
