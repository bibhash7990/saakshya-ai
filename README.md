# Saakshya AI ⚖️

Saakshya AI is a modern, secure, and AI-powered legal evidence and case management platform designed specifically for Indian citizens. It empowers individuals to manage legal disputes, secure digital evidence with cryptographic hashing, track the chain of custody, and understand their legal rights through an intelligent AI assistant.

**Live Demo**: [https://saakshya-ai.netlify.app/](https://saakshya-ai.netlify.app/)

## 🚀 The Problem We Solve
Navigating the legal system in India can be intimidating, expensive, and complex. Citizens often struggle with:
- Safely storing and managing digital evidence (WhatsApp chats, receipts, photos) without it being easily dismissed as tampered.
- Maintaining a provable "Chain of Custody" for digital files.
- Understanding basic legal rights (e.g., tenant rights, consumer protection) without paying hefty upfront consultation fees.
- Finding verified, official government portals or legal aid services.

## 💡 Our Solution
Saakshya AI bridges the gap between everyday citizens and the legal system by providing:
1. **Tamper-Proof Evidence Vault**: Upload evidence where each file is cryptographically hashed (SHA-256) upon upload, guaranteeing its integrity.
2. **Immutable Chain of Custody**: Every action (upload, view, download) is logged with timestamps and IP addresses, ensuring court-admissible audit trails.
3. **AI Legal Assistant**: An integrated conversational AI (powered by Google Gemini) that translates complex Indian laws into simple, actionable advice in multiple languages.
4. **AI-Powered Community Directory**: A global semantic search engine that instantly finds verified government portals, NGOs, and helplines based on the user's specific problem.

## 🛠️ Technologies Used
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (with custom design system, glassmorphism, and responsive layouts)
- **Backend/Database**: Supabase (PostgreSQL, Row Level Security, Storage Buckets)
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`)
- **Icons**: Lucide React
- **Deployment**: Netlify

## ⚙️ Features
- **Dashboard Analytics**: Visual representation of case distributions and evidence statuses.
- **Secure Authentication**: Email-based authentication managed by Supabase.
- **Responsive Design**: Premium, app-like mobile experience with safe-area insets and touch-optimized navigation.
- **Real-time AI Search**: Seamlessly blends curated static legal portals with dynamically generated AI results to provide the most relevant resources to the user.

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/bibhash7990/saakshya-ai.git
   cd saakshya-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📜 License
This project is licensed under the MIT License.
