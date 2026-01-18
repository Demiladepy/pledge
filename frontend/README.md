# PledgeAgent Frontend

A modern, production-quality React frontend for the PledgeAgent platform - where goals become accountable through crypto stakes and AI verification.

## Features

✨ **Modern Tech Stack**
- React 18 with TypeScript for type safety
- Vite for lightning-fast development
- Tailwind CSS for beautiful, responsive UI
- GSAP for smooth, performant animations
- React Icons for standard, professional icons
- React Router v6 for navigation

🎨 **Component Architecture**
- Reusable, composable component library
- Consistent design patterns across the app
- Proper TypeScript typing throughout
- Form validation with error handling
- Loading states and error boundaries

🚀 **Pages**
1. **Home Page** - Landing with feature overview and quick stats
2. **Create Goal** - Form to stake cryptocurrency and define goals
3. **Submit Proof** - Image upload with drag-and-drop, instant verification
4. **Dashboard** - User stats, streak tracking, financial overview

🎯 **Key Implementation Details**
- **No AI-generated icons** - Uses react-icons library for standard SVG icons
- **GSAP animations** - Smooth, performance-optimized animations using GreenSock
- **Clean API layer** - Typed API client with request/response validation
- **State management** - React Context + hooks, no over-engineering
- **Error handling** - User-friendly error messages and validation feedback
- **Responsive design** - Mobile-first, works on all screen sizes

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Create environment file**
```bash
cp .env.example .env.local
```

Update `.env.local` with your API URL:
```
VITE_API_URL=http://localhost:8000
```

3. **Start development server**
```bash
npm run dev
```

The frontend will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This generates optimized files in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Alert.tsx
│   │   ├── Badge.tsx
│   │   ├── Loader.tsx
│   │   ├── Layout.tsx
│   │   └── index.ts
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── CreateGoalPage.tsx
│   │   ├── SubmitProofPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── index.ts
│   ├── utils/
│   │   ├── api.ts          # Typed API client
│   │   ├── cn.ts           # Utility for className merging
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies
└── README.md              # This file
```

## API Integration

The frontend integrates with the backend API at `http://localhost:8000` with the following endpoints:

### POST /api/goals
Create a new goal with stake

**Request:**
```typescript
{
  goal_id: string
  user_id: string
  description: string
  stake_amount: number
  duration_days: number
}
```

**Response:**
```typescript
{
  goal_id: string
  user_id: string
  message: string
  stake_locked: number
}
```

### POST /api/proof/submit
Submit proof for verification

**Request:** FormData with goal_id, user_id, image_file

**Response:**
```typescript
{
  verdict: 'APPROVED' | 'REJECTED'
  confidence: number
  message: string
  fraud_signals: string[]
  recommendation: string
}
```

### GET /api/user/{user_id}/stats
Get user statistics

**Response:**
```typescript
{
  user_id: string
  total_goals: number
  approved_count: number
  rejected_count: number
  approval_rate: number
  total_stake_locked: number
  current_streak: number
  personality_mode: string
}
```

### GET /api/metrics/dashboard
Get platform metrics

**Response:**
```typescript
{
  total_verifications: number
  approval_rate: number
  fraud_detection_rate: number
  average_confidence: number
  active_users: number
  total_stake_locked: number
}
```

## Styling

The project uses **Tailwind CSS** with custom extensions:

- **Colors**: primary, secondary, success, danger, warning
- **Animations**: fade-in, slide-up, pulse-soft
- **Custom keyframes**: defined in tailwind.config.js

All components use utility classes for consistency and maintainability.

## Animations with GSAP

Animations are implemented using GreenSock (GSAP) for:
- Smooth page transitions
- Staggered element animations
- Success/error feedback animations
- Hover effects and interactive feedback

Example:
```typescript
gsap.from(element, {
  duration: 0.6,
  opacity: 0,
  y: 20,
  ease: 'power2.out',
})
```

## Component Library

### Button
```typescript
<Button variant="primary" size="lg" isLoading={false} icon={<Icon />}>
  Click me
</Button>
```

### Card
```typescript
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Input
```typescript
<Input
  label="Email"
  type="email"
  error="Invalid email"
  helperText="Enter a valid email"
/>
```

### Alert
```typescript
<Alert type="success" title="Success!" onClose={onClose}>
  Goal created successfully
</Alert>
```

### Loader
```typescript
<Loader size="md" />
<LoadingState isLoading={loading}>
  Your content here
</LoadingState>
```

## Development

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for consistent formatting

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

### Best Practices
1. **Components are small and focused** - each does one thing well
2. **Props are typed** - no implicit `any` types
3. **Consistent naming** - clear, descriptive names
4. **DRY principle** - reusable utilities and components
5. **Error handling** - graceful fallbacks and user feedback
6. **Performance** - optimized animations, code splitting, lazy loading ready

## Testing the Frontend

### Without Backend
You can still test the frontend's UI/UX without the backend by:
1. Mock data in components
2. Use browser DevTools to simulate network requests

### With Backend
1. Start the backend: `python backend/api/main.py`
2. Start the frontend: `npm run dev`
3. Create a goal, submit proof, view dashboard
4. Check browser DevTools Network tab for API calls

## Known Limitations & Next Steps

✅ **Implemented**
- All core pages and navigation
- API integration layer
- Responsive design
- GSAP animations
- Component library

❌ **Future Enhancements**
- User authentication (JWT/OAuth)
- Smart contract wallet integration (Web3.js)
- Real-time updates (WebSocket)
- Offline support (Service Workers)
- Dark mode
- Internationalization (i18n)
- Advanced analytics

## Environment Variables

```env
VITE_API_URL=http://localhost:8000  # Backend API URL
```

## License

Part of the PledgeAgent project - making goals accountable.

## Support

For issues or questions:
1. Check the backend API is running at `http://localhost:8000`
2. Review browser console for errors
3. Check Network tab in DevTools for API failures
4. Verify environment variables are set correctly
