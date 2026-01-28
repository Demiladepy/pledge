# PledgeAgent Design System
## Premium Web3 Application Design Standards

---

## 🎨 Brand Identity

### Core Brand Attributes
- **Intelligence** - AI-powered, sophisticated verification
- **Authority** - Non-negotiable accountability
- **Trust** - Secure financial transactions
- **Motivation** - Empowering goal achievement
- **Innovation** - Cutting-edge AI + Web3 technology

### Brand Personality
> "Make the complex simple, the adversarial approachable, and the financial transparent."

**User Emotional Journey:**
1. **Excited** to set ambitious goals
2. **Confident** in the security
3. **Challenged** by the accountability
4. **Rewarded** by success

---

## 🎨 Visual Identity

### Logo Concept
**Primary Symbol:** Agent + Accountability fusion
- Shield with AI circuit pattern (protection + intelligence)
- Checkmark integrated into shield (verification)
- Upward arrow element (growth/achievement)

**Wordmark:** "PledgeAgent"
- Primary font: Space Grotesk Bold
- Letter spacing: -0.02em
- Tagline: "AI-Enforced Accountability"

### Color Palette

#### Primary Colors
```css
/* Deep Midnight Blue - Authority & Trust */
--color-primary-50: #f0f4ff;
--color-primary-100: #e0e9ff;
--color-primary-200: #c7d7fe;
--color-primary-300: #a5bbfc;
--color-primary-400: #8195f8;
--color-primary-500: #6366f1; /* Main brand color */
--color-primary-600: #4f46e5;
--color-primary-700: #4338ca;
--color-primary-800: #3730a3;
--color-primary-900: #312e81;
--color-primary-950: #1e1b4b;
```

#### Secondary Colors
```css
/* Electric Cyan - Success & Energy */
--color-secondary-50: #ecfeff;
--color-secondary-100: #cffafe;
--color-secondary-200: #a5f3fc;
--color-secondary-300: #67e8f9;
--color-secondary-400: #22d3ee;
--color-secondary-500: #06b6d4; /* Main accent */
--color-secondary-600: #0891b2;
--color-secondary-700: #0e7490;
--color-secondary-800: #155e75;
--color-secondary-900: #164e63;
```

#### Semantic Colors
```css
/* Success - Goal Achievement */
--color-success-50: #f0fdf4;
--color-success-500: #10b981;
--color-success-600: #059669;
--color-success-700: #047857;

/* Warning - Approaching Deadline */
--color-warning-50: #fffbeb;
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Error - Failed Verification */
--color-error-50: #fef2f2;
--color-error-500: #ef4444;
--color-error-600: #dc2626;
--color-error-700: #b91c1c;

/* Info - AI Processing */
--color-info-50: #eff6ff;
--color-info-500: #3b82f6;
--color-info-600: #2563eb;
--color-info-700: #1d4ed8;
```

#### Neutral Grayscale
```css
/* Light Mode */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;
--color-gray-950: #030712;
```

#### Dark Mode Palette
```css
/* Dark mode uses elevated surfaces principle */
--dark-bg-primary: #0a0e1a;
--dark-bg-secondary: #111827;
--dark-bg-elevated: #1f2937;
--dark-bg-elevated-2: #374151;
--dark-border: #374151;
--dark-text-primary: #f9fafb;
--dark-text-secondary: #d1d5db;
--dark-text-tertiary: #9ca3af;
```

### Typography System

#### Font Families
```css
/* Headings - Bold, Modern */
--font-heading: 'Space Grotesk', 'Inter', system-ui, sans-serif;

/* Body - Highly Readable */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace - Addresses, Amounts */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale
```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 4.5rem;      /* 72px */

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Letter Spacing */
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0em;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Spacing Scale
```css
/* 4px base unit */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;  /* Pill shape */
```

### Shadows
```css
/* Elevation system */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Glow effects */
--shadow-glow-primary: 0 0 20px rgba(99, 102, 241, 0.5);
--shadow-glow-success: 0 0 20px rgba(16, 185, 129, 0.5);
--shadow-glow-error: 0 0 20px rgba(239, 68, 68, 0.5);
```

---

## 📐 Layout System

### Grid System
- **12-column responsive grid**
- **Gutter:** 24px (desktop), 16px (mobile)
- **Max content width:** 1440px
- **Container padding:** 64px (desktop), 32px (tablet), 16px (mobile)

