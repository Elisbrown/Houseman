import bcrypt from "bcryptjs"
import { supabase } from "./supabase"
import type { Database } from "@/types/database"

type User = Database["public"]["Tables"]["users"]["Row"]
type UserInsert = Database["public"]["Tables"]["users"]["Insert"]

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "client" | "provider"
  phone?: string
}): Promise<User | null> {
  try {
    const passwordHash = await hashPassword(userData.password)

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: userData.email,
        password_hash: passwordHash,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        role: userData.role,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return null
    }

    // Create user profile
    await supabase.from("user_profiles").insert({
      user_id: user.id,
      language: "en",
      theme: "system",
    })

    return user
  } catch (error) {
    console.error("Error in createUser:", error)
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return null
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error in authenticateUser:", error)
    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error in getUserById:", error)
    return null
  }
}

export async function updateUserAvatar(userId: string, avatarUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("users").update({ avatar_url: avatarUrl }).eq("id", userId)

    return !error
  } catch (error) {
    console.error("Error updating user avatar:", error)
    return false
  }
}
