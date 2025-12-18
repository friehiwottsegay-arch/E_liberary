# 🧪 E-Library Mobile App - QA Test Cases

## Test Environment Setup

**Devices to Test**:
- iOS: iPhone 12, iPhone 14 Pro, iPad Air
- Android: Samsung Galaxy S21, Pixel 6, OnePlus 9
- OS Versions: iOS 15+, Android 11+

**Network Conditions**:
- WiFi (fast)
- 4G/LTE (medium)
- 3G (slow)
- Offline
- Intermittent connection

**Test Accounts**:
- Student account: `student@test.com` / `Test123!`
- Buyer account: `buyer@test.com` / `Test123!`
- Guest mode (no login)

---

## 1. Authentication Test Cases

### TC-AUTH-001: User Registration (Student)
**Priority**: Critical  
**Type**: Functional

**Preconditions**:
- App installed and opened
- No existing account with test email

**Steps**:
1. Tap "Sign Up" on Auth Landing
2. Enter first name: "John"
3. Enter last name: "Doe"
4. Enter email: "john.doe.test@example.com"
5. Enter password: "SecurePass123!"
6. Confirm password: "SecurePass123!"
7. Select role: "Student"
8. Check "I agree to Terms" checkbox
9. Tap "Create Account"

**Expected Result**:
- ✅ Account created successfully
- ✅ Welcome modal appears: "Welcome, John! 🎉"
- ✅ User automatically logged in
- ✅ JWT tokens stored securely
- ✅ Navigated to Home screen
- ✅ User role displayed as "Student"

**API Validation**:
- POST `/api/users/register/` returns 201
- Response contains user object with correct data
- Tokens are valid JWT format

**Edge Cases to Test**:
- Email already exists → Show error
- Weak password → Show validation error
- Passwords don't match → Show error
- Network timeout → Show retry option
- Special characters in name → Accept

---

### TC-AUTH-002: User Login (Valid Credentials)
**Priority**: Critical  
**Type**: Functional

**Preconditions**:
- User account exists: `student@test.com` / `Test123!`
- User logged out

**Steps**:
1. Tap "Log In" on Auth Landing
2. Enter email: "student@test.com"
3. Enter password: "Test123!"
4. Tap "Log In"

**Expected Result**:
- ✅ Login successful
- ✅ Toast message: "Welcome back, Student!"
- ✅ JWT tokens stored
- ✅ User context loaded
- ✅ Navigated to Home
- ✅ Profile shows correct user info

**API Validation**:
- POST `/api/users/login/` returns 200
- Response contains access & refresh tokens
- User object has correct role

---

### TC-AUTH-003: User Login (Invalid Credentials)
**Priority**: High  
**Type**: Negative

**Steps**:
1. Tap "Log In"
2. Enter email: "student@test.com"
3. Enter password: "WrongPassword123!"
4. Tap "Log In"

**Expected Result**:
- ❌ Login fails
- ✅ Error message: "Invalid email or password"
- ✅ "Forgot Password?" link visible
- ✅ No navigation occurs
- ✅ No tokens stored

**API Validation**:
- POST `/api/users/login/` returns 401
- Error message in response

---

### TC-AUTH-004: Token Refresh
**Priority**: Critical  
**Type**: Functional

**Preconditions**:
- User logged in
- Access token expired (simulate by waiting or manipulating)

**Steps**:
1. Make API call with expired access token
2. Observe automatic token refresh

**Expected Result**:
- ✅ App detects 401 error
- ✅ Automatically calls refresh endpoint
- ✅ New access token obtained
- ✅ Original request retried successfully
- ✅ User not logged out

**API Validation**:
- POST `/api/users/token/refresh/` returns 200
- New access token received
- Original request succeeds

---

### TC-AUTH-005: Logout
**Priority**: High  
**Type**: Functional

**Preconditions**:
- User logged in