### Breakpoints
```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

---

## 🎭 Component Library

### Button Variants

#### Primary Button
```tsx
<button className="
  px-6 py-3 rounded-lg font-semibold
  bg-primary-600 text-white
  hover:bg-primary-700 hover:shadow-lg hover:scale-105
  active:scale-95
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
">
  Create Goal
</button>
```

#### Secondary Button
```tsx
<button className="
  px-6 py-3 rounded-lg font-semibold
  bg-secondary-600 text-white
  hover:bg-secondary-700 hover:shadow-lg hover:scale-105
  active:scale-95
  transition-all duration-200
">
  Submit Proof
</button>
```

#### Outline Button
```tsx
<button className="
  px-6 py-3 rounded-lg font-semibold
  border-2 border-primary-600 text-primary-600
  hover:bg-primary-50 hover:shadow-md
  dark:border-primary-400 dark:text-primary-400
  dark:hover:bg-primary-950
  transition-all duration-200
">
  Learn More
</button>
```

#### Ghost Button
```tsx
<button className="
  px-6 py-3 rounded-lg font-semibold
  text-gray-700 dark:text-gray-300
  hover:bg-gray-100 dark:hover:bg-gray-800
  transition-all duration-200
">
  Cancel
</button>
```

#### Danger Button
```tsx
<button className="
  px-6 py-3 rounded-lg font-semibold
  bg-error-600 text-white
  hover:bg-error-700 hover:shadow-lg
  transition-all duration-200
">
  Delete Goal
</button>
```

### Card Variants

#### Elevated Card
```tsx
<div className="
  bg-white dark:bg-gray-800
  rounded-xl shadow-lg
  p-6
  hover:shadow-xl hover:-translate-y-1
  transition-all duration-300
">
  {/* Content */}
</div>
```

#### Glass Card
```tsx
<div className="
  bg-white/70 dark:bg-gray-800/70
  backdrop-blur-lg
  rounded-xl border border-white/20
  p-6
  shadow-lg
">
  {/* Content */}
</div>
```

#### Interactive Card
```tsx
<div className="
  bg-white dark:bg-gray-800
  rounded-xl border-2 border-gray-200 dark:border-gray-700
  p-6
  cursor-pointer
  hover:border-primary-500 hover:shadow-lg
  transition-all duration-200
">
  {/* Content */}
</div>
```

### Input Components

#### Text Input
```tsx
<input
  type="text"
  className="
    w-full px-4 py-3 rounded-lg
    border-2 border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
    transition-all duration-200
  "
  placeholder="Enter your goal..."
/>
```

#### Error State
```tsx
<input
  type="text"
  className="
    w-full px-4 py-3 rounded-lg
    border-2 border-error-500
    bg-error-50 dark:bg-error-950
    text-gray-900 dark:text-gray-100
    focus:border-error-600 focus:ring-2 focus:ring-error-500/20
  "
/>
<p className="mt-2 text-sm text-error-600 dark:text-error-400">
  This field is required
</p>
```

### Web3-Specific Components

#### Wallet Connection Button
```tsx
<button className="
  flex items-center gap-3 px-6 py-3 rounded-lg
  bg-gradient-to-r from-primary-600 to-secondary-600
  text-white font-semibold
  hover:shadow-glow-primary
  transition-all duration-300
">
  <WalletIcon className="w-5 h-5" />
  Connect Wallet
</button>
```

#### Address Display
```tsx
<div className="
  flex items-center gap-2 px-4 py-2 rounded-lg
  bg-gray-100 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
">
  <Jazzicon diameter={24} address={address} />
  <span className="font-mono text-sm">
    {address.slice(0, 6)}...{address.slice(-4)}
  </span>
  <CopyButton value={address} />
</div>
```

#### Transaction Status
```tsx
{/* Pending */}
<div className="
  flex items-center gap-3 px-4 py-3 rounded-lg
  bg-info-50 dark:bg-info-950
  border border-info-200 dark:border-info-800
">
  <Spinner className="w-5 h-5 text-info-600 animate-spin" />
  <span className="text-info-700 dark:text-info-300">
    Transaction pending...
  </span>
</div>

{/* Success */}
<div className="
  flex items-center gap-3 px-4 py-3 rounded-lg
  bg-success-50 dark:bg-success-950
  border border-success-200 dark:border-success-800
">
  <CheckIcon className="w-5 h-5 text-success-600" />
  <span className="text-success-700 dark:text-success-300">
    Transaction confirmed!
  </span>
