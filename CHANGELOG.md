# CHANGELOG

All notable changes to Decision AI are documented in this file. This helps developers and maintainers understand the evolution of the project.

## Project Overview

**Decision AI** is a comprehensive static web application built with pure HTML, CSS, and JavaScript that helps users make informed decisions by analyzing two options using both logical and emotional intelligence powered by AI.

---

## [2.0.0] - July 05, 2025

### ✨ Major Features & Architectural Changes

#### 🏗️ **App Rebranding**
- **BREAKING**: Changed app name from "AI Decision Splitter" to "Decision AI"
- Updated all references in HTML, navigation, and landing page content
- Modernized branding throughout the application

#### 🔑 **Shared API Integration**
- **BREAKING**: Removed user-provided API key requirement
- Implemented shared Mistral AI API keys with fallback system
- Added intelligent fallback analysis when API keys are unavailable
- Users no longer need to configure API keys manually
- Enhanced user experience with zero-setup AI functionality

#### 💾 **Database Migration**
- **BREAKING**: Replaced Google Sheets integration with JSONBin.io
- Implemented free cloud database storage using JSONBin
- Added automatic fallback to localStorage when cloud database unavailable
- Removed complex Google Apps Script setup requirements
- Simplified data persistence architecture

#### 🎯 **Tooltip System**
- Added comprehensive tooltip system for user guidance
- Implemented CSS-based tooltips with hover animations
- Added tooltips to key analysis page features:
  - Option name inputs with examples
  - Pros/cons sections with best practices
  - Weight sliders with importance guidance
- Enhanced user experience with contextual help

#### 📄 **Enhanced Landing Page**
- **BREAKING**: Complete landing page redesign with conversion-focused copy
- Added problem/solution comparison section
- Implemented 6 detailed use case scenarios:
  - Career moves and job decisions
  - Life decisions and relocations
  - Business choices and investments
  - Education paths and learning
  - Personal life and health decisions
  - Team decisions and hiring
- Added step-by-step "How It Works" process
- Included social proof with statistics and testimonials
- Enhanced mobile responsive design
- Improved call-to-action buttons and messaging

### 🐛 **Bug Fixes**
- Fixed JavaScript null reference error in `addFactor()` function
- Added comprehensive null checks and error handling
- Improved navigation visibility logic for logged-in users
- Enhanced error handling in API calls with better fallback mechanisms

### 🎨 **UI/UX Improvements**
- Hidden home navigation link for logged-in users
- Added responsive design improvements for mobile landing page sections
- Enhanced tooltip styling with shadow effects and smooth animations
- Improved button and section spacing throughout application

### 🔧 **Technical Improvements**
- Refactored API key management system
- Implemented robust fallback mechanisms for all external services
- Enhanced data persistence with cloud-first, localStorage-fallback approach
- Improved error handling and user feedback systems
- Added comprehensive input validation and sanitization

### 📱 **Mobile Responsiveness**
- Enhanced mobile layout for new landing page sections
- Fixed grid layouts on smaller screens
- Improved touch interactions for mobile users
- Responsive font sizing for statistics and testimonials

---

## [1.0.0] - July 04, 2025

### 🎉 **Initial Release**

#### 🏗️ **Core Architecture**
- Multi-page static web application architecture
- Client-side routing system with vanilla JavaScript
- LocalStorage-based data persistence
- Responsive CSS Grid and Flexbox layouts

#### 🔐 **User Authentication System**
- Client-side authentication with localStorage persistence
- User registration and login functionality
- Session management across browser sessions
- Admin user privileges (admin@example.com)
- Credit-based system with 2 free trial credits

#### 🧠 **Decision Analysis Engine**
- Dual-mode analysis combining logical and emotional intelligence
- Dynamic factor management with weight sliders (1-10 scale)
- Mistral AI integration for emotional sentiment analysis
- Composite scoring with configurable alpha blending
- Real-time input validation and form management

