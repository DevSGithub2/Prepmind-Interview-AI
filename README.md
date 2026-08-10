# 🚀 PrepMind AI - Technical Interview Generator

An AI-powered multiple-choice question generator that helps software engineers prepare for technical interviews.

🔗 **Live Demo:** [https://prepmind-interview-ai.vercel.app](https://prepmind-interview-ai.vercel.app)

---

## ✨ Features
- 🎯 **Role & Level Specific:** Tailored practice for Frontend, Backend, Fullstack, Data Science, and DevOps.
- ⚡ **Instant Generation:** Powered by Groq AI (`llama-3.1-8b-instant`) for sub-second response times.
- 🔒 **Secure Architecture:** Uses Vercel Serverless Functions to shield API credentials on the backend.
- 📱 **Responsive UI:** Modern, dark-mode interface built with Tailwind CSS.

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend:** Node.js (Vercel Serverless Function)
- **AI Model:** Groq API (Llama 3.1)
- **Hosting:** Vercel

---

## 🛡️ Security & Architecture
Unlike standard client-side API projects, PrepMind AI routes all requests through a serverless proxy (`/api/generate.js`). This ensures the API key remains strictly hidden in environment variables and is never exposed in browser requests or source code.