</div>
```

---

## 🎬 Motion Design

### Animation Principles
1. **Duration:** 200-300ms for interactions, 400-600ms for page transitions
2. **Easing:** Use `ease-out` for entrances, `ease-in` for exits
3. **Respect:** Honor `prefers-reduced-motion`

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

#### Success Celebration
```css
@keyframes celebrate {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
}
```

### Micro-interactions
- **Button hover:** Scale 1.05, add shadow
- **Card hover:** Translate Y -4px, increase shadow
- **Input focus:** Border color change, ring appearance
- **Success state:** Checkmark animation + confetti
- **Error state:** Shake animation

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color contrast:** Minimum 4.5:1 for text, 3:1 for large text
- **Focus indicators:** Visible 2px outline with offset
- **Keyboard navigation:** All interactive elements accessible
- **ARIA labels:** Descriptive labels on all controls
- **Alt text:** Meaningful descriptions for images
- **Screen reader:** Tested with NVDA/JAWS

### Touch Targets
- **Minimum size:** 44x44px for mobile
- **Spacing:** 8px minimum between targets

---

## 📱 Responsive Design

### Mobile-First Approach
1. Design for 375px width first
2. Scale up to tablet (768px)
3. Optimize for desktop (1024px+)

### Responsive Patterns
- **Navigation:** Hamburger menu → Full nav bar
- **Grid:** 1 column → 2 columns → 3-4 columns
- **Typography:** Fluid type scaling with clamp()
- **Spacing:** Proportional padding/margins

---

## 🌙 Dark Mode

### Implementation Strategy
- **System preference detection:** `prefers-color-scheme`
- **Manual toggle:** Persistent user preference
- **Smooth transition:** 300ms color transitions
- **Elevated surfaces:** Lighter grays for depth
- **Adjusted colors:** Increase brightness for dark backgrounds

### Dark Mode Checklist
- [ ] All text has sufficient contrast
- [ ] Images have dark mode variants where needed
- [ ] Shadows are visible but subtle
- [ ] Borders are distinguishable
- [ ] Focus states are clear
- [ ] Syntax highlighting adjusted

---

## 🎯 Performance Targets

### Lighthouse Scores
- **Performance:** 90+
- **Accessibility:** 100
- **Best Practices:** 95+
- **SEO:** 100

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Bundle Size
- **Initial bundle:** < 200KB gzipped
- **Total JavaScript:** < 500KB
- **Images:** WebP format, lazy loaded

---

## 📚 Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-secondary: #06b6d4;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-unit: 0.25rem;
  
  /* Borders */
  --border-radius: 0.5rem;
  --border-width: 1px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
}

.dark {
  --color-bg-primary: #0a0e1a;
  --color-bg-secondary: #111827;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
}
```

---

## ✅ Design QA Checklist

### Visual Quality
- [ ] All components match design system
- [ ] Consistent spacing throughout
- [ ] Proper typography hierarchy
- [ ] Color palette used correctly
- [ ] Icons are consistent style
- [ ] Images are optimized

### Responsive Design
- [ ] Mobile (375px) tested
- [ ] Tablet (768px) tested
- [ ] Desktop (1024px+) tested
- [ ] No horizontal scroll
- [ ] Touch targets are 44px minimum

### Dark Mode
- [ ] All pages have dark mode
- [ ] Sufficient contrast ratios
- [ ] Smooth theme transitions
- [ ] Images work in both modes

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader tested

### Performance
- [ ] Lighthouse score 90+
- [ ] Images lazy loaded
- [ ] Fonts optimized
- [ ] Bundle size < 200KB

### Animations
- [ ] All animations < 300ms
- [ ] Respects reduced motion
- [ ] Smooth 60fps
- [ ] No janky transitions

---

## 🚀 Implementation Priority

### Phase 1: Foundation (Week 1)
1. ✅ Establish design tokens
2. ✅ Update color palette
3. ✅ Add typography system
4. ✅ Create spacing utilities

### Phase 2: Components (Week 2)
1. ⏳ Enhance button variants
2. ⏳ Improve card components
3. ⏳ Upgrade form inputs
4. ⏳ Add Web3 components

### Phase 3: Pages (Week 3-4)
1. ⏳ Redesign landing page
2. ⏳ Enhance dashboard
3. ⏳ Improve create goal flow
4. ⏳ Polish submit proof page

### Phase 4: Polish (Week 5-6)
1. ⏳ Add micro-interactions
2. ⏳ Implement dark mode
3. ⏳ Accessibility audit
4. ⏳ Performance optimization

---

**Design Philosophy:**
> "Every pixel serves a purpose. Every animation delights. Every interaction builds trust."

**Success Metric:**
> Users should feel this is the most polished Web3 app they've ever used.
