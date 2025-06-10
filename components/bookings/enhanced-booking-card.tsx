"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useI18n } from "@/components/providers/i18n-provider"
import { Calendar, Clock, MapPin, MessageCircle, Phone, Star, MoreHorizontal } from "lucide-react"

interface EnhancedBookingCardProps {
  booking: {
    id: string
    service: string
    provider?: string
    client?: string
    date: string
    time: string
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
    price: number
    image?: string
    address?: string
    rating?: number
  }
  onClick: () => void
  userRole: "client" | "provider"
}

export function EnhancedBookingCard({ booking, onClick, userRole }: EnhancedBookingCardProps) {
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in-progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />
      case "confirmed":
        return <Calendar className="h-3 w-3" />
      case "in-progress":
        return <Clock className="h-3 w-3" />
      case "completed":
        return <Calendar className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Contact clicked for booking:", booking.id)
    // Navigate to chat or call
  }

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Call clicked for booking:", booking.id)
    // Open call interface
  }

  const handleMore = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("More options clicked for booking:", booking.id)
    // Open options menu
  }

  const displayName = userRole === "client" ? booking.provider : booking.client

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 card-hover"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {booking.image && (
                <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={booking.image || "/placeholder.svg"}
                    alt={booking.service}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-base truncate">{booking.service}</h3>
                    {displayName && (
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xs">
                            {displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">
                          {userRole === "client" ? t("booking.serviceProvider") : t("booking.client")}: {displayName}
                        </p>
                      </div>
                    )}
                  </div>

                  <Badge className={`text-xs flex-shrink-0 ${getStatusColor(booking.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(booking.status)}
                      {t(`common.${booking.status}`)}
                    </div>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{booking.time}</span>
              </div>
            </div>

            {booking.address && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{booking.address}</span>
              </div>
            )}

            {booking.rating && booking.status === "completed" && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{booking.rating}</span>
                <span className="text-muted-foreground">rating given</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">
                {booking.price.toLocaleString()} {t("currency.xaf")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleContact}
                className="h-8 px-3 hover:bg-primary/10 transition-all duration-200"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">{t("nav.messages")}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleCall}
                className="h-8 px-3 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
              >
                <Phone className="h-3 w-3 mr-1" />
                <span className="text-xs">{t("common.call")}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleMore}
                className="h-8 w-8 p-0 hover:bg-muted transition-all duration-200"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
