# 🎨 E-Library Mobile App - Design Specifications

## Design System Overview

### Brand Colors
```
Primary: #6366F1 (Indigo)
Secondary: #8B5CF6 (Purple)
Accent: #10B981 (Green)
Error: #EF4444 (Red)
Warning: #F59E0B (Amber)
Success: #10B981 (Green)
```

### Typography
```
Headings: SF Pro Display (iOS) / Roboto (Android)
Body: SF Pro Text (iOS) / Roboto (Android)
Monospace: SF Mono (iOS) / Roboto Mono (Android)

Sizes:
- H1: 32px, Bold
- H2: 24px, Semibold
- H3: 20px, Semibold
- Body: 16px, Regular
- Caption: 14px, Regular
- Small: 12px, Regular
```

### Spacing System
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### Border Radius
```
sm: 8px
md: 12px
lg: 16px
xl: 24px
full: 9999px (circular)
```

---

## Screen-by-Screen Specifications


### 1. Splash Screen

**Layout**:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│          [E-Library Logo]           │
│                                     │
│         Digital Library             │
│                                     │
│      [Loading Animation]            │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Elements**:
- Logo: 120x120px, centered
- Tagline: 16px, gray-600, centered below logo
- Loading: Spinner or progress bar, 40px, primary color
- Background: Gradient from primary to secondary

**Animation**:
- Logo fade in (300ms)
- Tagline slide up (200ms delay)
- Loading spinner rotate continuously

**Duration**: 2-3 seconds maximum

---

### 2. Onboarding Carousel

**Slide 1: Browse Books**
```
┌─────────────────────────────────────┐
│  [Skip]                             │
│                                     │
│     [Illustration: Books]           │
│                                     │
│  Browse 10,000+ Digital Books       │
│  Access a vast library of           │
│  educational content                │
│                                     │
│  ● ○ ○                              │
│                                     │
│  [Next →]                           │
└─────────────────────────────────────┘
```

**Elements**:
- Skip button: Top-right, 14px, gray-600
- Illustration: 240x240px, centered
- Heading: 24px, bold, gray-900
- Description: 16px, regular, gray-600
- Pagination dots: 8px, primary (active), gray-300 (inactive)
- Next button: Full-width, 48px height, primary color, rounded-lg

**Slide 2 & 3**: Same layout, different content

---

### 3. Auth Landing Screen

```
┌─────────────────────────────────────┐
│                                     │
│          [E-Library Logo]           │
│                                     │
│      Welcome to E-Library           │
│   Your Digital Learning Companion   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        Log In               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        Sign Up              │   │
│  └─────────────────────────────┘   │
│                                     │
│     Continue as Guest               │
│                                     │
└─────────────────────────────────────┘
```

**Elements**:
- Logo: 80x80px, centered, margin-top: 64px
- Heading: 24px, bold, gray-900
- Subheading: 16px, regular, gray-600
- Log In button: Primary, 48px height, full-width, margin: 16px
- Sign Up button: Secondary (outlined), 48px height, full-width
- Guest link: 14px, primary color, underlined, centered

**Spacing**:
- Vertical padding: 24px
- Horizontal padding: 24px
- Button spacing: 16px

---

### 4. Sign Up Screen

```
┌─────────────────────────────────────┐
│  [← Back]    Sign Up                │
│                                     │
│  First Name                         │
│  [John                          ]   │
│                                     │
│  Last Name                          │
│  [Doe                           ]   │
│                                     │
│  Email                              │
│  [john@example.com              ]   │
│                                     │
│  Password                           │
│  [••••••••••                 👁]   │
│  ⚠️ Min 8 chars, 1 uppercase, 1 num│
│                                     │
│  Confirm Password                   │
│  [••••••••••                 👁]   │
│                                     │
│  Role                               │
│  [Student                       ▼]  │
│                                     │
│  ☐ I agree to Terms & Privacy       │
│                                     │
│  [Create Account]                   │
│                                     │
│  Already have an account? Log In    │
└─────────────────────────────────────┘
```

