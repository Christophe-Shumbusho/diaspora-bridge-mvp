export interface Mentor {
  id: string
  name: string
  email: string
  role: "mentor"
  title: string
  company: string
  field: string
  location: string
  experience: number
  bio: string
  expertise: string[]
  availability: "available" | "busy" | "unavailable"
  imageUrl: string
  conversationStarters: string[]
  createdAt: Date
}

export const SAMPLE_MENTORS: Mentor[] = [
  {
    id: "1",
    name: "Dr. Aline Uwimana",
    email: "aline.uwimana@google.com",
    role: "mentor" as const,
    title: "Senior Software Engineer",
    company: "Google",
    field: "Technology & Software",
    location: "San Francisco, USA",
    experience: 8,
    bio: "Passionate about building scalable systems and mentoring the next generation of African tech talent. I've worked on Google Search infrastructure and love helping young developers navigate their careers.",
    expertise: ["Software Engineering", "System Design", "Career Growth", "Technical Leadership"],
    availability: "available" as const,
    imageUrl: "/african-woman-software-engineer.png",
    conversationStarters: [
      "What programming languages should I focus on as a beginner?",
      "How do I prepare for technical interviews at big tech companies?",
      "What's the best way to build a strong portfolio as a developer?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Jean-Baptiste Nzeyimana",
    email: "jean.nzeyimana@gs.com",
    role: "mentor" as const,
    title: "Investment Director",
    company: "Goldman Sachs",
    field: "Finance & Banking",
    location: "London, UK",
    experience: 12,
    bio: "Leading investment strategies for emerging markets with a focus on African opportunities. I'm passionate about financial literacy and helping young professionals understand global finance.",
    expertise: ["Investment Banking", "Financial Analysis", "Market Strategy", "Leadership"],
    availability: "available" as const,
    imageUrl: "/professional-african-man-finance-suit.png",
    conversationStarters: [
      "How do I break into investment banking?",
      "What skills are most important for a career in finance?",
      "How can I understand global financial markets better?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Dr. Grace Mukamana",
    email: "grace.mukamana@jhmi.edu",
    role: "mentor" as const,
    title: "Pediatric Surgeon",
    company: "Johns Hopkins Hospital",
    field: "Healthcare & Medicine",
    location: "Baltimore, USA",
    experience: 15,
    bio: "Dedicated to improving healthcare outcomes for children globally. I've led medical missions back to Rwanda and am passionate about mentoring aspiring healthcare professionals.",
    expertise: ["Medical Career Path", "Specialization", "Medical School", "Healthcare Leadership"],
    availability: "busy" as const,
    imageUrl: "/professional-african-woman-doctor-medical.png",
    conversationStarters: [
      "What's the path to becoming a doctor?",
      "How do I choose a medical specialization?",
      "What are the challenges of working in healthcare?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Patrick Rwigema",
    email: "patrick@afritech.ventures",
    role: "mentor" as const,
    title: "Founder & CEO",
    company: "AfriTech Ventures",
    field: "Business & Entrepreneurship",
    location: "Nairobi, Kenya",
    experience: 10,
    bio: "Serial entrepreneur focused on building technology solutions for African markets. I've raised over $50M for various startups and love helping young entrepreneurs validate and scale their ideas.",
    expertise: ["Entrepreneurship", "Fundraising", "Business Strategy", "Startup Growth"],
    availability: "available" as const,
    imageUrl: "/professional-african-man-entrepreneur-business.png",
    conversationStarters: [
      "How do I validate my business idea?",
      "What's the best way to approach investors?",
      "How do I build a strong founding team?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    name: "Marie Claire Ingabire",
    email: "marie.ingabire@unilever.com",  // ADDED EMAIL
    role: "mentor" as const,
    title: "Marketing Director",
    company: "Unilever",
    field: "Marketing & Communications",
    location: "Amsterdam, Netherlands",
    experience: 9,
    bio: "Leading global marketing campaigns for consumer brands across Africa and Europe. I'm passionate about storytelling and helping young marketers understand the power of authentic brand communication.",
    expertise: ["Brand Marketing", "Digital Strategy", "Consumer Insights", "Campaign Management"],
    availability: "available" as const,
    imageUrl: "/professional-african-woman-marketing-creative.png",
    conversationStarters: [
      "How do I build a career in marketing?",
      "What makes a successful marketing campaign?",
      "How important is digital marketing today?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    name: "Emmanuel Hakizimana",
    email: "emmanuel.hakizimana@arup.com",  // ADDED EMAIL
    role: "mentor" as const,
    title: "Civil Engineer",
    company: "Arup",
    field: "Engineering",
    location: "Toronto, Canada",
    experience: 11,
    bio: "Designing sustainable infrastructure projects across North America and Africa. I believe in engineering solutions that create positive impact for communities and the environment.",
    expertise: ["Civil Engineering", "Project Management", "Sustainable Design", "Infrastructure"],
    availability: "unavailable" as const,
    imageUrl: "/professional-african-man-engineer-construction.png",
    conversationStarters: [
      "What does a career in engineering look like?",
      "How do I choose an engineering specialization?",
      "What's the future of sustainable engineering?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "7",
    name: "Dr. Sarah Uwase",
    email: "sarah.uwase@mit.edu",  // ADDED EMAIL
    role: "mentor" as const,
    title: "Research Scientist",
    company: "MIT",
    field: "Education & Research",
    location: "Boston, USA",
    experience: 7,
    bio: "Conducting groundbreaking research in renewable energy and climate science. I'm passionate about making science accessible and inspiring the next generation of African researchers.",
    expertise: ["Research Methods", "Academic Writing", "Grant Writing", "Scientific Communication"],
    availability: "available" as const,
    imageUrl: "/placeholder.svg",
    conversationStarters: [
      "How do I get started in research?",
      "What's the process for applying to graduate school?",
      "How can I make my research more impactful?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "8",
    name: "James Mugenzi",
    email: "james.mugenzi@microsoft.com",  // ADDED EMAIL
    role: "mentor" as const,
    title: "Senior Legal Counsel",
    company: "Microsoft",
    field: "Law & Legal Services",
    location: "Seattle, USA",
    experience: 13,
    bio: "Specializing in technology law and intellectual property. I help tech companies navigate complex legal landscapes and am passionate about mentoring young lawyers interested in tech law.",
    expertise: ["Technology Law", "Intellectual Property", "Contract Negotiation", "Corporate Law"],
    availability: "available" as const,
    imageUrl: "/placeholder.svg",
    conversationStarters: [
      "How do I transition into technology law?",
      "What skills are essential for corporate lawyers?",
      "How important is understanding technology for lawyers?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "9",
    name: "Fatima Niyonsaba",
    email: "fatima.niyonsaba@creativestudio.fr",  // ADDED EMAIL
    role: "mentor" as const,
    title: "Creative Director",
    company: "Freelance",
    field: "Arts & Creative Industries",
    location: "Paris, France",
    experience: 8,
    bio: "Award-winning creative director with expertise in visual storytelling and brand identity. I've worked with major brands and love helping young creatives find their unique voice.",
    expertise: ["Visual Design", "Brand Identity", "Creative Strategy", "Art Direction"],
    availability: "busy" as const,
    imageUrl: "/placeholder.svg",
    conversationStarters: [
      "How do I build a strong creative portfolio?",
      "What's the difference between art and design?",
      "How can I make a living as a creative professional?",
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "10",
    name: "David Nkurunziza",
    email: "david.nkurunziza@unicef.org",  // ADDED EMAIL
    role: "mentor" as const,
    title: "Program Director",
    company: "UNICEF",
    field: "Non-profit & Social Impact",
    location: "New York, USA",
    experience: 12,
    bio: "Leading education and child protection programs across Africa. I'm passionate about social impact and helping young professionals understand how to make a difference in their communities.",
    expertise: ["Program Management", "Social Impact", "International Development", "Community Engagement"],
    availability: "available" as const,
    imageUrl: "/placeholder.svg",
    conversationStarters: [
      "How do I get started in non-profit work?",
      "What skills are needed for international development?",
      "How can I measure social impact effectively?",
    ],
    createdAt: new Date("2024-01-01"),
  },
]

export function getMatchingMentors(careerField: string, goals: string): Mentor[] {
  const goalTokens = goals.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)

  // Score mentors by field match + keyword overlap
  const scored = SAMPLE_MENTORS.filter(m => m.availability === "available").map((mentor) => {
    let score = 0
    if (mentor.field === careerField) score += 5
    const expertiseText = mentor.expertise.join(" ").toLowerCase()
    for (const token of goalTokens) {
      if (expertiseText.includes(token)) score += 1
    }
    return { mentor, score }
  })

  // If no one scored, fall back to available mentors
  const sorted = scored.sort((a, b) => b.score - a.score)
  const result = sorted.map(s => s.mentor)
  if (result.length === 0) {
    return SAMPLE_MENTORS.filter(m => m.availability === "available").slice(0, 3)
  }
  return result.slice(0, 3)
}

export function getAllAvailableMentors(): Mentor[] {
  // Only show mentors who are approved (active status) and available
  return SAMPLE_MENTORS.filter((mentor) => mentor.availability !== "unavailable")
}

import { db, type MentorApplication } from './database'

export function getApprovedMentors(): Mentor[] {
  // Get mentors from database who have been approved by admin
  const approvedMentors = db.getApprovedMentors()
  console.log("getApprovedMentors - Raw from DB:", approvedMentors)
  
  const mappedMentors = approvedMentors.map((mentor: MentorApplication) => ({
    id: mentor.id,
    name: mentor.name,
    email: mentor.email,
    role: mentor.role,
    title: mentor.title,
    company: mentor.company,
    field: mentor.field,
    location: mentor.location,
    experience: mentor.yearsOfExperience,
    bio: mentor.bio,
    expertise: mentor.expertise,
    availability: mentor.availability,
    imageUrl: mentor.imageUrl || "/placeholder.svg",
    conversationStarters: mentor.conversationStarters || [],
    createdAt: mentor.createdAt
  }))
  
  console.log("getApprovedMentors - Mapped mentors:", mappedMentors)
  
  const filteredMentors = mappedMentors.filter((mentor) => mentor.availability !== "unavailable")
  console.log("getApprovedMentors - Filtered mentors:", filteredMentors)
  
  return filteredMentors
}