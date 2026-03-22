
---

````md
# Whimsy Whiskers

A modern e-commerce web application built with React, TypeScript, and Supabase.

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Supabase (authentication and database)
- Lucide Icons

---

## Features

- Product browsing interface
- Shopping cart modal
- User authentication (sign up / sign in)
- Supabase backend integration
- Responsive UI design

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/whimsy-whiskers.git
cd whimsy-whiskers
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open in browser:

[http://localhost:5173](http://localhost:5173)

---

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Project Structure

```
src/
├── components/   Reusable UI components (e.g. CartModal, AuthModal)
├── contexts/     Global state management (e.g. authentication)
├── lib/          API clients and utilities (e.g. Supabase setup)
├── pages/        Page-level components
└── App.tsx       Root component
```

---

## Notes

* Run `npm install` before starting the project
* Supabase configuration is required for authentication features
* NPM vulnerability warnings can be ignored during development

---

## Future Improvements

* Order management system
* Payment integration
* Recommendation system
* Admin dashboard