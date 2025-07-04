# AI Decision Splitter

## Overview

AI Decision Splitter is a comprehensive multi-page web application that helps users make informed decisions by comparing two options using both logical and emotional analysis. The application features user authentication, credit-based analysis system, admin panel, interactive charts, and AI-powered insights via Mistral API.

## System Architecture

### Multi-Page Static Application
The application is designed as a sophisticated static site with client-side routing, user management, and data persistence using localStorage. All processing occurs in the browser using vanilla JavaScript with advanced UI components.

**Key Architectural Decisions:**
- **Problem**: Platform constraint requiring static-only deployment + need for comprehensive user management
- **Solution**: Multi-page SPA architecture with client-side authentication and localStorage database
- **Rationale**: Enables full-featured application deployment on static hosting while maintaining security and user management
- **Trade-offs**: Data stored locally, API keys handled client-side

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+) with Chart.js for visualization
- **Styling**: Custom responsive CSS with Font Awesome icons and CSS Grid/Flexbox
- **Authentication**: Client-side authentication with localStorage persistence
- **Charts**: Chart.js for interactive data visualization
- **AI Integration**: Mistral API via fetch requests
- **Data Storage**: localStorage for user data + optional Google Sheets integration

## Key Components

### 1. Multi-Page Navigation System (index.html)
- **Home Page**: Hero section with pricing plans and feature overview
- **Analyze Page**: Enhanced decision analysis with dynamic factor management
- **Dashboard**: User statistics, credit tracking, and decision history
- **Authentication**: Login/register forms with two-column layout
- **Settings**: API configuration and user preferences
- **Admin Panel**: User management with searchable table (admin users only)

### 2. Enhanced Factor Management System
- **Dynamic Factor Lists**: Add/remove pros and cons with individual weight sliders (1-10)
- **Interactive Weight Sliders**: Real-time weight adjustment with visual feedback
- **Input Validation**: Real-time validation ensuring meaningful factor entries

### 3. User Authentication & Credit System
- **Client-side Authentication**: Login/register with localStorage persistence
- **Credit Management**: 2 free trial credits, tracks usage per analysis
- **User Roles**: Standard users and admin privileges
- **Session Management**: Persistent login across browser sessions

### 4. Interactive Chart Visualization (Chart.js)
- **Comparison Chart**: Bar chart showing logical vs emotional vs final scores
- **Score Breakdown**: Doughnut chart displaying logical/emotional weight distribution
- **Factor Distribution**: Radar chart showing factor counts and average weights

### 5. Core Logic Engine (script.js)
- **DecisionSplitterApp Class**: Main application controller with multi-page management
- **Enhanced Scoring Algorithms**: 
  - Logical scoring with dynamic weight sliders
  - Emotional scoring via Mistral API sentiment analysis
  - Composite scoring using configurable alpha blending (default α = 0.3)
- **Data Persistence**: localStorage for users, decisions, and settings

### 6. Advanced UI System (styles.css)
- **Responsive Navigation**: Fixed navbar with mobile hamburger menu
- **Toast Notifications**: Top-right notifications for user feedback
- **Loading Overlay**: Full-screen loading with progress indication
- **Modern Design**: Gradient backgrounds, glassmorphism effects, and smooth animations

## Data Flow

### 1. Authentication Phase
- User registration with 2 free trial credits
- Login with persistent session management
- Admin user detection and privilege assignment

### 2. Enhanced Input Phase
- Dynamic factor management with add/remove functionality
- Real-time weight adjustment using interactive sliders (1-10 scale)
- Live input validation and form state management
- Credit verification before analysis

### 3. Processing Phase
- Dynamic weight collection from slider components
- Logical score calculation: Sum of (Pro weights - Con weights) with normalization
- Mistral API calls for emotional sentiment analysis
- Credit deduction and user data updates

### 4. Enhanced Output Phase
- Multi-chart visualization using Chart.js:
  - Comparison bar charts for all score types
  - Breakdown doughnut chart for scoring methodology
  - Radar chart for factor distribution analysis
- Composite score calculation: `(1 - α) * Logical + α * Emotional`
- Results persistence to user decision history
- Optional Google Sheets export
- PDF export functionality

### 5. Data Persistence
- User data stored in localStorage
- Decision history tracking per user
- Settings and API configuration persistence
- Admin user management capabilities

## External Dependencies

### Mistral AI API
- **Purpose**: Provides AI-powered sentiment analysis and decision insights
- **Integration**: Direct fetch requests from browser
- **Authentication**: API key stored in environment variables or localStorage
- **Endpoints**: Uses Mistral's chat completion API

### Google Sheets (Optional)
- **Purpose**: Data persistence for decision history
- **Integration**: URL-based webhook or API integration
- **Configuration**: Configurable via environment variables

### Font Awesome
- **Purpose**: Icon library for enhanced UI
- **Integration**: CDN-based inclusion
- **Usage**: Decorative icons throughout interface

## Deployment Strategy

### Static Site Deployment
- **Target Platforms**: Any static hosting service (Netlify, Vercel, GitHub Pages, etc.)
- **Build Process**: No build step required - direct file deployment
- **Configuration**: Environment variables for API keys and external service URLs

### Environment Configuration
- `MISTRAL_API_KEY`: Required for AI functionality
- `GOOGLE_SHEETS_URL`: Optional for data persistence
- Fallback to localStorage for local development

### Security Considerations
- API keys exposed client-side (platform limitation)
- Input validation to prevent malicious content
- Rate limiting handled by external APIs

## Recent Changes
- **July 04, 2025 - Major Architecture Update**: Transformed from single-page app to comprehensive multi-page application
  - Implemented multi-page navigation system (Home, Analyze, Dashboard, Settings, Admin)
  - Added user authentication with login/register functionality
  - Integrated credit-based analysis system (2 free trial credits)
  - Enhanced factor management with dynamic add/remove and weight sliders
  - Added interactive Chart.js visualizations (comparison, breakdown, factor distribution)
  - Implemented admin panel with user management capabilities
  - Added toast notifications and full-screen loading overlay
  - Created responsive mobile-friendly design with hamburger navigation
  - Added PDF export and enhanced Google Sheets integration
  - Implemented decision history tracking and user dashboard

## Deployment Strategy

### Static Site Deployment
- **Target Platforms**: Any static hosting service (Netlify, Vercel, GitHub Pages, Replit Static)
- **Build Process**: No build step required - direct file deployment
- **Configuration**: 
  - Environment variables for API keys: `MISTRAL_API_KEY`, `GOOGLE_SHEETS_URL`
  - Fallback to localStorage for development and user configuration
  - Admin user: Use email `admin@example.com` during registration

### Security Considerations
- Client-side authentication with localStorage persistence
- API keys exposed client-side (platform limitation)
- Input validation and error handling
- Rate limiting handled by external APIs

## Features Implemented

✅ **Multi-Page Navigation**: Home, Analyze, Dashboard, Settings, Admin  
✅ **Enhanced Factor System**: Dynamic add/remove with weight sliders  
✅ **Interactive Charts**: Chart.js visualizations for comprehensive analysis  
✅ **Credit System**: 2 free trial credits with usage tracking  
✅ **User Authentication**: Login/register with persistent sessions  
✅ **Admin Panel**: User management with searchable table  
✅ **Toast Notifications**: User feedback system  
✅ **Loading UI**: Full-screen overlay during analysis  
✅ **Pricing Section**: Marketing page with plan options  
✅ **Mobile Responsive**: Hamburger navigation and responsive design  
✅ **PDF Export**: Decision report generation  
✅ **Decision History**: Track and review past analyses  
✅ **Settings Management**: API configuration and preferences

## User Preferences

Preferred communication style: Simple, everyday language.