**Steps**:
1. Tap profile icon
2. Tap "Logout"
3. Confirm logout

**Expected Result**:
- ✅ Confirmation dialog appears
- ✅ Tokens cleared from storage
- ✅ User context cleared
- ✅ Navigated to Auth Landing
- ✅ Toast: "Logged out successfully"
- ✅ Cannot access protected routes

---

## 2. Book Discovery & Detail Test Cases

### TC-BOOK-001: Browse Books (Home Screen)
**Priority**: Critical  
**Type**: Functional

**Steps**:
1. Open app (logged in or guest)
2. Navigate to Home screen
3. Observe book listings

**Expected Result**:
- ✅ Categories displayed horizontally
- ✅ Featured carousel auto-scrolls
- ✅ Book cards show: title, author, cover, price, badges
- ✅ "Recommended", "New", "Popular" sections visible
- ✅ Infinite scroll loads more books
- ✅ Pull-to-refresh works

**API Validation**:
- GET `/api/books/?page=1` returns 200
- GET `/api/categories/` returns categories
- Pagination works correctly

**Performance**:
- Initial load < 3 seconds
- Smooth scrolling (60fps)
- Images load progressively

---

### TC-BOOK-002: Search Books
**Priority**: High  
**Type**: Functional

**Steps**:
1. Tap search bar
2. Type "Python"
3. Wait for results (debounced)

**Expected Result**:
- ✅ Search results appear after 300ms delay
- ✅ Results match query (title or author)
- ✅ Empty state if no results
- ✅ Clear button visible
- ✅ Recent searches saved

**API Validation**:
- GET `/api/books/?search=Python` returns filtered results

---

### TC-BOOK-003: Filter by Category
**Priority**: High  
**Type**: Functional

**Steps**:
1. Tap "Science" category
2. Observe filtered books

**Expected Result**:
- ✅ Only Science books displayed
- ✅ Category name in header
- ✅ Filter badge visible
- ✅ Can clear filter

**API Validation**:
- GET `/api/books/?category=<id>` returns correct books

---

### TC-BOOK-004: View Book Detail
**Priority**: Critical  
**Type**: Functional

**Steps**:
1. Tap any book card
2. Observe book detail screen

**Expected Result**:
- ✅ Full book info displayed
- ✅ Cover image loads
- ✅ Price, author, description visible
- ✅ Available formats shown (hard/soft)
- ✅ Rental option if available
- ✅ Audio badge if has_audio=true
- ✅ "Read Sample" button visible
- ✅ "Buy" / "Rent" buttons visible

**API Validation**:
- GET `/api/books/<id>/` returns complete book data

---

### TC-BOOK-005: Read Sample PDF
**Priority**: High  
**Type**: Functional

**Preconditions**:
- Book has PDF file

**Steps**:
1. On book detail, tap "Read Sample"
2. PDF viewer opens

**Expected Result**:
- ✅ PDF loads in-app viewer
- ✅ First 10 pages accessible
- ✅ Can zoom, pan, navigate pages
- ✅ "Buy to read full book" banner at bottom
- ✅ Cannot access beyond sample pages

---

## 3. Purchase & Payment Test Cases

### TC-PAY-001: Purchase Book (Soft Copy) - Success
**Priority**: Critical  
**Type**: Functional

**Preconditions**:
- User logged in
- Book not already purchased
- Test payment method available

**Steps**:
1. On book detail, tap "Buy Digital" ($19.99)
2. Review confirmation modal
3. Select payment method: "Telebir"
4. Tap "Confirm Purchase"
5. Complete payment in WebView
6. Return to app

**Expected Result**:
- ✅ Confirmation modal shows correct price
- ✅ Payment WebView opens
- ✅ Payment completes successfully
- ✅ Success modal: "Purchase successful! 🎉"
- ✅ Book status changes to "Owned"
- ✅ "Read Now" and "Download" buttons enabled
- ✅ Book appears in "My Books"

