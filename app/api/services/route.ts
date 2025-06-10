import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const category = searchParams.get("category")
    const query = searchParams.get("query")
    const minPrice = searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : undefined
    const minRating = searchParams.get("minRating") ? Number.parseFloat(searchParams.get("minRating")!) : undefined
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10

    // Start building the query
    let servicesQuery = supabase
      .from("services")
      .select(`
        *,
        provider:provider_id(
          id,
          first_name,
          last_name,
          avatar_url,
          rating,
          review_count
        ),
        category:category_id(
          id,
          name,
          icon
        )
      `)
      .eq("is_active", true)

    // Apply filters
    if (category) {
      servicesQuery = servicesQuery.eq("category_id", category)
    }

    if (query) {
      servicesQuery = servicesQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (minPrice !== undefined) {
      servicesQuery = servicesQuery.gte("price", minPrice)
    }

    if (maxPrice !== undefined) {
      servicesQuery = servicesQuery.lte("price", maxPrice)
    }

    if (minRating !== undefined) {
      servicesQuery = servicesQuery.gte("rating", minRating)
    }

    // Apply sorting
    if (sortBy && sortOrder) {
      servicesQuery = servicesQuery.order(sortBy, { ascending: sortOrder === "asc" })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    servicesQuery = servicesQuery.range(from, to)

    // Execute the query
    const { data: services, error, count } = await servicesQuery

    if (error) {
      console.error("Error fetching services:", error)
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("services")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (countError) {
      console.error("Error counting services:", countError)
    }

    // Format the response
    const formattedServices = services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      currency: service.currency || "XAF",
      rating: service.rating || 0,
      reviewCount: service.review_count || 0,
      category: service.category
        ? {
            id: service.category.id,
            name: service.category.name,
            icon: service.category.icon,
          }
        : null,
      provider: service.provider
        ? {
            id: service.provider.id,
            firstName: service.provider.first_name,
            lastName: service.provider.last_name,
            avatar: service.provider.avatar_url,
            rating: service.provider.rating || 0,
            reviewCount: service.provider.review_count || 0,
          }
        : null,
      images: service.images || [],
      createdAt: service.created_at,
      updatedAt: service.updated_at,
    }))

    return NextResponse.json({
      services: formattedServices,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: totalCount ? Math.ceil(totalCount / limit) : 0,
      },
    })
  } catch (error) {
    console.error("Services API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()

    // Validate required fields
    const { title, description, price, currency, categoryId, providerId, images } = data

    if (!title || !description || !price || !categoryId || !providerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the service
    const { data: service, error } = await supabase
      .from("services")
      .insert({
        title,
        description,
        price,
        currency: currency || "XAF",
        category_id: categoryId,
        provider_id: providerId,
        images: images || [],
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating service:", error)
      return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
    }

    return NextResponse.json({
      service: {
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        currency: service.currency,
        categoryId: service.category_id,
        providerId: service.provider_id,
        images: service.images,
        createdAt: service.created_at,
        updatedAt: service.updated_at,
      },
      success: true,
    })
  } catch (error) {
    console.error("Service creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
