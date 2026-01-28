# PledgeAgent Design Showcase
## Visual Examples of Premium Components

---

## 🎨 Button Variants

### Primary Button (Main CTAs)
```tsx
<Button variant="primary" size="lg">
  Create Your First Goal
</Button>
```
**Visual:** Indigo gradient background, white text, shadow glow on hover, scales to 1.05x

### Secondary Button (Alternative Actions)
```tsx
<Button variant="secondary" size="md" icon={<WalletIcon />}>
  Connect Wallet
</Button>
```
**Visual:** Cyan gradient background, white text, icon on left, smooth hover effect

### Outline Button (Subtle Actions)
```tsx
<Button variant="outline" size="md">
  Learn More
</Button>
```
**Visual:** Transparent background, indigo border, fills with light indigo on hover

### Ghost Button (Minimal Actions)
```tsx
<Button variant="ghost" size="sm">
  Cancel
</Button>
```
**Visual:** Transparent, gray text, subtle gray background on hover

### Gradient Button (Special CTAs)
```tsx
<Button variant="gradient" size="xl" fullWidth>
  🚀 Launch Your Accountability Journey
</Button>
```
**Visual:** Animated multi-color gradient (indigo → purple → cyan), eye-catching

### Glass Button (Premium Look)
```tsx
<Button variant="glass" size="md">
  View Dashboard
</Button>
```
**Visual:** Glassmorphism effect with backdrop blur, elegant and modern

### Danger Button (Destructive Actions)
```tsx
<Button variant="danger" size="md">
  Delete Goal
</Button>
```
**Visual:** Red gradient, clear warning appearance

### Success Button (Positive Actions)
```tsx
<Button variant="success" size="md" icon={<CheckIcon />}>
  Goal Completed!
</Button>
```
**Visual:** Green gradient, celebratory feel

### Loading State
```tsx
<Button variant="primary" isLoading>
  Submitting Proof...
</Button>
```
**Visual:** Spinner animation, disabled state, maintains size

### Icon Button
```tsx
<IconButton 
  icon={<MenuIcon />} 
  aria-label="Open menu"
  variant="ghost"
  size="md"
/>
```
**Visual:** Square button, icon only, perfect for navigation

---

## 🎨 Color Palette Examples

### Primary Colors (Indigo)
```
50:  #f0f4ff  ████ Very light indigo (backgrounds)
100: #e0e9ff  ████ Light indigo (hover states)
500: #6366f1  ████ Main brand color (CTAs, links)
600: #4f46e5  ████ Dark indigo (hover states)
900: #312e81  ████ Very dark indigo (text on light)
```

### Secondary Colors (Cyan)
```
50:  #ecfeff  ████ Very light cyan (backgrounds)
100: #cffafe  ████ Light cyan (highlights)
500: #06b6d4  ████ Main accent color (success, energy)
600: #0891b2  ████ Dark cyan (hover states)
900: #164e63  ████ Very dark cyan (text)
```

### Semantic Colors
```
Success:  #10b981  ████ Green (goal completion)
Warning:  #f59e0b  ████ Amber (approaching deadline)
Error:    #ef4444  ████ Red (failed verification)
Info:     #3b82f6  ████ Blue (AI processing)
```

---

## 🎨 Typography Examples

### Headings (Space Grotesk)
```
H1: "Transform Your Goals into Reality"
    72px, 800 weight, -0.02em letter-spacing
    
H2: "How PledgeAgent Works"
    60px, 700 weight, -0.02em letter-spacing
    
H3: "AI-Powered Verification"
    36px, 700 weight, -0.02em letter-spacing
    
H4: "Your Active Goals"
    30px, 700 weight, -0.02em letter-spacing
```

### Body Text (Inter)
```
Large:  "Set ambitious goals with real financial stakes."
        18px, 400 weight, 1.7 line-height
        
Base:   "The AI agent verifies your proof submissions..."
        16px, 400 weight, 1.7 line-height
        
Small:  "Last updated 2 hours ago"
        14px, 400 weight, 1.5 line-height
```

