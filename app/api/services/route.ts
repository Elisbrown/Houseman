import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")
    const sortBy = searchParams.get("sortBy") || "created_at"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build the query
    let query = supabase
      .from("services")
      .select(`
        *,
        provider:users!services_provider_id_fkey (
          id,
          first_name,
          last_name,
          avatar_url,
          is_verified
        ),
        category:categories!services_category_id_fkey (
          id,
          name,
          icon
        )
      `)
      .eq("is_active", true)

    // Apply filters
    if (category) {
      query = query.eq("category_id", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (minPrice) {
      query = query.gte("price", Number.parseInt(minPrice))
    }

    if (maxPrice) {
      query = query.lte("price", Number.parseInt(maxPrice))
    }

    if (minRating) {
      query = query.gte("rating", Number.parseFloat(minRating))
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    const { data: services, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }

    // Process the services data
    const processedServices =
      services?.map((service) => ({
        ...service,
        currency: service.currency || "XAF",
        images: service.images || [],
        rating: service.rating || 0,
        review_count: service.review_count || 0,
      })) || []

    return NextResponse.json(processedServices)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data: service, error } = await supabase
      .from("services")
      .insert([
        {
          ...body,
          currency: body.currency || "XAF",
          images: body.images || [],
          rating: 0,
          review_count: 0,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
    }

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
