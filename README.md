# OVU WebUser - Enterprise Next.js Application

A modern, enterprise-level Next.js application built with TypeScript, Tailwind CSS, and industry best practices.

## Features

- **Next.js 15** - Latest version with App Router
- **TypeScript** - Full type safety across the application
- **Tailwind CSS** - Utility-first CSS framework
- **React Query (TanStack Query)** - Powerful data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form + Zod** - Form handling with schema validation
- **Axios** - HTTP client with interceptors
- **ESLint + Prettier** - Code quality and formatting
- **Security Headers** - Enterprise-grade security configuration

## Project Structure

```
ovu-webuser/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── forms/            # Form components
│   │   ├── layouts/          # Layout components
│   │   └── features/         # Feature-specific components
│   ├── lib/                  # Library code
│   │   ├── api/              # API client configuration
│   │   ├── utils/            # Utility functions
│   │   └── constants/        # Constants
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── services/             # API service functions
│   ├── config/               # Configuration files
│   └── providers/            # Context providers
├── public/                   # Static files
├── .env.local.example       # Environment variables template
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

### Code Quality

Run linting:
```bash
npm run lint
```

## Key Files and Configurations

### API Client

The API client is configured in `src/lib/api/client.ts` with interceptors for:
- Automatic token injection
- Error handling
- Request/response logging (in development)

### Environment Configuration

Environment variables are typed and validated in `src/config/env.ts`.

### TypeScript Configuration

Path aliases are configured in `tsconfig.json`:
- `@/*` - Root src directory
- `@/components/*` - Components directory
- `@/lib/*` - Library code
- `@/hooks/*` - Custom hooks
- `@/types/*` - Type definitions
- `@/services/*` - API services
- `@/config/*` - Configuration
- `@/providers/*` - Context providers

### Security Headers

Security headers are configured in `next.config.ts` including:
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## Components

### UI Components

Reusable UI components are located in `src/components/ui/`:
- `Button` - Customizable button with variants and sizes
- `Input` - Form input with label, error, and helper text support

### Layout Components

- `MainLayout` - Main application layout with header and navigation

## State Management

- **React Query** - Server state management
- **Zustand** - Client state management (configure in `src/store/`)
- **React Context** - Global providers (QueryProvider)

## Best Practices

1. **Type Safety** - Use TypeScript for all new files
2. **Component Structure** - Keep components small and focused
3. **File Organization** - Follow the established folder structure
4. **Code Style** - Use Prettier and ESLint configurations
5. **API Calls** - Use the configured API client with React Query
6. **Environment Variables** - Use the `env` object from `@/config/env`
7. **Styling** - Use Tailwind CSS utility classes with the `cn()` helper

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Dependencies

### Core
- next
- react
- react-dom
- typescript

### State & Data Management
- @tanstack/react-query
- zustand
- axios

### Forms & Validation
- react-hook-form
- zod
- @hookform/resolvers

### Utilities
- date-fns
- clsx
- tailwind-merge

### Styling
- tailwindcss
- @tailwindcss/postcss

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

## License

This project is proprietary and confidential.
