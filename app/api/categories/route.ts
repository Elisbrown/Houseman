import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    return NextResponse.json(categories || [])
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
