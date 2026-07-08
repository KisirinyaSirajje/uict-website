# UICT e-Library (UICTE-LIB) — Website

> A DSpace-inspired digital repository web interface for the **Uganda Institute of Information and Communication Technology (UICT)**, featuring an AI-powered chat assistant powered by Google Gemini.

---

## 📖 Overview

**UICTE-LIB** is the official e-library portal for UICT. It preserves and provides access to the research output of the UICT community — including student project reports, past examination papers, books, book chapters, and audio-visual materials — organized into academic communities and collections.

This repository contains the **frontend website** and a **lightweight Express.js backend** that proxies requests to the Google Gemini AI API to power the chatbot assistant.

---

## ✨ Features

- 🏛️ **DSpace-style Repository UI** — Community/collection hierarchy mirroring DSpace
- 🤖 **AI Chat Assistant** — Gemini-powered chatbot with UICT library knowledge base
- 📥 **Downloadable Resources** — Past exam papers and project reports with one-click download
- 🔗 **Clickable Logo Navigation** — UICT logo on every page links back to home
- 📊 **Statistics Page** — Repository usage and download statistics view
- 📱 **Responsive Design** — Works on desktop and mobile browsers
- 🌐 **Deployable to Vercel** — Serverless API function included for Vercel deployment

---

## 🗂️ Project Structure

```
uict-website/
│
├── index.html                    # Homepage — community listing & search
├── community-list.html           # Full expandable community/collection tree
├── engineering.html              # Engineering community page
├── it.html                       # Information Technology community page
├── management.html               # Management community page
├── partners.html                 # UICT Partners community page
├── dswe.html                     # Dept. of Software Engineering sub-community
├── statistics-engineering.html   # Repository statistics page
├── collection-dummy.html         # Template/demo collection page
│
├── server.js                     # Express.js local development server
│
├── api/
│   └── chat.js                   # Gemini AI chat handler (Vercel serverless / Express route)
│
├── js/
│   ├── chat.js                   # Client-side chat widget logic (FAQ + AI fetch)
│   └── main.js                   # General UI interactions (dropdowns, tree expand, etc.)
│
├── css/
│   ├── style.css                 # Main site stylesheet
│   └── chat-widget.css           # Chat widget styles
│
├── downloads/                    # Dummy downloadable PDF files (past papers & reports)
│   ├── DIT-*.pdf
│   ├── CIT-*.pdf
│   └── DSWE-*.pdf
│
├── .env                          # Environment variables (NOT committed — see .gitignore)
├── .gitignore                    # Ignores node_modules/, .env, .vercel/, .DS_Store
├── package.json                  # Node.js project metadata & dependencies
└── package-lock.json             # Locked dependency versions
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript |
| Fonts | Google Fonts — Roboto |
| Icons | Bootstrap Icons v1.11 |
| Backend | Node.js + Express 5 |
| AI API | Google Gemini (`gemini-2.5-flash`) via `@google/genai` |
| Env Config | `dotenv` |
| CORS | `cors` |
| Deployment | Vercel (serverless) |

---

## ⚙️ Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A Google Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/KisirinyaSirajje/uict-website.git
cd uict-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Start the development server

```bash
node server.js
```

The site will be available at **http://localhost:3000**.

---

## 🚀 Deployment (Vercel)

This project is configured for **Vercel** deployment with a serverless function at `api/chat.js`.

### Steps

1. Push your code to GitHub (ensure `.env` is **not** committed).
2. Go to [vercel.com](https://vercel.com) and import the GitHub repository.
3. In **Project Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` = your Gemini API key
4. Deploy — Vercel will automatically detect the `api/` folder and deploy it as a serverless function.

> The frontend HTML files are served as static files, and `/api/chat` is handled by the serverless function.

---

## 🤖 AI Chat Assistant

The floating chat button (💬) on every page opens the **UICT e-Library Assistant** — an AI chatbot that answers questions about the library strictly based on its configured knowledge base.

**Topics the assistant can help with:**
- Library opening hours
- How to borrow, return, or renew books
- How to search the repository
- How to download documents
- How to submit research
- Communities & collections
- Past papers location
- E-resources access
- And more...

The assistant is powered by `gemini-2.5-flash` with a custom system instruction that restricts it to library-related topics only.

---

## 📚 Communities & Collections

| Community | Sub-communities |
|---|---|
| **Engineering** | Dept. of Software Engineering (DSWE), Dept. of Computer Science, Dept. of Electrical Engineering, DECE |
| **Information Technology** | Diploma in IT (DIT), Certificate in IT (CIT) |
| **Management** | Dept. of Business Administration, Dept. of Accounting |
| **UICT Partners** | *(External partner resources)* |

Each community contains collections of:
- 📄 Examination Past Papers
- 📋 Project Reports
- 📚 Books & Book Chapters
- 🎬 Audio-Visual Materials

---

## 🔒 Security Notes

- The `.env` file is excluded from version control via `.gitignore`
- The `GEMINI_API_KEY` is only accessed server-side (never exposed to the browser)
- The API endpoint validates that a message is present before calling Gemini
- The AI system instruction restricts the bot from answering off-topic queries

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** — see [`package.json`](package.json) for details.

---

## 🏫 About UICT

The **Uganda Institute of Information and Communication Technology (UICT)** is a government institution in Uganda dedicated to ICT education, training, and research. UICTE-LIB is its digital institutional repository, preserving and disseminating the academic output of the UICT community.

---

*Built with ❤️ for the UICT community.*
