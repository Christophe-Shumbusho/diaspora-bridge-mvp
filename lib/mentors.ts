export interface Mentor {
  id: string
  name: string
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
}

export const SAMPLE_MENTORS: Mentor[] = [
  {
    id: "1",
    name: "Dr. Aline Uwimana",
    title: "Senior Software Engineer",
    company: "Google",
    field: "Technology & Software",
    location: "San Francisco, USA",
    experience: 8,
    bio: "Passionate about building scalable systems and mentoring the next generation of African tech talent. I've worked on Google Search infrastructure and love helping young developers navigate their careers.",
    expertise: ["Software Engineering", "System Design", "Career Growth", "Technical Leadership"],
    availability: "available",
    imageUrl: "/african-woman-software-engineer.png",
    conversationStarters: [
      "What programming languages should I focus on as a beginner?",
      "How do I prepare for technical interviews at big tech companies?",
      "What's the best way to build a strong portfolio as a developer?",
    ],
  },
  {
    id: "2",
    name: "Jean-Baptiste Nzeyimana",
    title: "Investment Director",
    company: "Goldman Sachs",
    field: "Finance & Banking",
    location: "London, UK",
    experience: 12,
    bio: "Leading investment strategies for emerging markets with a focus on African opportunities. I'm passionate about financial literacy and helping young professionals understand global finance.",
    expertise: ["Investment Banking", "Financial Analysis", "Market Strategy", "Leadership"],
    availability: "available",
    imageUrl: "/professional-african-man-finance-suit.png",
    conversationStarters: [
      "How do I break into investment banking?",
      "What skills are most important for a career in finance?",
      "How can I understand global financial markets better?",
    ],
  },
  {
    id: "3",
    name: "Dr. Grace Mukamana",
    title: "Pediatric Surgeon",
    company: "Johns Hopkins Hospital",
    field: "Healthcare & Medicine",
    location: "Baltimore, USA",
    experience: 15,
    bio: "Dedicated to improving healthcare outcomes for children globally. I've led medical missions back to Rwanda and am passionate about mentoring aspiring healthcare professionals.",
    expertise: ["Medical Career Path", "Specialization", "Medical School", "Healthcare Leadership"],
    availability: "busy",
    imageUrl: "/professional-african-woman-doctor-medical.png",
    conversationStarters: [
      "What's the path to becoming a doctor?",
      "How do I choose a medical specialization?",
      "What are the challenges of working in healthcare?",
    ],
  },
  {
    id: "4",
    name: "Patrick Rwigema",
    title: "Founder & CEO",
    company: "AfriTech Ventures",
    field: "Business & Entrepreneurship",
    location: "Nairobi, Kenya",
    experience: 10,
    bio: "Serial entrepreneur focused on building technology solutions for African markets. I've raised over $50M for various startups and love helping young entrepreneurs validate and scale their ideas.",
    expertise: ["Entrepreneurship", "Fundraising", "Business Strategy", "Startup Growth"],
    availability: "available",
    imageUrl: "/professional-african-man-entrepreneur-business.png",
    conversationStarters: [
      "How do I validate my business idea?",
      "What's the best way to approach investors?",
      "How do I build a strong founding team?",
    ],
  },
  {
    id: "5",
    name: "Marie Claire Ingabire",
    title: "Marketing Director",
    company: "Unilever",
    field: "Marketing & Communications",
    location: "Amsterdam, Netherlands",
    experience: 9,
    bio: "Leading global marketing campaigns for consumer brands across Africa and Europe. I'm passionate about storytelling and helping young marketers understand the power of authentic brand communication.",
    expertise: ["Brand Marketing", "Digital Strategy", "Consumer Insights", "Campaign Management"],
    availability: "available",
    imageUrl: "/professional-african-woman-marketing-creative.png",
    conversationStarters: [
      "How do I build a career in marketing?",
      "What makes a successful marketing campaign?",
      "How important is digital marketing today?",
    ],
  },
  {
    id: "6",
    name: "Emmanuel Hakizimana",
    title: "Civil Engineer",
    company: "Arup",
    field: "Engineering",
    location: "Toronto, Canada",
    experience: 11,
    bio: "Designing sustainable infrastructure projects across North America and Africa. I believe in engineering solutions that create positive impact for communities and the environment.",
    expertise: ["Civil Engineering", "Project Management", "Sustainable Design", "Infrastructure"],
    availability: "unavailable",
    imageUrl: "/professional-african-man-engineer-construction.png",
    conversationStarters: [
      "What does a career in engineering look like?",
      "How do I choose an engineering specialization?",
      "What's the future of sustainable engineering?",
    ],
  },
]

export function getMatchingMentors(careerField: string, goals: string): Mentor[] {
  // Filter mentors by career field first
  let matches = SAMPLE_MENTORS.filter((mentor) => mentor.field === careerField && mentor.availability === "available")

  // If no exact field matches, look for related fields or available mentors
  if (matches.length === 0) {
    matches = SAMPLE_MENTORS.filter((mentor) => mentor.availability === "available")
  }

  // Sort by relevance (for now, just randomize to simulate matching algorithm)
  return matches.sort(() => Math.random() - 0.5).slice(0, 3)
}

export function getAllAvailableMentors(): Mentor[] {
  return SAMPLE_MENTORS.filter((mentor) => mentor.availability !== "unavailable")
}
