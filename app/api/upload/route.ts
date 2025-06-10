import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")
    const type = searchParams.get("type") || "general"

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 })
    }

    if (!request.body) {
      return NextResponse.json({ error: "No file data provided" }, { status: 400 })
    }

    // Generate a unique filename with timestamp
    const timestamp = Date.now()
    const uniqueFilename = `${type}/${timestamp}-${filename}`

    const blob = await put(uniqueFilename, request.body, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      filename: uniqueFilename,
      size: blob.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
