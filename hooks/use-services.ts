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
    avatar_url: string | null
    is_verified: boolean
  }
  category: {
    id: string
    name: string
    icon: string | null
  }
  service_area?: any
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
      if (options.minPrice !== undefined) params.append("minPrice", options.minPrice.toString())
      if (options.maxPrice !== undefined) params.append("maxPrice", options.maxPrice.toString())
      if (options.minRating !== undefined) params.append("minRating", options.minRating.toString())
      if (options.sortBy) params.append("sortBy", options.sortBy)
      if (options.sortOrder) params.append("sortOrder", options.sortOrder)

      const response = await fetch(`/api/services?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()

      // Process the data to ensure all required fields are present
      const processedServices = data.map((service: any) => ({
        ...service,
        currency: service.currency || "XAF",
        images: service.images || [],
        rating: service.rating || 0,
        review_count: service.review_count || 0,
        provider: {
          ...service.provider,
          avatar_url: service.provider?.avatar_url || null,
        },
        category: {
          ...service.category,
          icon: service.category?.icon || null,
        },
      }))

      setServices(processedServices)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
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

// Also export the types for use in other components
export type { Service, UseServicesOptions }
