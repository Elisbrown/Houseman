import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch categories with service count
    const { data: categories, error } = await supabase
      .from("service_categories")
      .select(`
        *,
        services:services(count)
      `)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    // Format the response
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.icon || "tag", // Default icon if none provided
      description: category.description,
      serviceCount: category.services?.length || 0,
    }))

    return NextResponse.json({
      categories: formattedCategories,
    })
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { name, icon, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Create the category
    const { data: category, error } = await supabase
      .from("service_categories")
      .insert({
        name,
        icon: icon || "tag", // Default icon
        description,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating category:", error)
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        description: category.description,
      },
      success: true,
    })
  } catch (error) {
    console.error("Category creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
