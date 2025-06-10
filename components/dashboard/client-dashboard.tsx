"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { ServiceCard } from "@/components/services/service-card"
import { ChatList } from "@/components/chat/chat-list"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { useAuth } from "@/components/providers/auth-provider"
import { useI18n } from "@/components/providers/i18n-provider"
import { useServices } from "@/hooks/use-services"
import { useCategories } from "@/hooks/use-categories"
import { Search, Wrench, Zap, Paintbrush, Scissors, Car, Sparkles, MapPin } from "lucide-react"
import { EnhancedSearch } from "../search/enhanced-search"

const iconMap = {
  wrench: Wrench,
  zap: Zap,
  paintbrush: Paintbrush,
  scissors: Scissors,
  car: Car,
  sparkles: Sparkles,
}

interface ClientDashboardProps {
  initialSearchQuery?: string
  initialCategory?: string
}

export function ClientDashboard({ initialSearchQuery = "", initialCategory = "" }: ClientDashboardProps) {
  const { user } = useAuth()
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [activeTab, setActiveTab] = useState("home")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
  const [unreadMessages, setUnreadMessages] = useState(0)

  const { categories } = useCategories()
  const { services: featuredServices, loading: servicesLoading } = useServices({
    sortBy: "rating",
    sortOrder: "desc",
  })

  // Auto-navigate to search if initial query or category is provided
  useEffect(() => {
    if (initialSearchQuery || initialCategory) {
      setActiveTab("search")
    }
  }, [initialSearchQuery, initialCategory])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setActiveTab("search")
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setActiveTab("search")
  }

  const handleServiceClick = (serviceId: string) => {
    console.log("Service clicked:", serviceId)
    // Navigate to service details
  }

  const handleBookingClick = (bookingId: string) => {
    console.log("Booking clicked:", bookingId)
    // Navigate to booking details
  }

  const handleProfileClick = () => {
    setActiveTab("profile")
  }

  const renderHomeTab = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header with animated background */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white p-4 pb-6 rounded-b-3xl relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute top-20 right-0 w-24 h-24 bg-white rounded-full translate-x-12 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="animate-slide-in-left">
              <h1 className="text-xl font-semibold">
                {t("dashboard.hello")}, {user?.firstName}!
              </h1>
              <p className="text-primary-foreground/80 text-sm">{t("dashboard.whatService")}</p>
            </div>
            <div className="animate-slide-in-right">
              <Avatar
                className="ring-2 ring-white/20 cursor-pointer hover:ring-white/40 transition-all duration-300 hover:scale-105"
                onClick={handleProfileClick}
              >
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-white/20 text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative animate-slide-in-up">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("services.searchServices")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white text-foreground border-0 transition-all duration-300 focus:ring-2 focus:ring-white/50"
              onFocus={() => setActiveTab("search")}
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mt-3 text-primary-foreground/80 animate-slide-in-up delay-200">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Yaoundé, Cameroon</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Service Categories */}
        <div className="animate-slide-in-up delay-300">
          <h2 className="text-lg font-semibold mb-4">{t("dashboard.serviceCategories")}</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 6).map((category, index) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Wrench
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 transition-all duration-300 group-hover:scale-110">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium truncate">{category.name}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Featured Services */}
        <div className="animate-slide-in-up delay-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("dashboard.featuredServices")}</h2>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("search")} className="hover:bg-primary/10">
              {t("dashboard.viewAll")}
            </Button>
          </div>
          {servicesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {featuredServices.slice(0, 3).map((service, index) => (
                <div
                  key={service.id}
                  className="animate-slide-in-left"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <ServiceCard
                    service={{
                      id: service.id,
                      title: service.title,
                      provider: `${service.provider.first_name} ${service.provider.last_name}`,
                      rating: service.rating,
                      reviewCount: service.review_count,
                      price: service.price,
                      image: service.images[0] || "/placeholder.svg",
                      isVerified: service.provider.is_verified,
                      category: service.category.name,
                    }}
                    onClick={() => handleServiceClick(service.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderSearchTab = () => (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{t("nav.search")}</h1>
      <EnhancedSearch
        onServiceClick={handleServiceClick}
        initialQuery={searchQuery}
        initialCategory={selectedCategory}
      />
    </div>
  )

  const renderBookingsTab = () => (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{t("nav.bookings")}</h1>
      {/* Bookings will be loaded from API */}
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bookings yet</p>
      </div>
    </div>
  )

  const renderMessagesTab = () => (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{t("nav.messages")}</h1>
      <ChatList userRole="client" />
    </div>
  )

  const renderProfileTab = () => (
    <div className="p-4 animate-fade-in">
      <ProfileSettings />
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomeTab()
      case "search":
        return renderSearchTab()
      case "bookings":
        return renderBookingsTab()
      case "messages":
        return renderMessagesTab()
      case "profile":
        return renderProfileTab()
      default:
        return renderHomeTab()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="main-content">{renderContent()}</div>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole="client"
        unreadMessages={unreadMessages}
      />
    </div>
  )
}
