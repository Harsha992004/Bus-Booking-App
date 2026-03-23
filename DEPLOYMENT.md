# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account (for production database)

## Step 1: Deploy Backend to Vercel

### 1.1 Prepare Backend for Deployment
The backend is already configured with:
- `vercel.json` - Vercel configuration
- `server.js` updated for serverless deployment
- Dynamic CORS for multiple origins

### 1.2 Create MongoDB Atlas Database
1. Go to https://www.mongodb.com/atlas/database
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/bus-booking`)

### 1.3 Deploy Backend
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty, Vercel uses vercel.json)
   - **Output Directory**: (leave empty)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_string_min_32_chars
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. Click **Deploy**

7. After deployment, note your backend URL (e.g., `https://bus-booking-backend.vercel.app`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Frontend Environment
1. Go to `frontend/.env.production`
2. Replace with your backend URL:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```

3. Commit changes:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin master
   ```

### 2.2 Deploy Frontend
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import the same GitHub repository
4. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```

6. Click **Deploy**

## Step 3: Update Backend CORS

After frontend deployment:
1. Copy your frontend URL (e.g., `https://bus-booking.vercel.app`)
2. Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
3. Update `FRONTEND_URL` to your actual frontend URL
4. Click Save → Redeploy

## Project Structure for Vercel

```
backend/
├── server.js (exports app for serverless)
├── vercel.json (Vercel config)
└── ... other files

frontend/
├── vercel.json (Vercel config)
├── .env.production (API URL)
└── ... other files
```

## Environment Variables Summary

### Backend (.env)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bus-booking
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your actual frontend URL
- Backend automatically allows localhost for development

### Database Connection Errors
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `MONGODB_URI` format is correct

### API Not Working
- Verify backend URL format: `https://your-backend.vercel.app/api`
- Test backend: `https://your-backend.vercel.app/api/auth/login`

## Local Development

Still works normally with:
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2  
cd frontend
npm start
```

## Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Vercel
- [ ] Frontend URL set in backend env vars
- [ ] Backend URL set in frontend env vars
- [ ] Frontend deployed to Vercel
- [ ] CORS configured properly
- [ ] Test login/registration works