**API Validation**:
- POST `/api/payments/` returns transaction_id
- GET `/api/payments/<id>/status/` returns "completed"
- GET `/api/users/purchases/` includes new purchase

**Database Validation**:
- UserPurchase record created
- Payment record status = "completed"

---

### TC-PAY-002: Purchase Book - Payment Failure
**Priority**: High  
**Type**: Negative

**Steps**:
1. Initiate purchase
2. Simulate payment failure (cancel in WebView)

**Expected Result**:
- ❌ Payment fails
- ✅ Error message: "Payment failed. Please try again."
- ✅ Retry button available
- ✅ Book not unlocked
- ✅ No purchase record created

---

### TC-PAY-003: Rent Book - Success
**Priority**: High  
**Type**: Functional

**Steps**:
1. Tap "Rent Now" ($5.99 for 7 days)
2. Confirm rental
3. Complete payment

**Expected Result**:
- ✅ Rental confirmation shows expiry date
- ✅ Payment successful
- ✅ "Read Now" enabled (no download)
- ✅ Countdown timer visible: "6 days left"
- ✅ Book in "My Rentals"

**API Validation**:
- Payment type = "rental"
- rental_end_date set correctly

---

### TC-PAY-004: Rental Expiry
**Priority**: Medium  
**Type**: Functional

**Preconditions**:
- Book rented and expired (simulate by changing date)

**Steps**:
1. Try to access expired rental

**Expected Result**:
- ❌ Access denied
- ✅ Message: "Rental expired"
- ✅ "Extend Rental" button visible
- ✅ "Buy Now" option available

---

### TC-PAY-005: Download Purchased Book
**Priority**: High  
**Type**: Functional

**Preconditions**:
- Book purchased (soft copy)

**Steps**:
1. Tap "Download"
2. Wait for download

**Expected Result**:
- ✅ Download progress shown
- ✅ File saved to device storage (encrypted)
- ✅ "Downloaded" checkmark visible
- ✅ Can read offline

**API Validation**:
- GET `/api/books/<id>/download/` returns signed URL
- URL expires after 1 hour

---

## 4. Audiobook Test Cases

### TC-AUDIO-001: Play Existing AI Audio
**Priority**: High  
**Type**: Functional

**Preconditions**:
- Book has audio_file available

**Steps**:
1. On book detail, tap "Play Audio"
2. Audio player opens
3. Tap play button

**Expected Result**:
- ✅ Audio player screen opens
- ✅ Audio streams and plays
- ✅ Play/pause works
- ✅ Seek bar functional
- ✅ Volume control works
- ✅ Progress saved every 30s

**API Validation**:
- GET `/api/audiobooks/?book_id=<id>` returns audio URL
- POST `/api/audiobooks/progress/` saves position

---

### TC-AUDIO-002: Generate AI Audio - Success
**Priority**: Critical  
**Type**: Functional

**Preconditions**:
- Book has PDF but no audio
- User has permission

**Steps**:
1. Tap "Generate Audio"
2. Confirm generation
3. Wait for completion

**Expected Result**:
- ✅ Confirmation modal explains process
- ✅ Generation starts
- ✅ Progress shown: "Processing PDF... 35%"
- ✅ Poll status every 10s
- ✅ Notification when ready
- ✅ "Play Audio" button enabled
- ✅ Audio plays successfully

**API Validation**:
- POST `/api/audiobooks/generate-audio/` returns job_id
- GET `/api/audiobooks/<job_id>/status/` shows progress
- Final status = "ready" with audio_url

**Performance**:
- Generation completes within estimated time
- No app crashes during generation

---

### TC-AUDIO-003: Generate AI Audio - Failure
**Priority**: Medium  
**Type**: Negative

**Steps**:
1. Attempt generation on book with image-only PDF
2. Observe failure

