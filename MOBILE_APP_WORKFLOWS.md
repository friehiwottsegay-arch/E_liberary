# 📱 E-Library Mobile App - Complete Workflows Documentation

## Overview
This document provides step-by-step, no-code workflows for the Student/Buyer mobile app using the E-Library backend. Each workflow includes UI screens, user actions, API interactions, permissions, success/failure states, and UX notes.

---

## 1️⃣ App Bootstrap / First-Time Open (Onboarding)

**Goal**: Guide new user into the app, capture preferences, optionally sign in.

### Steps:
1. **Splash Screen**
   - Display: E-Library logo + loading animation
   - Duration: 2-3 seconds
   - Action: Check local storage for JWT/session

2. **Onboarding Carousel** (if first-time user)
   - **Slide 1**: "Browse 10,000+ Digital Books"
     - Visual: Book library illustration
   - **Slide 2**: "Listen to AI-Generated Audiobooks"
     - Visual: Headphones + audio waves
   - **Slide 3**: "Take Exams & Track Progress"
     - Visual: Certificate + progress chart
   - CTA: "Get Started" button

3. **Session Check**
   ```
   IF JWT exists in local storage:
     → Validate token
     → IF valid: Navigate to Home (logged in)
     → IF expired: Try refresh token
       → IF refresh succeeds: Navigate to Home
       → IF refresh fails: Show Auth Landing
   ELSE:
     → Show Auth Landing
   ```

4. **Auth Landing Screen**
   - Buttons:
     - "Log In" (primary)
     - "Sign Up" (secondary)
     - "Continue as Guest" (text link)
   - Actions:
     - Tap "Sign Up" → Go to Sign Up flow
     - Tap "Log In" → Go to Login flow
     - Tap "Continue as Guest" → Home (limited mode)

### Permissions:
- **Not requested yet** - defer until needed
- Push notifications: Ask later when offering notifications
- Microphone: Ask when user opens recording feature

### Success Condition:
User arrives at Home screen (logged in or guest mode)

### Failure States:
- Network error during session check → Continue as guest with offline banner
- Corrupted local storage → Clear and show Auth Landing

### UX Notes:
- Allow skip onboarding after first slide
- Remember "Don't show again" preference
- Smooth transitions between screens

---

## 2️⃣ Authentication (Sign Up / Login / Token Storage / Logout)

**Goal**: Secure JWT-based authentication mapping to `/api/users/` endpoints.

### Sign Up Flow (Student/Buyer)

**Screen Elements**:
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Password (required, min 8 chars, show/hide toggle)
- Confirm Password (required, must match)
- Role Dropdown: "Student" or "Buyer" (default: Student)
- Terms & Privacy checkbox
- "Create Account" button

**API Call**:
```
POST /api/users/register/
Body: {
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "Student",
  "user_type": "buyer"
}

Response (Success 201):
{
  "message": "User account created successfully",
  "username": "john_doe",
  "user": {
    "id": 123,
    "email": "john@example.com",
    "role": "Student"
  }
}
```

**On Success**:
1. Automatically log in user (call login endpoint)
2. Store JWT tokens securely
3. Show welcome modal: "Welcome, John! 🎉"
4. Navigate to Home

**Validation Rules**:
- Email: Valid format, unique
- Password: Min 8 chars, 1 uppercase, 1 number
- All fields required

### Login Flow

**Screen Elements**:
- Email/Username field
- Password field (show/hide toggle)
- "Forgot Password?" link
- "Remember Me" checkbox
- "Log In" button
- "Don't have an account? Sign Up" link

**API Call**:
```
POST /api/users/login/
Body: {
  "username": "john@example.com",
  "password": "SecurePass123!"
}

Response (Success 200):
{
  "message": "Login successful",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "redirect_url": "/dashboard",
  "user": {
    "id": 123,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Student",
    "first_name": "John",
    "last_name": "Doe"
  },
  "role": "Student"
}
```

**On Success**:
1. Store tokens in secure storage (Keychain/Keystore)
2. Store user context (id, role, name, email)
3. Navigate to Home
4. Show toast: "Welcome back, John!"

### Token Refresh & Expiry

**Automatic Refresh**:
```
When API returns 401:
  → Call POST /api/users/token/refresh/
  → Body: { "refresh": "<refresh_token>" }
  → On success: Update access token, retry original request
  → On failure: Clear tokens, navigate to Auth Landing
```

**Token Storage**:
- Use platform secure storage (iOS Keychain, Android Keystore)
- Never store in plain text or AsyncStorage
- Clear on logout

### Logout Flow

