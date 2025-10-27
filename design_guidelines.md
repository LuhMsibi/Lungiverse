# Design Guidelines: Lungiverse

## Brand Identity

**Name:** Lungiverse  
**Tagline:** "Discover Your AI Universe"

**Logo Concept:**  
A geometric anvil icon combined with circuit-pattern details, symbolizing the crafting of AI solutions. The icon uses clean, angular shapes that work well at all sizes. Wordmark uses a modern sans-serif in sentence case with "AI" slightly elevated.

---

## Design Approach

**Reference Strategy:** Blend modern tech platform aesthetics
- **Linear** - Clean typography, generous spacing, subtle interactions
- **Stripe** - Professional clarity, strong visual hierarchy
- **ProductHunt** - Tool discovery cards, category organization
- **Notion** - Organized information architecture, searchable content

**Core Principles:**
1. Clarity over complexity - users should find tools instantly
2. Professional credibility - establish trust in AI recommendations
3. Scannable content - quick visual parsing of tool capabilities
4. Guided discovery - progressive disclosure of information

---

## Typography System

**Font Families (via Google Fonts):**
- Primary: Inter (headings, UI, body)
- Accent: Space Grotesk (hero headlines, category labels)

**Type Scale:**
- Hero Headline: 3.5rem / 4rem line-height, font-weight 700
- Page Headline: 2.5rem / 3rem, font-weight 700
- Section Title: 1.875rem / 2.25rem, font-weight 600
- Card Title: 1.25rem / 1.75rem, font-weight 600
- Body Large: 1.125rem / 1.75rem, font-weight 400
- Body: 1rem / 1.5rem, font-weight 400
- Caption: 0.875rem / 1.25rem, font-weight 500
- Label: 0.75rem / 1rem, font-weight 600, uppercase, letter-spacing 0.05em

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 8, 12, 16, 20, 24, 32  
**Common Patterns:**
- Card padding: p-8
- Section vertical: py-24 (desktop), py-16 (mobile)
- Grid gaps: gap-8 (cards), gap-4 (tight lists)
- Component spacing: space-y-4 (related items), space-y-12 (sections)

**Container Strategy:**
- Full-width sections: w-full with max-w-7xl mx-auto px-8
- Content blocks: max-w-6xl
- Article content: max-w-3xl
- Search/input: max-w-2xl

**Grid Structures:**
- Tool cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Article previews: grid-cols-1 lg:grid-cols-2
- Feature highlights: grid-cols-1 md:grid-cols-3
- Category filters: flex-wrap horizontal scroll on mobile

---

## Component Library

### Navigation
**Primary Header:**
- Sticky top navigation (sticky top-0 z-50 backdrop-blur-lg)
- Logo left, navigation center, CTA button right
- Search icon that expands to full-width overlay search
- Mobile: hamburger menu with slide-in panel

### Hero Section
**Design:**
- Split layout (60/40) - left: content, right: abstract visual/illustration
- Hero headline with gradient text treatment
- Subheadline explaining platform value
- Dual CTAs: primary "Explore Tools" + secondary "Read Articles"
- Floating chatbot preview/teaser badge
- Trust indicators: "250+ AI Tools" "Updated Daily" "Free to Use"

**Image:** Abstract geometric illustration of connected nodes/AI pathways in isometric style, suggesting tool connectivity and workflow

### Search Component
**Prominent Search Bar:**
- Large centered input (h-16) with rounded corners (rounded-2xl)
- Search icon left, voice input icon right
- Placeholder: "Describe what you need or search by name..."
- Auto-complete dropdown with categorized suggestions
- Recent searches section below
- Border highlight on focus with subtle shadow

### Tool Cards
**Standard Card Structure:**
- Tool icon/logo top-left (w-16 h-16)
- Category badge top-right (small pill)
- Tool name (card title size)
- One-line description
- Key features (3 bullet points, compact)
- "Try Now" CTA button
- Metadata footer: "Free" / "API Required" / usage count
- Hover: subtle lift effect (shadow increase, -translate-y-1)
- Card design: border, rounded-xl, p-8, hover:shadow-xl transition

**Featured Tool Card:**
- Larger format, 2-column span
- Screenshot/preview image top
- Extended description
- Multiple CTAs

### Category Navigation
**Horizontal Pill Filter:**
- Sticky below header when scrolling
- Categories: "All Tools", "Conversion", "Image AI", "Text AI", "Video AI", "Audio AI", "Code AI"
- Active state: filled background
- Horizontal scroll on mobile with fade indicators

