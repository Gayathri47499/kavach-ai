# KavachAI (कवचAI / కవచ్AI) 🛡️🇮🇳
### AI Scam & Fraud Checker for Indian Citizens (English, Hindi & Telugu)

> **KavachAI** is an AI-powered scam defense and emergency response web application built specifically for India's cyber fraud ecosystem. It analyzes suspicious SMS, WhatsApp messages, Telegram offers, and screenshots, rates the fraud risk, explains the red flags in the user's regional language, and auto-generates a ready-to-file complaint for **Helpline 1930** and **cybercrime.gov.in**.

---

## ✨ Features

- **Multimodal Scanning**: Paste suspicious text or upload screenshots (WhatsApp chats, SMS, bank alerts, QR codes).
- **Multilingual Support**: Real-time localized explanations in **English**, **हिंदी (Hindi)**, and **తెలుగు (Telugu)**.
- **Tuned for Indian Scams**: Detects:
  - ⚡ Electricity Bill Disconnection Scams
  - ⚖️ Digital Arrest / CBI / Police Parcel Impersonation
  - 🏦 SBI YONO / Bank KYC & PAN Suspension Links
  - 💼 YouTube Like & Telegram Task / Work-From-Home Fraud
  - 📱 Malicious `.apk` Sideloading (Rewards / Loan apps)
  - 💳 QR Code Reverse Payment / OLX Scams
- **Actionable 1930 & Cybercrime Assistant**:
  - Auto-drafts an official complaint narrative with suspect phone numbers, URLs, and incident timeline.
  - 1-click copy to clipboard for pasting into `cybercrime.gov.in`.
  - Direct 1-tap dialer for `tel:1930`.
- **Golden Hour Security Checklist**: Instructions to freeze bank accounts, revoke permissions, and USSD codes (`*#21#`) to verify call-forwarding hacks.
- **100% Free**: Built on Google Gemini Flash free tier and zero-cost cloud hosting.

---

## 🚀 Quick Setup Instructions

### 1. Get Your Free Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API Key"** and copy your key. (100% free, 1,500 requests/day).

### 2. Configure Your Key
Open `.env.local` inside the project folder:
```env
GEMINI_API_KEY="your_copied_api_key_here"
```

### 3. Install & Run in VS Code
Open your VS Code terminal inside this folder:
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
kavach-ai/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.js       # Backend API endpoint (Gemini Multimodal integration)
│   ├── globals.css            # Cyber defense Tailwind theme & glassmorphism
│   ├── layout.jsx             # Root layout with metadata & responsive viewport
│   └── page.jsx               # Complete responsive frontend with live scanning
├── lib/
│   ├── constants.js           # Translations (English, Hindi, Telugu) & 1930 metadata
│   ├── gemini.js              # System prompt & Indian cyber fraud classification engine
│   └── samples.js             # Realistic 1-click test scam messages for demonstration
├── .env.example               # Environment variables template
├── .env.local                 # Pre-configured file where you paste your API key
├── package.json               # Node.js dependencies (Next.js 14, Tailwind, Lucide)
├── tailwind.config.js         # Tailwind styling configuration
└── README.md                  # Complete documentation
```

---

## 🌐 Free 1-Click Deployment to Vercel

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for KavachAI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/kavach-ai.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and log in with GitHub.
3. Click **"Add New Project"** and select `kavach-ai`.
4. In the **Environment Variables** section, add:
   - Name: `GEMINI_API_KEY`
   - Value: `Your_Gemini_API_Key`
5. Click **Deploy**. Your app will be live on a free `https://kavach-ai.vercel.app` domain with an SSL certificate!

---

## 🛡️ Cyber Emergency Helplines (India)
- **National Cyber Crime Helpline:** `1930`
- **National Cyber Crime Reporting Portal:** [https://cybercrime.gov.in](https://cybercrime.gov.in)
- **Check Call/SMS Forwarding:** Dial `*#21#` on your phone dialer.