**Expected Result**:
- ❌ Generation fails
- ✅ Error message: "Text extraction failed"
- ✅ Reason explained
- ✅ Retry option available

---

### TC-AUDIO-004: Record User Voice
**Priority**: Medium  
**Type**: Functional

**Preconditions**:
- Microphone permission granted

**Steps**:
1. Tap "Record Your Voice"
2. Grant microphone permission (if first time)
3. Tap record button
4. Speak for 30 seconds
5. Tap stop
6. Review recording
7. Tap save

**Expected Result**:
- ✅ Permission requested (first time)
- ✅ Recording starts
- ✅ Waveform visualization shown
- ✅ Timer counts up
- ✅ Stop button works
- ✅ Playback preview works
- ✅ Recording saved
- ✅ Appears in "My Recordings"

**API Validation**:
- POST `/api/audiobooks/upload-recording/` succeeds
- Recording accessible in list

---

### TC-AUDIO-005: Audio Playback Controls
**Priority**: High  
**Type**: Functional

**Steps**:
1. Play audio
2. Test all controls

**Expected Result**:
- ✅ Play/Pause toggles correctly
- ✅ Skip forward (10s) works
- ✅ Skip backward (10s) works
- ✅ Seek bar draggable
- ✅ Speed control (0.5x - 2x) works
- ✅ Volume slider works
- ✅ Sleep timer sets correctly
- ✅ Background playback works
- ✅ Lock screen controls visible

---

### TC-AUDIO-006: Download Audio
**Priority**: Medium  
**Type**: Functional

**Steps**:
1. On audio player, tap "Download"
2. Wait for download

**Expected Result**:
- ✅ Download progress shown
- ✅ File saved to device
- ✅ Offline playback works
- ✅ "Downloaded" badge visible

---

## 5. Exam Test Cases

### TC-EXAM-001: Browse Exams
**Priority**: High  
**Type**: Functional

**Steps**:
1. Navigate to Exams tab
2. View exam list

**Expected Result**:
- ✅ Exams displayed with details
- ✅ Filter by subject works
- ✅ Search works
- ✅ Status shown (not started, completed)
- ✅ Scores visible for completed

**API Validation**:
- GET `/api/exam/` returns exam list

---

### TC-EXAM-002: Start Exam
**Priority**: Critical  
**Type**: Functional

**Preconditions**:
- User logged in
- Exam not started

**Steps**:
1. Tap exam card
2. Read instructions
3. Tap "Start Exam"
4. Confirm readiness

**Expected Result**:
- ✅ Instructions displayed
- ✅ Confirmation dialog appears
- ✅ Timer starts on confirm
- ✅ First question loads
- ✅ Session created

**API Validation**:
- POST `/api/exam/<id>/start/` returns session_id
- Questions loaded

---

### TC-EXAM-003: Answer Questions
**Priority**: Critical  
**Type**: Functional

**Steps**:
1. During exam, select answers
2. Navigate between questions
3. Flag questions for review

**Expected Result**:
- ✅ Selected option highlighted
- ✅ Answer auto-saved
- ✅ Previous/Next navigation works
- ✅ Question navigator shows status
- ✅ Flag icon toggles
- ✅ Progress bar updates

**API Validation**:
- POST `/api/exam/<session>/answer/` saves answers
- Answers persist on navigation

---

### TC-EXAM-004: Submit Exam
**Priority**: Critical  
**Type**: Functional

**Steps**:
1. Answer all questions
2. Tap "Submit"
3. Review summary
4. Confirm submission

**Expected Result**:
- ✅ Review screen shows answered count
- ✅ Unanswered questions listed
- ✅ Confirmation dialog appears
- ✅ Submission succeeds
- ✅ Results screen appears
- ✅ Score displayed correctly

**API Validation**:
- POST `/api/exam/<session>/submit/` returns score
- Results include correct/incorrect breakdown

---

### TC-EXAM-005: Timer Expiry
**Priority**: High  
**Type**: Functional

