# 🚀 Deploy to Render.com

## Quick Deploy Guide

### Prerequisites
- GitHub account
- Render.com account (free)
- Your code pushed to GitHub

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

#### A. Create Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### B. Deploy Using Blueprint (Easiest)
1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will detect `render.yaml` automatically
4. Click **"Apply"**
5. Wait 5-10 minutes for deployment

#### C. Manual Deployment (Alternative)

**Deploy Backend:**
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure:
   - **Name**: `elibrary-backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r backend/requirements.txt && python backend/manage.py collectstatic --no-input && python backend/manage.py migrate
     ```
   - **Start Command**: 
     ```bash
     gunicorn --chdir backend bookmarket.wsgi:application
     ```
   - **Plan**: Free

**Deploy Frontend:**
1. Click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - **Name**: `elibrary-frontend`
   - **Build Command**: 
     ```bash
     cd frontend && npm install && npm run build
     ```
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

**Create Database:**
1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `elibrary-db`
   - **Plan**: Free
3. Copy the **Internal Database URL**
4. Add to backend environment variables as `DATABASE_URL`

### 3. Configure Environment Variables

#### Backend Environment Variables
Go to your backend service → **Environment** → Add:

```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=.onrender.com
DATABASE_URL=postgresql://... (from database)
DJANGO_SETTINGS_MODULE=bookmarket.settings_production
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
CHAPA_SECRET_KEY=your-chapa-key
```

#### Frontend Environment Variables
Go to your frontend service → **Environment** → Add:

```
REACT_APP_API_URL=https://elibrary-backend.onrender.com
REACT_APP_ENV=production
```

### 4. Update URLs

After deployment, update these files with your actual Render URLs:

**Backend CORS Settings** (`backend/bookmarket/settings_production.py`):
```python
CORS_ALLOWED_ORIGINS = [
    'https://YOUR-FRONTEND-NAME.onrender.com',
]
```

**Frontend API URL** (`frontend/.env.production`):
```
REACT_APP_API_URL=https://YOUR-BACKEND-NAME.onrender.com
```

### 5. Run Migrations

After first deployment:
1. Go to backend service
2. Click **"Shell"**
3. Run:
```bash
python manage.py migrate
python manage.py createsuperuser
```

## 📦 What Gets Deployed

### Backend (Django)
- ✅ REST API
- ✅ PostgreSQL database
- ✅ Static files (whitenoise)
- ✅ Media files
- ✅ Admin panel
- ✅ Health check endpoint

### Frontend (React)
- ✅ Static site
- ✅ Optimized build
- ✅ SPA routing
- ✅ API integration

## 🔧 Configuration Files Created

- ✅ `render.yaml` - Blueprint configuration
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ `backend/bookmarket/settings_production.py` - Production settings
- ✅ `backend/api/health.py` - Health check endpoint
- ✅ `frontend/.env.production` - Frontend environment
- ✅ `frontend/package.json` - Node dependencies

## 🌐 Your Live URLs

After deployment, you'll get:
- **Frontend**: `https://elibrary-frontend.onrender.com`
- **Backend API**: `https://elibrary-backend.onrender.com`
- **Admin Panel**: `https://elibrary-backend.onrender.com/admin`

## 🔒 Security Checklist

- ✅ DEBUG = False
- ✅ SECRET_KEY from environment
- ✅ HTTPS enforced
- ✅ CORS configured
- ✅ CSRF protection
- ✅ Secure cookies
- ✅ Database connection pooling

## 📊 Free Tier Limits

Render Free Tier includes:
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ PostgreSQL database (90 days, then expires)
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains

**Note**: Free services spin down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

## 🐛 Troubleshooting

### Build Fails
```bash
# Check logs in Render dashboard
# Common issues:
# - Missing dependencies in requirements.txt
# - Wrong Python version
# - Database connection issues
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set correctly
# Check database is running
# Ensure migrations ran successfully
```

### Static Files Not Loading
```bash
# Run collectstatic manually:
python manage.py collectstatic --no-input

# Check STATIC_ROOT and STATIC_URL in settings
```

### CORS Errors
```bash
# Update CORS_ALLOWED_ORIGINS in settings_production.py
# Add your frontend URL
# Redeploy backend
```

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render will automatically:
# 1. Detect changes
# 2. Build
# 3. Deploy
# 4. Run migrations
```

## 📱 Mobile App Configuration

Update mobile app API URL:

**BookMarketMobile/src/api/client.js**:
```javascript
const API_BASE_URL = 'https://elibrary-backend.onrender.com/api';
```

## 🎯 Post-Deployment Tasks

1. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

2. **Add Sample Data**
   ```bash
   python manage.py loaddata initial_data.json
   ```

3. **Test All Features**
   - Login/Register
   - Browse books
   - Purchase flow
   - PDF reader
   - Audiobooks
   - Exams
   - AI assistant

4. **Monitor Logs**
   - Check Render dashboard
   - Monitor errors
   - Check performance

## 💰 Upgrade to Paid Plan (Optional)

For production use, consider:
- **Starter Plan** ($7/month)
  - No spin-down
  - Faster builds
  - More resources
  
- **Database** ($7/month)
  - Persistent database
  - Automatic backups
  - Better performance

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Django Deployment](https://docs.djangoproject.com/en/4.2/howto/deployment/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

## ✅ Deployment Checklist

Before going live:
- [ ] Push code to GitHub
- [ ] Create Render account
- [ ] Deploy using Blueprint
- [ ] Set environment variables
- [ ] Run migrations
- [ ] Create superuser
- [ ] Test all features
- [ ] Update mobile app URLs
- [ ] Monitor logs
- [ ] Set up custom domain (optional)

## 🎉 You're Live!

Your E-Library platform is now deployed and accessible worldwide!

**Frontend**: https://elibrary-frontend.onrender.com
**Backend**: https://elibrary-backend.onrender.com
**Admin**: https://elibrary-backend.onrender.com/admin

Happy deploying! 🚀
