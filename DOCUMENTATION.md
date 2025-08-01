# Makin User Website - Project Documentation

## Overview
This is a React-based JSX application for the Makin Heavy Machinery Rental platform. The project has been converted from TypeScript to JSX while maintaining all original functionality and design.

## Project Structure

```
makin-jsx/
├── public/
│   └── vite.svg                    # Vite logo
├── src/
│   ├── components/
│   │   ├── booking/
│   │   │   └── BookingCard.jsx     # Main booking form component
│   │   ├── layout/
│   │   │   ├── Header.jsx          # Navigation header with auth
│   │   │   └── Footer.jsx          # Site footer with links
│   │   ├── maps/
│   │   │   └── MapComponent.jsx    # Mock map display component
│   │   └── ui/
│   │       ├── Button.jsx          # Reusable button component
│   │       ├── Input.jsx           # Reusable input component
│   │       └── LoadingSpinner.jsx  # Loading indicator component
│   ├── context/
│   │   ├── AuthContext.jsx         # User authentication state
│   │   └── BookingContext.jsx      # Booking form state
│   ├── pages/
│   │   ├── AuthPage.jsx            # Login/signup page
│   │   ├── BookingPage.jsx         # Equipment booking page
│   │   ├── ComponentLibrary.jsx    # UI component showcase
│   │   ├── Homepage.jsx            # Main landing page
│   │   ├── ProfilePage.jsx         # User profile page
│   │   ├── ResultsPage.jsx         # Search results page
│   │   └── SearchPage.jsx          # Equipment search page
│   ├── App.jsx                     # Main application component
│   ├── index.css                   # Global styles with Tailwind
│   └── main.jsx                    # Application entry point
├── dist/                           # Build output directory
├── node_modules/                   # Dependencies
├── .gitignore                      # Git ignore rules
├── eslint.config.js               # ESLint configuration
├── index.html                      # HTML template
├── package.json                    # Project dependencies and scripts
├── postcss.config.js              # PostCSS configuration
├── README.md                       # Project readme
├── tailwind.config.js             # Tailwind CSS configuration
├── vite.config.js                 # Vite build configuration
└── DOCUMENTATION.md               # This file
```

## Key Features

### 🎨 UI Components
- **Button**: Configurable button with multiple variants (primary, secondary, ghost, danger)
- **Input**: Form input with icon support and error states
- **LoadingSpinner**: Animated loading indicator
- **BookingCard**: Equipment rental booking form

### 🏗️ Layout Components
- **Header**: Responsive navigation with user authentication
- **Footer**: Site footer with company information and links

### 📱 Pages
- **Homepage**: Hero section with map background and booking card
- **SearchPage**: Equipment search functionality
- **ResultsPage**: Display search results
- **BookingPage**: Equipment booking details
- **AuthPage**: User authentication (login/signup)
- **ProfilePage**: User profile management
- **ComponentLibrary**: UI component showcase

### 🔧 State Management
- **AuthContext**: Manages user authentication state
- **BookingContext**: Manages booking form data

## Design System

### Colors
- **Primary Orange**: `#ff6f03` (makin-orange)
- **Deep Orange**: `#f47621` (makin-deep-orange)
- **Black**: `#161616` (makin-black)
- **Gray**: `#525353` (makin-gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
All components follow consistent design patterns:
- Rounded corners (lg = 0.5rem)
- Consistent spacing using Tailwind scale
- Hover and focus states
- Responsive design

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Technology Stack

- **React 18**: Frontend framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Icon library
- **PostCSS**: CSS processing
- **ESLint**: Code linting

## File Naming Conventions

- **Components**: PascalCase with `.jsx` extension
- **Pages**: PascalCase with `.jsx` extension
- **Context**: PascalCase with `Context.jsx` suffix
- **Configuration**: kebab-case with appropriate extension

## Architecture Patterns

### Component Structure
```jsx
import React from 'react';
import { /* dependencies */ } from 'library';

const ComponentName = ({ prop1, prop2 = 'default' }) => {
  // State and hooks
  // Event handlers
  // Render logic
  
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### Context Pattern
```jsx
const Context = createContext(undefined);

export const useContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContext must be used within Provider');
  }
  return context;
};

export const Provider = ({ children }) => {
  // State logic
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};
```

## Deployment

The project builds to static files in the `dist/` directory and can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Code splitting with React Router
- Lazy loading of components
- Optimized bundle size with Vite
- Tree shaking of unused code
- CSS purging with Tailwind

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
