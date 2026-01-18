# Frontend Development Guide

This guide explains the architecture, design decisions, and how to extend the PledgeAgent frontend.

## Architecture Overview

### High-Level Flow

```
User (Browser)
    ↓
React Router
    ↓
Page Component
    ├─ State (useState, Context)
    ├─ Effects (useEffect)
    ├─ API Calls (utils/api.ts)
    └─ UI Components (components/)
         ├─ Button, Input, Card, etc.
         └─ Tailwind CSS + GSAP
```

### Key Design Decisions

1. **No Redux/Complex State Management**
   - Pages manage their own state with `useState`
   - API calls are wrapped in try-catch with loading/error states
   - Simpler to reason about, less boilerplate
   - Upgrade to Context/Redux if app grows

2. **Typed API Layer**
   - Single source of truth for API calls in `utils/api.ts`
   - All requests/responses are typed
   - Easy to maintain and refactor
   - Centralized error handling

3. **Component-First UI**
   - 7-8 core components (Button, Card, Input, etc.)
   - All pages use these components
   - Consistent styling, spacing, and behavior
   - Easy to maintain visual consistency

4. **GSAP for Animations**
   - Performant GPU-accelerated animations
   - Smooth transitions on page load and interactions
   - Standard animations library (not custom CSS)
   - Easy to adjust timing and easing

5. **Tailwind CSS for Styling**
   - Utility-first approach
   - No CSS-in-JS complexity
   - Theme colors customizable in tailwind.config.js
   - Responsive design out of the box

## File Organization

```
src/
├── components/
│   ├── Button.tsx              # Reusable button component
│   ├── Card.tsx                # Card container with header/body/footer
│   ├── Input.tsx               # Text input with validation
│   ├── Textarea.tsx            # Multi-line text input
│   ├── Alert.tsx               # Styled alert messages
│   ├── Badge.tsx               # Small status badges
│   ├── Loader.tsx              # Loading spinner
│   ├── Layout.tsx              # App header/footer wrapper
│   └── index.ts                # Export all components
│
├── pages/
│   ├── HomePage.tsx            # Landing page
│   ├── CreateGoalPage.tsx      # Goal creation form
│   ├── SubmitProofPage.tsx     # Image upload & verification
│   ├── DashboardPage.tsx       # User stats & profile
│   └── index.ts                # Export all pages
│
├── utils/
│   ├── api.ts                  # Typed API client
│   └── cn.ts                   # Utility functions
│
├── App.tsx                     # Router setup
├── main.tsx                    # React entry point
└── index.css                   # Global styles
```

## Component Patterns

### Example Component Structure

```typescript
import { useState } from 'react'
import { Button, Card, Input } from '../components'
import { cn } from '../utils/cn'

interface MyComponentProps {
  title: string
  onSubmit?: (value: string) => void
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!value.trim()) {
      setError('Value is required')
      return
    }
    onSubmit?.(value)
  }

  return (
    <Card>
      <h2 className="text-lg font-bold">{title}</h2>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={error}
        placeholder="Enter something..."
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Card>
  )
}
```

### Creating New Components

1. **Keep components small** - max 200 lines ideally
2. **Use TypeScript interfaces** - no implicit `any` types
3. **Extract styles to Tailwind classes** - no inline styles
4. **Handle all error states** - show errors, loading, success
5. **Use existing components** - leverage Button, Card, Input, etc.

Example button component:
```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({ children, variant = 'primary', size = 'md', isLoading = false, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all',
        variant === 'primary' ? 'bg-primary hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300',
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader size="sm" />}
      {children}
    </button>
  )
}
```

## Adding New Pages

1. **Create page component**
```typescript
// src/pages/NewPage.tsx
import { Layout } from '../components'

export function NewPage() {
  return (
    <Layout>
      <h1>New Page</h1>
    </Layout>
  )
}
```

2. **Export from pages/index.ts**
```typescript
export { NewPage } from './NewPage'
```

3. **Add route in App.tsx**
```typescript
import { NewPage } from './pages'

<Routes>
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

4. **Add navigation link**
```typescript
<Link to="/new-page">
  <Button>Go to New Page</Button>
</Link>
```

## API Integration Pattern

### Making API Calls

```typescript
import { useEffect, useState } from 'react'
import { proofAPI, VerificationResult } from '../utils/api'

export function MyComponent() {
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProof = async (goalId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await proofAPI.submit(goalId, userId, imageFile)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && <Alert type="error">{error}</Alert>}
      <LoadingState isLoading={isLoading}>
        {result && <div>{result.verdict}</div>}
      </LoadingState>
      <Button onClick={() => fetchProof('goal_123')}>
        Submit
      </Button>
    </>
  )
}
```

### Adding New API Endpoints

In `utils/api.ts`:

```typescript
export interface MyResponse {
  // Define response shape
}

