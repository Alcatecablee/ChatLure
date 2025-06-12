# ChatLure - Interactive Chat Story Platform

## Overview

ChatLure is a modern interactive chat story platform that simulates WhatsApp-style conversations with dramatic storylines. The application uses a full-stack architecture with React frontend, Express backend, and PostgreSQL database, designed to create an engaging social media experience around story sharing and consumption.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the client application
- **Vite** as the build tool and development server
- **Tailwind CSS** with shadcn/ui components for styling
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Framer Motion** for animations and transitions

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design for data operations
- **Clerk** for authentication and user management
- **PayPal SDK** integration for payment processing
- **Drizzle ORM** for database operations

### Database Layer
- **PostgreSQL** as the primary database (Neon serverless)
- **Drizzle ORM** for type-safe database queries
- Schema includes: stories, messages, users, categories, payments, subscriptions

## Key Components

### Story Management System
- Interactive chat story creation and editing
- Real-time message simulation with typing indicators
- Story categorization with visual themes
- View/share/like tracking and analytics
- Cliffhanger levels and engagement metrics

### User Experience Features
- Mobile-first responsive design
- WhatsApp-style chat interface simulation
- Social sharing integration (Instagram, TikTok, Twitter, Facebook)
- Streak counters and achievement systems
- Battery/juice system for story unlocking

### Admin Dashboard
- Comprehensive story management interface
- Chat editor with real-time preview
- User management and analytics
- Payment processing and subscription management
- Site settings and configuration

### Payment Integration
- PayPal integration for subscriptions and one-time payments
- Multiple subscription tiers (Starter, Pro, Unlimited)
- Guest checkout capabilities
- Juice/battery top-up system

## Data Flow

1. **User Authentication**: Clerk handles user registration, login, and session management
2. **Story Consumption**: Users browse stories, simulate chat conversations, and engage through likes/shares
3. **Content Management**: Admins create/edit stories through the chat editor interface
4. **Payment Processing**: PayPal handles subscription payments and juice purchases
5. **Analytics Tracking**: User engagement data flows to analytics dashboards

## External Dependencies

### Authentication
- **Clerk**: Complete user authentication and management solution
- Handles user sessions, profile management, and security

### Payment Processing
- **PayPal SDK**: Payment processing for subscriptions and purchases
- Supports both sandbox and production environments
- Webhook handling for payment status updates

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- Automatic scaling and backup management
- SSL-enabled secure connections

### UI Framework
- **shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first CSS framework

## Deployment Strategy

### Development Environment
- Replit-based development with hot reloading
- Local PostgreSQL connection to Neon database
- Environment variables managed through .env.local

### Production Deployment
- Vite build process creates optimized static assets
- Express server serves both API and static files
- Automatic deployment through Replit's autoscale infrastructure

### Database Management
- Drizzle migrations for schema changes
- Seed scripts for initial data population
- Backup and restore capabilities through SQL dumps

## Changelog
- June 12, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.