**Form Fields**:
- Label: 14px, semibold, gray-700, margin-bottom: 8px
- Input: 48px height, 16px text, gray-900, border: 1px gray-300
- Focus state: border: 2px primary, shadow
- Error state: border: 2px error, red text below
- Success state: border: 2px success, green checkmark

**Validation Messages**:
- Error: 12px, red-600, margin-top: 4px
- Success: 12px, green-600, margin-top: 4px
- Info: 12px, gray-600, margin-top: 4px

**Password Strength Indicator**:
```
Weak:     [██░░░░░░░░] Red
Medium:   [██████░░░░] Yellow
Strong:   [██████████] Green
```

**Submit Button**:
- Enabled: Primary color, white text
- Disabled: Gray-300, gray-500 text
- Loading: Spinner inside button

---

### 5. Login Screen

```
┌─────────────────────────────────────┐
│  [← Back]    Log In                 │
│                                     │
│                                     │
│  Email or Username                  │
│  [john@example.com              ]   │
│                                     │
│  Password                           │
│  [••••••••••                 👁]   │
│                                     │
│  ☐ Remember Me    Forgot Password?  │
│                                     │
│  [Log In]                           │
│                                     │
│  ─────────── OR ───────────         │
│                                     │
│  [🔵 Continue with Google]          │
│  [⚫ Continue with Apple]            │
│                                     │
│  Don't have an account? Sign Up     │
└─────────────────────────────────────┘
```

**Social Login Buttons**:
- Height: 48px
- Border: 1px gray-300
- Icon: 24x24px, left-aligned
- Text: 16px, centered
- Hover: gray-50 background

---

### 6. Home Screen

```
┌─────────────────────────────────────┐
│  [☰]  E-Library        [🔍] [👤]   │
│                                     │
│  [Search books, authors...]         │
│                                     │
│  ← [📚 Fiction] [🔬 Science] → │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Featured Book Carousel    │   │
│  │   [Large Book Cover]        │   │
│  └─────────────────────────────┘   │
│                                     │
│  📊 Stats                           │
│  [10K+ Books] [2K+ Audio]           │
│                                     │
│  Recommended for You                │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │📖│ │📖│ │📖│ │📖│          │
│  └───┘ └───┘ └───┘ └───┘          │
│                                     │
│  New Arrivals                       │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │📖│ │📖│ │📖│ │📖│          │
│  └───┘ └───┘ └───┘ └───┘          │
│                                     │
└─────────────────────────────────────┘
```

**Top Navigation Bar**:
- Height: 56px
- Background: White, shadow-sm
- Menu icon: 24x24px, left: 16px
- Logo/Title: 20px, bold
- Search icon: 24x24px, right: 56px
- Profile icon: 32x32px, circular, right: 16px

**Search Bar**:
- Height: 44px
- Border-radius: 22px (pill shape)
- Background: gray-100
- Placeholder: gray-500
- Icon: 20x20px, left: 12px

**Category Scroll**:
- Height: 48px
- Horizontal scroll
- Item: 100px width, 40px height, rounded-full
- Active: primary background, white text
- Inactive: gray-100 background, gray-700 text

**Featured Carousel**:
- Height: 240px
- Auto-scroll: 5 seconds
- Indicators: 8px dots, bottom: 16px
- Border-radius: 16px
- Shadow: lg

**Stats Banner**:
- Height: 80px
- Grid: 2 columns
- Background: gradient primary to secondary
- Text: white, centered
- Icon: 24x24px

**Book Card**:
- Width: 160px
- Height: 280px
- Border-radius: 12px
- Shadow: md
- Padding: 12px
- Cover: 136px x 180px
- Title: 14px, bold, 2 lines max
- Author: 12px, gray-600
- Price: 14px, semibold, primary
- Badges: 20px height, rounded-full

**Section Headers**:
- Font: 20px, bold
- Margin: 24px top, 16px bottom
- "See all" link: 14px, primary, right-aligned

---

### 7. Book Detail Screen

