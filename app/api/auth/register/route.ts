import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role, phone } = await request.json()

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    if (!["client", "provider"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
    })

    if (!user) {
      return NextResponse.json({ error: "Failed to create user. Email may already exist." }, { status: 400 })
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      firstName: userWithoutPassword.first_name,
      lastName: userWithoutPassword.last_name,
      phone: userWithoutPassword.phone,
      role: userWithoutPassword.role,
      avatar: userWithoutPassword.avatar_url,
      isVerified: userWithoutPassword.is_verified,
      createdAt: userWithoutPassword.created_at,
      updatedAt: userWithoutPassword.updated_at,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
