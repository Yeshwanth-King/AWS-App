# PhotoBlog - Modern Social Photo Sharing App

A production-ready, full-stack photo blog application built with Next.js 15, featuring user authentication, social interactions, and cloud storage. Share your moments with the world through a beautiful, responsive interface.

## ✨ Features

### 🔐 **Authentication & User Management**
- **Custom JWT Authentication** - Secure, token-based authentication system
- **User Registration & Login** - Email/password authentication with validation
- **Session Management** - HTTP-only cookies for security
- **Protected Routes** - Authentication-required features

### 📸 **Media Upload & Management**
- **Multi-format Support** - Images (JPEG, PNG, GIF, WebP) and Videos (MP4, WebM, OGG, AVI, MOV)
- **File Size Limits** - Images max 1MB, Videos max 5MB
- **Upload Restrictions** - Maximum 5 uploads per user account
- **Drag & Drop** - Modern file upload interface with preview
- **Cloud Storage** - AWS S3 with CloudFront CDN for global delivery

### 🤝 **Social Features**
- **Like System** - Like/unlike posts with real-time counts
- **Comments** - Add, view, and delete comments on posts
- **User Profiles** - Author information and avatars
- **Ownership Controls** - Users can only delete their own content

### 🎨 **User Experience**
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode** - Automatic theme switching
- **Loading States** - Smooth loading indicators and transitions
- **Error Handling** - User-friendly error messages and validation
- **Real-time Updates** - Dynamic content without page refreshes

### 🚀 **Performance & Security**
- **CDN Integration** - Fast global content delivery via CloudFront
- **Image Optimization** - Next.js automatic image optimization
- **Type Safety** - Full TypeScript support throughout
- **Input Validation** - Both client and server-side validation
- **Secure File Handling** - Proper file type and size validation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Server Components
- **React 19** - Latest React features and concurrent rendering
- **TypeScript** - Full type safety and IntelliSense
- **Tailwind CSS v4** - Utility-first CSS with modern features
- **Custom Auth Context** - React Context for authentication state
- **Sonner** - Beautiful toast notifications

### Backend & Database
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database via Supabase
- **Next.js API Routes** - Serverless backend endpoints
- **JWT Tokens** - Secure authentication with `jose` library
- **bcryptjs** - Password hashing and security
- **cookies-next** - Secure cookie handling

### Cloud Infrastructure
- **AWS S3** - Scalable object storage for media files
- **AWS CloudFront** - Global CDN with signed URLs
- **Supabase** - Managed PostgreSQL database hosting

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - Advanced CSS processing
- **TSX** - TypeScript execution for build scripts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env` and fill in your actual values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   # Database (Supabase)
   DATABASE_URL="your-supabase-connection-string-with-pooling"
   DIRECT_URL="your-supabase-direct-connection-string"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   
   # AWS S3
   S3_ACCESS_KEY="your-s3-access-key"
   S3_SECRET_KEY="your-s3-secret-key"
   S3_BUCKET_NAME="your-s3-bucket-name"
   
   # AWS CloudFront
   CLOUDFRONT_DOMAIN="your-cloudfront-domain"
   CLOUDFRONT_PUBLIC_KEY="your-cloudfront-public-key-id"
   CLOUDFRONT_PRIVATE_KEY="your-cloudfront-private-key"
   
   # JWT Authentication
   JWT_SECRET="your-jwt-secret-key-min-32-chars"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## � Authentication System

The application uses a custom JWT-based authentication system built from scratch, replacing NextAuth for better control and customization.

### Key Features
- **JWT Tokens** - Secure authentication using JSON Web Tokens
- **HTTP-Only Cookies** - Tokens stored in secure, HTTP-only cookies
- **Password Security** - bcryptjs for hashing and salt generation
- **Session Management** - Automatic token refresh and validation
- **Protected Routes** - Server and client-side route protection

### Authentication Flow
1. **Registration** - Users create accounts with email/password
2. **Login** - JWT token issued on successful authentication
3. **Session** - Token stored in HTTP-only cookie for security
4. **Authorization** - Protected API routes validate tokens
5. **Logout** - Token invalidated and cookie cleared

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User sign-in
- `POST /api/auth/signout` - User sign-out
- `GET /api/auth/me` - Get current user info

### Client Components
- `AuthProvider` - React Context Provider for auth state
- `useAuth` - Custom hook for authentication actions
- Protected pages automatically redirect unauthenticated users

## �🗄️ Database Schema

The application uses a simplified blog schema with the following models:

### User
- User profiles and authentication
- Relationships with posts, comments, and likes

### Post
- Blog posts (used for photo storage in this implementation)
- Contains title, content (S3 key), slug, and metadata
- Relationships with users, comments, and likes

### Comment
- Comments on posts
- User attribution and timestamps

### Like
- Post likes system
- Unique constraint per user/post

## 📁 Project Structure

```
blog-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── route.ts      # User sign-in API
│   │   │   ├── register/
│   │   │   │   └── route.ts      # User registration API
│   │   │   ├── signout/
│   │   │   │   └── route.ts      # User sign-out API
│   │   │   └── me/
│   │   │       └── route.ts      # Current user info API
│   │   ├── photos/
│   │   │   └── route.ts          # Photo upload/fetch API
│   │   ├── comments/
│   │   │   └── route.ts          # Comments API
│   │   └── likes/
│   │       └── route.ts          # Likes API
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx          # Sign-in page
│   │   └── signup/
│   │       └── page.tsx          # Registration page
│   ├── components/
│   │   ├── AuthProvider.tsx      # Authentication context provider
│   │   ├── Comments.tsx          # Comments component
│   │   ├── Header.tsx            # Navigation header
│   │   ├── LikeButton.tsx        # Like/unlike button
│   │   ├── LoadingSpinner.tsx    # Loading component
│   │   ├── PhotoGrid.tsx         # Photo display grid
│   │   └── PhotoUpload.tsx       # Upload form component
│   ├── lib/
│   │   ├── auth.ts              # JWT authentication library
│   │   ├── AuthContext.tsx      # React authentication context
│   │   ├── prisma.ts            # Prisma client setup
│   │   └── s3.ts                # AWS S3 client setup
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── AUTH_MIGRATION_SUMMARY.md    # Authentication migration docs
├── COMPONENTS_FIXED.md          # Component update documentation
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with automatic fixing
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🔧 Configuration

