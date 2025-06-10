"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Plus, Star, Calendar, DollarSign, Users, TrendingUp, Clock, CheckCircle } from "lucide-react"

const recentBookings = [
  {
    id: "1",
    client: "Alice Johnson",
    service: "Home Cleaning",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "pending",
    price: 15000,
  },
  {
    id: "2",
    client: "Bob Smith",
    service: "Electrical Repair",
    date: "2024-01-14",
    time: "2:00 PM",
    status: "accepted",
    price: 8000,
  },
  {
    id: "3",
    client: "Carol Davis",
    service: "Painting",
    date: "2024-01-13",
    time: "9:00 AM",
    status: "completed",
    price: 25000,
  },
]

export function ProviderDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("home")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <Calendar className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="main-content">
        {/* Header */}
        <div className="bg-primary text-white p-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">Welcome back, {user?.firstName}!</h1>
              <p className="text-primary-foreground/80 text-sm">Manage your services and bookings</p>
            </div>
            <div className="flex items-center gap-2">
              {user?.isVerified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                    <p className="font-semibold">125,000 XAF</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Clients</p>
                    <p className="font-semibold">47</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="font-semibold">4.8 ⭐</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-semibold">156</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-auto p-4 flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Add Service</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>View Calendar</span>
              </Button>
            </div>
          </div>

          {/* Recent Bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Bookings</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <Card key={booking.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{booking.client}</h3>
                        <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </div>
                        </Badge>
                      </div>
                      <p className="font-semibold text-primary text-sm">{booking.price.toLocaleString()} XAF</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{booking.service}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.date} at {booking.time}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* KYC Verification */}
          {!user?.isVerified && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-800">Get Verified</CardTitle>
                <CardDescription className="text-blue-600">
                  Complete your KYC verification to get the blue tick and build trust with clients.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Start Verification
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} userRole="provider" />
    </div>
  )
}
