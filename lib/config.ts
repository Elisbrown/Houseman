/**
 * Application configuration from environment variables
 * This centralizes all environment variable access and provides defaults
 */

// Database Configuration
export const database = {
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // PostgreSQL Direct Connection
  postgresHost: process.env.POSTGRES_HOST || "localhost",
  postgresPort: Number.parseInt(process.env.POSTGRES_PORT || "5432"),
  postgresUser: process.env.POSTGRES_USER || "postgres",
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDatabase: process.env.POSTGRES_DATABASE || "houseman",
  postgresUrl: process.env.POSTGRES_URL,
  postgresUrlNonPooling: process.env.POSTGRES_URL_NON_POOLING,
  postgresPrismaUrl: process.env.POSTGRES_PRISMA_URL,
}

// Authentication & Security
export const auth = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  sessionSecret: process.env.SESSION_SECRET,
  sessionExpiry: process.env.SESSION_EXPIRY || "7d",

  // Social Authentication
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
  },
}

// Storage & Media
export const storage = {
  blobToken: process.env.BLOB_READ_WRITE_TOKEN,
  maxFileSize: Number.parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB default
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(",") || [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ],
}

// Third-Party Services
export const services = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  sms: {
    apiKey: process.env.SMS_API_KEY,
    senderId: process.env.SMS_SENDER_ID || "HOUSEMAN",
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || "Houseman <no-reply@houseman.cm>",
  },
  pushNotifications: {
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
  },
}

// Application Settings
export const app = {
  nodeEnv: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",

  // Localization
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en",
  supportedLocales: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES?.split(",") || ["en", "fr"],

  // Feature Flags
  features: {
    enableSocialLogin: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === "true",
    enablePushNotifications: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === "true",
    enableGoogleMaps: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAPS === "true",
    enableChat: process.env.NEXT_PUBLIC_ENABLE_CHAT === "true",
  },

  // Rate Limiting
  rateLimit: {
    max: Number.parseInt(process.env.RATE_LIMIT_MAX || "100"),
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"), // 1 minute default
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
}

// Validate required environment variables
export function validateConfig() {
  const requiredVars = [
    { value: database.supabaseUrl, name: "NEXT_PUBLIC_SUPABASE_URL" },
    { value: database.supabaseAnonKey, name: "NEXT_PUBLIC_SUPABASE_ANON_KEY" },
    { value: storage.blobToken, name: "BLOB_READ_WRITE_TOKEN" },
  ]

  const missingVars = requiredVars.filter((v) => !v.value)

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.map((v) => v.name).join(", ")}`)
  }

  return true
}

// Export default config object
const config = {
  database,
  auth,
  storage,
  services,
  app,
  validateConfig,
}

export default config
