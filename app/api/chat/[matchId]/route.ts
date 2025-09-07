import { NextRequest, NextResponse } from 'next/server'
import { findConversationById } from '@/lib/conversations-repo'
import { getMessages } from '@/lib/messages-repo'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const resolvedParams = await params
    const { matchId } = resolvedParams

    // Find the conversation
    const conversation = findConversationById(matchId)
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Get messages for this conversation
    const messages = getMessages(matchId)

    return NextResponse.json({
      success: true,
      conversation,
      messages,
      participants: {
        mentor: {
          id: conversation.mentorId,
          name: conversation.mentorName
        },
        mentee: {
          id: conversation.menteeId,
          name: conversation.menteeName
        }
      }
    })

  } catch (error) {
    console.error('Error fetching chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