**Steps**:
1. Start exam
2. Wait for timer to reach 0:00 (or simulate)

**Expected Result**:
- ✅ Warning at 5 minutes
- ✅ Critical warning at 1 minute
- ✅ Auto-submit at 0:00
- ✅ Results shown
- ✅ All answered questions counted

---

### TC-EXAM-006: Exam Interruption (App Crash)
**Priority**: High  
**Type**: Negative

**Steps**:
1. Start exam
2. Answer 5 questions
3. Force close app
4. Reopen app

**Expected Result**:
- ✅ Resume dialog appears
- ✅ Can continue from last saved state
- ✅ Timer continues from where it left off
- ✅ Answers preserved

---

### TC-EXAM-007: Offline During Exam
**Priority**: High  
**Type**: Negative

**Steps**:
1. Start exam
2. Disable internet
3. Continue answering
4. Re-enable internet

**Expected Result**:
- ✅ Offline banner shown
- ✅ Answers saved locally
- ✅ Can continue answering
- ✅ Answers sync when online
- ✅ Timer validated with server

---

## 6. Offline & Caching Test Cases

### TC-OFFLINE-001: View Downloaded Books Offline
**Priority**: High  
**Type**: Functional

**Preconditions**:
- Books downloaded while online

**Steps**:
1. Download 3 books
2. Enable airplane mode
3. Navigate to "My Books"
4. Open downloaded book

**Expected Result**:
- ✅ Downloaded books visible
- ✅ Can open and read PDF
- ✅ Offline banner shown
- ✅ Cannot purchase new books
- ✅ Cannot start new exams

---

### TC-OFFLINE-002: Play Downloaded Audio Offline
**Priority**: Medium  
**Type**: Functional

**Steps**:
1. Download audio while online
2. Go offline
3. Play audio

**Expected Result**:
- ✅ Audio plays from local storage
- ✅ All controls work
- ✅ Progress saved locally
- ✅ Syncs when online

---

### TC-OFFLINE-003: Queue Actions for Sync
**Priority**: Medium  
**Type**: Functional

**Steps**:
1. Go offline
2. Attempt purchase (should fail gracefully)
3. Answer exam questions (if already started)
4. Go online

**Expected Result**:
- ✅ Purchase shows "Requires internet"
- ✅ Exam answers queued
- ✅ Sync occurs automatically when online
- ✅ User notified of sync status

---

## 7. Performance Test Cases

### TC-PERF-001: App Launch Time
**Priority**: High  
**Type**: Performance

**Steps**:
1. Close app completely
2. Launch app
3. Measure time to Home screen

**Expected Result**:
- ✅ Cold start < 3 seconds
- ✅ Warm start < 1 second
- ✅ Splash screen smooth

---

### TC-PERF-002: Book List Scroll Performance
**Priority**: High  
**Type**: Performance

**Steps**:
1. Scroll through 100+ books rapidly

**Expected Result**:
- ✅ Smooth scrolling (60fps)
- ✅ No jank or stuttering
- ✅ Images load progressively
- ✅ No memory leaks

---

### TC-PERF-003: Large PDF Loading
**Priority**: Medium  
**Type**: Performance

**Steps**:
1. Open 500-page PDF

**Expected Result**:
- ✅ First page loads < 2 seconds
- ✅ Subsequent pages load quickly
- ✅ Smooth page transitions
- ✅ No crashes

---

## 8. Security Test Cases

### TC-SEC-001: Token Storage Security
**Priority**: Critical  
**Type**: Security

**Steps**:
1. Login
2. Inspect device storage

**Expected Result**:
- ✅ Tokens stored in Keychain/Keystore
- ✅ Not in plain text
- ✅ Not in AsyncStorage
- ✅ Cleared on logout

---

### TC-SEC-002: API Authentication
**Priority**: Critical  
**Type**: Security

