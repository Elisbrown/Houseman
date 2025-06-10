import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const userId = searchParams.get("userId")
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10

    if (!userId || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 })
    }

    // Start building the query
    let bookingsQuery = supabase.from("bookings").select(`
        *,
        service:service_id(*),
        client:client_id(*),
        provider:provider_id(*)
      `)

    // Apply filters based on role
    if (role === "client") {
      bookingsQuery = bookingsQuery.eq("client_id", userId)
    } else if (role === "provider") {
      bookingsQuery = bookingsQuery.eq("provider_id", userId)
    } else if (role !== "admin") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Apply status filter if provided
    if (status) {
      bookingsQuery = bookingsQuery.eq("status", status)
    }

    // Apply sorting
    bookingsQuery = bookingsQuery.order("created_at", { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    bookingsQuery = bookingsQuery.range(from, to)

    // Execute the query
    const { data: bookings, error } = await bookingsQuery

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq(role === "client" ? "client_id" : "provider_id", userId)

    if (countError) {
      console.error("Error counting bookings:", countError)
    }

    // Format the response
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      serviceId: booking.service_id,
      clientId: booking.client_id,
      providerId: booking.provider_id,
      status: booking.status,
      scheduledDate: booking.scheduled_date,
      scheduledTime: booking.scheduled_time,
      duration: booking.duration,
      price: booking.price,
      currency: booking.currency || "XAF",
      notes: booking.notes,
      service: booking.service
        ? {
            id: booking.service.id,
            title: booking.service.title,
            description: booking.service.description,
            price: booking.service.price,
            currency: booking.service.currency || "XAF",
          }
        : null,
      client: booking.client
        ? {
            id: booking.client.id,
            firstName: booking.client.first_name,
            lastName: booking.client.last_name,
            avatar: booking.client.avatar_url,
          }
        : null,
      provider: booking.provider
        ? {
            id: booking.provider.id,
            firstName: booking.provider.first_name,
            lastName: booking.provider.last_name,
            avatar: booking.provider.avatar_url,
            rating: booking.provider.rating,
          }
        : null,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    }))

    return NextResponse.json({
      bookings: formattedBookings,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: totalCount ? Math.ceil(totalCount / limit) : 0,
      },
    })
  } catch (error) {
    console.error("Bookings API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()

    // Validate required fields
    const { serviceId, clientId, providerId, scheduledDate, scheduledTime, duration, price } = data

    if (!serviceId || !clientId || !providerId || !scheduledDate || !scheduledTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        service_id: serviceId,
        client_id: clientId,
        provider_id: providerId,
        status: "pending",
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        duration: duration || 60, // Default to 60 minutes
        price: price,
        currency: data.currency || "XAF",
        notes: data.notes || "",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        serviceId: booking.service_id,
        clientId: booking.client_id,
        providerId: booking.provider_id,
        status: booking.status,
        scheduledDate: booking.scheduled_date,
        scheduledTime: booking.scheduled_time,
        duration: booking.duration,
        price: booking.price,
        currency: booking.currency,
        notes: booking.notes,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at,
      },
      success: true,
    })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
