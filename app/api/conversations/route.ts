import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Fetch conversations where the user is a participant
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        participants:conversation_participants(
          user_id,
          user:user_id(
            id,
            first_name,
            last_name,
            avatar_url,
            role
          )
        ),
        last_message:messages(
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .eq("conversation_participants.user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    // Format the response
    const formattedConversations = conversations.map((conversation) => {
      // Filter out the current user from participants
      const otherParticipants = conversation.participants.filter((p) => p.user_id !== userId).map((p) => p.user)

      // Get the last message
      const lastMessage = conversation.last_message?.[0]

      return {
        id: conversation.id,
        title: conversation.title || otherParticipants.map((p) => `${p.first_name} ${p.last_name}`).join(", "),
        participants: otherParticipants.map((p) => ({
          id: p.id,
          firstName: p.first_name,
          lastName: p.last_name,
          avatar: p.avatar_url,
          role: p.role,
        })),
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              createdAt: lastMessage.created_at,
              isFromUser: lastMessage.sender_id === userId,
            }
          : null,
        unreadCount: conversation.unread_count || 0,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at,
      }
    })

    return NextResponse.json({
      conversations: formattedConversations,
    })
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()

    // Validate required fields
    const { participants, title } = data

    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return NextResponse.json({ error: "At least two participants are required" }, { status: 400 })
    }

    // Create the conversation
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        title: title || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating conversation:", error)
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }

    // Add participants to the conversation
    const participantRecords = participants.map((userId) => ({
      conversation_id: conversation.id,
      user_id: userId,
    }))

    const { error: participantsError } = await supabase.from("conversation_participants").insert(participantRecords)

    if (participantsError) {
      console.error("Error adding participants:", participantsError)
      return NextResponse.json({ error: "Failed to add participants" }, { status: 500 })
    }

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        participants: participants,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at,
      },
      success: true,
    })
  } catch (error) {
    console.error("Conversation creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
