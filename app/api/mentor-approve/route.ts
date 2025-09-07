import { NextRequest, NextResponse } from 'next/server'
import { approveMenteeRequest, getMenteeRequestById } from '@/lib/mentee-requests-repo'
import { upsertConversation } from '@/lib/conversations-repo'
import { scheduleMatchNotification } from '@/lib/email'

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

    // Create conversation
    const conversationId = `conv-${Date.now()}`
    const conversation = {
      id: conversationId,
      mentorId: menteeRequest.mentorId,
      mentorName: menteeRequest.mentorName,
      menteeId: `mentee-${menteeRequest.id}`,
      menteeName: menteeRequest.menteeName,
      status: "active" as const,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }

    upsertConversation(conversation)

    // Approve the request
    const approvedRequest = approveMenteeRequest(requestId, conversationId)
    if (!approvedRequest) {
      return NextResponse.json(
        { error: 'Failed to approve request' },
        { status: 500 }
      )
    }

    // Send notification to mentee
    await scheduleMatchNotification(menteeRequest.menteeEmail, {
      mentorName: menteeRequest.mentorName,
      menteeName: menteeRequest.menteeName,
      mentorField: menteeRequest.field,
      conversationId,
      expiresAt: conversation.expiresAt
    })

    return NextResponse.json({
      success: true,
      conversationId,
      message: 'Mentee request approved successfully'
    })

  } catch (error) {
    console.error('Error approving mentee request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

