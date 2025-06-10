import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const { email, password, firstName, lastName, role, phone } = userData

    // Simulate user creation
    // In a real app, you would save to a database
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      firstName,
      lastName,
      phone,
      role,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(newUser)
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
