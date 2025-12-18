# 📱 E-Library Mobile App - Quick Reference Cheat Sheet

## 🎯 One-Page Overview for Product/Design/Dev Handoff

---

## API Endpoints Summary

### Authentication
```
POST   /api/users/register/          # Sign up
POST   /api/users/login/             # Log in
POST   /api/users/token/refresh/     # Refresh token
GET    /api/users/me/                # Get current user
PUT    /api/users/<id>/              # Update profile
```

### Books
```
GET    /api/books/                   # List books (paginated)
GET    /api/books/<id>/              # Book detail
GET    /api/books/?search=<query>    # Search books
GET    /api/books/?category=<id>     # Filter by category
GET    /api/books/<id>/sample/       # Get sample PDF
GET    /api/books/<id>/download/     # Download purchased book
POST   /api/books/<id>/progress/     # Save reading progress
```

### Categories
```
GET    /api/categories/              # List all categories
GET    /api/categories/<id>/         # Category detail
```

### Audiobooks
```
GET    /api/audiobooks/              # List audiobooks
GET    /api/audiobooks/?book_id=<id> # Get audio for book
POST   /api/audiobooks/generate-audio/ # Start AI generation
GET    /api/audiobooks/<job_id>/status/ # Check generation status
POST   /api/audiobooks/progress/     # Save listening progress
POST   /api/audiobooks/upload-recording/ # Upload user recording
GET    /api/audiobooks/<id>/download/ # Download audio
```

### Exams
```
GET    /api/exam/                    # List exams
GET    /api/exam/?subject=<id>       # Filter by subject
GET    /api/exam/<id>/               # Exam detail
POST   /api/exam/<id>/start/         # Start exam session
POST   /api/exam/<session>/answer/   # Save answer
POST   /api/exam/<session>/submit/   # Submit exam
GET    /api/exam/history/            # User's exam history
```

### Payments
```
POST   /api/payments/                # Initiate payment
GET    /api/payments/<id>/status/    # Check payment status
GET    /api/users/purchases/         # User's purchases
```

---

## User Flows Quick Map

### 1. Onboarding → Auth → Home
```
Splash (2s) → Onboarding (3 slides) → Auth Landing
  ├─ Sign Up → Home (logged in)
  ├─ Log In → Home (logged in)
  └─ Guest → Home (limited)
```

### 2. Browse → Detail → Purchase → Read
```
Home → Browse Books → Book Detail
  ├─ Read Sample → PDF Viewer
  ├─ Buy → Payment → Success → Read/Download
  └─ Rent → Payment → Success → Read (time-limited)
```

### 3. Audio Generation → Playback
```
Book Detail → Generate Audio → Processing (poll status)
  → Ready → Audio Player → Play/Pause/Seek
```

### 4. Exam Flow
```
Exam List → Exam Detail → Start → Answer Questions
  → Review → Submit → Results → Certificate
```

---

## Key Features Checklist

### ✅ Must-Have (MVP)
- [ ] User registration & login (JWT)
- [ ] Browse books with categories
- [ ] Search & filter books
- [ ] Book detail with sample reading
- [ ] Purchase books (soft copy)
- [ ] Payment integration (Telebir, CBE Bir)
- [ ] Download & read purchased books
- [ ] Take timed exams
- [ ] View exam results
- [ ] User profile & purchase history

### 🎯 Should-Have (Phase 2)
- [ ] AI audio generation from PDFs
- [ ] Audio player with controls
- [ ] User voice recording
- [ ] Book rental system
- [ ] Offline mode for downloaded content
- [ ] Push notifications
- [ ] Social sharing
- [ ] Book reviews & ratings

### 💡 Nice-to-Have (Phase 3)
- [ ] AI study assistant
- [ ] Personalized recommendations
- [ ] Reading progress sync across devices
- [ ] Bookmarks & highlights
- [ ] Discussion forums
- [ ] Certificates & badges
- [ ] Referral program
- [ ] Multi-language UI

---

## Tech Stack

### Frontend (Mobile)
```
Framework: React Native / Flutter / Native (iOS/Android)
State: Redux / MobX / Context API
Navigation: React Navigation / Flutter Navigator
HTTP: Axios / Fetch
Storage: AsyncStorage / SecureStore
Audio: react-native-sound / audioplayers
PDF: react-native-pdf / flutter_pdfview
```

### Backend (Existing)
```
Framework: Django + Django REST Framework
Database: SQLite (dev) → PostgreSQL (prod)
Auth: JWT (djangorestframework-simplejwt)
Storage: Local media → AWS S3 (prod)
Audio: gTTS + PyPDF2
AI: Google Gemini
```

---

## Data Models (Key Fields)

### User
```json
{
  "id": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "Student",
  "phone_number": "+251912345678"
}
```

### Book
```json
{
  "id": 1,
  "title": "Introduction to Python",
  "author": "John Smith",
  "description": "...",
  "cover_image": "https://...",
  "pdf_file": "https://...",
  "audio_file": "https://...",
  "soft_price": 19.99,
  "hard_price": 29.99,
  "rental_price_per_week": 5.99,
  "book_type": "both",
  "is_for_sale": true,
  "is_for_rent": true,
  "has_audio": true,
  "language": "english",
  "category": {...}
}
```