```
┌─────────────────────────────────────┐
│  [← Back]  [🔗 Share]  [❤️ Save]   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │     [Large Cover Image]     │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Introduction to Python             │
│  by John Smith                      │
│  ⭐⭐⭐⭐⭐ 4.5 (234 reviews)        │
│                                     │
│  📚 Programming | 🌍 English        │
│  📄 350 pages | 📅 2024             │
│                                     │
│  Available Formats:                 │
│  ┌─────────┐ ┌─────────┐           │
│  │ 📱 Soft │ │ 📚 Hard │           │
│  │ $19.99  │ │ $29.99  │           │
│  │ [Buy]   │ │ [Buy]   │           │
│  └─────────┘ └─────────┘           │
│                                     │
│  📅 Rent for 7 days: $5.99          │
│  [Rent Now]                         │
│                                     │
│  🎧 Audio Available                 │
│  [Play Audio]                       │
│                                     │
│  [📖 Read Sample]                   │
│                                     │
│  Description                        │
│  Comprehensive guide to Python...   │
│  [Read more]                        │
│                                     │
│  Reviews (234)                      │
│  [See all reviews]                  │
│                                     │
│  Related Books                      │
│  ← [📖] [📖] [📖] [📖] →           │
└─────────────────────────────────────┘
```

**Header Actions**:
- Back: 24x24px, left: 16px
- Share: 24x24px, right: 56px
- Save: 24x24px, right: 16px, filled if saved

**Cover Image**:
- Width: 100% - 48px (24px padding each side)
- Height: 400px
- Border-radius: 16px
- Shadow: xl
- Margin: 24px

**Title**:
- Font: 24px, bold
- Color: gray-900
- Margin: 16px bottom

**Author**:
- Font: 16px, regular
- Color: gray-600
- Margin: 8px bottom

**Rating**:
- Stars: 16px, yellow-400
- Score: 16px, bold
- Reviews: 14px, gray-600

**Metadata Icons**:
- Size: 16x16px
- Color: gray-500
- Text: 14px, gray-600
- Spacing: 12px between items

**Format Cards**:
- Width: 48%
- Height: 120px
- Border: 2px gray-300
- Border-radius: 12px
- Padding: 16px
- Icon: 32x32px, centered
- Label: 14px, semibold
- Price: 20px, bold, primary
- Button: 40px height, full-width

**Rental Card**:
- Full-width
- Height: 80px
- Background: blue-50
- Border: 2px blue-200
- Border-radius: 12px

**Audio Badge**:
- Background: green-100
- Text: green-700
- Icon: 20x20px
- Padding: 8px 16px
- Border-radius: 20px

**Action Buttons**:
- Height: 48px
- Full-width
- Border-radius: 12px
- Margin: 12px bottom

**Description**:
- Font: 16px, regular
- Color: gray-700
- Line-height: 1.6
- Max-lines: 4 (collapsed)
- "Read more": primary color, 14px

---

### 8. Audio Player Screen

```
┌─────────────────────────────────────┐
│  [← Back]  Audio Player  [⋮ More]  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │     [Book Cover Image]      │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Introduction to Python             │
│  by John Smith                      │
│  🤖 AI Generated Voice              │
│                                     │
│  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] │
│  1:23:45 / 5:32:00                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [⏮] [⏪] [▶️] [⏩] [⏭]     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Speed: [1.0x ▼]  Sleep: [Off ▼]   │
│                                     │
│  [🔊 ━━━━━━━━━━━━━━━━━━━━━━━━━]  │
│                                     │
│  Chapters                           │
│  ✓ Chapter 1: Introduction          │
│  ▶ Chapter 2: Getting Started       │
│    Chapter 3: Variables             │
│    Chapter 4: Functions             │
│                                     │
└─────────────────────────────────────┘
```

**Cover Image**:
- Size: 280x280px
- Border-radius: 16px
- Shadow: xl
- Centered

**Title & Info**:
- Title: 20px, bold
- Author: 16px, gray-600
- Narrator: 14px, gray-500, italic

