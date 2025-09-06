"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, Eye, Shield } from "lucide-react"
import { type Mentor } from "@/lib/mentors"
import { getAllMentors, addMentor as repoAddMentor, updateMentor as repoUpdateMentor, deleteMentor as repoDeleteMentor } from "@/lib/mentors-repo"
import { createMentorProfile } from "@/lib/auth"
import { useAuth } from "@/lib/auth-context"

const CAREER_FIELDS = [
  "Technology & Software",
  "Business & Entrepreneurship", 
  "Healthcare & Medicine",
  "Engineering",
  "Finance & Banking",
  "Education & Research",
  "Marketing & Communications",
  "Law & Legal Services",
  "Arts & Creative Industries",
  "Non-profit & Social Impact",
  "Other",
]

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "busy", label: "Busy", color: "bg-yellow-500" },
  { value: "unavailable", label: "Unavailable", color: "bg-red-500" },
]

export default function MentorManagementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [mentors, setMentors] = useState<Mentor[]>([])
  useEffect(() => {
    setMentors(getAllMentors())
  }, [])
  const [isAddingMentor, setIsAddingMentor] = useState(false)
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    company: "",
    field: "",
    location: "",
    experience: "",
    bio: "",
    expertise: "",
    availability: "available" as const,
    imageUrl: "",
    conversationStarters: "",
  })

  // Check admin access
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <Button asChild>
            <a href="/admin/login">Go to Admin Login</a>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddMentor = () => {
    const newMentor = createMentorProfile({
      name: formData.name,
      email: formData.email,
      title: formData.title,
      company: formData.company,
      field: formData.field,
      location: formData.location,
      experience: parseInt(formData.experience),
      bio: formData.bio,
      expertise: formData.expertise.split(",").map(s => s.trim()).filter(Boolean),
      availability: formData.availability,
      imageUrl: formData.imageUrl || "/placeholder.svg",
      conversationStarters: formData.conversationStarters.split("\n").filter(Boolean),
    })

    repoAddMentor(newMentor)
    setMentors(getAllMentors())
    setIsAddingMentor(false)
    resetForm()
  }

  const handleEditMentor = (mentor: Mentor) => {
    setEditingMentor(mentor)
    setFormData({
      name: mentor.name,
      email: mentor.email,
      title: mentor.title,
      company: mentor.company,
      field: mentor.field,
      location: mentor.location,
      experience: mentor.experience.toString(),
      bio: mentor.bio,
      expertise: mentor.expertise.join(", "),
      availability: mentor.availability,
      imageUrl: mentor.imageUrl,
      conversationStarters: mentor.conversationStarters.join("\n"),
    })
    setIsAddingMentor(true)
  }

  const handleUpdateMentor = () => {
    if (!editingMentor) return

    const updatedMentor = {
      ...editingMentor,
      name: formData.name,
      email: formData.email,
      title: formData.title,
      company: formData.company,
      field: formData.field,
      location: formData.location,
      experience: parseInt(formData.experience),
      bio: formData.bio,
      expertise: formData.expertise.split(",").map(s => s.trim()).filter(Boolean),
      availability: formData.availability,
      imageUrl: formData.imageUrl,
      conversationStarters: formData.conversationStarters.split("\n").filter(Boolean),
    }

    repoUpdateMentor(updatedMentor)
    setMentors(getAllMentors())
    setIsAddingMentor(false)
    setEditingMentor(null)
    resetForm()
  }

  const handleDeleteMentor = (mentorId: string) => {
    repoDeleteMentor(mentorId)
    setMentors(getAllMentors())
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      title: "",
      company: "",
      field: "",
      location: "",
      experience: "",
      bio: "",
      expertise: "",
      availability: "available",
      imageUrl: "",
      conversationStarters: "",
    })
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Management</h1>
          <p className="text-muted-foreground">Manage mentors and their availability across different sectors</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mentors.length}</p>
                  <p className="text-sm text-muted-foreground">Total Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentors.filter(m => m.availability === "available").length}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentors.filter(m => m.availability === "busy").length}</p>
                  <p className="text-sm text-muted-foreground">Busy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div>
                  <p className="text-2xl font-bold">{mentors.filter(m => m.availability === "unavailable").length}</p>
                  <p className="text-sm text-muted-foreground">Unavailable</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Mentor Form */}
        {isAddingMentor && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingMentor ? "Edit Mentor" : "Add New Mentor"}</CardTitle>
              <CardDescription>
                {editingMentor ? "Update mentor information" : "Add a new mentor to the platform"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Dr. Aline Uwimana"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="aline@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => updateFormData("company", e.target.value)}
                    placeholder="Google"
                  />
                </div>
                <div>
                  <Label htmlFor="field">Career Field</Label>
                  <Select value={formData.field} onValueChange={(value) => updateFormData("field", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAREER_FIELDS.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="San Francisco, USA"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => updateFormData("experience", e.target.value)}
                    placeholder="8"
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={formData.availability} onValueChange={(value: any) => updateFormData("availability", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  placeholder="Passionate about building scalable systems..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="expertise">Areas of Expertise (comma-separated)</Label>
                <Input
                  id="expertise"
                  value={formData.expertise}
                  onChange={(e) => updateFormData("expertise", e.target.value)}
                  placeholder="Software Engineering, System Design, Career Growth"
                />
              </div>
              
              <div>
                <Label htmlFor="conversationStarters">Conversation Starters (one per line)</Label>
                <Textarea
                  id="conversationStarters"
                  value={formData.conversationStarters}
                  onChange={(e) => updateFormData("conversationStarters", e.target.value)}
                  placeholder="What programming languages should I focus on as a beginner?"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Profile Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => updateFormData("imageUrl", e.target.value)}
                  placeholder="/african-woman-software-engineer.png"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={editingMentor ? handleUpdateMentor : handleAddMentor}>
                  {editingMentor ? "Update Mentor" : "Add Mentor"}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsAddingMentor(false)
                  setEditingMentor(null)
                  resetForm()
                }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mentors List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Mentors</h2>
            <Button onClick={() => setIsAddingMentor(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Mentor
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={mentor.imageUrl || "/placeholder.svg"}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <CardDescription>{mentor.title}</CardDescription>
                        <p className="text-sm text-muted-foreground">{mentor.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        mentor.availability === "available" ? "bg-green-500" :
                        mentor.availability === "busy" ? "bg-yellow-500" : "bg-red-500"
                      }`} />
                      <span className="text-xs text-muted-foreground capitalize">{mentor.availability}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">{mentor.field}</Badge>
                    <Badge variant="secondary">{mentor.experience} years</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditMentor(mentor)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteMentor(mentor.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
