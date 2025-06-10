# Houseman - Service Provider Platform

A comprehensive service provider platform connecting clients with trusted service providers across Central Africa, built with Next.js 14, Supabase, and Vercel Blob storage.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login/registration with role-based access (Client, Provider, Admin)
- **Service Marketplace**: Browse and search services with advanced filtering
- **Real-time Chat**: Fully functional messaging system with image sharing
- **Booking System**: Complete booking workflow from request to completion
- **KYC Verification**: Document upload and verification system for providers
- **Multi-language Support**: English and French with Google Translate integration
- **Responsive Design**: Mobile-first PWA with smooth animations

### User Roles

#### Clients
- Browse and search services
- Book services from verified providers
- Chat with service providers
- Rate and review completed services
- Manage bookings and profile

#### Service Providers
- Create and manage service listings
- Receive and manage booking requests
- Chat with clients
- Upload KYC documents for verification
- Track earnings and statistics

#### Administrators
- Manage users and services
- Review and approve KYC documents
- Handle reports and disputes
- Monitor platform analytics
- Manage service categories

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Vercel Blob
- **Authentication**: Custom auth with bcrypt
- **Deployment**: Vercel
- **PWA**: Service Worker, Web App Manifest

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd houseman-app
npm install
\`\`\`

### 2. Environment Variables
Create a \`.env.local\` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Optional: Social Login (if implementing)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
\`\`\`

### 3. Database Setup

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run the SQL scripts from \`scripts/\` folder in order:
   - \`01-create-tables.sql\`
   - \`02-seed-data.sql\`
   - \`03-create-functions.sql\`

#### Option B: Using the Project Scripts
The project includes executable SQL scripts that you can run directly:
1. Navigate to the scripts folder in the project
2. Execute each script in order through the Supabase SQL editor

### 4. Vercel Blob Setup
1. Install Vercel CLI: \`npm i -g vercel\`
2. Link your project: \`vercel link\`
3. Add Blob storage integration in Vercel dashboard
4. Copy the \`BLOB_READ_WRITE_TOKEN\` to your environment variables

### 5. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see the application.

## 🗄 Database Schema

### Core Tables
- **users**: User accounts and basic information
- **user_profiles**: Extended user profile data
- **service_categories**: Service category definitions
- **services**: Service listings (only visible if provider has profile picture)
- **bookings**: Service booking requests and status
- **conversations**: Chat conversations between users
- **messages**: Individual chat messages
- **kyc_verifications**: KYC document submissions and status
- **reviews**: Service reviews and ratings
- **reports**: User and service reports

### Key Features
- Automatic timestamp updates
- Service rating calculations
- Conversation last message tracking
- Profile picture requirement for service visibility

## 👥 Demo Accounts

### Test Credentials
\`\`\`
Admin:
Email: admin@houseman.cm
Password: HousemanAdmin2024!

Client:
Email: jean@houseman.cm  
Password: ClientDemo123!

Provider:
Email: marie@houseman.cm
Password: ProviderDemo123!
\`\`\`

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Modern, accessible color palette
- **Typography**: Inter font family for readability
- **Components**: Consistent shadcn/ui component library
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design with tablet and desktop support

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators

## 📱 PWA Features

- **Offline Support**: Basic offline functionality
- **App Installation**: Install as native app
- **Push Notifications**: Real-time notifications (when implemented)
- **Background Sync**: Sync data when connection restored

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Type and size validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Built-in Next.js protection

## 🌍 Internationalization

### Supported Languages
- English (en)
- French (fr)

### Google Translate Integration
- Automatic language detection
- Real-time translation for dynamic content
- Persistent language preferences

## 📊 Platform Guidelines

### For Service Providers
- Must upload profile picture before services are visible
- Complete KYC verification for blue tick
- Maintain professional communication
- Provide accurate service descriptions
- Honor booking commitments

### For Clients
- Provide clear service requirements
- Communicate respectfully
- Pay agreed amounts promptly
- Leave honest reviews
- Report any issues

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm run start
\`\`\`

### Environment Setup
Ensure all environment variables are properly configured in your deployment environment.

## 🔧 Development

### Project Structure
\`\`\`
houseman-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── chat/             # Chat components
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── scripts/              # Database scripts
└── public/               # Static assets
\`\`\`

### Key Commands
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Email: dev@houseman.cm
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- shadcn/ui for the component library
- Supabase for the backend infrastructure
- Vercel for hosting and blob storage
- The Next.js team for the framework
- All contributors and testers

---

**Built with ❤️ for Central Africa**
\`\`\`

This README provides comprehensive documentation for the Houseman platform, including setup instructions, feature descriptions, and deployment guidelines. The platform is now fully integrated with Supabase for data management and Vercel Blob for file storage, with all features working with real data from the database.
