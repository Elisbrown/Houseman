"use client"

import { useState, useEffect } from "react"
import config from "@/lib/config"

export interface Service {
  id: string
  title: string
  description: string
  price: number
  currency: string
  rating: number
  reviewCount: number
  category: {
    id: string
    name: string
    icon: string
  } | null
  provider: {
    id: string
    firstName: string
    lastName: string
    avatar: string
    rating: number
    reviewCount: number
  } | null
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface UseServicesOptions {
  category?: string
  query?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface ServicesPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export function useServices(options: UseServicesOptions = {}) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ServicesPagination>({
    page: options.page || 1,
    limit: options.limit || 10,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query parameters
        const params = new URLSearchParams()
        if (options.category) params.append("category", options.category)
        if (options.query) params.append("query", options.query)
        if (options.minPrice) params.append("minPrice", options.minPrice.toString())
        if (options.maxPrice) params.append("maxPrice", options.maxPrice.toString())
        if (options.minRating) params.append("minRating", options.minRating.toString())
        if (options.sortBy) params.append("sortBy", options.sortBy)
        if (options.sortOrder) params.append("sortOrder", options.sortOrder)
        if (options.page) params.append("page", options.page.toString())
        if (options.limit) params.append("limit", options.limit.toString())

        // Fetch services from API
        const response = await fetch(`${config.app.apiUrl}/services?${params.toString()}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch services")
        }

        const data = await response.json()

        // Process and set services
        setServices(data.services || [])
        setPagination(
          data.pagination || {
            page: options.page || 1,
            limit: options.limit || 10,
            total: data.services?.length || 0,
            pages: Math.ceil((data.services?.length || 0) / (options.limit || 10)),
          },
        )
      } catch (err: any) {
        console.error("Error fetching services:", err)
        setError(err.message || "An error occurred while fetching services")
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [
    options.category,
    options.query,
    options.minPrice,
    options.maxPrice,
    options.minRating,
    options.sortBy,
    options.sortOrder,
    options.page,
    options.limit,
  ])

  return {
    services,
    loading,
    error,
    pagination,
    setPage: (page: number) => {
      return { ...options, page }
    },
  }
}
