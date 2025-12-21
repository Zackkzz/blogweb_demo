# Netlify Deployment Guide

## 📋 Deployment Steps

### Step 1: Prepare Your GitHub Repository
✅ Your code is already pushed to GitHub at: `https://github.com/LinghuCh0ng/blogWeb.git`

### Step 2: Create a Netlify Account
1. Go to [https://www.netlify.com](https://www.netlify.com)
2. Sign up or log in (you can use your GitHub account for easy integration)

### Step 3: Create a New Site from GitHub
1. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"** and authorize Netlify to access your GitHub account
3. Select your repository: `LinghuCh0ng/blogWeb`
4. Netlify will automatically detect the `netlify.toml` configuration

### Step 4: Configure Build Settings
Netlify should auto-detect these settings from `netlify.toml`:
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/.next`

If not auto-detected, manually set:
- **Base directory**: `frontend`
- **Build command**: `cd frontend && npm install && npm run build`
- **Publish directory**: `frontend/.next`

### Step 5: Set Environment Variables
Go to **Site settings** → **Environment variables** and add:

#### Required Database Variables:
```
DB_HOST = crossover.proxy.rlwy.net
DB_PORT = <YOUR_RAILWAY_TCP_PROXY_PORT>
DB_USER = <YOUR_MYSQL_USER>
DB_PASSWORD = <YOUR_MYSQL_PASSWORD>
DB_NAME = <YOUR_MYSQL_DATABASE>
```

#### Required JWT Secret:
```
JWT_SECRET = <YOUR_SECURE_RANDOM_STRING>
```
Generate a secure random string (e.g., use: `openssl rand -base64 32`)

### Step 6: Deploy
1. Click **"Deploy site"** button
2. Netlify will start building your site
3. Wait for the build to complete (usually 2-5 minutes)

### Step 7: Verify Deployment
1. Once deployed, you'll get a URL like: `https://your-site-name.netlify.app`
2. Visit the site to verify it's working
3. Test the admin panel at: `https://your-site-name.netlify.app/admin`

### Step 8: Set Up Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your domain

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all environment variables are set correctly
- Verify that `frontend/package.json` has all required dependencies

### Database Connection Issues
- Verify all database environment variables are correct
- Ensure your Railway database is accessible from Netlify's servers
- Check that the database allows external connections

### API Routes Not Working
- Ensure `@netlify/plugin-nextjs` is installed (it's configured in `netlify.toml`)
- Check that environment variables are set for production
- Review Netlify function logs in the dashboard

## 📝 Notes

- The `netlify.toml` file is already configured in your repository
- Netlify will automatically deploy on every push to the `main` branch
- You can trigger manual deployments from the Netlify dashboard
- Environment variables can be set per environment (production, branch deploys, etc.)

## 🔐 Security Reminders

- Never commit `.env` files to GitHub
- Use strong, unique values for `JWT_SECRET`
- Keep your database credentials secure
- Regularly rotate passwords and secrets

