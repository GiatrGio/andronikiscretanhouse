# Product Requirements Document (PRD)
## Androniki's Cretan House - Next.js Website Rebuild

---

## 1. Project Overview

### 1.1 Purpose
Recreate the existing WordPress-based website (andronikiscretanhouse.com) as a modern, high-performance Next.js application that maintains the authentic Cretan cooking class experience while implementing contemporary web technologies and user experience improvements.

### 1.2 Business Context
Androniki's Cretan House offers traditional Greek cooking classes in Rethymno, Crete. The website serves as the primary digital presence for attracting tourists and food enthusiasts to book authentic cooking experiences. The current WordPress site requires modernization to improve performance, user experience, and maintainability.

### 1.3 Goals
- Create a fast, responsive, and modern website using Next.js
- Leverage Next.js SSR/SSG for optimal performance and SEO
- Improve user experience with smooth animations and interactions
- Maintain the authentic, traditional Cretan aesthetic
- Enhance mobile responsiveness
- Implement better SEO practices with built-in Next.js optimizations
- Add interactive features not present in the original
- Ensure easy content management for future updates
- Benefit from automatic image optimization and code splitting

---

## 2. Technical Stack

### 2.1 Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **Frontend Library**: React 18+
- **Styling**: Tailwind CSS (core utility classes only)
- **Language**: TypeScript
- **Image Optimization**: Next.js Image component (built-in)
- **Font Optimization**: Next.js Font optimization (next/font)

### 2.2 Additional Libraries
- **Icons**: lucide-react
- **Animations**: Framer Motion or CSS transitions
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns (for availability calendar if needed)
- **SEO**: next-seo (optional, Next.js has built-in SEO features)

### 2.3 Next.js Specific Features
- **App Router**: For modern routing and layouts
- **Server Components**: Default for better performance
- **Client Components**: Only where interactivity is needed
- **API Routes**: For contact form submission
- **Static Generation (SSG)**: For most pages
- **Image Optimization**: Automatic with next/image
- **Font Optimization**: Automatic with next/font
- **Metadata API**: For SEO optimization

### 2.4 Deployment Considerations
- **Recommended Platform**: Vercel (optimal for Next.js)
- **Alternative Platforms**: Netlify, AWS Amplify
- Static export capability (if needed)
- Optimized bundle size with automatic code splitting
- Edge runtime support for API routes
- Fast loading times (<2 seconds)
- Mobile-first approach

---

## 3. Site Structure & Pages

### 3.1 Page Hierarchy (Next.js App Router Structure)
```
app/
├── page.js                    (Home - /)
├── layout.js                  (Root layout with Header/Footer)
├── courses/
│   ├── page.js               (/courses)
│   └── availability/
│       └── page.js           (/courses/availability)
├── about/
│   └── page.js               (/about)
├── recipes/
│   └── page.js               (/recipes)
├── reviews/
│   └── page.js               (/reviews)
├── gallery/
│   └── page.js               (/gallery)
└── contact/
    └── page.js               (/contact)
```

### 3.2 API Routes (for Contact Form)
```
app/api/
└── contact/
    └── route.js              (POST /api/contact)
```

### 3.3 Navigation
- **Header Navigation**: Sticky header with logo and menu items (in root layout)
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Footer Navigation**: Contact info, social links, and quick links (in root layout)

### 3.4 Special Next.js Files

#### 3.4.1 Layout Files
```
app/layout.js           # Root layout (wraps all pages)
app/courses/layout.js   # Nested layout for courses section (optional)
```

#### 3.4.2 Loading States
```
app/loading.js          # Global loading UI
app/courses/loading.js  # Loading UI for courses section
```

#### 3.4.3 Error Handling
```
app/error.js            # Global error UI
app/not-found.js        # Custom 404 page
```

#### 3.4.4 Metadata Files
```
app/robots.js           # Dynamic robots.txt
app/sitemap.js          # Dynamic sitemap.xml
app/favicon.ico         # Favicon
```

---

## 4. Detailed Page Requirements

### 4.1 Home Page (/)

#### 4.1.1 Hero Section
- **Full-width hero image** with overlay text
- **Headline**: "Greek cooking lessons - Dining In Rethymno: An Evening Of Cretan Cooking"
- **Subheadline**: Brief tagline about authentic Cretan experience
- **Call-to-Action Button**: "Book Your Experience" or "View Courses"
- **Smooth scroll animation** on load
- **Parallax effect** (optional) on hero image

#### 4.1.2 Featured Sections (3 Cards)
Display three prominent cards linking to:
1. **Cretan Cooking Courses**
   - Image thumbnail
   - Title
   - Brief description (2-3 sentences)
   - "Learn More" button
   
2. **Availability & Details**
   - Image thumbnail
   - Key information (dates, capacity, duration)
   - "Check Availability" button
   
3. **Our Reviews**
   - Star rating visual
   - Snippet of latest review
   - "Read All Reviews" button

#### 4.1.3 Visual Features
- **Hover effects** on cards (subtle lift/shadow)
- **Fade-in animations** as user scrolls
- **Responsive grid**: 3 columns desktop, 1 column mobile

#### 4.1.4 Quick Info Section
- Display key information:
  - Location with Google Maps link
  - Phone number (clickable on mobile)
  - Email address
  - Operating months (April 20 - October 9)

---

### 4.2 Cretan Cooking Courses (/courses)

