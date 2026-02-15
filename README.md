# IndieBook - Personal eBook Reader

A lightweight, fast PDF reader built with Vite + React + Hono.

## ✨ Features

- 📚 **PDF Reading**: Smooth PDF viewing with zoom controls
- 📖 **Page Navigation**: Easy page-by-page reading
- 💾 **Personal Library**: Organize your book collection
- ⬆️ **Easy Upload**: Drag & drop PDF files
- 🎨 **Clean UI**: Modern, beautiful interface with Tailwind CSS
- ⚡ **Fast**: Built with Vite for instant dev server and fast builds
- 🪶 **Lightweight**: Minimal dependencies, optimized for performance

## 🚀 Tech Stack

- **Frontend**: Vite, React 18, TypeScript
- **Backend**: Hono (lightweight, fast)
- **PDF**: react-pdf, pdfjs-dist
- **Styling**: Tailwind CSS 4
- **Storage**: localStorage + file system
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies for both frontend and backend
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Install root dependencies (concurrently)
npm install
```

## 🏃 Running

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Vite on port 5173
npm run dev:backend   # Hono on port 3001
```

Open http://localhost:5173

## 📁 Project Structure

```
indiebook/
├── frontend/              # Vite + React app
│   ├── src/
│   │   ├── pages/        # HomePage, LibraryPage, UploadPage, ReaderPage
│   │   ├── components/   # Reusable components
│   │   └── App.tsx       # Main app component
│   └── public/
│       └── uploads/      # Uploaded PDF files
├── backend/              # Hono API
│   └── src/
│       ├── routes/       # API routes
│       └── index.ts      # Main server
└── shared/               # Shared types/utils
```

## 🎯 Usage

1. **Upload a Book**: Click "Upload" and select a PDF file
2. **Browse Library**: View all your uploaded books
3. **Read**: Click on any book to open the reader
4. **Navigate**: Use arrow buttons or keyboard to turn pages
5. **Zoom**: Adjust zoom level for comfortable reading

## 💾 Data Storage

- Books metadata stored in localStorage
- PDF files saved in `frontend/public/uploads/`

## 🚀 Deployment

Deploy to Cloudflare Workers:

```bash
cd frontend
npm run build

cd ../backend
npm run build

# Deploy with Cloudflare
# (Follow Cloudflare Workers deployment guide)
```

## 📝 License

Private project - All rights reserved

---

Built with ❤️ using Nxcode templates
