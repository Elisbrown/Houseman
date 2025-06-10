import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:users!messages_sender_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        ),
        reply_to:messages!messages_reply_to_id_fkey(
          id,
          content,
          message_type,
          image_url,
          sender:users!messages_sender_id_fkey(
            first_name,
            last_name
          )
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json(messages || [])
  } catch (error) {
    console.error("Messages API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const messageData = await request.json()

    const { data: message, error } = await supabase.from("messages").insert(messageData).select().single()

    if (error) {
      console.error("Error creating message:", error)
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Create message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