**Actions**:
1. Show confirmation: "Are you sure you want to log out?"
2. On confirm:
   - Clear JWT tokens
   - Clear user context
   - Clear cached data (optional: keep downloaded books)
   - Navigate to Auth Landing
3. Show toast: "Logged out successfully"

### Failure States

| Error | Message | Action |
|-------|---------|--------|
| Wrong credentials | "Invalid email or password" | Show "Forgot Password?" |
| Network error | "Connection failed. Please try again." | Retry button + offline mode |
| Account inactive | "Your account is inactive. Contact support." | Support link |
| Email exists (signup) | "Email already registered. Try logging in." | Link to login |
| Validation error | Specific field error | Highlight field in red |

### UX Notes:
- Show spinner during network call
- Disable submit button to prevent duplicate requests
- Auto-focus first empty field
- Show password strength indicator on signup
- Implement exponential backoff for retries

---

## 3️⃣ Home & Discovery (Browse Books, Categories)

**Goal**: Let students discover books quickly with intuitive navigation.

### Screen Layout

**Top Section**:
- Search bar with placeholder: "Search books, authors, subjects..."
- Filter icon (opens filter modal)
- Notification bell (badge if unread)

**Horizontal Scroll - Categories**:
```
GET /api/categories/

Display: [📚 Fiction] [🔬 Science] [📜 History] [💻 Technology] ...
```

**Stats Banner** (if logged in):
```
┌─────────────────────────────────────┐
│  📚 10K+ Books  |  🎧 2K+ Audio     │
│  📝 500+ Exams  |  👥 50K+ Students │
└─────────────────────────────────────┘
```

**Featured Carousel**:
- Auto-scroll every 5 seconds
- Show 3-5 featured books with large images
- Tap to view book detail

**Content Sections** (Vertical Scroll):
1. **"Recommended for You"** (if logged in)
   - Based on user's role, past purchases, browsing history
2. **"New Arrivals"**
   - Recently added books
3. **"Popular This Week"**
   - Most viewed/purchased
4. **"Free Books"**
   - Filter: `is_free=true`
5. **"Audio Available"**
   - Books with audio files

### API Calls

**Initial Load**:
```
GET /api/books/?page=1&page_size=20
GET /api/categories/

Response:
{
  "count": 10000,
  "next": "/api/books/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Introduction to Python",
      "author": "John Smith",
      "cover_image": "https://...",
      "price": 29.99,
      "soft_price": 19.99,
      "hard_price": 29.99,
      "is_free": false,
      "has_audio": true,
      "rating": 4.5,
      "language": "english",
      "book_type": "both"
    },
    ...
  ]
}
```

**Category Filter**:
```
GET /api/books/?category=<category_id>&page=1
```

**Search**:
```
GET /api/books/?search=<query>&page=1
```

### Book Card Design

```
┌─────────────────────────┐
│   [Cover Image]         │
│                         │
│   Title (2 lines max)   │
│   by Author             │
│   ⭐ 4.5  🎧 Audio      │
│   $19.99 | Free         │
└─────────────────────────┘
```

**Badges**:
- 🎧 Audio Available (green)
- 📄 PDF Available (blue)
- 🆓 Free (orange)
- ⭐ Featured (gold)

### User Interactions

1. **Tap Category**:
   - Filter books by category
   - Update URL: `/books?category=science`
   - Show category name in header

2. **Tap Book Card**:
   - Navigate to Book Detail screen
   - Pass book ID

3. **Pull to Refresh**:
   - Reload books list
   - Show loading indicator

4. **Infinite Scroll**:
   - Load next page when user scrolls to bottom
   - Show loading spinner at bottom

5. **Search**:
   - Debounce input (300ms)
   - Show search results
   - Show "No results" if empty

### Loading States

**Skeleton Loaders**:
- Show 6 skeleton cards while loading
- Animate shimmer effect

**Empty States**:
- No books found: "No books match your search"
  - CTA: "Clear filters" or "Browse all books"
- No internet: "You're offline"
  - CTA: "Retry" or "View downloaded books"

### Caching Strategy

**Cache First Page**:
- Store first 20 books in local storage
- Show immediately on app open
- Refresh in background

**Cache Images**:
- Use image caching library
- Preload visible images

### Performance Optimization

- Lazy load images
- Virtualized list for long scrolls
- Pagination: 20 items per page
- Compress images on server

### UX Notes:
- Smooth animations for transitions
- Haptic feedback on tap (iOS)
- Show loading progress
- Remember scroll position when returning

---

## 4️⃣ Book Detail (View, Sample, Purchase, Rent, Read)

**Goal**: Provide comprehensive book information and enable purchase/rent/read actions.

### Screen Layout

**Header**:
- Back button
- Share button
- Wishlist button (heart icon)

