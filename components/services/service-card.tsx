"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, MessageCircle, Phone } from "lucide-react"
import { useI18n } from "@/components/providers/i18n-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface ServiceCardProps {
  service: {
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
  onBook?: (serviceId: string) => void
  onMessage?: (providerId: string) => void
  onCall?: (providerId: string) => void
}

export function ServiceCard({ service, onBook, onMessage, onCall }: ServiceCardProps) {
  const { t } = useI18n()
  const { user } = useAuth()
  const { toast } = useToast()
  const [imageError, setImageError] = useState(false)

  const handleBook = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book services.",
        variant: "destructive",
      })
      return
    }
    onBook?.(service.id)
  }

  const handleMessage = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to message providers.",
        variant: "destructive",
      })
      return
    }
    onMessage?.(service.provider.id)
  }

  const handleCall = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to call providers.",
        variant: "destructive",
      })
      return
    }
    onCall?.(service.provider.id)
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getImageSrc = () => {
    if (imageError || !service.images || service.images.length === 0) {
      return "/placeholder.svg?height=200&width=300"
    }
    return service.images[0]
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={getImageSrc() || "/placeholder.svg"}
            alt={service.title}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-black">
              {service.category.name}
            </Badge>
          </div>
          {service.rating > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{service.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({service.review_count})</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{service.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-primary">{formatPrice(service.price, service.currency)}</div>
            {service.service_area && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{service.service_area.address}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={service.provider.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {service.provider.first_name[0]}
                {service.provider.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium truncate">
                  {service.provider.first_name} {service.provider.last_name}
                </span>
                {service.provider.is_verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={handleBook} className="flex-1">
          {t("services.book")}
        </Button>
        <Button variant="outline" size="icon" onClick={handleMessage}>
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCall}>
          <Phone className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
