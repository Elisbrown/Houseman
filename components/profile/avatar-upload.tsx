"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useToast } from "@/hooks/use-toast"
import { Camera } from "lucide-react"

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onAvatarUpdate: (url: string) => void
}

export function AvatarUpload({ currentAvatar, userName, onAvatarUpdate }: AvatarUploadProps) {
  const { uploadFile, isUploading } = useFileUpload()
  const { toast } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/jpeg,image/jpg,image/png"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Show preview immediately
        const preview = URL.createObjectURL(file)
        setPreviewUrl(preview)

        // Upload file
        const result = await uploadFile(file, {
          type: "avatars",
          allowedTypes: ["image/jpeg", "image/jpg", "image/png"],
          maxSize: 2 * 1024 * 1024, // 2MB
        })

        if (result) {
          onAvatarUpdate(result.url)
          setPreviewUrl(null)
          URL.revokeObjectURL(preview)
        } else {
          // Reset preview on error
          setPreviewUrl(null)
          URL.revokeObjectURL(preview)
        }
      }
    }
    input.click()
  }

  const displayAvatar = previewUrl || currentAvatar

  return (
    <div className="relative">
      <Avatar className="h-20 w-20">
        <AvatarImage src={displayAvatar || "/placeholder.svg"} />
        <AvatarFallback className="text-lg">
          {userName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <Button
        size="sm"
        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
        onClick={handleFileSelect}
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