**Book Info Section**:
```
┌─────────────────────────────────────┐
│                                     │
│        [Large Cover Image]          │
│                                     │
│   Title (full, multi-line)          │
│   by Author Name                    │
│   ⭐⭐⭐⭐⭐ 4.5 (234 reviews)        │
│                                     │
│   📚 Category: Science              │
│   🌍 Language: English              │
│   📄 Pages: 350                     │
│   📅 Published: 2024                │
│                                     │
└─────────────────────────────────────┘
```

**Availability Section**:
```
Available Formats:
┌─────────────────┬─────────────────┐
│  📱 Soft Copy   │  📚 Hard Copy   │
│  $19.99         │  $29.99         │
│  [Buy Digital]  │  [Buy Physical] │
└─────────────────┴─────────────────┘

Rental Option:
┌─────────────────────────────────────┐
│  📅 Rent for 7 days: $5.99          │
│  [Rent Now]                         │
└─────────────────────────────────────┘
```

**Features Section**:
- 🎧 Audio Available (if `has_audio: true`)
- 📖 Read Sample (first 10 pages)
- 💾 Download after purchase
- 📊 Track reading progress

**Description**:
- Full book description
- "Read more" if long

**Reviews Section**:
- Average rating
- Review count
- Top 3 reviews
- "See all reviews" button

**Related Books**:
- Horizontal scroll of similar books

### API Calls

**Get Book Detail**:
```
GET /api/books/<book_id>/

Response:
{
  "id": 1,
  "title": "Introduction to Python Programming",
  "author": "John Smith",
  "description": "Comprehensive guide to Python...",
  "cover_image": "https://...",
  "pdf_file": "https://...",
  "audio_file": "https://..." (if available),
  "price": 29.99,
  "soft_price": 19.99,
  "hard_price": 29.99,
  "rental_price_per_week": 5.99,
  "book_type": "both",
  "is_for_sale": true,
  "is_for_rent": true,
  "is_free": false,
  "has_audio": true,
  "rating": 4.5,
  "views": 1234,
  "downloads": 567,
  "language": "english",
  "page_count": 350,
  "published_date": "2024-01-15",
  "category": {
    "id": 5,
    "name": "Programming"
  },
  "tags": ["Python", "Programming", "Beginner"]
}
```

### User Flows

#### Flow 1: Read Sample

**Steps**:
1. User taps "Read Sample"
2. Check if logged in:
   - If guest: Allow sample (first 10 pages)
   - If logged in: Allow sample
3. Fetch sample PDF URL:
   ```
   GET /api/books/<book_id>/sample/
   ```
4. Open in-app PDF viewer
5. Show "Buy to read full book" banner at bottom

**PDF Viewer Features**:
- Page navigation
- Zoom in/out
- Night mode
- Bookmark (if logged in)

#### Flow 2: Buy Book (Soft Copy)

**Precondition**: User must be logged in

**Steps**:
1. User taps "Buy Digital" ($19.99)
2. If not logged in → Show login prompt
3. Show confirmation modal:
   ```
   ┌─────────────────────────────────────┐
   │  Purchase Confirmation              │
   │                                     │
   │  Introduction to Python             │
   │  Digital Copy                       │
   │                                     │
   │  Price: $19.99                      │
   │  Tax: $2.00                         │
   │  ─────────────                      │
   │  Total: $21.99                      │
   │                                     │
   │  Payment Method:                    │
   │  [💳 Telebir ▼]                    │
   │                                     │
   │  [Cancel]  [Confirm Purchase]       │
   └─────────────────────────────────────┘
   ```
4. User selects payment method
5. User taps "Confirm Purchase"
6. Call payment API:
   ```
   POST /api/payments/
   Body: {
     "user_id": 123,
     "book_id": 1,
     "payment_type": "purchase_soft",
     "amount": 21.99,
     "payment_method": "telebir"
   }
   
   Response:
   {
     "transaction_id": "TXN123456",
     "payment_url": "https://telebir.com/pay/...",
     "status": "pending"
   }
   ```
7. Open WebView with `payment_url`
8. User completes payment on gateway
9. Gateway redirects back to app
10. App verifies payment:
    ```
    GET /api/payments/<transaction_id>/status/
    
    Response:
    {
      "status": "completed",
      "transaction_id": "TXN123456",
      "book_id": 1
    }
    ```
11. On success:
    - Show success modal: "Purchase successful! 🎉"
    - Update book status to "Owned"
    - Enable "Read Now" and "Download" buttons
    - Add to "My Books"

#### Flow 3: Rent Book

