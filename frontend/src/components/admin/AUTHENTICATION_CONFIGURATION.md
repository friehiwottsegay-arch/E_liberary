# Admin Authentication Configuration

## Overview
I have successfully configured the admin panel at `frontend/src/components/admin/` to require authentication and redirect users to the login page if they are not authenticated.

## Changes Made

### 1. Created AdminAuthWrapper Component
**File:** `frontend/src/components/admin/AdminAuthWrapper.jsx`

- **Purpose:** Central authentication guard for all admin routes
- **Features:**
  - Validates JWT tokens against the backend
  - Checks user permissions (admin/superuser only)
  - Shows loading state during authentication checks
  - Automatically redirects to login if not authenticated
  - Handles token expiration and cleanup

### 2. Updated Routes Configuration
**File:** `frontend/src/Routes.jsx`

- **Admin Route Protection:** All admin routes under `/admin/*` are now wrapped with `AdminAuthWrapper`
- **Import Added:** Added `AdminAuthWrapper` import
- **Route Structure:** Admin routes now require authentication before access

### 3. Created Error Pages
**Files:**
- `frontend/src/components/pages/Unauthorized.jsx` - 403 Forbidden page
- `frontend/src/components/pages/NotFound.jsx` - 404 Not Found page

### 4. Updated Login Component
**File:** `frontend/src/components/admin/Login.jsx`

- **Fixed API Endpoint:** Updated from `/api/login/` to `/login/` to match backend
- **Role-based Redirect:** Automatically redirects admins to `/admin` after login

## Authentication Flow

### When User Tries to Access Admin Routes

1. **Request Access:** User navigates to `/admin/*` (e.g., `/admin/books`)
2. **AuthWrapper Activation:** `AdminAuthWrapper` checks for valid JWT token
3. **Token Validation:** Calls `/api/current_user/` to validate token and get user info
4. **Permission Check:** Verifies user is admin/superuser
5. **Outcome:**
   - ✅ **Authenticated & Authorized:** Access granted to admin dashboard
   - ❌ **No Token:** Redirects to `/login`
   - ❌ **Invalid/Expired Token:** Redirects to `/login`
   - ❌ **Not Admin:** Redirects to `/unauthorized`

### Login Process

1. User accesses `/login`
2. Enters credentials
3. Backend validates and returns JWT tokens
4. Frontend stores tokens and user data
5. User redirected to `/admin` (if admin) or `/dashboard` (if regular user)

### Logout Process

1. User clicks logout in admin dashboard
2. All authentication data cleared from storage
3. User redirected to `/login`

## Protected Admin Routes

All admin routes now require authentication:

- `/admin/*` - Main admin dashboard
- `/admin/books` - Book management
- `/admin/books/upload` - Book upload
- `/admin/exams` - Exam management
- `/admin/exams/upload` - Upload exams
- `/admin/exams/quzi/upload` - Upload quizzes
- `/admin/users` - User management
- `/admin/users/create-account` - Create accounts
- `/admin/projects` - Project management
- `/admin/projects/upload` - Upload projects
- `/admin/subjects` - Subject management
- `/admin/AdminSignWords` - Sign language management
- `/admin/reports` - Analytics & reports
- `/admin/settings` - System settings
- `/admin/profile` - Profile management

## API Endpoints Used

- `GET /api/current_user/` - Validate token and get user info
- `POST /api/login/` - User authentication
- `GET /api/token/refresh/` - Refresh JWT tokens (handled automatically)

## Storage Keys Used

The authentication system uses these localStorage/sessionStorage keys:

- `access_token` - JWT access token
- `refresh_token` - JWT refresh token
- `user_data` - User information (ID, username, email, role)
- `remember_login` - Boolean flag for persistent sessions

## Testing Instructions

### Test Authentication Flow

1. **Clear Browser Storage:**
   - Open browser dev tools
   - Go to Application tab > Local Storage
   - Clear all keys

2. **Try Accessing Admin Without Login:**
   - Navigate to `http://localhost:5173/admin`
   - Should redirect to `/login`

3. **Login with Valid Credentials:**
   - Use admin username and password
   - Should redirect to `/admin/dashboard`

4. **Test Logout:**
   - Click logout button in admin dashboard
   - Should clear auth data and redirect to `/login`

### Test User Role Restrictions

- Regular users cannot access admin routes
- Admin users have full access
- Non-admin users get redirected to `/unauthorized`

## Security Features

1. **JWT Token Validation:** All admin routes validate tokens with backend
2. **Role-Based Access:** Only admins/superusers can access admin area
3. **Automatic Logout:** Tokens are checked on each admin route access
4. **Clean Storage:** Auth data cleared on logout
5. **Error Handling:** Proper handling of authentication errors

## Error Pages

- **401 Unauthorized:** Handled by redirecting to login
- **403 Forbidden:** Custom `/unauthorized` page
- **404 Not Found:** Custom `/404` page

## Browser Console Monitoring

Monitor these messages in browser console:
- "Checking authentication..." - AuthWrapper loading
- "Auth check failed" - Authentication validation failed
- "Redirecting to login" - User being redirected
- API errors for debugging authentication issues

## Configuration Complete ✅

The admin authentication system is now fully configured and operational. All admin routes are protected and will redirect to login if users are not authenticated.