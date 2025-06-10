"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/providers/auth-provider"
import { useI18n } from "@/components/providers/i18n-provider"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Camera,
  Moon,
  Sun,
  Monitor,
  Globe,
  Star,
  Award,
  MapPin,
  Phone,
  Users,
  Code,
  FileText,
  ExternalLink,
} from "lucide-react"

const countryCodes = [
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+242", country: "Republic of the Congo", flag: "🇨🇬" },
]

const cemacCountries = [
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Republic of the Congo",
  "Equatorial Guinea",
  "Gabon",
]

export function EnhancedProfileSettings() {
  const { user, logout } = useAuth()
  const { t, language, setLanguage } = useI18n()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [phoneCountryCode, setPhoneCountryCode] = useState("+237")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [location, setLocation] = useState({
    quarter: "",
    city: "",
    country: "Cameroon",
  })
  const [notifications, setNotifications] = useState({
    bookings: true,
    messages: true,
    promotions: false,
    reviews: true,
  })

  const handleEditProfile = () => {
    setIsEditing(!isEditing)
  }

  const handleChangeAvatar = () => {
    toast({
      title: "Feature coming soon",
      description: "Avatar upload will be available in the next update.",
    })
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleSaveLocation = () => {
    toast({
      title: "Location updated",
      description: "Your location has been updated successfully.",
    })
  }

  const handleSavePhone = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Phone number updated",
      description: "Your phone number has been updated successfully.",
    })
  }

  const handleChangePassword = () => {
    toast({
      title: "Feature coming soon",
      description: "Password change will be available in the next update.",
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Feature coming soon",
      description: "Account deletion will be available in the next update.",
    })
  }

  const handleHelp = () => {
    toast({
      title: "Help Center",
      description: "Redirecting to help center...",
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("profile.myProfile")}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEditProfile}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? t("common.cancel") : t("profile.editProfile")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t("profile.signOut")}
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={handleChangeAvatar}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </h2>
                {user?.isVerified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge variant={user?.role === "provider" ? "default" : "secondary"}>{t(`auth.${user?.role}`)}</Badge>
                {user?.role === "provider" && user?.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{user.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({user.reviewCount} {t("reviews.reviews")})
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {user?.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("auth.firstName")}</Label>
                  <Input defaultValue={user?.firstName} />
                </div>
                <div className="space-y-2">
                  <Label>{t("auth.lastName")}</Label>
                  <Input defaultValue={user?.lastName} />
                </div>
              </div>
              <Button onClick={handleSaveProfile}>{t("common.save")}</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Quarter/Neighborhood</Label>
              <Input
                placeholder="e.g., Bastos"
                value={location.quarter}
                onChange={(e) => setLocation({ ...location, quarter: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                placeholder="e.g., Yaoundé"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={location.country} onValueChange={(value) => setLocation({ ...location, country: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cemacCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSaveLocation}>Update Location</Button>
        </CardContent>
      </Card>

      {/* Phone Number Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Number
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="6XX XXX XXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your phone number without the country code. Example: 677123456
          </p>
          <Button onClick={handleSavePhone}>Update Phone Number</Button>
        </CardContent>
      </Card>

      {/* Provider Stats */}
      {user?.role === "provider" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Provider Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground">{t("dashboard.completed")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">{t("dashboard.rating")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">47</p>
                <p className="text-sm text-muted-foreground">{t("dashboard.totalClients")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t("profile.settings")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>{t("profile.language")}</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t("profile.english")}</SelectItem>
                <SelectItem value="fr">{t("profile.french")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getThemeIcon()}
              <div>
                <Label>{t("profile.theme")}</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("profile.lightMode")}</SelectItem>
                <SelectItem value="dark">{t("profile.darkMode")}</SelectItem>
                <SelectItem value="system">{t("profile.systemMode")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Notifications */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>{t("profile.notifications")}</Label>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4 ml-8">
              <div className="flex items-center justify-between">
                <Label htmlFor="bookings-notifications">Booking updates</Label>
                <Switch
                  id="bookings-notifications"
                  checked={notifications.bookings}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, bookings: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="messages-notifications">New messages</Label>
                <Switch
                  id="messages-notifications"
                  checked={notifications.messages}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="promotions-notifications">Promotions</Label>
                <Switch
                  id="promotions-notifications"
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reviews-notifications">Reviews</Label>
                <Switch
                  id="reviews-notifications"
                  checked={notifications.reviews}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, reviews: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("profile.security")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleChangePassword} className="w-full justify-start">
            {t("profile.changePassword")}
          </Button>

          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            {t("profile.deleteAccount")}
          </Button>
        </CardContent>
      </Card>

      {/* Professional Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            About & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleHelp} className="w-full justify-start">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                About Houseman
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Houseman</DialogTitle>
                <DialogDescription>Connecting service providers with clients across Central Africa</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm">
                  Houseman is the leading platform for connecting trusted service providers with clients across the
                  CEMAC region. We're committed to building a safe, reliable, and efficient marketplace for all your
                  service needs.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Version: 2.1.0</p>
                  <p className="text-sm font-medium">Last Updated: January 2024</p>
                  <p className="text-sm font-medium">Support: support@houseman.cm</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Frequently Asked Questions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <h4 className="font-medium mb-2">How do I get verified?</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete your KYC verification by uploading required documents. The process usually takes 24-48
                    hours.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">How do payments work?</h4>
                  <p className="text-sm text-muted-foreground">
                    Payments are processed securely through our platform. Providers receive payment after service
                    completion.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What if I have issues with a service?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can report issues through the chat or contact our support team. We're here to help resolve any
                    problems.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">How do I change my location?</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your location in the profile settings. This helps us show you relevant services in your area.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Code className="h-4 w-4 mr-2" />
                Developers
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Developer Information</DialogTitle>
                <DialogDescription>Built with modern technologies for the CEMAC region</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Technology Stack</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Frontend: Next.js 14, React, TypeScript</p>
                    <p>• UI: Tailwind CSS, shadcn/ui</p>
                    <p>• Backend: Node.js, PostgreSQL</p>
                    <p>• Mobile: Progressive Web App (PWA)</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">API Documentation</h4>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View API Docs
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact Development Team</h4>
                  <p className="text-sm text-muted-foreground">dev@houseman.cm</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
