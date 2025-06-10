"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: string
  title: string
  description: string
  price: number
  currency: string
  images: string[]
  rating: number
  review_count: number
  provider: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string
    is_verified: boolean
  }
  category: {
    id: string
    name: string
    icon: string
  }
}

interface UseServicesOptions {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export function useServices(options: UseServicesOptions = {}) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.category) params.append("category", options.category)
      if (options.search) params.append("search", options.search)
      if (options.minPrice) params.append("minPrice", options.minPrice.toString())
      if (options.maxPrice) params.append("maxPrice", options.maxPrice.toString())
      if (options.minRating) params.append("minRating", options.minRating.toString())
      if (options.sortBy) params.append("sortBy", options.sortBy)
      if (options.sortOrder) params.append("sortOrder", options.sortOrder)

      const response = await fetch(`/api/services?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      setServices(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch services"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [
    options.category,
    options.search,
    options.minPrice,
    options.maxPrice,
    options.minRating,
    options.sortBy,
    options.sortOrder,
  ])

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  }
}