#### 4.2.1 Content Sections
- **Introduction Paragraph**
  - Description of the cooking class experience
  - Emphasis on traditional methods, wood oven, courtyard setting
  - Family-owned, authentic approach

- **What You'll Learn**
  - List of dishes typically prepared
  - Cooking techniques taught
  - Cultural insights shared

- **The Experience**
  - Timeline of a typical class
  - Garden tour mention
  - Wood oven cooking details
  - Communal dining experience

- **Image Gallery**
  - 6-8 images showing:
    - The courtyard
    - Cooking in action
    - Wood oven
    - Finished dishes
    - Happy participants
  - Lightbox/modal view on click

#### 4.2.2 Call-to-Action
- **Booking Section**
  - "Book Your Spot" button
  - Link to contact form or availability section
  
- **Pricing Section** (if applicable)
  - Clear pricing structure
  - What's included

---

### 4.3 Availability & Details (/courses/availability)

#### 4.3.1 Key Information Display
Present the following details in a visually appealing format:

- **Season**: April 20th to October 9th
- **Group Size**: 
  - Maximum 8 people for mixed groups
  - Up to 12 people for private groups (family/friends)
- **Booking Deadline**: 2 days before the event
- **Duration**: Approximately 4 hours (including meal)
- **Included**: Written recipes and souvenirs

#### 4.3.2 Visual Design
- **Information Cards** or **Accordion-style** layout
- **Icons** for each detail (calendar, people, clock, gift)
- **Highlighted information** with visual hierarchy

#### 4.3.3 Booking Calendar (Optional Enhancement)
- Interactive calendar showing available dates
- Mark booked vs available days
- Quick date selection for inquiry

#### 4.3.4 What to Bring / Expect
- Dress code suggestions
- What's provided
- Dietary restrictions handling
- Transportation info

---

### 4.4 About Us (/about)

#### 4.4.1 Content
- **Personal Story**
  - Background of Androniki & Pantelis
  - How they started offering cooking classes
  - Their passion for Cretan cuisine
  - Family traditions

- **Philosophy Section**
  - Commitment to authentic recipes
  - Use of local ingredients
  - Sustainable practices
  - Sharing Cretan culture

- **Photo of Hosts**
  - Professional or candid photo of Androniki & Pantelis
  - Photo of their home/courtyard
  - Garden photos

#### 4.4.2 Layout
- **Two-column layout** (desktop): Text on one side, images on the other
- **Single column** (mobile): Alternating text and images
- **Pull quotes** highlighting key philosophy statements

---

### 4.5 Greek Traditional Recipes (/recipes)

#### 4.5.1 Recipe Cards
Display a grid of traditional Cretan recipes:
- **Recipe Card** includes:
  - Recipe name
  - Thumbnail image
  - Brief description (1-2 sentences)
  - Difficulty level indicator
  - Preparation time
  - "View Recipe" button

#### 4.5.2 Recipe Detail View
When clicking on a recipe card:
- **Modal or Separate Page** with:
  - Large recipe image
  - Full ingredient list
  - Step-by-step instructions
  - Cultural notes about the dish
  - Print recipe option
  - Share recipe option

#### 4.5.3 Recipe Categories (Optional)
- Filter by category: Appetizers, Main Courses, Desserts, Breads, Preserves
- Search functionality

#### 4.5.4 Featured Recipes
Based on original site, include recipes/products like:
- Moussaka
- Traditional bread in wood oven
- Homemade cheeses
- Orange Jam
- Quince Jelly
- Fig Marmalade
- Vanilla Marmalade

---

### 4.6 Our Reviews (/reviews)

#### 4.6.1 Review Display
- **Review Cards** showing:
  - Guest name
  - Date of visit
  - Star rating (5 stars)
  - Review text
  - Guest photo (optional)
  - Country flag or location

#### 4.6.2 Layout Options
- **Masonry grid** layout for varied review lengths
- **Infinite scroll** or pagination
- **Filter options**: By date, rating

#### 4.6.3 Featured Reviews Section
- Highlight 2-3 exceptional reviews at the top
- Larger cards with emphasis

#### 4.6.4 Review Content (from original site)
Include reviews from guests like:
- Tanja (August 2018): "Great cooking experience"
- Catherine V. (May 2019): "The best Cretan cooking experience"
- Melnoel22 (July 2018): "Creatan Cooking Dream"
- Jennifer (September 2019)
- Amit (September 2019)
- Lieke (October 2018)
- Zoe (July 2020): "Authentic and genuine"

#### 4.6.5 Social Proof Elements
- **Total number of reviews**
- **Average rating**
- **Tripadvisor/Google rating badges** (if applicable)

---

### 4.7 Photo Gallery (/gallery)

#### 4.7.1 Gallery Grid
- **Responsive masonry or grid layout**
- **High-quality images** showing:
  - The courtyard and outdoor dining area
  - Cooking process
  - Wood oven in use
  - Garden and fresh ingredients
  - Finished dishes
  - Happy guests and hosts
  - Traditional Cretan dancing (if applicable)
  - Seasonal variations

#### 4.7.2 Interactive Features
- **Lightbox viewer**: Click to expand images
- **Navigation**: Previous/Next arrows in lightbox
- **Zoom capability**: For detail viewing
- **Image captions**: Brief descriptions
- **Lazy loading**: For performance

#### 4.7.3 Gallery Categories (Optional)
Filter by:
- The Garden
- Cooking Process
- Our Dishes
- Happy Guests
- The Venue

#### 4.7.4 Download Option
- Allow guests to download class photos (if they participated)

