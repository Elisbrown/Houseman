"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { ServiceCard } from "@/components/services/service-card"
import { BookingCard } from "@/components/bookings/booking-card"
import { ChatList } from "@/components/chat/chat-list"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { useAuth } from "@/components/providers/auth-provider"
import { useI18n } from "@/components/providers/i18n-provider"
import { Search, Filter, Wrench, Zap, Paintbrush, Scissors, Car, Sparkles, MapPin } from "lucide-react"
import { EnhancedSearch } from "../search/enhanced-search"

const serviceCategories = [
  {
    id: "carpenter",
    name: "services.carpenter",
    icon: Wrench,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    id: "electrician",
    name: "services.electrician",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    id: "painter",
    name: "services.painter",
    icon: Paintbrush,
    color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
  },
  {
    id: "barber",
    name: "services.barber",
    icon: Scissors,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    id: "mechanic",
    name: "services.mechanic",
    icon: Car,
    color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
  },
  {
    id: "cleaner",
    name: "services.cleaner",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",
  },
]

const featuredServices = [
  {
    id: "1",
    title: "Home Cleaning & Disinfection",
    provider: "Marie Dubois",
    rating: 4.8,
    reviewCount: 124,
    price: 15000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: true,
    category: "Cleaning",
    location: "Yaoundé, Cameroon",
    distance: "2.5 km",
  },
  {
    id: "2",
    title: "Electronic Device Fixing",
    provider: "Jean Baptiste",
    rating: 4.9,
    reviewCount: 89,
    price: 8000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: true,
    category: "Electronics",
    location: "Douala, Cameroon",
    distance: "1.2 km",
  },
  {
    id: "3",
    title: "Apartment Painting",
    provider: "Paul Ngozi",
    rating: 4.7,
    reviewCount: 156,
    price: 45000,
    image: "/placeholder.svg?height=200&width=300",
    isVerified: false,
    category: "Painting",
    location: "Yaoundé, Cameroon",
    distance: "3.8 km",
  },
]

const recentBookings = [
  {
    id: "1",
    service: "Home Cleaning",
    provider: "Marie Dubois",
    date: "2024-01-20",
    time: "10:00 AM",
    status: "confirmed" as const,
    price: 15000,
    image: "/placeholder.svg?height=100&width=100",
    address: "Bastos, Yaoundé",
  },
  {
    id: "2",
    service: "Electrical Repair",
    provider: "Jean Baptiste",
    date: "2024-01-18",
    time: "2:00 PM",
    status: "completed" as const,
    price: 8000,
    image: "/placeholder.svg?height=100&width=100",
    address: "Bonanjo, Douala",
  },
]

interface ClientDashboardProps {
  initialSearchQuery?: string
  initialCategory?: string
}

export function ClientDashboard({ initialSearchQuery = "", initialCategory = "" }: ClientDashboardProps) {
  const { user } = useAuth()
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [activeTab, setActiveTab] = useState("home")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
  const [unreadMessages, setUnreadMessages] = useState(3) // Mock unread count

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
            <Button
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 transition-all duration-300"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
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
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2 transition-all duration-300 group-hover:scale-110`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium truncate">{t(category.name)}</p>
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
          <div className="space-y-4">
            {featuredServices.map((service, index) => (
              <div
                key={service.id}
                className="animate-slide-in-left"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <ServiceCard service={service} onClick={() => handleServiceClick(service.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="animate-slide-in-up delay-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("dashboard.recentBookings")}</h2>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("bookings")} className="hover:bg-primary/10">
              {t("dashboard.viewAll")}
            </Button>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="animate-slide-in-right"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <BookingCard booking={booking} onClick={() => handleBookingClick(booking.id)} userRole="client" />
                </div>
              ))}
            </div>
          ) : (
            <Card className="animate-fade-in delay-800">
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">{t("dashboard.noRecentBookings")}</p>
                <Button className="mt-2" size="sm" onClick={() => setActiveTab("search")}>
                  {t("dashboard.bookService")}
                </Button>
              </CardContent>
            </Card>
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
      <div className="space-y-3">
        {recentBookings.map((booking, index) => (
          <div key={booking.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <BookingCard booking={booking} onClick={() => handleBookingClick(booking.id)} userRole="client" />
          </div>
        ))}
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
