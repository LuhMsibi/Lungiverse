# Lungiverse

## Overview

Lungiverse is a centralized platform for discovering, comparing, and utilizing AI tools and conversion utilities. The application provides a comprehensive directory of 250+ AI tools across multiple categories (Conversion, Image AI, Text AI, Video AI, Audio AI, Code AI) with intelligent search capabilities, article content for user education, and an AI-powered chatbot assistant for tool recommendations.

The platform is built as a full-stack web application with a React frontend and Express backend, designed to help users navigate the AI tools landscape with curated content, expert insights, and guided discovery. The brand name "Lungiverse" derives from the founder's name, Lungisani, combined with "universe" to represent a comprehensive universe of AI tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## Production Database Seeding

**IMPORTANT:** Replit has TWO separate databases:
1. **Development Database** - Used during development in the workspace
2. **Production Database** - Powers the published site at lungiverse.com

**How to Populate Production Database:**

The production database does NOT automatically copy data from development. To add the 26 AI tools and 5 articles to your published site:

### Method 1: Admin Seeding Page (Easiest!)
1. Publish your site to lungiverse.com
2. Log in with your Replit account
3. Promote yourself to admin by running this SQL in the database pane:
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
   ```
4. Visit: `https://lungiverse.com/admin/seed`
5. Click "Seed Production Database" button
6. Wait 5-10 seconds - done!

### Method 2: Manual Entry via Database Pane
1. Open Database pane in Replit
2. Toggle to "Production Database"
3. Go to "My data" tab
4. Click "Edit" to enable editing
5. Manually insert 26 tools and 5 articles (tedious!)

### What Gets Seeded:
- **26 AI Tools** across 6 categories:
  - 3 Conversion tools (CloudConvert, PDF.co, Zamzar)
  - 5 Image AI tools (DALL-E 3, Midjourney, Stable Diffusion, Remove.bg, Canva AI)
  - 5 Text AI tools (ChatGPT, Jasper AI, Copy.ai, Grammarly, QuillBot)
  - 4 Video AI tools (Runway ML, Synthesia, Descript, Pictory)
  - 4 Audio AI tools (ElevenLabs, Murf AI, Adobe Podcast, Krisp)
  - 5 Code AI tools (GitHub Copilot, Tabnine, Cursor, Replit AI, CodeWhisperer)
  
- **5 SEO-Optimized Articles:**
  - "How AI is Transforming Business Workflows in 2025"
  - "The Complete Guide to Choosing the Right AI Tools"
  - "Understanding File Conversion Tools: From PDF to Everything"
  - "Boosting Productivity with AI: Real-World Success Stories"
  - "The Future of AI Tools: Trends to Watch in 2025"

### Technical Implementation:
- **Admin Endpoint:** `POST /api/admin/seed` (protected by `isAdmin` middleware)
- **Seeding Module:** `server/seedData.ts` contains all data
- **Idempotent:** Safe to run multiple times (uses `onConflictDoNothing()`)
- **Frontend Page:** `client/src/pages/AdminSeedPage.tsx` provides UI

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and dev server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design system

**Design System:**
- Custom theme extending Shadcn's "new-york" style with neutral base colors
- Typography: Inter (primary) and Space Grotesk (accent) from Google Fonts
- Design inspired by Linear, Stripe, ProductHunt, and Notion aesthetics
- Comprehensive spacing system using Tailwind's scale
- CSS custom properties for theming with light/dark mode support

**State Management:**
- Server state: TanStack Query with infinite stale time (data treated as static)
- No complex client state - relies on URL parameters for filtering/search
- Query client configured to never refetch on window focus or intervals

**Key Features:**
- Homepage with hero section, featured tools, and articles
- Tools directory with search, category filtering, and free/paid filtering
- Articles section with featured article layout
- Individual article detail pages
- About page
- AI chatbot widget (floating button with modal interface)

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js
- TypeScript with ESM modules
- PostgreSQL database with Drizzle ORM
- Neon Serverless PostgreSQL driver
- OpenAI integration via Replit AI Integrations service