**Progress Bar**:
- Height: 4px
- Background: gray-200
- Progress: primary color
- Thumb: 16px circle, white, shadow
- Draggable

**Time Labels**:
- Font: 14px, semibold
- Color: gray-600
- Position: below progress bar

**Control Buttons**:
- Previous/Next: 40x40px
- Skip: 48x48px
- Play/Pause: 64x64px, primary background, white icon
- Spacing: 16px between
- Centered horizontally

**Speed & Sleep Controls**:
- Height: 40px
- Width: 48%
- Border: 1px gray-300
- Border-radius: 8px
- Dropdown icon: 16x16px

**Volume Slider**:
- Height: 40px
- Icon: 24x24px, left
- Slider: flex-1
- Same style as progress bar

**Chapter List**:
- Item height: 56px
- Padding: 12px 16px
- Border-bottom: 1px gray-200
- Active: primary background (light)
- Checkmark: 16x16px, green
- Play icon: 16x16px, primary

---

### 9. Exam Runner Screen

```
┌─────────────────────────────────────┐
│  ⏱ 28:45  Question 5/20  [📊]      │
│                                     │
│  Question 5:                        │
│  What is the output of print(2**3)?│
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ○ A. 5                      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ○ B. 6                      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ● C. 8                      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ○ D. 9                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [🚩 Flag for Review]               │
│                                     │
│  [◀ Previous]      [Next ▶]        │
│                                     │
│  Progress: [████░░░░░░░░░░░░░░░░]  │
│  Answered: 4/20                     │
└─────────────────────────────────────┘
```

**Top Bar**:
- Height: 56px
- Background: white, shadow
- Timer: 16px, bold, left: 16px
- Red when < 5 min
- Question number: 16px, center
- Navigator icon: 24x24px, right: 16px

**Question Text**:
- Font: 18px, semibold
- Color: gray-900
- Padding: 24px
- Line-height: 1.5

**Option Cards**:
- Height: 56px
- Border: 2px gray-300
- Border-radius: 12px
- Padding: 16px
- Margin: 12px bottom
- Radio: 20x20px, left
- Text: 16px, gray-700
- Selected: border primary, background primary-50
- Hover: background gray-50

**Flag Button**:
- Height: 44px
- Border: 1px gray-300
- Border-radius: 8px
- Icon: 20x20px
- Text: 14px
- Flagged: background yellow-50, border yellow-400

**Navigation Buttons**:
- Height: 48px
- Width: 48%
- Border-radius: 12px
- Previous: secondary (outlined)
- Next: primary

**Progress Bar**:
- Height: 8px
- Border-radius: 4px
- Background: gray-200
- Progress: primary

**Progress Text**:
- Font: 14px, semibold
- Color: gray-600
- Centered

---

### 10. Results Screen

```
┌─────────────────────────────────────┐
│  [← Back]  Exam Results             │
│                                     │
│  🎉 Exam Complete!                  │
│                                     │
│  Python Basics Quiz                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │    Your Score: 85%          │   │
│  │    ⭐⭐⭐⭐⭐              │   │
│  │    17/20 Correct            │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Status: ✅ PASSED                  │
│  Passing Score: 70%                 │
│  Time Taken: 30:00                  │
│  Completed: Jan 15, 2024            │
│                                     │
│  📊 Performance:                    │
│  • Correct: 17 (85%)                │
│  • Incorrect: 3 (15%)               │
│  • Unanswered: 0                    │
│                                     │
│  [View Detailed Results]            │
│  [Download Certificate]             │
│  [Share Result]                     │
│  [Back to Exams]                    │
└─────────────────────────────────────┘
```

**Celebration Icon**:
- Size: 64x64px
- Centered
- Animated (confetti or checkmark)

**Score Card**:
- Height: 200px
- Background: gradient primary to secondary
- Border-radius: 16px
- Shadow: xl
- Text: white, centered
- Score: 48px, bold
- Stars: 32px each
- Subtitle: 20px

