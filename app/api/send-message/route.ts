import { NextRequest, NextResponse } from 'next/server'
import { findConversationById } from '@/lib/conversations-repo'
import { sendMessage } from '@/lib/messages-repo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { matchId, sender, message } = body

    // Validate required fields
    if (!matchId || !sender || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the conversation
    const conversation = findConversationById(matchId)
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Check if conversation is active
    if (conversation.status !== 'active') {
      return NextResponse.json(
        { error: 'Conversation is not active' },
        { status: 400 }
      )
    }

    // Send the message
    const chatMessage = sendMessage({
      conversationId: matchId,
      senderId: sender === 'mentee' ? conversation.menteeId : conversation.mentorId,
      senderName: sender === 'mentee' ? conversation.menteeName : conversation.mentorName,
      senderType: sender,
      content: message,
    })

    return NextResponse.json({
      success: true,
      message: chatMessage,
      messageId: chatMessage.id
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

