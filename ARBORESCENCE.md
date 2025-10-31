# Complete Project Structure - Horizon Studio

## 📁 General Structure

```
horizonstudio/
├── backend/                          # Backend Node.js + Express
├── frontend/                         # Frontend Next.js 14
├── README.md                         # Main documentation
├── ARBORESCENCE.md                   # This file
├── install.ps1                       # Windows installation script
└── install.sh                        # Linux/Mac installation script
```

## 🔧 Backend (Node.js + Express)

```
backend/
├── src/
│   ├── config/                       # Configuration
│   │   ├── database.js              # PostgreSQL configuration
│   │   ├── redis.js                 # Redis configuration (cache)
│   │   ├── cloudinary.js            # Cloudinary configuration
│   │   ├── stripe.js                # Stripe configuration
│   │   └── paypal.js                # PayPal configuration
│   │
│   ├── controllers/                  # API Controllers
│   │   ├── authController.js        # Authentication (login, register, OAuth)
│   │   ├── productController.js     # Product management
│   │   ├── blogController.js        # Blog management
│   │   ├── ticketController.js      # Support ticket system
│   │   ├── uploadController.js      # File upload
│   │   ├── statsController.js       # Statistics and analytics
│   │   ├── contactController.js     # Contact form
│   │   ├── portfolioController.js   # Portfolio management
│   │   └── messageController.js     # Internal messaging
│   │
│   ├── middleware/                   # Middlewares
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Error handling
│   │   ├── rateLimiter.js           # Rate limiting
│   │   ├── upload.js                # Multer for uploads
│   │   └── validation.js            # Data validation
│   │
│   ├── routes/                       # API Routes
│   │   ├── auth.js                  # Authentication routes
│   │   ├── users.js                 # User routes
│   │   ├── products.js              # Product routes
│   │   ├── orders.js                # Order routes
│   │   ├── services.js              # Service routes
│   │   ├── portfolio.js             # Portfolio routes
│   │   ├── blog.js                  # Blog routes
│   │   ├── tickets.js               # Ticket routes
│   │   ├── messages.js              # Message routes
│   │   ├── upload.js                # Upload routes
│   │   ├── stats.js                 # Statistics routes
│   │   └── contact.js               # Contact routes
│   │
│   ├── utils/                        # Utilities
│   │   ├── appError.js              # Custom error class
│   │   ├── email.js                 # Email sending (Nodemailer)
│   │   ├── logger.js                # Logger (Winston)
│   │   └── helpers.js               # Utility functions
│   │
│   ├── validators/                   # Joi Validation
│   │   ├── authValidator.js         # Auth validation
│   │   ├── productValidator.js      # Product validation
│   │   ├── orderValidator.js        # Order validation
│   │   └── ...                      # Other validators
│   │
│   └── server.js                     # Main entry point
│
├── database/                         # Database
│   ├── schema.sql                   # Complete PostgreSQL schema
│   └── seed.sql                     # Test data
│
├── uploads/                          # Locally uploaded files
├── logs/                            # Application logs
├── .env.example                     # Environment variables example
├── .gitignore                       # Files to ignore by Git
└── package.json                     # Backend dependencies
```

## 🎨 Frontend (Next.js 14)