---

### 4.8 Contact Us (/contact)

#### 4.8.1 Contact Form
- **Form Fields**:
  - Full Name (required)
  - Email (required, validated)
  - Phone Number (optional)
  - Preferred Date(s) (date picker)
  - Number of Guests (dropdown)
  - Special Requests / Dietary Restrictions (textarea)
  - How did you hear about us? (optional dropdown)

- **Form Validation**:
  - Real-time validation
  - Clear error messages
  - Success message upon submission
  - Loading state during submission

- **Form Handling**:
  - Client-side validation with React Hook Form
  - Prepare for backend integration (API endpoint)
  - Email notification system (future implementation)

#### 4.8.2 Contact Information Display
- **Address**: Loutra, Rethymno, Crete
- **Phone**: +30 6948247099 (clickable tel: link)
- **Email**: andronikiscretanhouse@gmail.com (clickable mailto: link)
- **Google Maps**: Embedded map or link
- **Operating Hours/Season**: April 20 - October 9

#### 4.8.3 Form Handling with Next.js API Route

**Client-Side Form Component** (Client Component):
```jsx
'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({})
  const [status, setStatus] = useState('idle') // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({}) // Reset form
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

**Server-Side API Route**:
```javascript
// app/api/contact/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  
  // Validation
  // Email sending logic (Resend, SendGrid, Nodemailer, etc.)
  
  return NextResponse.json({ success: true })
}
```

#### 4.8.4 Layout
- **Two-column layout** (desktop):
  - Contact form on left
  - Contact info + map on right
- **Stacked layout** (mobile)

#### 4.8.4 Additional Elements
- **FAQ Section** (optional): Common questions about booking
- **Social Media Links**: If applicable
- **Response Time Expectation**: "We'll respond within 24 hours"

---

## 5. Global Components

### 5.1 Header / Navigation

#### 5.1.1 Desktop Header
- **Logo**: Left-aligned, links to home using Next.js Link component
- **Navigation Menu**: Horizontal menu with all page links
- **Sticky Header**: Remains visible on scroll (position: sticky)
- **Hover Effects**: Underline or highlight on menu items
- **Active Page Indicator**: Visual indication of current page
- **Implementation**: Create as Server Component in `components/layout/Header.jsx`

```jsx
// Example structure
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <Link href="/">Logo</Link>
      <nav>
        <Link href="/courses">Courses</Link>
        {/* More links */}
      </nav>
    </header>
  )
}
```

#### 5.1.2 Mobile Header
- **Hamburger Menu Icon**: Top-right corner
- **Slide-out Menu**: Full-screen or side drawer navigation
- **Close Button**: X icon to close menu
- **Menu Animation**: Smooth transition
- **Client Component**: Needs 'use client' for interactivity

```jsx
'use client'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  // Mobile menu logic
}
```

#### 5.1.3 Logo
- Use the existing logo from original site or create a text-based logo
- Optimize logo with Next.js Image component
- "Greek cooking lessons" or "Androniki's Cretan House"

---

### 5.2 Footer

#### 5.2.1 Footer Layout (3 Columns)

**Column 1: About**
- Brief description (2-3 sentences)
- "Experience authentic Cretan cuisine..."

**Column 2: Quick Links**
- Home
- Courses
- About Us
- Recipes
- Reviews
- Gallery
- Contact
(Use Next.js Link component for all internal links)

**Column 3: Contact Info**
- Location
- Phone
- Email
- Operating Season

#### 5.2.2 Footer Bottom
- Copyright notice: "© 2024 Androniki's Cretan House. All rights reserved."
- Social media icons (if applicable)
- Website credits (optional)

#### 5.2.3 Mobile Footer
- Stacked single column layout
- Collapsed sections with expand/collapse (optional)

#### 5.2.4 Implementation
Place Footer in root layout (`app/layout.js`) so it appears on all pages:
```jsx
// app/layout.js
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

---

### 5.3 Social Sharing Component

#### 5.3.1 Share Buttons
On relevant pages (courses, recipes), include share buttons for:
- Facebook
- Twitter/X
- Email
- WhatsApp (mobile)
- Pinterest (for recipes/photos)

#### 5.3.2 Design
- Icon-only buttons with tooltips
- Subtle hover effects
- Opens in new window/tab

---

## 6. Design Requirements

### 6.1 Color Palette

