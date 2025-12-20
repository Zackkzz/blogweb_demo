# Zack's Personal Blog Website

A modern personal website organized as frontend and backend folders, built with Next.js 15, featuring a coding capybara logo and glassmorphism navigation design.

## ✨ Features

- 🦫 Custom capybara coding logo
- 🌊 Flowing blue gradient background animation
- 🪟 Glassmorphism navigation design
- 📱 Fully responsive layout
- 🔐 Admin panel for content management
- 💾 MySQL database support
- 🎨 Beautiful UI with Tailwind CSS

## 🗂 Project Structure

```
root/
	frontend/            # Next.js app (pages, UI, API routes)
	backend/             # Database utilities and SQL dump
		db.ts              # MySQL connection + initialization
		web.sql            # Example SQL dump
	netlify.toml         # Netlify build configuration
```

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (Netlify dashboard or local `.env.local`):

Required for DB connection (Railway via TCP proxy):
- `DB_HOST` = `crossover.proxy.rlwy.net`
- `DB_PORT` = `<RAILWAY_TCP_PROXY_PORT>` (e.g. 44546)
- `DB_USER` = `<MYSQLUSER>` (e.g. root)
- `DB_PASSWORD` = `<MYSQLPASSWORD>`
- `DB_NAME` = `<MYSQLDATABASE>` (e.g. railway)
- `JWT_SECRET` = `<your-secure-random-string>`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Access admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

## 📦 Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Authentication**: JWT
- **Language**: TypeScript

## 📄 Pages

- **Home**: Hero section with background image
- **About**: Personal introduction
- **Projects**: Portfolio showcase
- **Blog**: Blog posts listing
- **Admin**: Content management panel

All content is dynamically managed through the admin panel and stored in the database.

## 🌐 Deploy on Netlify

- The repo includes `netlify.toml`. Set environment variables in Netlify → Site settings → Environment.
- Build command: `npm run build`
- Publish directory: `.next` (or configure base as `frontend/` if you move the Next app inside that folder)
