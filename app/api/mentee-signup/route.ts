import { NextRequest, NextResponse } from 'next/server'
import { addMenteeRequest, canMenteeRequestAgain } from '@/lib/mentee-requests-repo'
import { sendMentorRequestNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, field, careerQuestion, experience, goals, mentorId } = body

    // Validate required fields
    if (!name || !email || !field || !careerQuestion || !mentorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if mentee can request again
    if (!canMenteeRequestAgain(email)) {
      return NextResponse.json(
        { error: 'You have a recent declined request. Please wait 7 days before requesting again.' },
        { status: 429 }
      )
    }

    // Create mentee request
    const menteeRequest = {
      id: `req-${Date.now()}`,
      menteeName: name,
      menteeEmail: email,
      mentorId: mentorId,
      mentorName: "Mentor Name", // This would be fetched from mentor data
      field: field,
      careerQuestion: careerQuestion,
      experience: experience || "",
      goals: goals || "",
      status: "pending" as const,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    }

    addMenteeRequest(menteeRequest)

    // Send notification to mentor
    await sendMentorRequestNotification("mentor@example.com", {
      name,
      email,
      careerField: field,
      goals: goals || "",
      experience: experience || ""
    })

    return NextResponse.json({
      success: true,
      requestId: menteeRequest.id,
      message: 'Mentorship request submitted successfully'
    })

  } catch (error) {
    console.error('Error creating mentee request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

