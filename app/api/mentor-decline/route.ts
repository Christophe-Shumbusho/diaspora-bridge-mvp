import { NextRequest, NextResponse } from 'next/server'
import { declineMenteeRequest, getMenteeRequestById } from '@/lib/mentee-requests-repo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, mentorId } = body

    // Validate required fields
    if (!requestId || !mentorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the mentee request
    const menteeRequest = getMenteeRequestById(requestId)
    if (!menteeRequest) {
      return NextResponse.json(
        { error: 'Mentee request not found' },
        { status: 404 }
      )
    }

    // Check if mentor owns this request
    if (menteeRequest.mentorId !== mentorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if request is still pending
    if (menteeRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Request is no longer pending' },
        { status: 400 }
      )
    }

    // Decline the request
    const declinedRequest = declineMenteeRequest(requestId)
    if (!declinedRequest) {
      return NextResponse.json(
        { error: 'Failed to decline request' },
        { status: 500 }
      )
    }

    // TODO: Send decline notification to mentee
    // This would be implemented in the email system

    return NextResponse.json({
      success: true,
      message: 'Mentee request declined successfully'
    })

  } catch (error) {
    console.error('Error declining mentee request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