export const myAPI = {
  getData: async (id: string): Promise<MyResponse> => {
    const response = await apiClient.get<MyResponse>(`/api/my-endpoint/${id}`)
    return response.data
  },
  
  postData: async (data: any): Promise<MyResponse> => {
    const response = await apiClient.post<MyResponse>('/api/my-endpoint', data)
    return response.data
  },
}
```

Then use in components:
```typescript
const response = await myAPI.getData('123')
```

## Animations with GSAP

### Basic Pattern

```typescript
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function AnimatedComponent() {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementRef.current) {
      gsap.from(elementRef.current, {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
      })
    }
  }, [])

  return <div ref={elementRef}>Content</div>
}
```

### Common Animation Patterns

**Fade In:**
```typescript
gsap.from(element, {
  duration: 0.4,
  opacity: 0,
  ease: 'power1.inOut',
})
```

**Slide Up:**
```typescript
gsap.from(element, {
  duration: 0.6,
  opacity: 0,
  y: 20,
  ease: 'power2.out',
})
```

**Stagger Animation:**
```typescript
gsap.from(elements, {
  duration: 0.6,
  opacity: 0,
  y: 10,
  stagger: 0.1,
  ease: 'power2.out',
})
```

**On Click:**
```typescript
gsap.to(element, {
  duration: 0.3,
  scale: 0.95,
  opacity: 0.7,
})
```

## Styling Guide

### Color Palette

```css
primary: #3B82F6      /* Main actions */
secondary: #1E40AF    /* Alternative actions */
success: #10B981      /* Positive states */
danger: #EF4444       /* Error/warning states */
warning: #F59E0B      /* Caution */
```

### Responsive Breakpoints (Tailwind)

```typescript
// Mobile first approach
<div className="text-base md:text-lg lg:text-xl">
  Text scales on larger screens
</div>

// Grid responsive
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  Columns adjust based on screen size
</div>
```

### Spacing

```typescript
// Use consistent spacing
p-2   // padding
m-4   // margin
gap-6 // gap between flex/grid items
mb-4  // margin-bottom
mt-2  // margin-top
```

## Testing Components

### Manual Testing Checklist

- [ ] Component renders without errors
- [ ] All inputs/buttons work
- [ ] Form validation displays errors
- [ ] Loading states show spinners
- [ ] Error states show alerts
- [ ] Success states show confirmation
- [ ] Mobile responsive (test at 320px width)
- [ ] Animations are smooth
- [ ] Keyboard navigation works
- [ ] Tab order is logical

### Testing with Backend

1. Ensure backend is running:
```bash
cd backend
python api/main.py
```

2. Start frontend:
```bash
npm run dev
```

3. Open browser DevTools → Network tab

4. Create goal → Check POST /api/goals
5. Submit proof → Check POST /api/proof/submit
6. View dashboard → Check GET /api/user/{id}/stats

## Performance Optimization

### Built-in Optimizations

1. **Vite code splitting** - automatic per-route
2. **Tree shaking** - unused code removed
3. **CSS purging** - only used styles in production
4. **Image optimization** - consider for avatars/proofs
5. **Lazy loading** - ready for dynamic imports

### Monitor Performance

```typescript
// In components
useEffect(() => {
  console.time('apiCall')
  fetchData()
  console.timeEnd('apiCall')
}, [])
```

### Production Build

The production build is optimized:
```
dist/
├── index.html (0.65 KB)
├── assets/index-*.css (17.96 KB → 4.06 KB gzipped)
└── assets/index-*.js (321.58 KB → 111.51 KB gzipped)
```

## Common Tasks

### Add a New Form Field

```typescript
// 1. Add to state
const [formData, setFormData] = useState({
  email: '', // NEW
  password: '',
})

// 2. Add to form
<Input
  label="Email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
/>

// 3. Update handler
const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }))
}

// 4. Validate
if (!formData.email.includes('@')) {
  setErrors(prev => ({ ...prev, email: 'Invalid email' }))
}
```

### Add a Loading State

```typescript
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async () => {
  setIsLoading(true)
  try {
    await someAPI.call()
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}

<Button isLoading={isLoading} disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### Add Error Handling

```typescript
const [error, setError] = useState<string | null>(null)

const handleSubmit = async () => {
  setError(null) // Clear previous errors
  try {
    await api.call()
  } catch (err) {
    setError(
      err instanceof Error ? err.message : 'An error occurred'
    )
  }
}

{error && (
  <Alert type="error" onClose={() => setError(null)}>
    {error}
  </Alert>
)}
```

## Debugging

### Browser DevTools

1. **Console** - logs, errors
2. **Network** - API calls, responses
3. **Application** - localStorage (user IDs stored here)
4. **React DevTools** - component tree, props, state

### API Debugging

Add logging to api.ts:
```typescript
export const goalAPI = {
  create: async (goal: Goal): Promise<GoalResponse> => {
    console.log('Creating goal:', goal)
    const response = await apiClient.post<GoalResponse>('/api/goals', goal)
    console.log('Goal created:', response.data)
    return response.data
  },
}
```

## Troubleshooting

### "Cannot find module"
- Check import path is correct
- Verify file exists in src/
- Check export in file/index.ts

### Build fails with TypeScript error
- Run `npm run build` to see full error
- Fix types in tsconfig.json or component

### API calls not working
- Check VITE_API_URL in .env.local
- Verify backend is running
- Check CORS in browser console
- Monitor Network tab in DevTools

### Styling not applying
- Ensure Tailwind class names are complete
- Rebuild CSS: `npm run dev`
- Check tailwind.config.js for purge settings

## Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [GSAP Docs](https://greensock.com/docs/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vitejs.dev/guide/)

## Next Steps

1. **Run the frontend**: `npm run dev`
2. **Start the backend**: See backend README
3. **Test integration**: Create goal → Submit proof → Check dashboard
4. **Deploy**: `npm run build` then serve dist/ folder