### Exam
```json
{
  "id": 1,
  "name": "Python Basics Quiz",
  "subject": {...},
  "time_limit_minutes": 30,
  "question_count": 20,
  "passing_score": 70,
  "questions": [...]
}
```

### Payment
```json
{
  "transaction_id": "TXN123456",
  "user_id": 123,
  "book_id": 1,
  "payment_type": "purchase_soft",
  "amount": 21.99,
  "payment_method": "telebir",
  "status": "completed"
}
```

---

## Error Handling

### HTTP Status Codes
```
200 OK              - Success
201 Created         - Resource created
400 Bad Request     - Validation error
401 Unauthorized    - Auth required
403 Forbidden       - No permission
404 Not Found       - Resource not found
500 Server Error    - Backend error
```

### Error Response Format
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect",
  "code": "AUTH_FAILED"
}
```

### Client-Side Handling
```javascript
try {
  const response = await api.call();
  // Success
} catch (error) {
  if (error.response?.status === 401) {
    // Refresh token or logout
  } else if (error.response?.status === 400) {
    // Show validation errors
  } else {
    // Show generic error
  }
}
```

---

## Security Checklist

### ✅ Authentication
- [ ] JWT tokens stored in secure storage (Keychain/Keystore)
- [ ] Tokens never in plain text or logs
- [ ] Auto-refresh expired tokens
- [ ] Logout clears all tokens

### ✅ API Security
- [ ] All requests include Authorization header
- [ ] HTTPS only (no HTTP)
- [ ] Validate SSL certificates
- [ ] Rate limiting on sensitive endpoints

### ✅ Data Protection
- [ ] Downloaded files encrypted on device
- [ ] No sensitive data in logs
- [ ] User data cleared on logout
- [ ] Comply with data privacy laws

### ✅ Payment Security
- [ ] Never store card details
- [ ] Use payment gateway SDKs
- [ ] Verify payments server-side
- [ ] Handle payment failures gracefully

---

## Performance Targets

### Load Times
```
App Launch:        < 3 seconds (cold start)
Home Screen:       < 2 seconds
Book Detail:       < 1 second
Search Results:    < 1 second
PDF First Page:    < 2 seconds
Audio Start:       < 3 seconds
```

### Network
```
API Response:      < 500ms (average)
Image Load:        < 2 seconds
PDF Download:      Show progress, allow cancel
Audio Stream:      Buffer 10 seconds ahead
```

### Memory
```
Idle:              < 100 MB
Active:            < 200 MB
Peak:              < 300 MB
```

---

## Testing Priorities

### Critical (Must Test)
1. User registration & login
2. Book purchase flow
3. Payment processing
4. Exam submission
5. Token refresh
6. Offline book reading

### High (Should Test)
1. Search & filters
2. Audio generation
3. Audio playback
4. PDF rendering
5. Network errors
6. App state restoration

### Medium (Nice to Test)
1. Social sharing
2. Push notifications
3. Multi-language
4. Accessibility
5. Performance benchmarks

---

## Launch Checklist

### Pre-Launch
- [ ] All critical tests pass
- [ ] Performance benchmarks met
- [ ] Security audit complete
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] App store assets ready
- [ ] Backend scaled for load
- [ ] Monitoring & analytics setup

### Launch Day
- [ ] Deploy to production
- [ ] Monitor error rates
- [ ] Watch server load
- [ ] Check payment processing
- [ ] Respond to user feedback
- [ ] Track key metrics

### Post-Launch
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Plan next features
- [ ] Optimize performance
- [ ] Update documentation

---

## Support Resources

### Documentation
- `MOBILE_APP_WORKFLOWS.md` - Detailed workflows
- `MOBILE_APP_QA_TEST_CASES.md` - Test cases
- `MOBILE_APP_DESIGN_SPECS.md` - Design specs
- `MOBILE_APP_QUICK_REFERENCE.md` - This file

### Backend Docs
- `README.md` - Project overview
- `COMPLETE_WORKING_SETUP.md` - Setup guide
- `AI_IMPLEMENTATION_COMPLETE.md` - AI features

### External
- Django REST: https://www.django-rest-framework.org/
- React Native: https://reactnative.dev/
- Flutter: https://flutter.dev/

---

## Contact & Escalation

### Development Team
- Backend: backend-team@elibrary.com
- Mobile: mobile-team@elibrary.com
- DevOps: devops@elibrary.com

### Product Team
- Product Manager: pm@elibrary.com
- Design Lead: design@elibrary.com
- QA Lead: qa@elibrary.com

### Emergency
- On-call: +251-XXX-XXXX
- Slack: #elibrary-urgent
- Email: urgent@elibrary.com

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2024 | Initial mobile app spec |
| 1.1 | TBD | Audio features enhancement |
| 2.0 | TBD | AI assistant integration |

---

**Last Updated**: January 2024  
**Maintained By**: Product & Engineering Teams  
**Status**: ✅ Ready for Development

