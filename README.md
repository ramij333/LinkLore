# LinkLore 🔗

A modern bookmarking web app that lets users save, preview, organize, and manage links with ease.

🌐 **Live App**: [https://link-lore.vercel.app/](https://link-lore.vercel.app/)

---

## ✨ Features

- 🔐 Authenticated user experience via Supabase
- 📥 Enter a URL to auto-fetch title, summary, favicon using preview API
- 📝 Edit metadata and add tags before saving
- 📚 View your saved bookmarks in a clean grid
- 🔍 Full-text search by title, summary, or tags
- 🌒 Toggle between dark & light themes
- 🧭 Hamburger menu with logout and theme switch
- ⚙️ Edit or delete bookmarks with contextual menu

---


## 🛠 Tech Stack

### Frontend:
- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [ShadCN UI](https://ui.shadcn.com/) for modern, accessible components

### Backend/Auth/Database:
- [Supabase](https://supabase.com/) for:
  - Auth
  - Postgres database
  - Edge functions via Supabase client

### Forms & Validation:
- ShadCN form components
- [Zod](https://zod.dev/) for schema-based validation

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/ramij333/LinkLore.git
cd link-lore

# 2. Install dependencies
npm install

# 3. Create a `.env.local` file and add your environment variables:
NEXT_PUBLIC_SUPABASE_URL=https://ekezkctviklrvgyqidhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZXprY3R2aWtscnZneXFpZGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzIwNTYsImV4cCI6MjA2MzMwODA1Nn0.aSJ5A7cOtOASy2sQC1Nhb6hm9THp9hgHDMdcRndkgT4

# 4. Run the development server
npm run dev
```

---

## 🧩 What I'd Do Next

🧲 **Drag and Drop**  
Initially planned to enable sorting via drag-and-drop (using DnDKit), but due to popup/menu conflicts, it’s temporarily disabled. Fixing this will be a priority.

💄 **Polish UI**  
Add subtle transitions, animations, and improve responsiveness on smaller screens.

🧪 **Add Tests**  
Include unit tests and component tests for key interactions.

🗂 **Bookmark Folders/Tags**  
Let users organize bookmarks by categories.

🔖 **Shareable Links**  
Enable public/private sharing of bookmarks.

---

## ⏱ Time Taken

I spent approximately **30 hours** building this project.

Much of the time went into:

- Debugging edge cases with drag-and-drop and API behavior  
- Polishing the UI with Tailwind and ShadCN to follow modern design trends  
- Dealing with Vercel deployment build issues and Supabase authentication quirks

---

## 🖼️ Screenshots

<!-- Add screenshots below by dragging them here or uploading manually -->

### 📌 Adding a New Bookmark  
![Add Bookmark](./public/screenshots/create_bookmark.PNG)

### 📖 Bookmark Details  
![Detailed Bookmark](./public/screenshots/card_button.PNG)

### 🔍 Searching Bookmarks  
![Search Bookmark](./public/screenshots/searching_bookmark.PNG)

### 🌓 Theme Toggle & Menu  
![Theme Toggle](./public/screenshots/toggle_button.PNG)

### 🛠️ Edit & Delete Bookmarks  
![Edit or Delete Bookmark Button](./public/screenshots/card_popup_button.PNG)  
![Edit Form](./public/screenshots/update_form.PNG)

---

## 📝 Notes

Feel free to explore the app and test all functionality via the [live demo](https://link-lore.vercel.app/).  
I’m open to feedback and would love to continue improving this project.

---

🧑‍💻 Built with ❤️ by [Ramij](https://github.com/ramij333)
