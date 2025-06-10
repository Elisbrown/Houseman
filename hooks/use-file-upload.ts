"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface UploadOptions {
  type?: string
  maxSize?: number
  allowedTypes?: string[]
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadFile = async (file: File, options: UploadOptions = {}) => {
    const {
      type = "general",
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"],
    } = options

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please select a file of type: ${allowedTypes.join(", ")}`,
        variant: "destructive",
      })
      return null
    }

    // Validate file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please select a file smaller than ${Math.round(maxSize / (1024 * 1024))}MB`,
        variant: "destructive",
      })
      return null
    }

    setIsUploading(true)

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&type=${type}`, {
        method: "POST",
        body: file,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
      })

      return result
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadFile, isUploading }
}
