import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const conversationId = searchParams.get("conversationId")
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    // Start building the query
    let messagesQuery = supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id(
          id,
          first_name,
          last_name,
          avatar_url,
          role
        ),
        reply_to:reply_to_id(
          id,
          content,
          sender_id,
          sender:sender_id(
            id,
            first_name,
            last_name
          )
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    messagesQuery = messagesQuery.range(from, to)

    // Execute the query
    const { data: messages, error } = await messagesQuery

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conversationId)

    if (countError) {
      console.error("Error counting messages:", countError)
    }

    // Format the response
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      conversationId: message.conversation_id,
      content: message.content,
      senderId: message.sender_id,
      sender: message.sender
        ? {
            id: message.sender.id,
            firstName: message.sender.first_name,
            lastName: message.sender.last_name,
            avatar: message.sender.avatar_url,
            role: message.sender.role,
          }
        : null,
      replyTo: message.reply_to
        ? {
            id: message.reply_to.id,
            content: message.reply_to.content,
            senderId: message.reply_to.sender_id,
            senderName: message.reply_to.sender
              ? `${message.reply_to.sender.first_name} ${message.reply_to.sender.last_name}`
              : "Unknown",
          }
        : null,
      attachments: message.attachments || [],
      isRead: message.is_read,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
    }))

    return NextResponse.json({
      messages: formattedMessages,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: totalCount ? Math.ceil(totalCount / limit) : 0,
      },
    })
  } catch (error) {
    console.error("Messages API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()

    // Validate required fields
    const { conversationId, content, senderId } = data

    if (!conversationId || !content || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        content,
        sender_id: senderId,
        reply_to_id: data.replyToId || null,
        attachments: data.attachments || [],
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating message:", error)
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
    }

    // Update conversation's updated_at timestamp and unread count
    await supabase
      .from("conversations")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId)

    return NextResponse.json({
      message: {
        id: message.id,
        conversationId: message.conversation_id,
        content: message.content,
        senderId: message.sender_id,
        replyToId: message.reply_to_id,
        attachments: message.attachments,
        isRead: message.is_read,
        createdAt: message.created_at,
        updatedAt: message.updated_at,
      },
      success: true,
    })
  } catch (error) {
    console.error("Message creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
