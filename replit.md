# Overview

Woodinn Home is an ecommerce platform designed for a home and electrical retail company based in Nsawam, Ghana. The application provides a modern, mobile-friendly online shopping experience for local customers to browse and purchase furniture, electronics, and home decor items. The platform emphasizes trustworthiness, simplicity, and local payment preferences including cash on delivery and mobile money integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using React 18 with TypeScript in a Single Page Application (SPA) architecture. The routing is handled by Wouter for lightweight navigation. The UI is constructed using shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements. Tailwind CSS is used for styling with a custom design system featuring warm colors (orange primary, red secondary) and comprehensive theming support including dark mode.

State management is handled through a combination of Zustand stores for client-side state (auth, cart) and TanStack Query for server state management and caching. The application uses React Hook Form with Zod validation for form handling throughout the platform.

Key features include:
- Product browsing with categories, search, and filtering
- Shopping cart functionality with persistent state
- Checkout flow with multiple payment options
- User account management and order history
- Admin panel for product and order management
- WhatsApp integration for customer support

## Backend Architecture
The server follows a REST API architecture built with Express.js and TypeScript. The application uses a layered architecture pattern with clear separation between routes, storage abstraction, and business logic.

The storage layer is abstracted through an IStorage interface, allowing for flexible database implementations. Currently configured for PostgreSQL with Drizzle ORM, the system supports:
- User management and authentication
- Product catalog with categories, reviews, and inventory
- Shopping cart operations
- Order processing and management
- Administrative functions

The server includes middleware for request logging, error handling, and development tools integration (Vite HMR, Replit-specific plugins).

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes:

- **Users**: Authentication and profile management with admin role support
- **Categories**: Product organization with slug-based routing
- **Products**: Comprehensive product data including pricing, inventory, images, specifications, and ratings
- **Reviews**: Customer feedback system with ratings
- **Cart Items**: Shopping cart persistence
- **Orders**: Order management with items and status tracking

The database schema uses UUID primary keys and includes proper foreign key relationships. JSON fields are used for flexible data like product specifications and arrays for images and tags.

## Authentication and Authorization
The system uses a simple authentication pattern with JWT-like session management through Zustand persistence. User roles are supported through an `isAdmin` boolean flag, enabling administrative functions. The auth store maintains user state across browser sessions.

## External Dependencies

### UI and Styling
- **shadcn/ui + Radix UI**: Component library providing accessible, customizable UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### State Management and Data Fetching
- **TanStack Query**: Server state management, caching, and synchronization
- **Zustand**: Client-side state management for auth and cart
- **React Hook Form + Zod**: Form handling and validation

### Database and ORM
- **PostgreSQL**: Primary database (configured via DATABASE_URL)
- **Drizzle ORM**: Type-safe database operations and migrations
- **Neon Database**: Serverless PostgreSQL provider

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Server-side bundling for production

### Third-party Integrations
- **WhatsApp**: Customer support integration through direct links
- **Mobile Money**: Payment integration (Ghana-specific)
- **Cash on Delivery**: Local payment preference support

The application is optimized for mobile-first usage with progressive web app capabilities and designed specifically for the Ghanaian market with appropriate payment methods and user experience considerations.