```
frontend/
├── src/
│   ├── app/                          # Next.js Pages (App Router)
│   │   ├── layout.js                # Main layout
│   │   ├── page.js                  # Homepage
│   │   ├── globals.css              # Global styles
│   │   │
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.js         # Login page
│   │   │   ├── register/
│   │   │   │   └── page.js         # Registration page
│   │   │   └── forgot-password/
│   │   │       └── page.js         # Forgot password
│   │   │
│   │   ├── services/                # Services pages
│   │   │   ├── page.js             # Services list
│   │   │   └── [slug]/
│   │   │       └── page.js         # Service detail
│   │   │
│   │   ├── portfolio/               # Portfolio pages
│   │   │   ├── page.js             # Projects list
│   │   │   └── [slug]/
│   │   │       └── page.js         # Project detail
│   │   │
│   │   ├── shop/                    # Shop pages
│   │   │   ├── page.js             # Products list
│   │   │   ├── cart/
│   │   │   │   └── page.js         # Cart
│   │   │   ├── checkout/
│   │   │   │   └── page.js         # Checkout
│   │   │   └── [slug]/
│   │   │       └── page.js         # Product detail
│   │   │
│   │   ├── blog/                    # Blog pages
│   │   │   ├── page.js             # Articles list
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.js     # Articles by category
│   │   │   └── [slug]/
│   │   │       └── page.js         # Article detail
│   │   │
│   │   ├── contact/                 # Contact page
│   │   │   └── page.js
│   │   │
│   │   ├── dashboard/               # Client area
│   │   │   ├── page.js             # Main dashboard
│   │   │   ├── profile/
│   │   │   │   └── page.js         # User profile
│   │   │   ├── orders/
│   │   │   │   ├── page.js         # Orders list
│   │   │   │   └── [id]/
│   │   │   │       └── page.js     # Order detail
│   │   │   ├── tickets/
│   │   │   │   ├── page.js         # Tickets list
│   │   │   │   └── [id]/
│   │   │   │       └── page.js     # Ticket detail
│   │   │   └── messages/
│   │   │       ├── page.js         # Messaging
│   │   │       └── [id]/
│   │   │           └── page.js     # Conversation
│   │   │
│   │   └── admin/                   # Admin dashboard
│   │       ├── page.js             # Main dashboard
│   │       ├── users/
│   │       │   └── page.js         # User management
│   │       ├── products/
│   │       │   └── page.js         # Product management
│   │       ├── orders/
│   │       │   └── page.js         # Order management
│   │       ├── services/
│   │       │   └── page.js         # Service management
│   │       ├── portfolio/
│   │       │   └── page.js         # Portfolio management
│   │       ├── blog/
│   │       │   └── page.js         # Blog management
│   │       ├── tickets/
│   │       │   └── page.js         # Ticket management
│   │       └── stats/
│   │           └── page.js         # Statistics
│   │
│   ├── components/                   # React Components
│   │   ├── layout/                  # Layout components
│   │   │   ├── Navbar.js           # Navigation bar
│   │   │   ├── Footer.js           # Footer
│   │   │   └── Sidebar.js          # Sidebar (dashboard)
│   │   │
│   │   ├── home/                    # Homepage components
│   │   │   ├── Hero.js             # Hero section
│   │   │   ├── Services.js         # Services section
│   │   │   ├── Portfolio.js        # Portfolio section
│   │   │   ├── Testimonials.js     # Testimonials
│   │   │   ├── Stats.js            # Statistics
│   │   │   └── CTA.js              # Call-to-action
│   │   │
│   │   ├── common/                  # Common components
│   │   │   ├── Button.js           # Button
│   │   │   ├── Input.js            # Input field
│   │   │   ├── Card.js             # Card
│   │   │   ├── Modal.js            # Modal
│   │   │   ├── Loader.js           # Loader
│   │   │   ├── Pagination.js       # Pagination
│   │   │   └── Badge.js            # Badge
│   │   │
│   │   ├── shop/                    # Shop components
│   │   │   ├── ProductCard.js      # Product card
│   │   │   ├── ProductGrid.js      # Product grid
│   │   │   ├── CartItem.js         # Cart item
│   │   │   └── CheckoutForm.js     # Checkout form
│   │   │
│   │   ├── dashboard/               # Dashboard components
│   │   │   ├── StatsCard.js        # Statistics card
│   │   │   ├── OrderTable.js       # Orders table
│   │   │   ├── TicketList.js       # Tickets list
│   │   │   └── Chart.js            # Charts
│   │   │
│   │   └── Providers.js             # Providers (React Query, etc.)
│   │
│   ├── lib/                          # Libraries and utilities
│   │   ├── api.js                   # Axios configuration + API calls
│   │   ├── utils.js                 # Utility functions
│   │   └── socket.js                # Socket.io configuration
│   │
│   ├── store/                        # Global state (Zustand)
│   │   ├── authStore.js             # Authentication store
│   │   ├── cartStore.js             # Cart store
│   │   └── notificationStore.js     # Notifications store
│   │
│   └── hooks/                        # Custom hooks
│       ├── useAuth.js               # Authentication hook
│       ├── useCart.js               # Cart hook
│       └── useSocket.js             # WebSocket hook
│
├── public/                           # Static assets
│   ├── images/                      # Images
│   ├── icons/                       # Icons
│   └── favicon.ico                  # Favicon
│
├── .env.example                      # Environment variables example
├── .gitignore                        # Files to ignore by Git
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
└── package.json                      # Frontend dependencies
```

## 📊 Database (PostgreSQL)

### Main Tables

1. **users** - Users and administrators
2. **refresh_tokens** - JWT refresh tokens
3. **services** - Services offered
4. **service_quotes** - Quote requests
5. **products** - Shop products
6. **cart_items** - Shopping carts
7. **orders** - Orders
8. **order_items** - Order details
9. **portfolio** - Portfolio projects
10. **portfolio_images** - Project images
11. **blog_categories** - Blog categories
12. **blog_tags** - Blog tags
13. **blog_posts** - Blog articles
14. **blog_post_tags** - Articles-tags relation
15. **testimonials** - Client testimonials
16. **tickets** - Support tickets
17. **ticket_messages** - Ticket messages
18. **messages** - Internal messaging
19. **contact_messages** - Contact form messages

## 🔑 Important Configuration Files

### Backend
- **`.env`** - Environment variables (DB, API keys, etc.)
- **`package.json`** - Dependencies and npm scripts
- **`server.js`** - Application entry point

### Frontend
- **`.env.local`** - Frontend environment variables
- **`next.config.js`** - Next.js configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`package.json`** - Dependencies and npm scripts

## 📦 Main Dependencies

### Backend
- **express** - Web framework
- **pg** - PostgreSQL client
- **redis** - Redis client
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **joi** - Data validation
- **nodemailer** - Email sending
- **cloudinary** - Media storage
- **stripe** - Payments
- **socket.io** - Real-time WebSocket
- **helmet** - HTTP security
- **cors** - CORS
- **morgan** - HTTP logger
- **winston** - Application logger

### Frontend
- **next** - React framework
- **react** - UI library
- **tailwindcss** - CSS framework
- **framer-motion** - Animations
- **axios** - HTTP client
- **react-query** - Server state management
- **zustand** - Global state management
- **react-hook-form** - Form management
- **react-hot-toast** - Notifications
- **socket.io-client** - WebSocket client
- **stripe** - Stripe integration
- **recharts** - Charts

## 🚀 NPM Scripts

### Backend
```bash
npm run dev          # Development with nodemon
npm start            # Production
npm test             # Tests
npm run lint         # Linter
```

### Frontend
```bash
npm run dev          # Development
npm run build        # Production build
npm start            # Production server
npm run lint         # Linter
```

## 📝 Notes

- All files are well documented
- Code follows ES6+ conventions
- Modular and scalable architecture
- Enhanced security (JWT, bcrypt, helmet, rate limiting)
- Responsive design (mobile-first)
- SEO optimized
- Performance optimized (lazy loading, code splitting)
- Accessibility (ARIA labels, semantic HTML)