# Photo Blog App - Complete Setup Guide

This guide will help you set up and run the Photo Blog application with all its features including authentication, file uploads, comments, and likes.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- An AWS account with S3 and CloudFront access
- Git installed

## Step 1: Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd blog-app
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > Database and copy your connection strings
3. Go to Settings > API and copy your project URL and anon key

## Step 3: Set Up AWS S3 and CloudFront

### S3 Setup:
1. Create an S3 bucket in your preferred region
2. Configure bucket permissions for CloudFront access
3. Create an IAM user with S3 permissions

### CloudFront Setup:
1. Create a CloudFront distribution pointing to your S3 bucket
2. Generate a key pair for signed URLs
3. Configure the distribution settings

## Step 4: Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database - From Supabase Dashboard > Settings > Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase - From Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth - Generate a secure secret
NEXTAUTH_SECRET="your-secure-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3 - From your AWS IAM user
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="your-aws-region"
S3_BUCKET_NAME="your-bucket-name"

# AWS CloudFront - From your CloudFront distribution
CLOUDFRONT_DOMAIN="https://your-cloudfront-domain"
CLOUDFRONT_PUBLIC_KEY="your-public-key-id"
CLOUDFRONT_PRIVATE_KEY="your-private-key"
```

## Step 5: Database Setup

Run Prisma migrations to set up your database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Run database migrations in production
npm run db:migrate
```

## Step 6: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features Available

### Authentication
- User registration and login
- Session management with NextAuth
- Protected routes and API endpoints

### File Upload
- Image uploads (JPEG, PNG, GIF, WebP) - max 1MB
- Video uploads (MP4, WebM, OGG, AVI, MOV) - max 5MB
- Maximum 5 files per user
- Files stored in AWS S3 with CloudFront CDN

### Social Features
- Like/unlike posts
- Add/delete comments
- View author information
- Real-time like and comment counts

### UI Features
- Responsive design with Tailwind CSS
- Dark mode support
- Image/video preview modals
- File drag-and-drop upload
- Loading states and error handling

## File Structure

```
app/
├── api/                    # API routes
│   ├── auth/              # Authentication endpoints
│   ├── comments/          # Comments API
│   ├── likes/             # Likes API
│   └── photos/            # Photo upload/fetch API
├── auth/                  # Authentication pages
├── components/            # Reusable components
├── lib/                   # Utility libraries
└── types/                 # TypeScript type definitions

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migrations
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/photos` - Fetch all photos
- `POST /api/photos` - Upload new photo
- `GET /api/comments` - Fetch comments for a post
- `POST /api/comments` - Add new comment
- `DELETE /api/comments` - Delete comment
- `GET /api/likes` - Get likes for a post
- `POST /api/likes` - Toggle like/unlike

## Troubleshooting

### Common Issues:

1. **Database Connection Issues**
   - Verify your DATABASE_URL and DIRECT_URL are correct
   - Check if your Supabase project is running

2. **File Upload Issues**
   - Verify AWS credentials and S3 bucket permissions
   - Check CloudFront distribution settings

3. **Authentication Issues**
   - Ensure NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain

4. **Build Issues**
   - Run `npm run db:generate` after schema changes
   - Clear `.next` folder and rebuild if needed

### Getting Help

- Check the browser console for client-side errors
- Check the terminal/server logs for API errors
- Ensure all environment variables are properly set
- Verify database schema matches your Prisma schema

## Production Deployment

1. Set up your production environment variables
2. Run database migrations: `npm run db:migrate`
3. Build the application: `npm run build`
4. Deploy to your preferred platform (Vercel, Railway, AWS, etc.)

Make sure to:
- Set all environment variables in your deployment platform
- Configure your database for production use
- Set up proper CORS policies for your S3 bucket
- Configure CloudFront for your production domain