**Status Badge**:
- Height: 40px
- Padding: 8px 16px
- Border-radius: 20px
- Passed: green background
- Failed: red background
- Icon: 20x20px
- Text: 16px, bold

**Metadata**:
- Font: 14px, regular
- Color: gray-600
- Icon: 16x16px
- Spacing: 12px between lines

**Performance Section**:
- Background: gray-50
- Border-radius: 12px
- Padding: 16px
- List items: 16px, gray-700
- Bullets: primary color

**Action Buttons**:
- Height: 48px
- Full-width
- Border-radius: 12px
- Margin: 12px bottom
- Primary: solid
- Secondary: outlined

---

## Component Library

### Buttons

**Primary Button**:
```css
background: #6366F1
color: white
height: 48px
border-radius: 12px
font-size: 16px
font-weight: 600
shadow: sm
hover: #4F46E5
active: #4338CA
disabled: #D1D5DB (gray-300)
```

**Secondary Button**:
```css
background: transparent
color: #6366F1
border: 2px solid #6366F1
height: 48px
border-radius: 12px
font-size: 16px
font-weight: 600
hover: background #EEF2FF
active: background #E0E7FF
```

**Text Button**:
```css
background: transparent
color: #6366F1
height: 44px
font-size: 14px
font-weight: 600
underline on hover
```

### Input Fields

**Text Input**:
```css
height: 48px
border: 1px solid #D1D5DB
border-radius: 12px
padding: 12px 16px
font-size: 16px
color: #111827
placeholder: #9CA3AF
focus: border 2px #6366F1, shadow
error: border 2px #EF4444
```

**Search Input**:
```css
height: 44px
border-radius: 22px (pill)
background: #F3F4F6
padding: 12px 16px 12px 44px
icon: 20px, left 12px
```

### Cards

**Book Card**:
```css
width: 160px
height: 280px
border-radius: 12px
shadow: md
padding: 12px
background: white
hover: shadow lg, scale 1.02
```

**Info Card**:
```css
width: 100%
border-radius: 12px
padding: 16px
background: white
border: 1px #E5E7EB
```

### Badges

**Status Badge**:
```css
height: 24px
padding: 4px 12px
border-radius: 12px
font-size: 12px
font-weight: 600
```

Colors:
- Success: green-100 bg, green-700 text
- Error: red-100 bg, red-700 text
- Warning: yellow-100 bg, yellow-700 text
- Info: blue-100 bg, blue-700 text

### Modals

**Standard Modal**:
```css
width: 90% (max 400px)
border-radius: 16px
padding: 24px
background: white
shadow: 2xl
backdrop: rgba(0,0,0,0.5)
```

**Header**:
- Font: 20px, bold
- Margin-bottom: 16px

**Content**:
- Font: 16px, regular
- Color: gray-700
- Line-height: 1.5

**Actions**:
- Flex row, justify-end
- Gap: 12px
- Margin-top: 24px

---

## Animations

### Page Transitions
```
Enter: slide from right, 300ms ease-out
Exit: slide to left, 300ms ease-in
```

### Button Press
```
Scale: 0.95, 100ms ease-out
```

### Modal
```
Backdrop: fade in, 200ms
Content: scale from 0.9 to 1, 300ms ease-out
```

### Loading
```
Spinner: rotate 360deg, 1s linear infinite
Skeleton: shimmer left to right, 1.5s ease-in-out infinite
```

---

## Accessibility

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px
- Spacing: 8px minimum between targets

### Color Contrast
- Text on background: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus States
- Visible outline: 2px solid primary
- Offset: 2px
- Border-radius: match element

### Screen Reader
- All images: alt text
- All buttons: aria-label
- All forms: label association
- Navigation: aria-navigation

---

## Responsive Breakpoints

```
Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+
```

### Mobile-First Approach
- Design for mobile first
- Scale up for larger screens
- Use flexible layouts
- Test on real devices

---

**Document Version**: 1.0  
**Last Updated**: January 2024  
**Design Tool**: Figma  
**Maintained By**: Design Team