**Steps**:
1. User taps "Rent Now" ($5.99 for 7 days)
2. Show rental confirmation:
   ```
   ┌─────────────────────────────────────┐
   │  Rental Confirmation                │
   │                                     │
   │  Introduction to Python             │
   │  Rental Period: 7 days              │
   │  Expires: Jan 22, 2024              │
   │                                     │
   │  Price: $5.99                       │
   │                                     │
   │  [Cancel]  [Confirm Rental]         │
   └─────────────────────────────────────┘
   ```
3. Call payment API:
   ```
   POST /api/payments/
   Body: {
     "user_id": 123,
     "book_id": 1,
     "payment_type": "rental",
     "amount": 5.99,
     "rental_duration_weeks": 1,
     "payment_method": "telebir"
   }
   ```
4. Complete payment (same as buy flow)
5. On success:
   - Show rental confirmation with expiry date
   - Enable "Read Now" (no download for rentals)
   - Add to "My Rentals" with countdown timer

**Rental Expiry**:
- Show countdown: "3 days left"
- Send push notification: "Rental expires in 1 day"
- On expiry: Disable access, show "Extend Rental" option

#### Flow 4: Download & Read (After Purchase)

**Download**:
```
GET /api/books/<book_id>/download/
Headers: Authorization: Bearer <jwt_token>

Response:
{
  "download_url": "https://signed-url-expires-in-1hour...",
  "file_size": "15.2 MB",
  "expires_at": "2024-01-15T10:30:00Z"
}
```

**Steps**:
1. User taps "Download"
2. Show download progress:
   ```
   Downloading... 45%
   [████████░░░░░░░░] 6.8 MB / 15.2 MB
   ```
3. Save to device storage (encrypted)
4. Mark as "Downloaded" with checkmark
5. Enable offline reading

**Read**:
1. User taps "Read Now"
2. Open in-app PDF reader
3. Track reading progress:
   ```
   POST /api/books/<book_id>/progress/
   Body: {
     "user_id": 123,
     "current_page": 45,
     "total_pages": 350,
     "last_read": "2024-01-15T10:30:00Z"
   }
   ```
4. Sync progress across devices

### Edge Cases & Errors

| Scenario | Handling |
|----------|----------|
| Payment fails | Show error, option to retry, save cart |
| Network disconnect during download | Resume capability, show progress |
| Book already purchased | Show "Already owned", enable read |
| Rental expired | Disable access, show "Extend" or "Buy" |
| PDF too large | Warn user, offer streaming option |
| Invalid payment method | Show supported methods |

### Security

- Protect download endpoints with JWT
- Use signed URLs with expiration
- Encrypt downloaded files on device
- Validate purchase before allowing access
- Rate limit download requests

### UX Notes:
- Show clear pricing for all options
- Highlight best value (e.g., "Save 33% with digital")
- Allow wishlist for later
- Show "Customers also bought" recommendations
- Enable social sharing with referral tracking

---


## 5️⃣ Audiobook Generation & Playback (AI Audio + gTTS Pipeline)

**Goal**: Enable students to play AI-generated audio or record their own reading.

### Preconditions

**Backend Endpoints**:
- `GET /api/audiobooks/` - List audiobooks
- `POST /api/audiobooks/generate-audio/` - Start generation
- `GET /api/audiobooks/<id>/` - Get status & file URL
- `POST /api/audiobooks/progress/` - Track listening progress
- `POST /api/audiobooks/upload-recording/` - Upload user recording

### Flow 1: Play Available AI Audio

**Scenario**: Book already has AI-generated audio

**Steps**:
1. Book Detail shows "🎧 Audio Available" badge
2. User taps "Play Audio" button
3. Fetch audio URL:
   ```
   GET /api/audiobooks/?book_id=<id>
   
   Response:
   {
     "id": 1,
     "book_id": 1,
     "audio_file": "https://.../ai_audio_1.mp3",
     "duration": "5h 32m",
     "narrator": "AI Generated Voice",
     "status": "ready",
     "created_at": "2024-01-15T10:00:00Z"
   }
   ```
