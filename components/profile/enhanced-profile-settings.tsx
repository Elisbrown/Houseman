"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AvatarUpload } from "./avatar-upload"
import { useAuth } from "@/components/providers/auth-provider"
import { useI18n } from "@/components/providers/i18n-provider"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { updateUserAvatar } from "@/lib/auth"
import { Settings, Bell, LogOut, Edit, Moon, Sun, Monitor, Globe } from "lucide-react"

export function EnhancedProfileSettings() {
  const { user, logout } = useAuth()
  const { t, language, setLanguage } = useI18n()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState({
    bookings: true,
    messages: true,
    promotions: false,
    reviews: true,
  })

  const handleEditProfile = () => {
    setIsEditing(!isEditing)
  }

  const handleAvatarUpdate = async (url: string) => {
    if (user) {
      const success = await updateUserAvatar(user.id, url)
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile picture has been updated successfully.",
        })
        // Update user in auth context
        window.location.reload()
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update profile picture. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
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

  if (!user) return null

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
            <AvatarUpload
              currentAvatar={user.avatar}
              userName={`${user.firstName} ${user.lastName}`}
              onAvatarUpdate={handleAvatarUpdate}
            />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                {user.isVerified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge variant={user.role === "provider" ? "default" : "secondary"}>{t(`auth.${user.role}`)}</Badge>
              </div>

              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("auth.firstName")}</Label>
                  <Input defaultValue={user.firstName} />
                </div>
                <div className="space-y-2">
                  <Label>{t("auth.lastName")}</Label>
                  <Input defaultValue={user.lastName} />
                </div>
              </div>
              <Button onClick={handleSaveProfile}>{t("common.save")}</Button>
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  )
}