### Monospace (JetBrains Mono)
```
Address:  "0x742d...5f3a"
          16px, 500 weight, monospace
          
Amount:   "0.05 ETH"
          16px, 600 weight, monospace
```

---

## 🎨 Animation Examples

### Fade In (Page Load)
```css
/* Element fades in smoothly */
animation: fadeIn 0.4s ease-out;
```
**Use:** Page transitions, modal appearances

### Slide Up (Content Reveal)
```css
/* Element slides up from below */
animation: slideUp 0.5s ease-out;
```
**Use:** Card reveals, list items

### Float (Subtle Motion)
```css
/* Element gently floats up and down */
animation: float 3s ease-in-out infinite;
```
**Use:** Hero illustrations, decorative elements

### Pulse Glow (Attention)
```css
/* Element pulses with glowing shadow */
animation: pulseGlow 2s ease-in-out infinite;
```
**Use:** Active states, important CTAs

### Shimmer (Loading)
```css
/* Skeleton screen shimmer effect */
animation: shimmer 1.5s ease-in-out infinite;
```
**Use:** Loading states, skeleton screens

### Shake (Error)
```css
/* Element shakes horizontally */
animation: shake 0.5s ease-in-out;
```
**Use:** Form validation errors

### Celebrate (Success)
```css
/* Element scales and rotates playfully */
animation: celebrate 0.6s ease-in-out;
```
**Use:** Goal completion, success states

---

## 🎨 Component Combinations

### Hero Section
```tsx
<section className="hero-gradient py-20">
  <div className="container-custom">
    <h1 className="text-gradient-primary mb-6 animate-slideUp">
      AI-Enforced Accountability
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slideUp">
      Set goals. Lock money. Submit proof. The AI verifies. Succeed or lose.
    </p>
    <div className="flex gap-4 animate-slideUp">
      <Button variant="gradient" size="xl">
        Create Your First Goal
      </Button>
      <Button variant="outline" size="xl">
        See How It Works
      </Button>
    </div>
  </div>
</section>
```

### Goal Card
```tsx
<div className="glass p-6 rounded-xl card-hover">
  <div className="flex items-center justify-between mb-4">
    <Badge variant="success">Active</Badge>
    <span className="font-mono text-sm">3 days left</span>
  </div>
  
  <h3 className="font-heading text-2xl mb-2">
    Go to gym 5x this week
  </h3>
  
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-2">
      <span>Progress</span>
      <span className="font-semibold">3/5 sessions</span>
    </div>
    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
        style={{ width: '60%' }}
      />
    </div>
  </div>
  
  <div className="flex items-center justify-between">
    <div>
      <span className="text-sm text-gray-600 dark:text-gray-400">Stake</span>
      <p className="font-mono font-semibold text-lg">0.05 ETH</p>
    </div>
    <Button variant="primary" size="sm">
      Submit Proof
    </Button>
  </div>
</div>
```

### Transaction Status
```tsx
{/* Pending */}
<div className="flex items-center gap-3 p-4 rounded-lg bg-info-50 dark:bg-info-950 border border-info-200 dark:border-info-800">
  <div className="animate-spin">⏳</div>
  <div>
    <p className="font-semibold text-info-700 dark:text-info-300">
      Transaction Pending
    </p>
    <p className="text-sm text-info-600 dark:text-info-400">
      Confirming on Base...
    </p>
  </div>
</div>

{/* Success */}
<div className="flex items-center gap-3 p-4 rounded-lg bg-success-50 dark:bg-success-950 border border-success-200 dark:border-success-800 animate-celebrate">
  <div className="text-2xl">✅</div>
  <div>
    <p className="font-semibold text-success-700 dark:text-success-300">
      Goal Created Successfully!
    </p>
    <p className="text-sm text-success-600 dark:text-success-400">
      Your stake has been locked
    </p>
  </div>
</div>
```