### AWS S3 Setup
1. Create an S3 bucket
2. Set up IAM user with S3 permissions
3. Configure CORS for your bucket
4. Set up CloudFront distribution (optional but recommended)

### Supabase Setup
1. Create a new Supabase project
2. Get your database connection strings
3. Copy the API keys from your project settings

### Next.js Configuration
The `next.config.ts` file includes:
- Image domains for S3 and CloudFront
- Remote pattern configurations for secure image loading

## 🎨 UI Components

### Authentication Components
- **AuthProvider**: React Context provider for authentication state
- **Header**: Navigation with user menu and auth status
- **Sign-in/Sign-up Pages**: Custom authentication forms with validation

### Social Features
- **LikeButton**: Toggle likes with real-time count updates
- **Comments**: Add, view, and delete comments with user attribution
- **User Profiles**: Display user information and avatars

### Photo Management
- **PhotoUpload**: Drag-and-drop file upload with preview and validation
- **PhotoGrid**: Responsive grid layout with lazy loading and optimization
- **LoadingSpinner**: Reusable loading component with smooth animations

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication system
- **HTTP-Only Cookies**: Tokens stored securely to prevent XSS attacks
- **Password Hashing**: bcryptjs with salt for secure password storage
- **Route Protection**: Server-side and client-side authentication checks
- **Signed URLs**: CloudFront signed URLs for secure image access
- **File Validation**: Server-side file type and size validation
- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Both client and server-side data validation

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Dark mode support
- Touch-friendly interface

## � Migration from NextAuth

This project has been migrated from NextAuth to a custom JWT authentication system. Key changes include:

### Removed Dependencies
- `next-auth` - Replaced with custom JWT system
- `@auth/prisma-adapter` - No longer needed

### New Dependencies
- `jose` - JWT creation and verification
- `cookies-next` - Cookie handling utilities
- `bcryptjs` - Password hashing

### Database Changes
- Removed NextAuth tables (Account, Session, VerificationToken)
- Simplified User model for custom authentication
- Maintained existing Post, Comment, and Like relationships

### Code Changes
- Replaced `useSession` with `useAuth` hook
- Updated all API routes to use custom authentication
- New authentication pages and components
- Custom JWT token management

For detailed migration information, see `AUTH_MIGRATION_SUMMARY.md`.

## �🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Supabase](https://supabase.com/) - Database hosting
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [AWS](https://aws.amazon.com/) - Cloud services
