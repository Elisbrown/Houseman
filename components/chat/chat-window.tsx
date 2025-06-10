"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/providers/i18n-provider"
import { ArrowLeft, Send, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react"

interface ChatWindowProps {
  chat: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    service: string
  }
  onBack: () => void
  userRole: "client" | "provider"
}

interface Message {
  id: string
  text: string
  timestamp: string
  isOwn: boolean
  isRead: boolean
  isDelivered: boolean
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hello! I'm interested in your home cleaning service.",
    timestamp: "10:30 AM",
    isOwn: true,
    isRead: true,
    isDelivered: true,
  },
  {
    id: "2",
    text: "Hi! Thank you for your interest. I'd be happy to help you with home cleaning.",
    timestamp: "10:32 AM",
    isOwn: false,
    isRead: false,
    isDelivered: true,
  },
  {
    id: "3",
    text: "What's your availability for this weekend?",
    timestamp: "10:33 AM",
    isOwn: true,
    isRead: true,
    isDelivered: true,
  },
  {
    id: "4",
    text: "I'm available on Saturday morning. Would 10 AM work for you?",
    timestamp: "10:35 AM",
    isOwn: false,
    isRead: false,
    isDelivered: true,
  },
  {
    id: "5",
    text: "Perfect! I'll be there at 10 AM tomorrow. See you then!",
    timestamp: "10:36 AM",
    isOwn: false,
    isRead: false,
    isDelivered: true,
  },
]

export function ChatWindow({ chat, onBack, userRole }: ChatWindowProps) {
  const { t } = useI18n()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        isRead: false,
        isDelivered: true,
      }

      setMessages([...messages, message])
      setNewMessage("")

      // Simulate typing indicator and response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        // Could add auto-response here
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCall = () => {
    console.log("Call clicked")
    // Implement call functionality
  }

  const handleVideoCall = () => {
    console.log("Video call clicked")
    // Implement video call functionality
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return t("chat.today")
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t("chat.yesterday")
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {chat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {chat.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{chat.name}</h3>
          <p className="text-xs text-muted-foreground">
            {chat.isOnline ? t("chat.online") : `${t("chat.lastSeen")} 2 hours ago`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCall}>
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleVideoCall}>
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Service Context */}
      <div className="p-3 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {chat.service}
          </Badge>
          <span className="text-xs text-muted-foreground">Booking discussion</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Header */}
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            {formatDate(new Date())}
          </Badge>
        </div>

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <span className={`text-xs ${message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {message.timestamp}
                </span>
                {message.isOwn && (
                  <div className="text-primary-foreground/70">
                    {message.isRead ? (
                      <CheckCheck className="h-3 w-3 text-blue-400" />
                    ) : message.isDelivered ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">{t("chat.typing")}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder={t("chat.typeMessage")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 rounded-full"
            />
          </div>
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full w-10 h-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
