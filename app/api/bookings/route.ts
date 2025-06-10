import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userRole = searchParams.get("userRole")

    if (!userId || !userRole) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 })
    }

    let query = supabase.from("bookings").select(`
        *,
        client:users!bookings_client_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        ),
        provider:users!bookings_provider_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        ),
        service:services!bookings_service_id_fkey(
          id,
          title,
          images
        )
      `)

    if (userRole === "client") {
      query = query.eq("client_id", userId)
    } else if (userRole === "provider") {
      query = query.eq("provider_id", userId)
    }

    query = query.order("created_at", { ascending: false })

    const { data: bookings, error } = await query

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json(bookings || [])
  } catch (error) {
    console.error("Bookings API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    const { data: booking, error } = await supabase.from("bookings").insert(bookingData).select().single()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