4. Open Audio Player screen
5. Stream audio (don't require full download)

**Audio Player UI**:
```
┌─────────────────────────────────────┐
│  [Book Cover]                       │
│                                     │
│  Introduction to Python             │
│  by John Smith                      │
│  🤖 AI Generated Voice              │
│                                     │
│  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] │
│  1:23:45 / 5:32:00                  │
│                                     │
│  [⏮] [⏪] [▶️/⏸] [⏩] [⏭]         │
│                                     │
│  Speed: 1.0x  |  Sleep: Off         │
│  [🔊 Volume Slider]                 │
│                                     │
│  Chapters:                          │
│  ✓ Chapter 1: Introduction          │
│  ▶ Chapter 2: Getting Started       │
│    Chapter 3: Variables             │
└─────────────────────────────────────┘
```

**Player Features**:
- Play/Pause
- Skip forward/backward (10s, 30s)
- Playback speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- Sleep timer (15min, 30min, 1hr, end of chapter)
- Volume control
- Chapter navigation
- Background playback
- Lock screen controls

**Track Progress**:
```
POST /api/audiobooks/progress/
Body: {
  "book_id": 1,
  "user_id": 123,
  "position": 5025, // seconds
  "duration": 19920,
  "last_played": "2024-01-15T10:30:00Z"
}

Auto-save every 30 seconds
```

### Flow 2: Request AI Audio Generation

**Scenario**: Book has PDF but no audio yet

**Steps**:
1. Book Detail shows "Generate Audio" button
2. User taps "Generate Audio"
3. Show confirmation modal:
   ```
   ┌─────────────────────────────────────┐
   │  Generate AI Audio                  │
   │                                     │
   │  This will create an AI-narrated    │
   │  audiobook from the PDF text.       │
   │                                     │
   │  ⏱ Estimated time: 5-10 minutes    │
   │  📊 File size: ~50 MB               │
   │                                     │
   │  Voice: [English (US) ▼]            │
   │  Speed: [Normal ▼]                  │
   │                                     │
   │  ⚠️ This uses AI and may take time. │
   │  We'll notify you when ready.       │
   │                                     │
   │  [Cancel]  [Generate]               │
   └─────────────────────────────────────┘
   ```
4. User taps "Generate"
5. Call generation API:
   ```
   POST /api/audiobooks/generate-audio/
   Body: {
     "book_id": 1,
     "voice": "en-US",
     "speed": "normal"
   }
   
   Response:
   {
     "success": true,
     "job_id": "job_abc123",
     "status": "queued",
     "estimated_time": "5-10 minutes",
     "message": "Audio generation started"
   }
   ```
6. Show generation in progress:
   ```
   ┌─────────────────────────────────────┐
   │  🎧 Generating Audio...             │
   │                                     │
   │  Status: Processing PDF             │
   │  Progress: 35%                      │
   │  [████████░░░░░░░░░░░░]            │
   │                                     │
   │  Estimated time: 3 minutes          │
   │                                     │
   │  [Cancel Generation]                │
   └─────────────────────────────────────┘
   ```
7. Poll for status every 10 seconds:
   ```
   GET /api/audiobooks/<job_id>/status/
   
   Response (Processing):
   {
     "job_id": "job_abc123",
     "status": "processing",
     "progress": 35,
     "current_step": "Extracting text from PDF",
     "estimated_time_remaining": "3 minutes"
   }
   
   Response (Ready):
   {
     "job_id": "job_abc123",
     "status": "ready",
     "progress": 100,
     "audio_url": "https://.../ai_audio_1.mp3",
     "duration": "5h 32m",
     "file_size": "52.3 MB"
   }
   ```
8. When ready:
   - Show success notification: "Audio ready! 🎉"
   - Enable "Play Audio" button
   - Send push notification if app in background

**Generation States**:
- `queued` - Waiting in queue
- `processing` - Extracting text & generating audio
- `ready` - Audio file available
- `failed` - Generation failed

**Progress Steps**:
1. Extracting text from PDF (20%)
2. Processing text (40%)
3. Generating audio (70%)
4. Finalizing (90%)
5. Ready (100%)

### Flow 3: User Voice Recording

**Scenario**: Student wants to record their own reading

**Steps**:
1. User taps "Record Your Voice" button
2. Request microphone permission:
   ```
   ┌─────────────────────────────────────┐
   │  Microphone Access                  │
   │                                     │
   │  E-Library needs microphone access  │
   │  to record your voice.              │
   │                                     │
   │  [Don't Allow]  [Allow]             │
   └─────────────────────────────────────┘
   ```
3. If granted, show recording screen:
   ```
   ┌─────────────────────────────────────┐
   │  🎙 Record Your Reading             │
   │                                     │
   │  [Waveform Visualization]           │
   │  ▁▂▃▅▇▅▃▂▁▂▃▅▇▅▃▂▁                │
   │                                     │
   │  Recording: 00:02:34                │
   │                                     │
   │  [🔴 Stop]  [⏸ Pause]              │
   │                                     │
   │  Tips:                              │
   │  • Speak clearly                    │
   │  • Minimize background noise        │
   │  • Hold phone 6 inches away         │
   └─────────────────────────────────────┘
   ```
4. User taps "Stop" when done
5. Show recording preview:
   ```
   ┌─────────────────────────────────────┐
   │  Recording Complete                 │
   │                                     │
   │  Duration: 00:02:34                 │
   │  Size: 2.3 MB                       │
   │                                     │
   │  [▶️ Play]  [🔄 Re-record]         │
   │                                     │
   │  Title: [My Reading - Chapter 1]    │
   │  Privacy: [🔒 Private ▼]           │
   │                                     │
   │  [Discard]  [Save]                  │
   └─────────────────────────────────────┘
   ```
6. User taps "Save"
7. Upload recording:
   ```
   POST /api/audiobooks/upload-recording/
   Headers: Authorization: Bearer <jwt>
   Body (multipart/form-data): {
     "audio_file": <file>,
     "book_id": 1,
     "user_id": 123,
     "title": "My Reading - Chapter 1",
     "duration": 154,
     "privacy": "private"
   }
   
   Response:
   {
     "success": true,
     "recording_id": "rec_xyz789",
     "url": "https://.../user_recordings/rec_xyz789.webm",
     "message": "Recording saved successfully"
   }
   ```
8. Add to "My Recordings" list

**Recording Features**:
- Pause/Resume during recording
- Visual waveform feedback
- Audio level meter
- Background noise detection
- Maximum duration: 2 hours
- Format: WebM or AAC

**My Recordings List**:
```
┌─────────────────────────────────────┐
│  My Recordings (3)                  │
│                                     │
│  📼 My Reading - Chapter 1          │
│     00:02:34  |  Jan 15, 2024       │
│     [▶️] [📥] [🗑]                  │
│                                     │
│  📼 Practice Reading                │
│     00:05:12  |  Jan 14, 2024       │
│     [▶️] [📥] [🗑]                  │
│                                     │
│  📼 Book Summary                    │
│     00:01:45  |  Jan 13, 2024       │
│     [▶️] [📥] [🗑]                  │
└─────────────────────────────────────┘
```

**Actions**:
- ▶️ Play recording
- 📥 Download to device
- 🗑 Delete recording
- 🔗 Share (if public)

### Playback & Download

**Download AI Audio**:
```
GET /api/audiobooks/<id>/download/
Headers: Authorization: Bearer <jwt>

Response:
{
  "download_url": "https://signed-url...",
  "file_size": "52.3 MB",
  "expires_at": "2024-01-15T11:00:00Z"
}
```

**Download User Recording**:
- Tap download icon
- Save to device: `Downloads/BookTitle-user-audio-timestamp.webm`
- Show in "Downloaded" section

**Offline Playback**:
- Downloaded audio plays without internet
- Show "Downloaded" badge
- Sync progress when online

### Edge Cases & Errors

| Scenario | Handling |
|----------|----------|
| PDF too large (>100 pages) | Offer chunked generation or summary |
| PDF has images only | Show error: "Text extraction failed" |
| Generation fails | Show reason, offer retry |
| Microphone permission denied | Show settings link to enable |
| Recording interrupted (call) | Auto-save draft, allow resume |
| Network fails during upload | Queue for retry, show pending |
| Audio file corrupted | Show error, offer re-generation |
| Unsupported language | Show supported languages list |

### Permissions

**Microphone** (for recording):
- Request when user taps "Record"
- Explain usage clearly
- Provide settings link if denied

**Storage** (for downloads):
- Request when user taps "Download"
- Show available space warning if low

**Background Audio** (for playback):
- Enable background mode
- Show lock screen controls
- Handle interruptions (calls, alarms)

### UX & States

**Generation Progress**:
- Show real-time progress bar
- Display current step
- Allow cancellation
- Estimate time remaining
- Send notification when complete

**Playback States**:
- Loading: Show spinner
- Playing: Show pause button
- Paused: Show play button
- Buffering: Show loading indicator
- Error: Show retry button

**Recording States**:
- Ready: Show record button
- Recording: Show stop/pause
- Paused: Show resume/stop
- Processing: Show saving indicator
- Saved: Show success message

### Performance Optimization

- Stream audio instead of full download
- Cache audio chunks for offline
- Compress recordings before upload
- Use adaptive bitrate for streaming
- Preload next chapter

### Accessibility

- VoiceOver/TalkBack support
- Large touch targets for controls
- High contrast mode
- Haptic feedback for actions
- Keyboard shortcuts (if applicable)

---

## 6️⃣ Exam / Quiz Flow (Browse, Take Timed Exam, Submit)

**Goal**: Enable students to take timed, scored exams with progress tracking.

### Screens Overview

1. **Exam List** - Browse available exams
2. **Exam Detail** - View instructions and requirements
3. **Exam Runner** - Take the exam with timer
4. **Results** - View score and feedback

### Flow 1: Browse Exams

**Exam List Screen**:
```
┌─────────────────────────────────────┐
│  📝 Exams & Quizzes                 │
│                                     │
│  Filters: [All ▼] [Subject ▼]      │
│  Search: [Search exams...]          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📚 Python Basics Quiz       │   │
│  │ Subject: Programming        │   │
│  │ ⏱ 30 min  |  📊 20 questions│   │
│  │ ⭐ Not Started              │   │
│  │ [Start Exam]                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔬 Science Midterm          │   │
│  │ Subject: Science            │   │
│  │ ⏱ 60 min  |  📊 50 questions│   │
│  │ ✅ Completed: 85%           │   │
│  │ [View Results]              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**API Call**:
```
GET /api/exam/

Response:
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "name": "Python Basics Quiz",
      "subject": {
        "id": 5,
        "name": "Programming"
      },
      "description": "Test your Python knowledge",
      "time_limit_minutes": 30,
      "question_count": 20,
      "passing_score": 70,
      "status": "not_started",
      "attempts_allowed": 3,
      "attempts_used": 0
    },
    ...
  ]
}
```

**Filter by Subject**:
```
GET /api/exam/?subject=<subject_id>
```

**User Progress**:
```
GET /api/exam/history/?user_id=<id>

