import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import config from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // First try to authenticate with database
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

    // If database auth fails, try demo credentials
    // Only in development or if explicitly enabled
    if (config.app.isDevelopment || process.env.ENABLE_DEMO_ACCOUNTS === "true") {
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
    }

    console.log("Invalid login attempt:", { email })
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
