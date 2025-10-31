---
description: Repository Information Overview
alwaysApply: true
---

# Studio Web Information Overview

## Repository Summary
Studio Web is a comprehensive web development platform that includes a showcase website with services and portfolio, an online store with Stripe/PayPal payment, a blog with content management system, a client area with messaging and support tickets, a complete admin dashboard, and a secure REST API with JWT authentication.

## Repository Structure
- **frontend/**: Next.js 14 application with React 18 and Tailwind CSS
- **backend/**: Node.js + Express API with PostgreSQL database
- **backend/database/**: SQL schema and seed data
- **backend/src/**: Backend source code with controllers, routes, and middleware
- **frontend/src/**: Frontend source code with components, pages, and utilities

### Main Repository Components
- **Frontend Application**: Next.js 14 web application with React 18
- **Backend API**: Express.js REST API with PostgreSQL database
- **Database Layer**: PostgreSQL database with Redis caching

## Projects

### Frontend (Next.js Application)
**Configuration File**: frontend/package.json

#### Language & Runtime
**Language**: JavaScript/TypeScript
**Version**: Node.js 18+
**Framework**: Next.js 14.2.0, React 18.3.0
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- next 14.2.0
- react 18.3.0
- axios 1.6.8
- zustand 4.5.2
- react-query 3.39.3
- framer-motion 11.0.28
- tailwindcss 3.4.3
- stripe 14.25.0

**Development Dependencies**:
- typescript 5.x
- eslint 8.x
- autoprefixer 10.4.19
- postcss 8.4.38

#### Build & Installation
```bash
cd frontend
npm install
npm run dev    # Development
npm run build  # Production build
npm start      # Production server
```

#### Testing
**Framework**: Not specified in configuration
**Run Command**:
```bash
npm run lint   # Code linting
```

### Backend (Express API)
**Configuration File**: backend/package.json

#### Language & Runtime
**Language**: JavaScript
**Version**: Node.js 18+ (specified in engines)
**Framework**: Express 4.18.2
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- express 4.18.2
- pg 8.11.3 (PostgreSQL)
- redis 4.6.12
- jsonwebtoken 9.0.2
- bcryptjs 2.4.3
- socket.io 4.6.0
- stripe 14.10.0
- nodemailer 6.9.7
- passport 0.7.0

**Development Dependencies**:
- nodemon 3.0.2
- jest 29.7.0
- supertest 6.3.3

#### Build & Installation
```bash
cd backend
npm install
npm run dev    # Development with nodemon
npm start      # Production server
```

#### Testing
**Framework**: Jest 29.7.0
**Test Location**: Not specified in configuration
**Run Command**:
```bash
npm test       # Run tests with coverage
```

## Database
**Type**: PostgreSQL 14+
**Schema**: backend/database/schema.sql
**Seed Data**: backend/database/seed.sql
**Cache**: Redis 6+

**Main Tables**:
- users - User accounts and admins
- products - Store products
- orders - Customer orders
- portfolio - Portfolio projects
- blog_posts - Blog articles
- tickets - Support tickets
- messages - Internal messaging

## Authentication
**Method**: JWT (JSON Web Tokens)
**Refresh Tokens**: Yes
**OAuth Providers**: Google
**Password Storage**: bcrypt hashing

## API Endpoints
**Base URL**: http://localhost:5000/api
**Documentation**: http://localhost:5000/api-docs

**Main Endpoints**:
- /api/auth - Authentication routes
- /api/users - User management
- /api/products - Product management
- /api/orders - Order processing
- /api/portfolio - Portfolio projects
- /api/blog - Blog content
- /api/tickets - Support tickets

## Security Features
- Helmet.js for secure HTTP headers
- CORS protection
- Rate limiting
- Input validation with Joi
- Data sanitization
- JWT with expiration and refresh tokens