**Steps**:
1. Attempt API call without token
2. Attempt with invalid token

**Expected Result**:
- ❌ Unauthorized (401)
- ✅ No data leaked
- ✅ Proper error handling

---

### TC-SEC-003: Downloaded File Encryption
**Priority**: High  
**Type**: Security

**Steps**:
1. Download book
2. Inspect file system

**Expected Result**:
- ✅ Files encrypted on device
- ✅ Cannot open outside app
- ✅ Deleted on logout (optional)

---

## 9. Accessibility Test Cases

### TC-A11Y-001: Screen Reader Support
**Priority**: High  
**Type**: Accessibility

**Steps**:
1. Enable VoiceOver (iOS) or TalkBack (Android)
2. Navigate app

**Expected Result**:
- ✅ All buttons labeled
- ✅ Images have alt text
- ✅ Navigation logical
- ✅ Forms accessible

---

### TC-A11Y-002: Text Scaling
**Priority**: Medium  
**Type**: Accessibility

**Steps**:
1. Increase system font size to maximum
2. Navigate app

**Expected Result**:
- ✅ Text scales appropriately
- ✅ No text cutoff
- ✅ Layout adapts
- ✅ Buttons still tappable

---

### TC-A11Y-003: Color Contrast
**Priority**: Medium  
**Type**: Accessibility

**Steps**:
1. Enable high contrast mode
2. Review all screens

**Expected Result**:
- ✅ Text readable
- ✅ Buttons distinguishable
- ✅ WCAG AA compliance

---

## 10. Localization Test Cases

### TC-L10N-001: Language Switching
**Priority**: Medium  
**Type**: Localization

**Steps**:
1. Go to Settings
2. Change language to Amharic
3. Navigate app

**Expected Result**:
- ✅ All UI text translated
- ✅ Right-to-left if applicable
- ✅ Date/time formats correct
- ✅ Currency symbols correct

---

## Test Summary Template

**Test Execution Report**

| Category | Total | Passed | Failed | Blocked | Pass Rate |
|----------|-------|--------|--------|---------|-----------|
| Authentication | 5 | 5 | 0 | 0 | 100% |
| Book Discovery | 5 | 5 | 0 | 0 | 100% |
| Purchase | 5 | 4 | 1 | 0 | 80% |
| Audiobook | 6 | 6 | 0 | 0 | 100% |
| Exam | 7 | 7 | 0 | 0 | 100% |
| Offline | 3 | 3 | 0 | 0 | 100% |
| Performance | 3 | 3 | 0 | 0 | 100% |
| Security | 3 | 3 | 0 | 0 | 100% |
| Accessibility | 3 | 3 | 0 | 0 | 100% |
| Localization | 1 | 1 | 0 | 0 | 100% |
| **TOTAL** | **41** | **40** | **1** | **0** | **97.6%** |

---

## Bug Report Template

**Bug ID**: BUG-001  
**Title**: Payment fails on slow network  
**Severity**: High  
**Priority**: P1  
**Status**: Open  

**Environment**:
- Device: iPhone 14 Pro
- OS: iOS 16.5
- App Version: 1.0.0
- Network: 3G

**Steps to Reproduce**:
1. Select book to purchase
2. Initiate payment on 3G network
3. Payment WebView times out

**Expected Result**:
Payment completes or shows retry option

**Actual Result**:
App crashes

**Attachments**:
- Screenshot
- Crash log
- Video recording

**Notes**:
Occurs only on slow networks

---

## Regression Test Checklist

Run before each release:

- [ ] All critical test cases pass
- [ ] No new crashes introduced
- [ ] Performance benchmarks met
- [ ] Security tests pass
- [ ] Accessibility compliance
- [ ] Localization verified
- [ ] API compatibility confirmed
- [ ] Database migrations successful

---

**Document Version**: 1.0  
**Last Updated**: January 2024  
**Maintained By**: QA Team