**API Design:**
- RESTful endpoints under `/api` prefix
- JSON request/response format
- Routes for tools listing, search, and articles
- Chat endpoint for AI assistant functionality

**Key Endpoints:**
- `GET /api/tools` - Retrieve all AI tools from database
- `GET /api/tools/search?q=query` - Search tools by query string
- `GET /api/articles` - Retrieve all articles from database
- `GET /api/articles/:slug` - Get article by slug
- `POST /api/chat` - AI chatbot conversation endpoint

**Data Storage Strategy:**
- PostgreSQL database with Drizzle ORM for type-safe database operations
- `DBStorage` class in `server/dbStorage.ts` implements all data access methods
- Database seeded with 26 AI tools and 5 SEO-optimized articles
- Transformation layer converts DB records to frontend-expected format
- Image assets referenced via paths to `attached_assets` directory

**Server Configuration:**
- Custom Vite middleware integration for development
- Request logging for API endpoints with response capture
- Express middleware for JSON parsing with raw body preservation
- Static file serving for production builds

### Data Models

**AI Tool Schema:**
```typescript
{
  id: string
  name: string
  description: string
  category: "Conversion" | "Image AI" | "Text AI" | "Video AI" | "Audio AI" | "Code AI"
  features: string[]
  isPaid: boolean
  requiresAPI: boolean
  url?: string
  usageCount?: number
}
```

**Article Schema:**
```typescript
{
  id: string
  title: string
  slug: string
  excerpt: string
  content: string (markdown/HTML)
  coverImage: string (path)
  category: string
  author: { name: string, avatar?: string }
  publishedAt: string (ISO date)
  readTime: string
  tags: string[]
}
```

**Chat Message Schema:**
```typescript
{
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}
```

### Build and Deployment

**Development:**
- `npm run dev` - Runs development server with Vite HMR
- TypeScript type checking via `tsc --noEmit`
- Client served through Vite dev server on Express

**Production:**
- `npm run build` - Builds frontend with Vite, bundles backend with esbuild
- Frontend output: `dist/public`
- Backend output: `dist/index.js`
- `npm start` - Runs production build

**Configuration:**
- TypeScript paths configured for `@/` (client), `@shared/`, and `@assets/` aliases
- Vite aliases match TypeScript paths
- Tailwind config references client source paths

## External Dependencies

### UI Component Library
- **Shadcn/ui** - Pre-built accessible components based on Radix UI primitives
- **Radix UI** - Headless UI components (20+ components: Dialog, Dropdown, Popover, etc.)
- **Lucide React** - Icon library used throughout the application

### AI Services
- **OpenAI API** - Used for chatbot functionality via Replit AI Integrations
- Configuration uses environment variables: `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY`
- Currently configured to use GPT-5 model (as of August 2025)

### Form and Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation (used with Drizzle Zod for type-safe schemas)
- **@hookform/resolvers** - Zod resolver integration for React Hook Form

### Database (Prepared but Not Active)
- **Drizzle ORM** - Type-safe SQL ORM configured for PostgreSQL
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver
- Configuration file (`drizzle.config.ts`) points to `shared/schema.ts`
- Migration output directory: `./migrations`
- **Note:** Database is not currently in use; application uses in-memory storage

### Development Tools
- **Replit-specific plugins:**
  - `@replit/vite-plugin-runtime-error-modal` - Error overlay for development
  - `@replit/vite-plugin-cartographer` - Replit integration (dev only)
  - `@replit/vite-plugin-dev-banner` - Development banner (dev only)

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing with Autoprefixer
- **class-variance-authority** - Type-safe variant styling for components
- **clsx** and **tailwind-merge** - Utility for conditional class names

### Additional Libraries
- **date-fns** - Date manipulation and formatting
- **embla-carousel-react** - Carousel component for image galleries
- **nanoid** - Unique ID generation
- **cmdk** - Command menu component (accessible command palette)