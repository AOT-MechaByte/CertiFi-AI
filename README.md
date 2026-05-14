# 🎓 CertiChain AI

> AI-powered tamper-proof certificate verification system using SHA-256 hashing, QR-based validation, and Supabase-powered immutable logs.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Hackathon](https://img.shields.io/badge/Built%20For-Hackathon-purple)

---

# 🚀 Overview

CertiChain AI is a lightweight, blockchain-inspired certificate verification platform designed to eliminate fake academic certificates and simplify verification for institutions, students, and employers.

The platform allows institutions to issue tamper-proof digital certificates with embedded QR codes. Anyone can instantly verify a certificate's authenticity using SHA-256 cryptographic hashing.

---

# ❌ Problem Statement

Fake certificates and forged academic credentials are a major global problem.

### Current Challenges
- Fake degrees are increasingly common
- Manual verification takes days or weeks
- Paper certificates are easy to forge
- Existing blockchain solutions are expensive and complex

### Impact
- Employers hire unqualified candidates
- Universities lose credibility
- Background verification becomes costly

---

# ✅ Solution

CertiChain AI provides:

- SHA-256 based certificate fingerprinting
- QR-code-powered instant verification
- Tamper detection system
- Immutable certificate logs using Supabase
- Public verification without login
- AI-powered fake certificate detection (optional)

---

# 🧠 How It Works

```text
Institution Admin
        │
        ▼
Upload Certificate Data
        │
        ▼
Generate SHA-256 Hash
        │
        ▼
Store Hash + Metadata in Supabase
        │
        ▼
Generate QR Code + PDF Certificate
        │
        ▼
Verifier Scans QR Code
        │
        ▼
Hash Recomputed
        │
        ▼
VALID ✅ or TAMPERED ❌
```

---

# ✨ Core Features

## MUST HAVE (MVP)

- 🔐 Admin Authentication
- 📝 Certificate Issuance Form
- 🔑 SHA-256 Hash Generation
- 🗄️ Supabase Database Storage
- 📱 QR Code Generation
- 📄 PDF Certificate Generation
- 🌍 Public Verification Page
- 🚨 Tamper Detection
- 📊 Admin Dashboard
- 📜 Verification Logs

---

# 🤖 Optional AI Features

- AI-based fake certificate detection
- Font inconsistency analysis
- Seal manipulation detection
- Simulated blockchain transaction hash

---

# 👥 Target Users

| User | Purpose |
|---|---|
| Institution Admin | Issue certificates |
| Students | Share verifiable credentials |
| Employers | Verify authenticity instantly |

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Hashing | Node.js Crypto |
| QR Generation | qrcode npm package |
| PDF Generation | jsPDF |
| AI Integration | Gemini API / Mock AI |
| Hosting | Vercel |

---

# 🏗️ System Architecture

```text
┌──────────────────────────────┐
│         FRONTEND             │
│   Next.js + Tailwind CSS     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        SUPABASE BACKEND      │
│  Auth + Database + Storage   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ OPTIONAL SERVICES            │
│ Gemini API / Polygon Testnet │
└──────────────────────────────┘
```

---

# 📂 Folder Structure

```bash
certichain-ai/
│
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── issue/
│   ├── verify/
│   └── components/
│
├── lib/
├── utils/
├── public/
├── api/
├── styles/
└── README.md
```

---

# 🔐 Security Features

✅ SHA-256 certificate hashing  
✅ Tamper detection mechanism  
✅ Immutable verification logs  
✅ Supabase Row-Level Security  
✅ QR-based public verification  
✅ Secure admin authentication  

---

# 🔄 Certificate Issuance Flow

```text
Admin Login
   ↓
Fill Certificate Form
   ↓
Generate SHA-256 Hash
   ↓
Store Record in Supabase
   ↓
Generate QR Code
   ↓
Generate PDF Certificate
   ↓
Certificate Ready
```

---

# 🔍 Verification Flow

```text
Scan QR Code / Enter Certificate ID
        ↓
Fetch Certificate Data
        ↓
Recompute SHA-256 Hash
        ↓
Compare with Stored Hash
        ↓
VALID ✅ / TAMPERED ❌ / NOT FOUND ⚠️
```

---

# 📊 Database Schema

## certificates table

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_id TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  issue_date DATE NOT NULL,
  grade TEXT,
  sha256_hash TEXT NOT NULL,
  qr_code_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# 🔑 SHA-256 Hash Logic

```javascript
import crypto from 'crypto';

function generateCertHash(cert) {
  const payload = `${cert.cert_id}|${cert.recipient_name}|${cert.course_name}|${cert.issue_date}|${cert.grade}`;

  return crypto
    .createHash('sha256')
    .update(payload)
    .digest('hex');
}
```

---

# 🎨 UI Design

### Color Palette

| Purpose | Color |
|---|---|
| Primary | Indigo |
| Success | Green |
| Error | Red |
| Warning | Amber |
| Background | Dark Navy |

### UI Highlights
- Dark mode interface
- Large verification badges
- Monospace hash display
- Animated verification status
- Mobile responsive layout

---

# 📦 Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/certichain-ai.git
cd certichain-ai
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

# 🌐 Deployment

Deploy easily using:

- Vercel
- Netlify

### Recommended

```bash
vercel deploy
```

---

# 📈 Future Scope

- Real Blockchain Integration
- NFT Certificates
- AI Fraud Detection Model
- Multi-Institution Support
- Mobile App
- Government Verification APIs
- Global Certificate Registry

---

# 🏆 Hackathon Advantages

✅ Real-world problem  
✅ Impressive live demo  
✅ Easy-to-understand concept  
✅ Modern tech stack  
✅ AI + Security + Web3 combination  
✅ Fully buildable within 24 hours  

---

# 🎬 Demo Flow

### Step 1
Admin issues certificate

### Step 2
QR code generated automatically

### Step 3
Verifier scans QR

### Step 4
Certificate verified instantly

### Step 5
Modify certificate → System detects tampering ❌

---

# 📸 Sample Verification States

## VALID

```text
✅ CERTIFICATE VERIFIED
```

## TAMPERED

```text
❌ HASH MISMATCH DETECTED
```

## NOT FOUND

```text
⚠️ CERTIFICATE NOT FOUND
```

---

# 💡 Why CertiChain AI?

Unlike traditional systems:

| Traditional Verification | CertiChain AI |
|---|---|
| Slow manual process | Instant verification |
| Easy to forge | Tamper-proof |
| Expensive | Low-cost |
| Centralized | Immutable logs |
| No public verification | Public QR verification |

---

# 👨‍💻 Team Roles

| Role | Responsibility |
|---|---|
| Frontend Developer | UI & UX |
| Backend Developer | Supabase & APIs |
| Security Engineer | Hashing & Verification |
| AI Developer | Fraud Detection |
| Presenter | Pitch & Demo |

---

# 📚 Learning Outcomes

This project teaches:

- Cryptographic Hashing
- Authentication Systems
- Full Stack Development
- Database Design
- QR Code Systems
- AI Integration
- Modern Web Architecture
- Security Best Practices

---

# 🧪 MVP Features Checklist

- [x] Admin Login
- [x] Certificate Form
- [x] SHA-256 Hashing
- [x] QR Generation
- [x] Public Verification
- [x] Tamper Detection
- [x] Verification Logs
- [x] Dashboard
- [ ] AI Fraud Detection
- [ ] Real Blockchain Integration

---

# 🤝 Contributing

Contributions are welcome!

```bash
Fork the repo
Create your branch
Commit changes
Push branch
Open Pull Request
```

---

# 📄 License

MIT License

---

# 🙌 Acknowledgements

- Next.js
- Supabase
- Tailwind CSS
- shadcn/ui
- Gemini API
- Vercel
- Open Source Community

---

# ⭐ Final Vision

> “To create a world where every certificate is instantly verifiable, impossible to forge, and trusted globally.”

---

# 🔥 Built For

🏆 Hackathons  
🎓 Universities  
🔐 Secure Credential Verification  
🌐 Web3-Inspired Systems  
🤖 AI + Security Innovation  

---
