import { createServerSupabaseClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

interface CreateUserParams {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "client" | "provider" | "admin"
  phone?: string
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(email: string, password: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get user from database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("is_active", true)
      .single()

    if (error || !user) {
      console.error("User not found or inactive:", error)
      return null
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      console.error("Password does not match")
      return null
    }

    return user
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

/**
 * Create a new user
 */
export async function createUser(params: CreateUserParams) {
  try {
    const supabase = createServerSupabaseClient()

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(params.password, salt)

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: params.email.toLowerCase(),
        password_hash: passwordHash,
        first_name: params.firstName,
        last_name: params.lastName,
        role: params.role,
        phone: params.phone,
        is_active: true,
        is_verified: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("User creation error:", error)
    return null
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("User fetch error:", error)
    return null
  }
}