#### 6.1.1 Primary Colors (Inspired by Crete)
- **Primary**: Warm Mediterranean blue (#2C5F8D or similar)
- **Secondary**: Terracotta/Clay (#D4785C or similar)
- **Accent**: Olive green (#7A8B45 or similar)
- **Background**: Warm white/cream (#FAF8F5 or similar)
- **Text**: Dark gray/charcoal (#2D3436 or similar)

#### 6.1.2 Usage
- Use colors to evoke Mediterranean, rustic, authentic Cretan atmosphere
- Ensure sufficient contrast for accessibility (WCAG AA compliance)

---

### 6.2 Typography

#### 6.2.1 Font Selection (Using Next.js Font Optimization)
- **Headings**: Serif font (e.g., Playfair Display, Merriweather, Lora)
  - Conveys tradition and elegance
  
- **Body Text**: Sans-serif font (e.g., Open Sans, Inter, Lato)
  - Clean and readable

#### 6.2.2 Next.js Font Implementation
```jsx
// app/layout.js
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Use in className: font-playfair, font-inter
```

#### 6.2.3 Font Sizes (Responsive)
- **H1**: 2.5rem (desktop), 2rem (mobile)
- **H2**: 2rem (desktop), 1.75rem (mobile)
- **H3**: 1.5rem (desktop), 1.25rem (mobile)
- **Body**: 1rem (16px base)
- **Small Text**: 0.875rem

#### 6.2.4 Line Height & Spacing
- Body text: 1.6-1.8 line height for readability
- Generous whitespace between sections

---

### 6.3 Imagery

#### 6.3.1 Image Requirements
- **High Quality**: Minimum 1920px width for hero images
- **Format**: Next.js automatically optimizes to WebP/AVIF
- **Authentic**: Real photos from the cooking classes
- **Aspect Ratios**: Consistent ratios within galleries
- **Storage**: Images in `/public/images/` directory

#### 6.3.2 Image Categories Needed
- Hero/banner images (landscape, 16:9 or 21:9)
- Courtyard and venue photos
- Cooking process photos
- Food/dish photos (styled)
- Host photos (Androniki & Pantelis)
- Garden and ingredient photos
- Guest testimonial photos (optional)

#### 6.3.3 Next.js Image Handling
- **Use Next.js Image component**: `<Image>` from 'next/image'
- **Automatic Optimization**: Serves WebP/AVIF formats automatically
- **Lazy Loading**: Built-in with Next.js Image component
- **Responsive Images**: Use `sizes` prop for responsive loading
- **Priority Loading**: Use `priority` prop for above-the-fold images
- **Blur Placeholder**: Use `placeholder="blur"` with blurDataURL
- **Alt Text**: Required for all images (SEO + accessibility)

#### 6.3.4 Example Next.js Image Usage
```jsx
import Image from 'next/image'

<Image
  src="/images/hero-cooking.jpg"
  alt="Traditional Cretan cooking in courtyard"
  width={1920}
  height={1080}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

---

### 6.4 UI/UX Principles

#### 6.4.1 Design Philosophy
- **Authentic & Warm**: Reflect traditional Cretan hospitality
- **Clean & Modern**: Contemporary design without losing character
- **User-Friendly**: Intuitive navigation and interactions
- **Trust-Building**: Professional design that inspires confidence

#### 6.4.2 Interaction Design
- **Hover Effects**: Subtle transitions on buttons and cards (0.3s ease)
- **Button Styles**: 
  - Primary buttons: Filled with primary color
  - Secondary buttons: Outlined
  - Ghost buttons: Text-only with hover effect
- **Loading States**: Spinners or skeleton screens
- **Error States**: Clear, helpful error messages

#### 6.4.3 Spacing & Layout
- **Consistent Spacing**: Use Tailwind spacing scale (4, 8, 16, 24, 32, 48, 64px)
- **Grid System**: 12-column grid (Tailwind default)
- **Max Width**: Content container max-width of 1280px
- **Whitespace**: Generous breathing room between sections

---

### 6.5 Responsive Design

#### 6.5.1 Breakpoints (Tailwind defaults)
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

#### 6.5.2 Mobile-First Approach
- Design for mobile first, then scale up
- Touch-friendly tap targets (minimum 44x44px)
- Simplified navigation on mobile
- Reduced image sizes on mobile

#### 6.5.3 Responsive Patterns
- **Navigation**: Hamburger menu on mobile
- **Cards**: Stack on mobile, grid on desktop
- **Images**: Full-width on mobile, contained on desktop
- **Forms**: Single column on mobile

---

## 7. Animations & Interactions

### 7.1 Page Transitions
- **Fade-in on Load**: Hero section fades in smoothly
- **Scroll Animations**: Elements fade/slide in as user scrolls (use 'use client' directive)
- **Page Navigation**: Smooth route transitions with Next.js

### 7.2 Micro-interactions
- **Button Hover**: Scale slightly or change color
- **Card Hover**: Lift effect with shadow
- **Link Hover**: Underline animation (use Next.js Link component)
- **Form Focus**: Input field highlight

### 7.3 Animation Performance
- Use CSS transforms (translate, scale) for performance
- Avoid animating expensive properties (width, height)
- Use `will-change` sparingly
- Respect `prefers-reduced-motion` accessibility setting
- **Note**: Components with animations need 'use client' directive in Next.js

### 7.4 Loading States
- **Initial Load**: Next.js loading.js for page skeleton
- **Image Loading**: Blur-up effect with Next.js Image
- **Form Submission**: Button loading spinner
- **Gallery Loading**: Progressive image loading with Next.js Image
- **Suspense Boundaries**: Use React Suspense for async components

---

## 8. Performance Requirements

### 8.1 Performance Targets
- **First Contentful Paint**: < 1.2 seconds
- **Largest Contentful Paint**: < 2.0 seconds
- **Time to Interactive**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **Google PageSpeed Score**: > 95 (mobile and desktop)

### 8.2 Next.js Optimization Strategies

#### 8.2.1 Server vs Client Components
- **Default to Server Components**: Use Server Components by default
- **Client Components**: Only add 'use client' directive when needed:
  - Interactive components (useState, useEffect)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - Animation libraries (Framer Motion)

#### 8.2.2 Route Handling
- **Static Generation (SSG)**: Use for most pages (default in Next.js 14)
- **generateStaticParams**: For dynamic routes if needed
- **Dynamic Routes**: Only if content changes frequently

#### 8.2.3 Code Splitting
- **Automatic Code Splitting**: Built-in with Next.js App Router
- **Dynamic Imports**: Use for heavy components
```jsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
})
```

#### 8.2.4 Image Optimization
- **Next.js Image Component**: Automatic optimization to WebP/AVIF
- **Responsive Images**: Use `sizes` prop appropriately
- **Priority Loading**: Mark above-the-fold images with `priority`
- **Lazy Loading**: Automatic for below-the-fold images

#### 8.2.5 Font Optimization
- **next/font**: Automatic font optimization with zero layout shift
- **Font Display**: Use 'swap' for better perceived performance
- **Subset Selection**: Load only required character sets

#### 8.2.6 Asset Optimization
- **Minification**: Automatic in production builds
- **Tree Shaking**: Automatic with ES modules
- **Compression**: Enable Gzip/Brotli on hosting platform
- **Bundle Analysis**: Use @next/bundle-analyzer

#### 8.2.7 Caching Strategy
- **Static Assets**: Cached automatically with immutable cache headers
- **API Routes**: Implement appropriate cache headers
- **ISR (Incremental Static Regeneration)**: Use for content that updates periodically
- **CDN**: Leverage Vercel's Edge Network (or similar)

---

## 9. SEO Requirements

### 9.1 Technical SEO

#### 9.1.1 Next.js Metadata API
Use Next.js 14+ Metadata API in each page:

```jsx
// app/page.js (Home)
export const metadata = {
  title: 'Authentic Cretan Cooking Classes | Androniki\'s House',
  description: 'Join Androniki for traditional Greek cooking lessons in Rethymno, Crete. Learn authentic recipes in a beautiful courtyard with wood oven.',
  keywords: ['Cretan cooking classes', 'Greek cooking lessons', 'Rethymno', 'traditional Cretan cuisine'],
  openGraph: {
    title: 'Authentic Cretan Cooking Classes | Androniki\'s House',
    description: 'Join Androniki for traditional Greek cooking lessons in Rethymno, Crete.',
    images: ['/images/og-image.jpg'],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Authentic Cretan Cooking Classes | Androniki\'s House',
    description: 'Join Androniki for traditional Greek cooking lessons in Rethymno, Crete.',
    images: ['/images/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://andronikiscretanhouse.com',
  },
}
```

#### 9.1.2 Dynamic Metadata (for dynamic routes if needed)
```jsx
export async function generateMetadata({ params }) {
  return {
    title: `${params.recipeName} | Greek Traditional Recipes`,
    description: `Learn how to make authentic ${params.recipeName}`,
  }
}
```

#### 9.1.3 Structured Data (Schema.org)
Implement JSON-LD structured data in page components or layout:

```jsx
// app/layout.js or specific pages
export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Androniki\'s Cretan House',
    image: 'https://andronikiscretanhouse.com/images/logo.jpg',
    '@id': 'https://andronikiscretanhouse.com',
    url: 'https://andronikiscretanhouse.com',
    telephone: '+30-6948247099',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Loutra',
      addressLocality: 'Rethymno',
      addressRegion: 'Crete',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.3667,
      longitude: 24.4833,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  )
}
```

**Schema Types to Implement**:
- **LocalBusiness Schema**: Main business information
- **Recipe Schema** (for recipe pages): Recipe name, ingredients, instructions
- **Review Schema**: Aggregate rating and individual reviews
- **BreadcrumbList Schema**: For navigation breadcrumbs

#### 9.1.4 Semantic HTML
- Proper heading hierarchy (H1 → H2 → H3)
- Semantic tags: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Descriptive alt text for all images (required by Next.js Image)
- Descriptive link text (avoid "click here")
- Use Next.js Link component for internal navigation

#### 9.1.5 URL Structure
Next.js App Router provides clean URLs automatically:
- `/courses` not `/courses.html`
- `/courses/availability` not `/courses?page=availability`
- Clean, descriptive routes
- Automatic trailing slash handling

#### 9.1.6 Robots.txt and Sitemap
```jsx
// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://andronikiscretanhouse.com/sitemap.xml',
  }
}

