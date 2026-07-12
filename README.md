# AssetFlow ERP

A modern, high-performance Asset Management System built with React, Vite, and Tailwind CSS. The interface features premium animations via Framer Motion, Lottie, and sleek styling designed for enterprise use.

## Features Included (Frontend Only)
This repository contains the frontend mockups and UI implementations for the following screens:

1. **Login Page**
   - Split-screen layout.
   - Validation and loading states.
   - Routing logic to Dashboard or Pending Approval screen.

2. **Pending Approval Page**
   - Full-screen animated waiting state for newly registered employees.

3. **Admin Dashboard Layout**
   - Responsive Sidebar navigation.
   - Top Header with Notification Dropdown and Profile snippet.

4. **Dashboard Modules**:
   - **Reports**: Animated Recharts data visualizations and stat cards.
   - **Organization Setup**: Company profile, asset prefix, financial config forms.
   - **Departments**: Management list of all company departments.
   - **Categories**: Asset classifications (Laptop, Monitor, Vehicle, etc.).
   - **Employee Directory**: Split view showing employee list and detailed profiles.
   - **Assets**: Main asset tracking table with filters, search, and assignments.
   - **Activity Logs**: Timeline view of all system actions.
   - **Settings**: System-wide configuration options.

## Dummy Data Integration
All data is sourced from a single JSON file: `src/data/dummyData.json`.
This makes it incredibly easy for backend engineers to replace the dummy JSON structure with actual API calls to a real database. The dummy data represents the expected schema for `organization`, `users`, `departments`, `categories`, `assets`, `activities`, and `notifications`.

## Tech Stack
- React 18+ (Vite)
- Tailwind CSS (Vanilla configuration with extended colors)
- Framer Motion (Page transitions, micro-animations)
- Recharts (Data visualization)
- Lucide React (Icons)
- React Router DOM (Navigation)

## Getting Started

First, install all dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Design Highlights
- **Glassmorphism**: Translucent panels and deep blur effects used extensively across the dashboard.
- **Micro-interactions**: Hover effects, smooth transitions on list items, and animated borders.
- **Dark Mode Aesthetic**: A sleek, slate and deep-blue color palette mimicking premium modern software.
