# AI Decision Splitter

## Overview

AI Decision Splitter is a client-side web application that helps users make informed decisions by comparing two options using both logical and emotional analysis. The application leverages the Mistral AI API to provide sentiment analysis and decision insights, combining quantitative scoring with AI-powered emotional intelligence.

## System Architecture

### Frontend-Only Architecture
The application is designed as a static site with no backend dependencies, making it suitable for deployment on platforms that only support static hosting. All processing occurs in the browser using vanilla JavaScript.

**Key Architectural Decisions:**
- **Problem**: Platform constraint requiring static-only deployment
- **Solution**: Pure client-side architecture using HTML, CSS, and JavaScript
- **Rationale**: Enables deployment on static hosting platforms while maintaining full functionality
- **Trade-offs**: API keys must be handled client-side, limiting security options

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Font Awesome icons
- **AI Integration**: Mistral API via fetch requests
- **Data Storage**: Optional Google Sheets integration for persistence

## Key Components

### 1. User Interface (index.html)
- Responsive web interface with mobile-friendly design
- Input forms for two decision options (A and B)
- Text areas for pros and cons with optional weight syntax
- Results display area with analysis breakdown

### 2. Core Logic Engine (script.js)
- **DecisionSplitter Class**: Main application controller
- **Input Processing**: Parses pros/cons with optional weight extraction using syntax "Item | weight"
- **Scoring Algorithms**: 
  - Logical scoring based on weighted pros/cons
  - Emotional scoring via Mistral API sentiment analysis
  - Composite scoring using alpha blending (α = 0.3)

### 3. Styling System (styles.css)
- Modern gradient background design
- Card-based layout for options
- Responsive design with mobile optimization
- Loading states and error handling UI

## Data Flow

### 1. Input Phase
- User enters decision options with pros/cons
- Optional weight assignment using pipe syntax
- Input validation and parsing

### 2. Processing Phase
- Weight normalization per option
- Logical score calculation: Sum of (Pro weights - Con weights)
- Three sequential Mistral API calls:
  1. Input summarization
  2. Emotional sentiment scoring
  3. Final decision analysis

### 3. Output Phase
- Composite score calculation: `(1 - α) * Logical + α * Emotional`
- Results display with detailed breakdown
- Optional data persistence to Google Sheets

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

## Changelog
- July 04, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.