// app/sitemap.js
export default function sitemap() {
  return [
    {
      url: 'https://andronikiscretanhouse.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://andronikiscretanhouse.com/courses',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Add all pages
  ]
}
```

### 9.2 Content SEO
- **Primary Keywords**: 
  - Cretan cooking classes
  - Greek cooking lessons Rethymno
  - Traditional Cretan cuisine
  - Cooking classes Crete
  
- **Long-tail Keywords**:
  - Authentic Cretan cooking experience
  - Traditional Greek recipes Crete
  - Wood oven cooking class Greece

- **Content Strategy**:
  - Natural keyword integration
  - Comprehensive, valuable content
  - Regular updates (recipes, blog posts)

### 9.3 Local SEO
- Google My Business integration (mention in footer/contact)
- NAP consistency (Name, Address, Phone)
- Local keywords (Rethymno, Crete, Greece)
- Embedded Google Maps with proper markup

---

## 10. Accessibility Requirements (WCAG 2.1 AA)

### 10.1 Keyboard Navigation
- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order
- Skip to main content link

### 10.2 Screen Reader Support
- Descriptive alt text for images
- ARIA labels for icon-only buttons
- ARIA landmarks for page sections
- Proper heading structure

### 10.3 Color & Contrast
- Minimum contrast ratio 4.5:1 (text)
- Minimum contrast ratio 3:1 (large text, UI elements)
- Don't rely on color alone to convey information

### 10.4 Forms
- Label all form inputs
- Associate labels with inputs (for/id)
- Provide error messages
- Clear instructions

### 10.5 Media
- Captions for videos (if any)
- Transcripts for audio (if any)
- Pause/stop controls for auto-playing content

### 10.6 Responsive & Zoom
- Support 200% zoom without horizontal scrolling
- Text remains readable when zoomed
- Touch targets at least 44x44px

---

## 11. Browser & Device Support

### 11.1 Browsers
- **Desktop**:
  - Chrome (last 2 versions)
  - Firefox (last 2 versions)
  - Safari (last 2 versions)
  - Edge (last 2 versions)

- **Mobile**:
  - iOS Safari (last 2 versions)
  - Chrome Android (last 2 versions)
  - Samsung Internet (last 2 versions)

### 11.2 Devices
- Desktop (1920px+, 1440px, 1280px)
- Laptop (1024px)
- Tablet (768px, portrait and landscape)
- Mobile (375px, 414px)

### 11.3 Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced experience with JavaScript enabled
- Fallbacks for older browsers

---

## 12. Content Management

### 12.1 Content Structure
All content should be easily editable:
- Store text content in JSON or Markdown files
- Image paths in a central configuration
- Separate content from components

### 12.2 Future CMS Integration
Design with future headless CMS in mind:
- Contentful, Sanity, or Strapi integration capability
- Component structure supports dynamic content
- API-ready architecture

### 12.3 Multilingual Support (Future)
- Prepare structure for i18n (internationalization)
- Support for Greek and English languages
- Language switcher component (future feature)

---

## 13. Testing Requirements

### 13.1 Testing Checklist
- [ ] All pages load correctly
- [ ] All links work (internal and external)
- [ ] Forms validate and submit properly
- [ ] Images load and display correctly
- [ ] Responsive design works across breakpoints
- [ ] Animations perform smoothly
- [ ] No console errors
- [ ] SEO tags present on all pages
- [ ] Accessibility audit passes (Lighthouse, axe)
- [ ] Cross-browser testing complete

### 13.2 Testing Tools
- **Chrome DevTools**: Responsive design, performance
- **Lighthouse**: Performance, SEO, accessibility audits
- **axe DevTools**: Accessibility testing
- **WAVE**: Web accessibility evaluation
- **BrowserStack**: Cross-browser testing (optional)

---

## 14. Deployment & Hosting

### 14.1 Deployment Platform Options

#### 14.1.1 Vercel (Recommended)
- **Why**: Built by Next.js creators, optimal performance
- **Features**:
  - Zero-config deployment
  - Automatic HTTPS
  - Edge Network (CDN)
  - Preview deployments for PRs
  - Analytics and Web Vitals monitoring
  - Serverless Functions for API routes
- **Pricing**: Free tier available, generous limits

#### 14.1.2 Alternative Platforms
- **Netlify**: Good Next.js support, similar features
- **AWS Amplify**: If already using AWS infrastructure
- **Cloudflare Pages**: Good for static exports
- **Self-hosted**: Using Node.js server or Docker

### 14.2 Domain & SSL
- Domain: andronikiscretanhouse.com (existing)
- SSL certificate (automatic with Vercel/Netlify)
- HTTPS enforced
- Custom domain configuration in Vercel

### 14.3 Environment Variables
Configure in hosting platform:
- `NEXT_PUBLIC_SITE_URL`: Site URL for canonical links
- `CONTACT_EMAIL_TO`: Email address for contact form
- `CONTACT_EMAIL_FROM`: Sender email for notifications
- API keys (if using external services)

### 14.4 CI/CD
- **Automatic Deployments**: From main/master branch
- **Preview Deployments**: For pull requests
- **Build Notifications**: Via email or Slack
- **Build Configuration**:
  ```json
  {
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "framework": "nextjs"
  }
  ```

### 14.5 Analytics & Monitoring

#### 14.5.1 Vercel Analytics (Recommended)
- Built-in Web Vitals monitoring
- Real user monitoring
- Performance insights
- Zero configuration

#### 14.5.2 Google Analytics 4
- Install with `next/script` component
- Privacy-friendly implementation
- Cookie consent banner (if needed)

#### 14.5.3 Privacy-Friendly Alternatives
- Plausible Analytics
- Fathom Analytics
- Simple Analytics

### 14.6 Build Configuration

#### 14.6.1 next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['andronikiscretanhouse.com'], // Add external image domains if needed
    formats: ['image/avif', 'image/webp'],
  },
  // Enable experimental features if needed
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

#### 14.6.2 Output Configuration
- **Default**: Standalone server (Node.js)
- **Static Export**: For fully static sites (if no dynamic features)
  ```javascript
  output: 'export' // in next.config.js
  ```

---

## 15. Future Enhancements (Phase 2)

### 15.1 Online Booking System
- Real-time availability calendar
- Payment integration (Stripe, PayPal)
- Booking confirmation emails
- Customer account system
- Use Next.js API routes for backend logic

### 15.2 Blog Section
- Recipe blog posts (using MDX or CMS)
- Stories from guests
- Cretan culture articles
- SEO benefits
- Dynamic routes: `/blog/[slug]`
- RSS feed generation

### 15.3 Multilingual Support
- Full Greek translation
- Language switcher
- Localized content
- Use Next.js i18n routing
- SEO optimization for each language

### 15.4 Customer Portal
- Login for past guests (NextAuth.js)
- Access to recipe PDFs
- Photo downloads from their class
- Loyalty program
- Protected routes with middleware

### 15.5 Social Media Integration
- Live Instagram feed
- Facebook reviews widget
- Social media share count
- Open Graph optimization

### 15.6 Email Newsletter
- Newsletter signup form
- Mailchimp or similar integration
- Seasonal recipe emails
- API route for subscription handling

### 15.7 Advanced Next.js Features
- **Incremental Static Regeneration (ISR)**: For content that updates periodically
- **Middleware**: For authentication, redirects, geo-targeting
- **Edge Functions**: For personalized content delivery
- **Image Gallery with CDN**: Optimize image delivery
- **Progressive Web App (PWA)**: Offline capability with service workers

---

## 16. Project Deliverables

### 16.1 Code Deliverables
- [ ] Complete React application source code
- [ ] All components properly organized
- [ ] Responsive layouts for all pages
- [ ] Working navigation and routing
- [ ] Contact form with validation
- [ ] Image gallery with lightbox
- [ ] README.md with setup instructions
- [ ] Package.json with all dependencies

### 16.2 Documentation
- [ ] Component documentation
- [ ] Setup and installation guide
- [ ] Deployment instructions
- [ ] Content update guide
- [ ] Troubleshooting guide

### 16.3 Assets
- [ ] Optimized images
- [ ] Logo files
- [ ] Icon set
- [ ] Color palette reference
- [ ] Typography reference

---

## 17. Success Criteria

The project will be considered successful when:

1. **Functionality**: All pages are working, navigation is smooth, forms submit correctly
2. **Design**: Website looks professional, modern, and authentic to Cretan culture
3. **Performance**: Lighthouse scores > 90, fast loading times
4. **Responsiveness**: Perfect display on all device sizes
5. **Accessibility**: WCAG 2.1 AA compliance
6. **SEO**: All meta tags present, structured data implemented
7. **Code Quality**: Clean, maintainable, well-documented code
8. **User Experience**: Intuitive navigation, clear calls-to-action, engaging content

---

## 18. Development Guidelines

### 18.1 Code Style
- Use ES6+ JavaScript features
- Functional components with hooks (no class components)
- Use Server Components by default (Next.js 14+)
- Add 'use client' directive only when necessary
- Consistent naming conventions:
  - camelCase for variables and functions
  - PascalCase for components
  - kebab-case for file/folder names in app directory
- Descriptive variable and function names
- Comments for complex logic

### 18.2 Next.js App Router Structure
```
project-root/
├── app/
│   ├── layout.js              # Root layout (Header/Footer)
│   ├── page.js                # Home page
│   ├── loading.js             # Loading UI
│   ├── error.js               # Error UI
│   ├── not-found.js           # 404 page
│   ├── globals.css            # Global styles
│   ├── courses/
│   │   ├── page.js
│   │   ├── layout.js          # Courses layout (optional)
│   │   └── availability/
│   │       └── page.js
│   ├── about/
│   │   └── page.js
│   ├── recipes/
│   │   └── page.js
│   ├── reviews/
│   │   └── page.js
│   ├── gallery/
│   │   └── page.js
│   ├── contact/
│   │   └── page.js
│   └── api/
│       └── contact/
│           └── route.js       # Contact form API endpoint
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   ├── layout/                # Layout components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navigation.jsx
│   │   └── MobileMenu.jsx
│   └── sections/              # Page sections
│       ├── HeroSection.jsx
│       ├── FeaturedCourses.jsx
│       └── TestimonialCard.jsx
├── lib/                       # Utility functions
│   ├── utils.js
│   └── constants.js
├── public/
│   ├── images/
│   ├── fonts/                 # Custom fonts (if not using next/font)
│   └── favicon.ico
├── styles/                    # Additional styles (optional)
├── types/                     # TypeScript types (if using TS)
├── .env.local                 # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── package.json
```

### 18.3 Server vs Client Components

#### 18.3.1 Use Server Components (Default) For:
- Static content display
- Data fetching from databases/APIs
- SEO-critical content
- Accessing backend resources
- Reducing bundle size

```jsx
// app/page.js (Server Component by default)
export default function HomePage() {
  // No 'use client' directive needed
  return <div>Static content</div>
}
```

#### 18.3.2 Use Client Components For:
- Interactivity (useState, useEffect, event handlers)
- Browser APIs (localStorage, window)
- Animations (Framer Motion)
- Third-party libraries requiring browser APIs

```jsx
// components/ContactForm.jsx
'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({})
  // Interactive component logic
}
```

### 18.4 Best Practices

#### 18.4.1 Component Design
- Keep components small and focused (single responsibility)
- Use props for component customization
- Extract reusable logic into custom hooks
- Avoid prop drilling (use Context API if needed)
- Memoize expensive calculations (useMemo, useCallback)

#### 18.4.2 Next.js Specific
- Use Link component for navigation (not <a>)
- Use Image component for images (not <img>)
- Use next/font for font optimization
- Implement proper error boundaries
- Use loading.js for loading states
- Use Metadata API for SEO

#### 18.4.3 Performance
- Minimize use of 'use client' directive
- Code split heavy components with dynamic imports
- Use Suspense boundaries for async components
- Optimize images with Next.js Image component
- Implement proper caching strategies

#### 18.4.4 Data Fetching
```jsx
// Server Component (recommended)
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store' // or 'force-cache' for static data
  })
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