#### 📊 **Interactive Visualizations**
- Chart.js integration for data visualization
- Comparison bar charts for logical vs emotional vs final scores
- Score breakdown doughnut charts
- Factor distribution radar charts
- Dynamic chart updates with real-time data

#### 🏠 **Multi-Page Navigation**
- **Home Page**: Hero section with pricing plans and features
- **Analyze Page**: Core decision analysis functionality
- **Dashboard**: User statistics and decision history
- **Settings**: API configuration and preferences
- **Admin Panel**: User management (admin access only)
- **Authentication**: Login/register with two-column layout

#### 🎨 **Modern UI Design**
- Gradient backgrounds with glassmorphism effects
- Toast notification system for user feedback
- Loading overlay with progress indication
- Mobile-responsive hamburger navigation
- Font Awesome icons throughout interface

#### 💾 **Data Management**
- Google Sheets integration via Apps Script
- PDF export functionality using jsPDF
- Decision history tracking per user
- Local storage backup and sync

#### 📱 **Mobile Experience**
- Fully responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized mobile navigation and interactions
- Progressive enhancement approach

### 🔧 **Technical Stack**
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Charts**: Chart.js for interactive visualizations
- **Icons**: Font Awesome 6.0
- **Storage**: LocalStorage + Google Sheets integration
- **AI**: Mistral AI API integration
- **Export**: jsPDF for report generation

### 🎯 **Key Features Delivered**
- ✅ Dynamic factor management with add/remove functionality
- ✅ Interactive weight sliders with real-time updates
- ✅ Multi-chart visualization system
- ✅ User authentication and session management
- ✅ Credit system with usage tracking
- ✅ Admin panel with user management
- ✅ PDF export and data persistence
- ✅ Mobile-responsive design
- ✅ Toast notifications and loading states

---

## Development Guidelines

### 🏗️ **Architecture Decisions**
- **Static Site Deployment**: All functionality runs client-side for maximum compatibility
- **No Build Process**: Direct file deployment without compilation steps
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Mobile-First Design**: Responsive design starting from mobile breakpoints

### 🔒 **Security Considerations**
- Client-side authentication (platform limitation)
- Input validation and sanitization
- XSS protection through proper escaping
- Rate limiting handled by external APIs

### 🧪 **Testing Strategy**
- Manual testing across multiple browsers
- Mobile device testing for responsive design
- API integration testing with error scenarios
- User workflow testing for critical paths

### 📦 **Deployment Strategy**
- **Target Platforms**: Any static hosting (Netlify, Vercel, GitHub Pages, Replit)
- **Zero Dependencies**: No build process required
- **Environment Variables**: API keys and service URLs
- **Fallback Systems**: LocalStorage when external services unavailable

---

## Migration Notes

### From v1.0.0 to v2.0.0
- **API Keys**: Users no longer need to provide Mistral API keys
- **Database**: Google Sheets setup is no longer required
- **Branding**: Update any external references to use "Decision AI"
- **Landing Page**: New conversion-focused content structure

### Breaking Changes
- Removed user API key configuration requirement
- Replaced Google Sheets with JSONBin.io integration
- Changed application name and branding
- Restructured landing page content and navigation

---

## Contributors

This project represents a comprehensive decision-making platform built with modern web technologies and best practices for static site deployment.

### Key Milestones
- **July 04, 2025**: Initial multi-page application release
- **July 05, 2025**: Major UX improvements and shared API integration

---

## Future Roadmap

### Planned Features
- Advanced analytics and decision pattern tracking
- Team collaboration features
- Decision templates and presets
- Enhanced mobile app experience
- Integration with additional AI providers

### Technical Improvements
- WebAssembly integration for performance
- Service Worker for offline functionality
- Enhanced accessibility features
- Internationalization support

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/) principles and [Semantic Versioning](https://semver.org/) standards.*