### Chatbot Widget
**Floating Assistant:**
- Bottom-right corner (fixed)
- Circular trigger button (w-16 h-16) with pulse animation
- Icon: chat bubble with sparkle
- On click: expands to chat panel (w-96 h-[600px])
- Panel: header with "AI Assistant", message thread, input field
- Message bubbles: user (right-aligned), bot (left-aligned)
- Suggested prompts chips below input

### Articles Section
**Article Cards:**
- Featured article: full-width with large image (left) and content (right)
- Standard articles: grid of 2 columns
- Card includes: cover image (16:9), category tag, title, excerpt, author avatar, read time
- "Read More" link
- Published date

**Article Page Layout:**
- Hero: large cover image (full-width, 60vh)
- Title overlay on image with blurred background for text
- Article metadata bar: author, date, read time, share buttons
- Content: max-w-3xl, generous line-height, images at max-w-2xl
- Table of contents sidebar (sticky) for long articles
- Related articles footer

### Dynamic "Not Found" Experience
**Empty State Design:**
- Centered content with illustration
- "We're searching for that..." headline
- Loading state with skeleton cards
- Results appear: external resources, similar tools, or web search results
- Each result: title, snippet, source, "Visit" CTA

### Footer
**Comprehensive Footer:**
- 4-column layout on desktop
  - Column 1: Logo, tagline, social links
  - Column 2: Quick Links (About, Blog, Submit a Tool, API Access)
  - Column 3: Categories (all tool categories)
  - Column 4: Newsletter signup (input + submit)
- Bottom bar: Copyright, Privacy Policy, Terms, Contact
- Secondary navigation for SEO (all article links)

---

## Page-Specific Guidelines

### Homepage Structure (7 sections):
1. **Hero** - Split layout with CTA and visual
2. **Search Showcase** - Large centered search with suggested categories
3. **Featured Tools** - 6 tool cards in grid, "View All" CTA
4. **How It Works** - 3-column explanation with icons (Search → Discover → Implement)
5. **Categories** - Visual category grid (6 categories with icons and counts)
6. **Latest Articles** - 3 article preview cards
7. **CTA Section** - Centered "Start Exploring" with chatbot mention

### Tools Directory Page:
- Filter sidebar (left 25%, sticky)
  - Category checkboxes
  - Free/Paid toggle
  - API Required filter
  - Sort dropdown
- Tool grid (right 75%)
  - Masonry layout option for varied card heights
  - Infinite scroll or pagination
  - Results count header

### Individual Tool Page:
- Hero: Tool logo/banner with name and category
- Quick info bar: Free/Paid, API, Website link, Add to Favorites
- Tabs: Overview, Features, Pricing, API Docs, Reviews
- "Try It" embedded demo section if applicable
- Related tools carousel
- Comment/review section

### Articles/Blog Page:
- Featured article hero (full-width)
- Category filter tabs
- 2-column grid of articles
- Load more button

---

## Images Strategy

**Hero Section:** Yes - large abstract illustration (isometric AI/tool connectivity theme)

**Tool Cards:** Tool logos/icons (provided or placeholder with first letter)

**Articles:** 
- Cover images for each article (16:9 ratio, 1200x675px)
- In-content screenshots and diagrams
- Author avatars (circular, 40x40px)

**Category Sections:** Icon illustrations for each AI category (consistent style, 2-3 color palette each)

**Chatbot:** Avatar icon for assistant responses

**Empty States:** Custom illustrations for "no results", "loading", "error" states

---

## Interaction Patterns

**Micro-interactions:**
- Button hover: subtle scale (scale-105) and shadow increase
- Card hover: lift with shadow enhancement
- Input focus: border accent and subtle scale
- Smooth page transitions (200-300ms ease)

**Loading States:**
- Skeleton screens for tool cards while fetching
- Spinner for chatbot responses
- Progressive image loading with blur-up

**Animations:**
- Hero: Fade-in-up for content (stagger elements by 100ms)
- Tool cards: Fade-in as they enter viewport
- Chatbot: Slide-in from bottom-right
- Search overlay: Fade backdrop, scale search box

**Avoid:** Excessive parallax, auto-playing videos, distracting background animations

---

## Accessibility

- Minimum contrast ratio 4.5:1 for body text, 3:1 for large text
- Focus indicators on all interactive elements (ring-2 offset-2)
- Semantic HTML (nav, main, article, aside)
- Skip to content link
- Alt text for all images
- Keyboard navigation for all features
- ARIA labels for icon-only buttons
- Form labels and error messages

---

This design system creates a professional, modern AI tools platform that prioritizes usability while maintaining visual appeal and brand identity.