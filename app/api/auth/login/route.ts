import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
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
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
