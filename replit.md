# ToolForge AI

## Overview

ToolForge AI is a centralized platform for discovering, comparing, and utilizing AI tools and conversion utilities. The application provides a comprehensive directory of 250+ AI tools across multiple categories (Conversion, Image AI, Text AI, Video AI, Audio AI, Code AI) with intelligent search capabilities, article content for user education, and an AI-powered chatbot assistant for tool recommendations.

The platform is built as a full-stack web application with a React frontend and Express backend, designed to help users navigate the AI tools landscape with curated content, expert insights, and guided discovery.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- In-memory data storage (no database currently connected)
- OpenAI integration via Replit AI Integrations service

**API Design:**
- RESTful endpoints under `/api` prefix
- JSON request/response format
- Routes for tools listing, search, and articles
- Chat endpoint for AI assistant functionality

**Key Endpoints:**
- `GET /api/tools` - Retrieve all AI tools
- `GET /api/tools/search?q=query` - Search tools by query string
- `GET /api/articles` - Retrieve all articles
- `POST /api/chat` - AI chatbot conversation endpoint

**Data Storage Strategy:**
- Currently using in-memory storage with `MemStorage` class implementing `IStorage` interface
- Data initialized on server startup with predefined tools and articles
- Abstracted storage interface allows future database migration without API changes
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