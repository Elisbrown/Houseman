"use client"

import { useState } from "react"
import { put } from "@vercel/blob"
import config from "@/lib/config"

interface UploadOptions {
  folder?: string
  maxSizeMB?: number
  allowedTypes?: string[]
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File, options: UploadOptions = {}) => {
    try {
      setIsUploading(true)
      setProgress(0)
      setError(null)

      // Validate file size
      const maxSize = options.maxSizeMB ? options.maxSizeMB * 1024 * 1024 : config.storage.maxFileSize

      if (file.size > maxSize) {
        throw new Error(`File size exceeds the maximum allowed size (${options.maxSizeMB || 5}MB)`)
      }

      // Validate file type
      const allowedTypes = options.allowedTypes || config.storage.allowedFileTypes
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(", ")}`)
      }

      // Create folder path if provided
      const folderPath = options.folder ? `${options.folder}/` : ""

      // Generate a unique filename with timestamp and random string
      const timestamp = new Date().getTime()
      const randomString = Math.random().toString(36).substring(2, 10)
      const fileName = `${folderPath}${timestamp}-${randomString}-${file.name}`

      // Upload to Vercel Blob
      const response = await put(fileName, file, {
        access: "public",
        handleUploadProgress: (progress) => {
          setProgress(Math.round(progress))
        },
      })

      setProgress(100)
      return response.url
    } catch (err: any) {
      setError(err.message || "An error occurred during upload")
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadFile,
    isUploading,
    progress,
    error,
  }
}
