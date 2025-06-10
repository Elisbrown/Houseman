"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ServiceCardProps {
  id: string
  title: string
  description: string
  price: number
  currency?: string
  rating?: number
  reviewCount?: number
  providerName?: string
  providerAvatar?: string
  image?: string
  onClick?: () => void
}

// Format price with currency
const formatPrice = (price: number, currency?: string) => {
  try {
    // Default to XAF (Central African Franc) if no currency provided
    const currencyCode = currency || "XAF"

    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  } catch (error) {
    // Fallback if Intl.NumberFormat fails
    console.error("Price formatting error:", error)
    return `${price.toLocaleString()} ${currency || "XAF"}`
  }
}

export function ServiceCard({
  id,
  title,
  description,
  price,
  currency,
  rating = 0,
  reviewCount = 0,
  providerName,
  providerAvatar,
  image,
  onClick,
}: ServiceCardProps) {
  // Default image if none provided
  const serviceImage = image || "/placeholder.svg?height=200&width=300"

  // Default avatar if none provided
  const avatar = providerAvatar || "/placeholder.svg?height=40&width=40"

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
      <div className="relative h-48 w-full">
        <Image
          src={serviceImage || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>

        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{description}</p>

        <div className="flex items-center mt-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="ml-1 text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          {providerAvatar && (
            <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
              <Image
                src={avatar || "/placeholder.svg"}
                alt={providerName || "Service provider"}
                fill
                className="object-cover"
              />
            </div>
          )}
          {providerName && <span className="text-xs text-muted-foreground">{providerName}</span>}
        </div>

        <div className="font-semibold">{formatPrice(price, currency)}</div>
      </CardFooter>
    </Card>
  )
}
