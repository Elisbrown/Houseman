"use client"

import { useState, useEffect } from "react"
import config from "@/lib/config"

export interface Category {
  id: string
  name: string
  icon: string
  description?: string
  serviceCount?: number
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch categories from API
        const response = await fetch(`${config.app.apiUrl}/categories`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch categories")
        }

        const data = await response.json()
        setCategories(data.categories || [])
      } catch (err: any) {
        console.error("Error fetching categories:", err)
        setError(err.message || "An error occurred while fetching categories")
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
  }
}
