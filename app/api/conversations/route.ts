import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        participant_1_user:users!conversations_participant_1_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          is_verified
        ),
        participant_2_user:users!conversations_participant_2_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          is_verified
        ),
        booking:bookings(
          id,
          service:services(
            id,
            title
          )
        ),
        last_message:messages(
          id,
          content,
          message_type,
          created_at
        )
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order("last_message_at", { ascending: false })

    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    return NextResponse.json(conversations || [])
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { participant1, participant2, bookingId } = await request.json()

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id")
      .or(
        `and(participant_1.eq.${participant1},participant_2.eq.${participant2}),and(participant_1.eq.${participant2},participant_2.eq.${participant1})`,
      )
      .single()

    if (existingConversation) {
      return NextResponse.json(existingConversation)
    }

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        participant_1: participant1,
        participant_2: participant2,
        booking_id: bookingId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating conversation:", error)
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
