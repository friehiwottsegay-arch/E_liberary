# 🚀 Deploy to Render in 5 Minutes

## Step 1: Push to GitHub (2 minutes)

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 2: Deploy on Render (1 minute)

1. Go to https://render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repo
4. Click **"Apply"**

## Step 3: Set Environment Variables (2 minutes)

In Render dashboard, add to **Backend**:

```
SECRET_KEY=your-secret-key-here
DEBUG=False
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
CHAPA_SECRET_KEY=CHASECK_...
```

## ✅ Done!

Your app will be live at:
- Frontend: `https://elibrary-frontend.onrender.com`
- Backend: `https://elibrary-backend.onrender.com`

## 🎯 Post-Deployment

Create superuser in Render backend shell:
```bash
python manage.py createsuperuser
```

## 📱 Update Mobile App

Change API URL in `BookMarketMobile/src/api/client.js`:
```javascript
const API_BASE_URL = 'https://elibrary-backend.onrender.com/api';
```

That's it! 🎉
