# Mobile App API Connection Fixes

## Issues Found and Fixed

### 1. **payments.js** - Missing API Prefix
**Issue:** Line 60 was missing the leading `/` in the API endpoint
```javascript
// BEFORE (WRONG)
const response = await apiClient.get(`user-purchases/check-access/${bookId}/`);

// AFTER (FIXED)
const response = await apiClient.get(`/user-purchases/check-access/${bookId}/`);
```

### 2. **dictionary.js** - Wrong Port and Not Using apiClient
**Issues:**
- Using wrong port `8001` instead of `8000`
- Using raw `fetch` instead of `apiClient` (missing auth token handling)
- Inconsistent error handling

**Fixed Methods:**
- `getSignWords()` - Now uses apiClient
- `searchWords()` - Now uses apiClient with params
- `getWordDetail()` - Now uses apiClient
- `markWordAsLearned()` - Now uses apiClient
- `addToFavorites()` - Now uses apiClient
- `getWordCategories()` - Now uses apiClient
- `getUserProgress()` - Now uses apiClient
- Removed `getAuthToken()` method (handled by apiClient)

### 3. **projects.js** - Wrong Port and Not Using apiClient
**Issues:**
- Using wrong port `8001` instead of `8000`
- Using raw `fetch` instead of `apiClient`
- Inconsistent error handling

**Fixed Methods:**
- `getProjects()` - Now uses apiClient
- `getProjectDetail()` - Now uses apiClient
- `searchProjects()` - Now uses apiClient with params
- `downloadProjectPDF()` - Now uses apiClient with blob response
- `rateProject()` - Now uses apiClient
- `getFeaturedProjects()` - Now uses apiClient
- `getUserFavorites()` - Now uses apiClient
- `addToFavorites()` - Now uses apiClient
- Removed `getAuthToken()` method (handled by apiClient)

### 4. **audiobooks.js** - Wrong Endpoint URLs
**Issues:**
- Using non-existent endpoints that don't match backend URLs

**Fixed Endpoints:**
```javascript
// BEFORE (WRONG)
'/audiobooks/book/${bookId}/' → '/audiobooks/${bookId}/detail/'
'/audiobooks/generate/' → '/audiobooks/generate-audio/'
'/audiobooks/upload/' → '/audiobooks/save-recording/'
'/audiobooks/my-audiobooks/' → '/audiobooks/list/'
```

## Backend API Endpoints (Correct)

### Authentication
- `POST /api/login/` - User login
- `POST /api/register/` - User registration
- `GET /api/current_user/` - Get current user
- `POST /api/token/refresh/` - Refresh JWT token

### Books
- `GET /api/books/` - List all books
- `GET /api/categories/` - List categories
- `GET /api/admin-books/{id}/` - Get book detail
- `POST /api/admin-books/{id}/increment_views/` - Increment views

### Payments
- `POST /api/payments/process/` - Process payment
- `POST /api/payments/chapa/` - Chapa payment
- `GET /api/payments/methods/` - Get payment methods
- `GET /api/payments/user-purchases/` - Get user purchases
- `GET /api/user-purchases/check-access/{book_id}/` - Check book access
- `POST /api/payments/chapa/verify/` - Verify Chapa payment

### Audiobooks
- `GET /api/audiobooks/list/` - List all audiobooks
- `GET /api/audiobooks/{book_id}/detail/` - Get audiobook detail
- `POST /api/audiobooks/save-recording/` - Save user recording
- `POST /api/audiobooks/generate-audio/` - Generate AI audio
- `GET /api/audiobooks/extract-text/{book_id}/` - Extract PDF text

### Exams
- `GET /api/exams/` - List all exams
- `GET /api/exams/{id}/` - Get exam detail
- `POST /api/exams/{id}/submit/` - Submit exam
- `GET /api/exams/results/` - Get user results

### Projects
- `GET /api/projects/` - List projects
- `GET /api/projects/{id}/` - Get project detail

### Dictionary (Sign Words)
- `GET /api/signwords/` - List sign words
- `GET /api/signwords/{id}/` - Get word detail

## Benefits of Using apiClient

All API files now consistently use `apiClient` which provides:

1. **Automatic Authentication** - JWT tokens added to all requests
2. **Token Refresh** - Automatic token refresh on 401 errors
3. **Consistent Base URL** - Single source of truth for API URL
4. **Consistent Error Handling** - Standardized error responses
5. **Request/Response Interceptors** - Centralized logging and debugging

## Testing Checklist

- [ ] Test login/registration
- [ ] Test book browsing and search
- [ ] Test book purchase flow
- [ ] Test audiobook playback
- [ ] Test exam taking
- [ ] Test dictionary/sign words
- [ ] Test projects viewing
- [ ] Test payment processing

## Next Steps

1. Restart the mobile app to load the fixed API files
2. Test each feature to ensure API connections work
3. Check console logs for any remaining errors
4. Verify authentication flow works correctly
