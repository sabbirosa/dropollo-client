# Dropollo: Parcel Delivery System Client

A modern, responsive, and feature-rich frontend application for the Dropollo parcel delivery system. Built with React and TypeScript, this client provides an intuitive user interface for senders, receivers, and administrators to manage parcel deliveries, track shipments, and access comprehensive analytics.

## 🌐 Live Applications

- **Frontend**: [https://dropollo.vercel.app](https://dropollo.vercel.app)
- **Backend API**: [https://dropollo-api.vercel.app](https://dropollo-api.vercel.app)

## 📚 Repository Links

- **Client Repository**: [https://github.com/sabbirosa/dropollo-client](https://github.com/sabbirosa/dropollo-client)
- **API Repository**: [https://github.com/sabbirosa/dropollo-api](https://github.com/sabbirosa/dropollo-api)

## 🚀 Features

- **Responsive Design**: Mobile-first approach with adaptive layouts for all devices
- **Role-Based Dashboard**: Tailored interfaces for Admin, Sender, and Receiver roles
- **Real-time Parcel Tracking**: Public tracking system with detailed status updates
- **Interactive Analytics**: Comprehensive charts and statistics for business insights
- **Modern UI/UX**: Beautiful, intuitive interface built with Radix UI components
- **Theme Support**: Light/dark mode with system preference detection
- **Form Validation**: Robust form handling with Zod schema validation
- **State Management**: Efficient state management with Redux Toolkit
- **Type Safety**: Full TypeScript implementation for better development experience

## 🛠️ Technology Stack

| Category           | Technology        | Purpose                                    |
| ------------------ | ----------------- | ------------------------------------------ |
| **Framework**      | React 19          | Modern React with latest features         |
| **Language**       | TypeScript        | Type-safe development                      |
| **Build Tool**     | Vite              | Fast development and build tooling        |
| **Styling**        | Tailwind CSS      | Utility-first CSS framework               |
| **UI Components**  | Shadcn         | Accessible, unstyled UI primitives        |
| **State Management**| Redux Toolkit     | Predictable state management              |
| **Routing**        | React Router      | Client-side routing                       |
| **Forms**          | React Hook Form   | Performant forms with validation         |
| **Validation**     | Zod               | TypeScript-first schema validation        |
| **HTTP Client**    | Axios             | Promise-based HTTP client                 |
| **Charts**         | Recharts          | Composable charting library               |
| **Icons**          | Lucide React      | Beautiful, customizable icons             |
| **Date Handling**  | date-fns          | Modern date utility library               |
| **Theming**        | next-themes       | Theme switching and system preference     |
| **Notifications**  | Sonner            | Toast notifications                       |

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser with ES6+ support

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sabbirosa/dropollo-client.git
cd dropollo-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://dropollo-api.vercel.app/api/v1

# Frontend Configuration
VITE_APP_NAME=Dropollo
VITE_APP_VERSION=1.0.0
```

### 4. Run the Application

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm run preview
```

The application will be available at `http://localhost:5173` (development) or the preview URL (production build).

## 📱 Application Structure

### Public Pages

| Page              | Description                                    | Access        |
| ----------------- | ---------------------------------------------- | ------------- |
| **Home**          | Landing page with service overview             | Public        |
| **About**         | Company information and mission                | Public        |
| **Services**      | Detailed service offerings                     | Public        |
| **Pricing**       | Transparent pricing structure                  | Public        |
| **Contact**       | Contact form and information                   | Public        |
| **Track Parcel**  | Public parcel tracking system                  | Public        |
| **Login**         | User authentication                            | Public        |
| **Registration**  | New user account creation                      | Public        |

### Role-Based Dashboards

#### 🏠 Sender Dashboard

| Feature           | Description                                    |
| ----------------- | ---------------------------------------------- |
| **Create Parcel** | Form to create new delivery requests          |
| **My Parcels**    | View and manage all created parcels           |
| **Profile**       | Personal information and settings              |

#### 📦 Receiver Dashboard

| Feature              | Description                                    |
| -------------------- | ---------------------------------------------- |
| **Incoming Parcels** | View parcels addressed to the receiver        |
| **Delivery History** | Track completed deliveries                     |
| **Profile**          | Personal information and settings              |

#### 👑 Admin Dashboard

| Feature              | Description                                    |
| -------------------- | ---------------------------------------------- |
| **User Management**  | Manage all system users                        |
| **Parcel Management**| Oversee all parcel operations                 |
| **Analytics**        | System-wide statistics and insights            |
| **Settings**         | System configuration                           |
| **Profile**          | Admin account management                       |

## 🎨 UI Components

The application uses a comprehensive set of reusable UI components built with Radix UI primitives and styled with Tailwind CSS:

### Core Components

- **Layout Components**: MainLayout, DashboardLayout, Navbar, Sidebar
- **Form Components**: Input, Select, Textarea, Password Input
- **Data Display**: Table, Card, Badge, Avatar
- **Navigation**: Breadcrumb, Navigation Menu, Pagination
- **Feedback**: Alert Dialog, Toast, Tooltip, Progress
- **Interactive**: Button, Dialog, Dropdown Menu, Collapsible

### Design System

- **Color Palette**: Consistent color scheme with light/dark variants
- **Typography**: Hierarchical text system with proper contrast
- **Spacing**: Systematic spacing scale using Tailwind's spacing utilities
- **Responsive**: Mobile-first responsive design with breakpoint system
- **Accessibility**: WCAG compliant components with proper ARIA labels

## 🔐 Authentication & Authorization

### User Roles

- **Admin**: Full system access and management capabilities
- **Sender**: Create and manage outgoing parcels
- **Receiver**: View and confirm incoming parcels

### Security Features

- **JWT Token Management**: Secure token handling with automatic refresh
- **Protected Routes**: Role-based access control for all dashboard features
- **Session Management**: Automatic logout on token expiration
- **Input Sanitization**: Client-side validation and sanitization

## 📊 State Management

### Redux Store Structure

- **Auth Slice**: User authentication and profile management
- **Parcel Slice**: Parcel data and operations
- **User Slice**: User management and statistics
- **UI Slice**: Application state and theme preferences

### API Integration

- **RTK Query**: Efficient API data fetching and caching
- **Optimistic Updates**: Immediate UI updates with background sync
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Proper loading indicators and skeleton screens

## 🎯 Key Features

### Parcel Management

- **Create Parcels**: Intuitive form with validation and fee calculation
- **Track Parcels**: Real-time status updates with detailed history
- **Manage Parcels**: Edit, cancel, and monitor parcel status
- **Bulk Operations**: Efficient handling of multiple parcels

### Analytics & Reporting

- **Dashboard Metrics**: Key performance indicators and trends
- **Charts & Graphs**: Visual representation of data using Recharts
- **Export Functionality**: Data export capabilities for reporting
- **Real-time Updates**: Live data refresh for current information

### User Experience

- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Mode**: Theme switching with system preference detection
- **Keyboard Navigation**: Full keyboard accessibility support
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: User-friendly error messages and recovery options

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Code Quality

- **ESLint**: Code linting with React-specific rules
- **TypeScript**: Strict type checking and validation
- **Prettier**: Code formatting and consistency
- **Git Hooks**: Pre-commit validation and formatting

## 🚀 Deployment

### Vercel Deployment

The application is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch
