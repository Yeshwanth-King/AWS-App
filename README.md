# Photo Blog App

A modern, full-stack photo blog application built with Next.js 15, TypeScript, Prisma, Supabase, and AWS S3. This application allows users to upload photos with captions, view them in a beautiful grid layout, and manage their photo collections.

## 🚀 Features

- **Photo Upload & Management**: Upload photos with drag-and-drop functionality
- **Cloud Storage**: Secure photo storage using AWS S3 and CloudFront CDN
- **Database**: PostgreSQL database hosted on Supabase with Prisma ORM
- **Modern UI**: Responsive design with Tailwind CSS and dark mode support
- **Real-time Updates**: Dynamic photo grid with loading states
- **Type Safety**: Full TypeScript support throughout the application
- **Performance**: Optimized image loading and caching

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Sonner** - Beautiful toast notifications

### Backend & Database
- **Prisma** - Next-generation ORM
- **Supabase** - PostgreSQL database hosting
- **Next.js API Routes** - Serverless API endpoints

### Cloud Services
- **AWS S3** - Photo storage
- **AWS CloudFront** - CDN for fast image delivery
- **Supabase** - Database hosting and authentication ready

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TSX** - TypeScript execution for scripts

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
   
   # NextAuth (Optional)
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
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

## 🗄️ Database Schema

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
│   │   └── photos/
│   │       └── route.ts          # Photo upload/fetch API
│   ├── components/
│   │   ├── LoadingSpinner.tsx    # Loading component
│   │   ├── PhotoGrid.tsx         # Photo display grid
│   │   └── PhotoUpload.tsx       # Upload form component
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client setup
│   │   └── s3.ts                # AWS S3 client setup
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
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

### PhotoUpload
- Drag-and-drop file upload
- Image preview functionality
- Form validation and error handling
- Loading states with progress indicators

### PhotoGrid
- Responsive grid layout
- Lazy loading for performance
- Image optimization with Next.js Image component
- Hover effects and interactions

### LoadingSpinner
- Reusable loading component
- Smooth animations
- Consistent styling

## 🔒 Security Features

- **Signed URLs**: CloudFront signed URLs for secure image access
- **File Validation**: Server-side file type and size validation
- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Dark mode support
- Touch-friendly interface

## 🚀 Deployment

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

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

---

Built with ❤️ using modern web technologies