### Wallet Connection
```tsx
<Button 
  variant="gradient" 
  size="lg"
  icon={<WalletIcon />}
  className="hover-glow-primary"
>
  Connect Wallet
</Button>

{/* Connected State */}
<div className="flex items-center gap-3 px-4 py-2 rounded-lg glass">
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500" />
  <span className="font-mono text-sm">0x742d...5f3a</span>
  <IconButton 
    icon={<CopyIcon />}
    aria-label="Copy address"
    size="sm"
  />
</div>
```

---

## 🎨 Dark Mode Comparison

### Light Mode
```
Background:     #ffffff (white)
Text:           #111827 (gray-900)
Card:           #f9fafb (gray-50)
Border:         #e5e7eb (gray-200)
Primary:        #6366f1 (indigo-500)
```

### Dark Mode
```
Background:     #0a0e1a (dark-bg-primary)
Text:           #f9fafb (dark-text-primary)
Card:           #1f2937 (dark-bg-elevated)
Border:         #374151 (dark-border)
Primary:        #818cf8 (indigo-400, brighter)
```

**Key Principle:** In dark mode, elevated surfaces use *lighter* colors, not darker. This creates proper depth perception.

---

## 🎨 Responsive Breakpoints

### Mobile (375px - 639px)
```tsx
<Button size="md" fullWidth>
  Create Goal
</Button>
```
- Full-width buttons
- Larger touch targets (44px minimum)
- Simplified layouts
- Bottom navigation

### Tablet (640px - 1023px)
```tsx
<div className="grid grid-cols-2 gap-4">
  <Button variant="primary">Create</Button>
  <Button variant="outline">Cancel</Button>
</div>
```
- 2-column layouts
- Medium-sized components
- Collapsible sections

### Desktop (1024px+)
```tsx
<div className="grid grid-cols-3 gap-6">
  {goals.map(goal => <GoalCard key={goal.id} {...goal} />)}
</div>
```
- 3-4 column layouts
- Hover effects prominent
- Side navigation
- Maximum content width: 1440px

---

## 🎨 Accessibility Features

### Keyboard Navigation
```tsx
<Button 
  variant="primary"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Submit
</Button>
```
- All interactive elements focusable
- Visible focus indicators (2px indigo ring)
- Logical tab order
- Escape key closes modals

### Screen Reader Support
```tsx
<IconButton 
  icon={<MenuIcon />}
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
/>
```
- ARIA labels on all controls
- Meaningful alt text on images
- Landmark regions defined
- Status announcements

### Color Contrast
```
Text on White:      4.5:1 minimum (WCAG AA)
Large Text:         3:1 minimum
Interactive:        3:1 minimum
Focus Indicators:   3:1 minimum
```
- All combinations tested
- Works in both light and dark modes
- Error states don't rely on color alone

---

## 🎨 Performance Optimizations

### CSS
```css
/* GPU-accelerated animations */
.button-hover {
  transform: translateZ(0);
  will-change: transform;
}

/* Efficient transitions */
.transition-smooth {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### React
```tsx
// Memoized expensive components
const GoalCard = memo(({ goal }) => {
  // Component logic
})

// Lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'))
```

### Images
```tsx
// WebP with fallback
<picture>
  <source srcSet="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero" loading="lazy" />
</picture>
```

---

## 🎯 Design Principles in Action

### 1. "Every pixel serves a purpose"
- Whitespace creates breathing room
- Colors convey meaning (green = success, red = danger)
- Shadows indicate elevation and interactivity

### 2. "Every animation delights"
- Buttons scale on hover (feedback)
- Cards slide up on page load (reveal)
- Success states celebrate (reward)

### 3. "Every interaction builds trust"
- Clear loading states (transparency)
- Helpful error messages (guidance)
- Consistent patterns (familiarity)

---

**This showcase demonstrates how our design system creates a cohesive, premium experience throughout the application.**
