# Personal Blog Website

A modern personal website built with Next.js 15, featuring a beautiful UI with Tailwind CSS and an admin panel for content management.

## ✨ Features

- 🌊 Beautiful gradient background animations
- 🪟 Glassmorphism navigation design
- 📱 Fully responsive layout
- 🔐 Admin panel for content management
- 💾 Local file-based storage (no database required)
- 🎨 Beautiful UI with Tailwind CSS

## 🗂 Project Structure

```
root/
	frontend/            # Next.js app (pages, UI, API routes)
		app/              # Next.js app directory
		data/             # Local data storage (content.json, admin.json)
		lib/              # Utility functions
	backend/             # Legacy database files (not used)
	netlify.toml         # Netlify build configuration
```

## 🚀 Getting Started

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up admin credentials (optional):
- Copy `frontend/data/admin.json.example` to `frontend/data/admin.json`
- Default credentials:
  - Username: `admin`
  - Password: `admin123`
  - Email: `admin@example.com`

3. Run the development server:
```bash
cd frontend
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Access admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

## 📦 Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Authentication**: JWT (local file-based)
- **Storage**: Local JSON files
- **Language**: TypeScript

## 📄 Pages

- **Home**: Hero section with background image
- **About**: Personal introduction
- **Projects**: Portfolio showcase
- **Blog**: Blog posts listing
- **Admin**: Content management panel

All content is dynamically managed through the admin panel and stored in local JSON files.

## 🌐 Deploy on Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variable (optional):
   - `JWT_SECRET` = A secure random string (for JWT token signing)
4. Deploy!

The `netlify.toml` file is already configured. No database setup required!
