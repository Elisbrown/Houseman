import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import config from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size
    if (file.size > config.storage.maxFileSize) {
      return NextResponse.json(
        { error: `File size exceeds the maximum allowed size (${config.storage.maxFileSize / 1024 / 1024}MB)` },
        { status: 400 },
      )
    }

    // Validate file type
    if (!config.storage.allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed types: ${config.storage.allowedFileTypes.join(", ")}` },
        { status: 400 },
      )
    }

    // Generate a unique filename with timestamp and random string
    const timestamp = new Date().getTime()
    const randomString = Math.random().toString(36).substring(2, 10)
    const fileName = `${folder}/${timestamp}-${randomString}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      success: true,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "An error occurred during upload" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