### 18.5 API Routes

#### 18.5.1 Contact Form API Route
```javascript
// app/api/contact/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email (integrate with email service)
    // await sendEmail({ name, email, message })

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 18.6 Environment Variables
```bash
# .env.local (not committed to git)
NEXT_PUBLIC_SITE_URL=https://andronikiscretanhouse.com
CONTACT_EMAIL_TO=andronikiscretanhouse@gmail.com
EMAIL_SERVICE_API_KEY=your_api_key_here
```

Access in code:
```javascript
// Public variables (accessible in browser)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

// Private variables (only on server)
const apiKey = process.env.EMAIL_SERVICE_API_KEY
```

---

## 19. Content Placeholder Text

If original content is not available, use the following placeholders:

### 19.1 Hero Section
**Headline**: "Experience Authentic Cretan Cooking"
**Subheadline**: "Join Androniki & Pantelis for traditional Greek cooking lessons in the heart of Rethymno, Crete"

### 19.2 About Us
"For over [X] years, we've been sharing our love for traditional Cretan cuisine with visitors from around the world. In our family home in Loutra, Rethymno, we invite you to experience authentic Greek hospitality, learn time-honored recipes, and taste the flavors of Crete in our beautiful courtyard and wood-fired oven."

### 19.3 Course Description
"Our cooking classes take place in the flowered courtyard of our traditional Cretan home. Together, we'll prepare authentic dishes using fresh ingredients from our garden and local markets. You'll learn to cook using our traditional wood-fired oven, just as generations of Cretans have done before us. After cooking, we gather around the table to enjoy the meal we've created together, sharing stories and experiencing genuine Cretan hospitality."

---

## 20. Appendix

### 20.1 Original Website Reference
- URL: https://andronikiscretanhouse.com/
- Platform: WordPress.com
- Current Design: Traditional, image-focused, simple navigation

### 20.2 Competitor Research
Research similar cooking class websites for inspiration:
- Other Greek cooking classes
- Mediterranean cooking experiences
- Culinary tourism websites

### 20.3 Contact Information (from original site)
- **Location**: Loutra, Rethymno, Crete, Greece
- **Phone**: +30 6948247099
- **Email**: andronikiscretanhouse@gmail.com
- **Google Maps**: Search "andronikiscretanhouse" or "Loutra Rethymno Crete"
- **Operating Season**: April 20 - October 9

### 20.4 Existing Content to Migrate
- All text content from original site pages
- Customer reviews from "Our Review" page
- Recipe information from products page
- Photo gallery images
- Logo and branding elements

---

## 21. Questions & Clarifications

Before starting development, clarify the following:

1. **Booking System**: Should this be integrated now or Phase 2?
2. **Pricing**: Should pricing information be displayed publicly?
3. **Photography**: Will new professional photos be provided, or use existing ones?
4. **Content**: Will all original WordPress content be migrated, or new content created?
5. **Backend**: Is a backend/API needed for the contact form, or client-side only?
6. **Analytics**: Which analytics platform should be integrated?
7. **Payment**: If booking is included, which payment processor?
8. **Languages**: Should Greek translation be included in Phase 1?

---

## End of PRD

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Prepared For**: Next.js Development Team  
**Project**: Androniki's Cretan House Website Rebuild  
**Framework**: Next.js 14+ (App Router)

---

## Quick Start Checklist for Developers

- [ ] Read and understand the entire PRD
- [ ] Set up Next.js 14+ project: `npx create-next-app@latest`
  - [ ] Choose App Router (not Pages Router)
  - [ ] Choose Yes for TypeScript (recommended) or No for JavaScript
  - [ ] Choose Yes for Tailwind CSS
  - [ ] Choose Yes for `src/` directory (optional)
- [ ] Install required dependencies:
  - [ ] lucide-react for icons
  - [ ] react-hook-form for form handling
  - [ ] framer-motion for animations (optional)
  - [ ] date-fns for date handling (if needed)
- [ ] Configure Tailwind CSS with custom colors and fonts
- [ ] Set up Next.js font optimization (next/font)
- [ ] Create folder structure as outlined in the PRD
- [ ] Implement root layout with Header and Footer
- [ ] Create all pages using App Router structure:
  - [ ] Home page (app/page.js)
  - [ ] Courses page (app/courses/page.js)
  - [ ] Availability page (app/courses/availability/page.js)
  - [ ] About page (app/about/page.js)
  - [ ] Recipes page (app/recipes/page.js)
  - [ ] Reviews page (app/reviews/page.js)
  - [ ] Gallery page (app/gallery/page.js)
  - [ ] Contact page (app/contact/page.js)
- [ ] Add metadata to each page using Metadata API
- [ ] Build reusable components (Button, Card, etc.)
- [ ] Implement responsive design for all breakpoints
- [ ] Add animations and interactions (mark components as 'use client' when needed)
- [ ] Optimize images using Next.js Image component
- [ ] Create API route for contact form (app/api/contact/route.js)
- [ ] Implement SEO features:
  - [ ] Metadata API for all pages
  - [ ] Structured data (JSON-LD)
  - [ ] Sitemap (app/sitemap.js)
  - [ ] Robots.txt (app/robots.js)
- [ ] Add loading states (loading.js files)
- [ ] Add error handling (error.js files)
- [ ] Conduct accessibility audit (use Lighthouse)
- [ ] Test across browsers and devices
- [ ] Configure next.config.js for production
- [ ] Set up environment variables (.env.local)
- [ ] Deploy to Vercel (or chosen platform)
- [ ] Connect custom domain
- [ ] Set up analytics (Vercel Analytics or Google Analytics)
- [ ] Final QA and launch

**Good luck with the development!** 🚀
