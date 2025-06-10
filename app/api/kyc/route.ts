import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      // Get specific user's KYC status
      const { data: kyc, error } = await supabase.from("kyc_verifications").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error fetching KYC:", error)
        return NextResponse.json({ error: "Failed to fetch KYC status" }, { status: 500 })
      }

      return NextResponse.json(kyc || null)
    } else {
      // Get all KYC requests for admin
      const { data: kycRequests, error } = await supabase
        .from("kyc_verifications")
        .select(`
          *,
          user:users!kyc_verifications_user_id_fkey(
            id,
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          ),
          reviewer:users!kyc_verifications_reviewed_by_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching KYC requests:", error)
        return NextResponse.json({ error: "Failed to fetch KYC requests" }, { status: 500 })
      }

      return NextResponse.json(kycRequests || [])
    }
  } catch (error) {
    console.error("KYC API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const kycData = await request.json()

    const { data: kyc, error } = await supabase.from("kyc_verifications").insert(kycData).select().single()

    if (error) {
      console.error("Error creating KYC:", error)
      return NextResponse.json({ error: "Failed to create KYC request" }, { status: 500 })
    }

    return NextResponse.json(kyc)
  } catch (error) {
    console.error("Create KYC error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, reviewedBy, rejectionReason } = await request.json()

    const updateData: any = {
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    }

    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason
    }

    const { data: kyc, error } = await supabase
      .from("kyc_verifications")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating KYC:", error)
      return NextResponse.json({ error: "Failed to update KYC request" }, { status: 500 })
    }

    // If approved, update user verification status
    if (status === "approved") {
      await supabase.from("users").update({ is_verified: true }).eq("id", kyc.user_id)
    }

    return NextResponse.json(kyc)
  } catch (error) {
    console.error("Update KYC error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
