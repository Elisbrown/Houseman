import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // First try to authenticate with Supabase
    const user = await authenticateUser(email, password)

    if (user) {
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
    }

    // If Supabase auth fails, try demo credentials

    // Mock Admin Profile
    if (email === "admin@houseman.cm" && password === "HousemanAdmin2024!") {
      const user = {
        id: "admin_001",
        email: "admin@houseman.cm",
        firstName: "Sarah",
        lastName: "Mbeki",
        role: "admin",
        isVerified: true,
        avatar: "/placeholder.svg?height=100&width=100",
        phone: "+237 677 123 456",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json(user)
    }

    // Mock Client Profile
    if (email === "client@houseman.cm" && password === "ClientDemo123!") {
      const user = {
        id: "client_001",
        email: "client@houseman.cm",
        firstName: "Jean",
        lastName: "Kouam",
        role: "client",
        isVerified: false,
        avatar: "/placeholder.svg?height=100&width=100",
        phone: "+237 655 987 654",
        location: {
          address: "Bastos, Yaoundé, Cameroon",
          latitude: 3.848,
          longitude: 11.5021,
        },
        createdAt: "2024-01-15T00:00:00.000Z",
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json(user)
    }

    // Mock Provider Profile
    if (email === "provider@houseman.cm" && password === "ProviderDemo123!") {
      const user = {
        id: "provider_001",
        email: "provider@houseman.cm",
        firstName: "Marie",
        lastName: "Dubois",
        role: "provider",
        isVerified: true,
        avatar: "/placeholder.svg?height=100&width=100",
        phone: "+237 699 456 789",
        rating: 4.8,
        reviewCount: 124,
        kycStatus: "approved",
        services: [
          {
            id: "service_001",
            title: "Professional Home Cleaning",
            category: "Cleaning",
            price: 15000,
            currency: "XAF",
          },
        ],
        createdAt: "2023-06-01T00:00:00.000Z",
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json(user)
    }

    // Legacy credentials for backward compatibility
    if (email === "admin@houseman.com" && password === "admin123") {
      const user = {
        id: "1",
        email: "admin@houseman.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json(user)
    }

    if (email === "client@example.com" && password === "password") {
      const user = {
        id: "2",
        email: "client@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "client",
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json(user)
    }

    if (email === "provider@example.com" && password === "password") {
      const user = {
        id: "3",
        email: "provider@example.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "provider",
        isVerified: true,
        rating: 4.8,
        reviewCount: 124,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json(user)
    }

    console.log("Invalid login attempt:", { email, password })
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
