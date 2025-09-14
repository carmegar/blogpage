# NextJS Blog - Full Stack Blog Platform

A modern, full-featured blog platform built with Next.js 14, featuring user authentication, rich text editing, content management, and image uploads.

## 🚀 Features

### ✅ **Authentication System**

- User registration and login with NextAuth.js
- Google OAuth integration
- Role-based access control (Admin, Writer, User)
- Protected routes and middleware
- Session management with JWT

### ✅ **Blog Management**

- Rich text editor with Tiptap
- Post creation, editing, and deletion
- Draft, Published, and Archived status
- Category and tag system
- Featured images with Cloudinary
- SEO-friendly URLs with auto-generated slugs

### ✅ **Content Organization**

- Categories with custom colors and descriptions
- Tag system for content labeling
- Advanced filtering and pagination
- Author attribution and management

### ✅ **Admin Dashboard**

- Role-based dashboard access
- Post management with status filtering
- Category and tag administration
- User role management
- Image upload and management

### ✅ **Public Blog**

- Responsive blog listing with pagination
- Individual post pages with related posts
- Category filtering and navigation
- Mobile-optimized design
- Social sharing ready

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v4
- **Styling**: Tailwind CSS
- **Rich Text**: Tiptap Editor
- **Image Upload**: Cloudinary
- **Forms**: React Hook Form + Zod validation
- **Code Quality**: ESLint + Prettier + Husky

## 📦 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd 02-nextjs-blog
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

4. **Set up the database**

```bash
npx prisma db push
npx prisma generate
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── blog/              # Public blog pages
│   ├── dashboard/         # Admin dashboard
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── editor/            # Rich text editor
│   └── ui/                # UI components
├── lib/                   # Utilities and configurations
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Database connection
│   └── validations.ts     # Zod schemas
└── types/                 # TypeScript type definitions
```

## 🗄️ Database Schema

- **Users**: Authentication and role management
- **Posts**: Blog content with status and metadata
- **Categories**: Content organization
- **Tags**: Content labeling
- **Accounts/Sessions**: NextAuth.js tables

## 🔒 User Roles

- **ADMIN**: Full access to all features and user management
- **WRITER**: Can create, edit, and manage posts, categories, and tags
- **USER**: Read-only access to published content

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms

- **Railway**: Railway.app
- **DigitalOcean**: App Platform
- **Netlify**: With serverless functions

## 🔄 Development Phases

### ✅ Phase 1: Project Setup

- Next.js 14 with TypeScript
- Tailwind CSS configuration
- ESLint and Prettier setup

### ✅ Phase 2: Authentication System

- NextAuth.js implementation
- User registration and login
- Role-based access control
- Protected routes

### ✅ Phase 3: Blog Core System

- Database schema design
- CRUD operations for posts
- Rich text editor integration
- Category and tag management
- Image upload with Cloudinary
- Admin dashboard

### 🔄 Phase 4: Advanced Features (Planned)

- Search and filtering system
- Comment system
- SEO optimization
- User profiles
- Email notifications
- Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Prisma](https://prisma.io/) for database management
- [Tiptap](https://tiptap.dev/) for the rich text editor
- [Cloudinary](https://cloudinary.com/) for image management
