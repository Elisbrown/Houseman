import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")
    const sortBy = searchParams.get("sortBy") || "created_at"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let query = supabase
      .from("services")
      .select(`
        *,
        provider:users!services_provider_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          is_verified
        ),
        category:service_categories!services_category_id_fkey(
          id,
          name,
          icon
        )
      `)
      .eq("is_active", true)
      .not("provider.avatar_url", "is", null) // Only show services from providers with profile pictures

    // Apply filters
    if (category) {
      query = query.eq("category_id", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (minPrice) {
      query = query.gte("price", Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte("price", Number.parseFloat(maxPrice))
    }

    if (minRating) {
      query = query.gte("rating", Number.parseFloat(minRating))
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    const { data: services, error } = await query

    if (error) {
      console.error("Error fetching services:", error)
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }

    return NextResponse.json(services || [])
  } catch (error) {
    console.error("Services API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json()

    const { data: service, error } = await supabase.from("services").insert(serviceData).select().single()

    if (error) {
      console.error("Error creating service:", error)
      return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Create service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
