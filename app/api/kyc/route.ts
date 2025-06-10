import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Fetch KYC verifications for the user
    const { data: verifications, error } = await supabase
      .from("kyc_verifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching KYC verifications:", error)
      return NextResponse.json({ error: "Failed to fetch KYC verifications" }, { status: 500 })
    }

    // Format the response
    const formattedVerifications = verifications.map((verification) => ({
      id: verification.id,
      userId: verification.user_id,
      documentType: verification.document_type,
      documentNumber: verification.document_number,
      documentFront: verification.document_front,
      documentBack: verification.document_back,
      selfie: verification.selfie,
      status: verification.status,
      rejectionReason: verification.rejection_reason,
      createdAt: verification.created_at,
      updatedAt: verification.updated_at,
    }))

    return NextResponse.json({
      verifications: formattedVerifications,
    })
  } catch (error) {
    console.error("KYC API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()
    
    // Validate required fields
    const { userId, documentType, documentNumber, documentFront } = data
    
    if (!userId || !documentType || !documentNumber || !documentFront) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Create the KYC verification
    const { data: verification, error } = await supabase
      .from("kyc_verifications")
      .insert({
        user_id: userId,
        document_type: documentType,
        document_number: documentNumber,
        document_front: documentFront,
        document_back: data.documentBack || null,
        selfie: data.selfie || null,
        status: "pending",
      })
      .select()
      .single()
    
    if (error) {
      console.error("Error creating KYC verification:", error)
      return NextResponse.json({ error: "Failed to create KYC verification" }, { status:\