Response:
{
  "exams": [
    {
      "exam_id": 1,
      "status": "completed",
      "score": 85,
      "completed_at": "2024-01-15T10:00:00Z",
      "time_spent": 1800
    },
    ...
  ]
}
```

### Flow 2: Exam Detail & Instructions

**Exam Detail Screen**:
```
┌─────────────────────────────────────┐
│  📚 Python Basics Quiz              │
│                                     │
│  Subject: Programming               │
│  Difficulty: Intermediate           │
│                                     │
│  📊 Exam Details:                   │
│  • Questions: 20                    │
│  • Time Limit: 30 minutes           │
│  • Passing Score: 70%               │
│  • Attempts: 0/3 used               │
│                                     │
│  📝 Instructions:                   │
│  • Read each question carefully     │
│  • Select the best answer           │
│  • You can review before submit     │
│  • Timer starts when you begin      │
│  • No pausing allowed               │
│                                     │
│  ⚠️ Important:                      │
│  • Ensure stable internet           │
│  • Do not close the app             │
│  • Answers auto-save                │
│                                     │
│  [Cancel]  [Start Exam]             │
└─────────────────────────────────────┘
```

**Start Exam Confirmation**:
```
┌─────────────────────────────────────┐
│  Ready to Start?                    │
│                                     │
│  Once you start, the timer begins   │
│  and cannot be paused.              │
│                                     │
│  Make sure you have:                │
│  ✓ Stable internet connection       │
│  ✓ 30 minutes of uninterrupted time │
│  ✓ Quiet environment                │
│                                     │
│  [Cancel]  [I'm Ready]              │
└─────────────────────────────────────┘
```

### Flow 3: Taking the Exam

**Start Exam**:
```
POST /api/exam/<exam_id>/start/

Response:
{
  "session_id": "session_abc123",
  "exam_id": 1,
  "started_at": "2024-01-15T10:00:00Z",
  "expires_at": "2024-01-15T10:30:00Z",
  "questions": [
    {
      "id": 101,
      "question_number": 1,
      "question_text": "What is Python?",
      "options": [
        "A snake",
        "A programming language",
        "A framework",
        "A database"
      ],
      "question_type": "multiple_choice"
    },
    ...
  ]
}
```

**Exam Runner Screen**:
```
┌─────────────────────────────────────┐
│  ⏱ 28:45  |  Question 5/20  |  📊  │
│                                     │
│  Question 5:                        │
│  What is the output of print(2**3)?│
│                                     │
│  ○ A. 5                             │
│  ○ B. 6                             │
│  ● C. 8                             │
│  ○ D. 9                             │
│                                     │
│  [Flag for Review]                  │
│                                     │
│  [◀ Previous]  [Next ▶]            │
│                                     │
│  Progress: [████░░░░░░░░░░░░░░░░]  │
│  Answered: 4/20                     │
└─────────────────────────────────────┘
```

**Top Bar**:
- Timer (countdown, turns red at 5 min)
- Question number
- Progress button (opens question navigator)

**Question Navigator** (tap 📊):
```
┌─────────────────────────────────────┐
│  Question Navigator                 │
│                                     │
│  [✓1] [✓2] [✓3] [✓4] [●5]          │
│  [○6] [○7] [○8] [○9] [○10]         │
│  [○11] [○12] [○13] [○14] [○15]     │
│  [○16] [○17] [○18] [○19] [○20]     │
│                                     │
│  Legend:                            │
│  ✓ Answered  |  ● Current  |  ○ Not│
│  🚩 Flagged for review              │
│                                     │
│  [Close]                            │
└─────────────────────────────────────┘
```

**Auto-Save Answers**:
```
POST /api/exam/<session_id>/answer/
Body: {
  "question_id": 101,
  "selected_option": "C. 8",
  "answered_at": "2024-01-15T10:05:23Z"
}

Auto-save every 10 seconds or on answer change
```

**Navigation**:
- Previous/Next buttons
- Jump to question via navigator
- Flag questions for review
- Show answered count

**Timer Behavior**:
- Countdown from time limit
- Show warning at 5 minutes
- Show critical warning at 1 minute
- Auto-submit at 0:00

### Flow 4: Review & Submit

**Review Screen** (before final submit):
```
┌─────────────────────────────────────┐
│  Review Your Answers                │
│                                     │
│  Answered: 18/20                    │
│  Unanswered: 2                      │
│  Flagged: 3                         │
│                                     │
│  ⚠️ Unanswered Questions:           │
│  • Question 7                       │
│  • Question 15                      │
│                                     │
│  🚩 Flagged for Review:             │
│  • Question 3                       │
│  • Question 12                      │
│  • Question 18                      │
│                                     │
│  Time Remaining: 12:34              │
│                                     │
│  [Continue Exam]  [Submit]          │
└─────────────────────────────────────┘
```

**Submit Confirmation**:
```
┌─────────────────────────────────────┐
│  Submit Exam?                       │
│                                     │
│  You have answered 18/20 questions. │
│  2 questions are unanswered.        │
│                                     │
│  ⚠️ You cannot change answers after │
│  submission.                        │
│                                     │
│  Are you sure you want to submit?   │
│                                     │
│  [Cancel]  [Yes, Submit]            │
└─────────────────────────────────────┘
```

**Submit Exam**:
```
POST /api/exam/<session_id>/submit/

Response:
{
  "session_id": "session_abc123",
  "exam_id": 1,
  "score": 85,
  "total_questions": 20,
  "correct_answers": 17,
  "incorrect_answers": 3,
  "time_spent": 1800,
  "passing_score": 70,
  "passed": true,
  "completed_at": "2024-01-15T10:30:00Z",
  "results": [
    {
      "question_id": 101,
      "question_text": "What is Python?",
      "selected_option": "B. A programming language",
      "correct_option": "B. A programming language",
      "is_correct": true,
      "explanation": "Python is a high-level programming language."
    },
    ...
  ]
}
```

### Flow 5: Results Screen

**Results Overview**:
```
┌─────────────────────────────────────┐
│  🎉 Exam Complete!                  │
│                                     │
│  Python Basics Quiz                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Your Score: 85%        │   │
│  │      ⭐⭐⭐⭐⭐              │   │
│  │      17/20 Correct          │   │
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

**Detailed Results** (per question):
```
┌─────────────────────────────────────┐
│  Question 1: ✅ Correct             │
│                                     │
│  What is Python?                    │
│                                     │
│  Your Answer: B. A programming lang │
│  Correct Answer: B. A programming   │
│                                     │
│  💡 Explanation:                    │
│  Python is a high-level programming │
│  language known for its simplicity. │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  Question 2: ❌ Incorrect           │
│  ...                                │
└─────────────────────────────────────┘
```

**Certificate** (if passed):
- Generate PDF certificate
- Include: Name, Exam, Score, Date
- Allow download and share

### Edge Cases & Anti-Cheat

| Scenario | Handling |
|----------|----------|
| App loses connection | Save answers locally, sync on reconnect |
| App crashes | Resume from last saved state |
| Timer expires | Auto-submit with current answers |
| User exits app | Show warning, save progress |
| Multiple devices | Lock to one device per session |
| Screen recording | Detect and warn (if possible) |
| Copy/paste | Disable in exam mode |

**Anti-Cheat Measures**:
- Server-side time validation
- Question randomization per user
- Option shuffling
- Session locking (one device)
- Activity monitoring (focus loss)
- Proctoring (optional, future)

### Offline Handling

**During Exam**:
- Save answers locally
- Show offline banner
- Queue submissions
- Sync when online
- Validate with server time

**Offline Mode**:
- Cannot start new exam
- Can review past results
- Can view exam list (cached)

### Permissions

**None required** for basic exam functionality

**Optional**:
- Camera (for proctoring, future)
- Screen recording detection

### UX Notes

- Clear timer visibility
- Smooth navigation
- Auto-save feedback
- Progress indicators
- Confirmation dialogs
- Encouraging messages
- Detailed feedback
- Performance analytics

### Performance Optimization

- Preload questions
- Cache exam data
- Minimize API calls
- Batch answer saves
- Compress payloads
- Lazy load results

---

