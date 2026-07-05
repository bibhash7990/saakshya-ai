import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Fingerprint,
  Zap,
  BookOpen,
  ArrowRight,
  UserCheck,
  Building,
  HelpCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Animations configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
  };

  return (
    <div className="min-h-screen text-text-primary bg-bg-primary overflow-x-hidden flex flex-col">
      {/* 1. Header/Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-border bg-bg-primary/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-glow">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-base tracking-wider text-text-primary">
              Saakshya<span className="text-primary-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-secondary">
            <a href="#problem" className="hover:text-text-primary transition">Problem</a>
            <a href="#how-it-works" className="hover:text-text-primary transition">How it Works</a>
            <a href="#features" className="hover:text-text-primary transition">Features</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 px-6 relative flex flex-col items-center justify-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl flex flex-col items-center gap-6 z-10"
        >
          <Badge variant="primary" size="md" className="animate-shield-pulse">
            🛡️ Securing Digital Evidences in India
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Your Digital Evidence, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500">
              Legally Admissible & Locked.
            </span>
          </h1>

          <p className="text-sm md:text-base font-semibold text-text-secondary leading-relaxed max-w-xl">
            Don't let vital proofs get rejected in court. Capture screens, verify metadata, calculate tamper-proof checksum hashes, and generate Section 65B certificates in minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Button variant="accent" size="lg" onClick={() => navigate('/signup')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Secure Your Proofs
            </Button>
            <a href="#how-it-works">
              <Button variant="secondary" size="lg">
                Explore How it Works
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* 3. Impact Stats Section */}
      <section className="py-12 border-y border-border bg-bg-secondary/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-3xl font-bold text-accent-500">47%</h2>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-text-muted">Evidence Rejection Rate</p>
            <p className="text-xs text-text-secondary">Due to broken chain of custody</p>
          </div>
          <div className="flex flex-col gap-1.5 border-l border-border/50">
            <h2 className="text-3xl font-bold text-primary-400">18M+</h2>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-text-muted">Citizens Affected</p>
            <p className="text-xs text-text-secondary">Facing rental, wage or fraud disputes</p>
          </div>
          <div className="flex flex-col gap-1.5 border-l border-border/50">
            <h2 className="text-3xl font-bold text-primary-400">SHA-256</h2>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-text-muted">Admissibility Lock</p>
            <p className="text-xs text-text-secondary">Verifies zero document tampering</p>
          </div>
          <div className="flex flex-col gap-1.5 border-l border-border/50">
            <h2 className="text-3xl font-bold text-accent-500">Zero</h2>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-text-muted">Complexity Needed</p>
            <p className="text-xs text-text-secondary">AI handles local laws & rules</p>
          </div>
        </div>
      </section>

      {/* 4. Problem Statement Section */}
      <section id="problem" className="py-20 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <h2 className="text-3xl font-bold">Unsecured Proof is No Proof</h2>
          <p className="text-sm font-semibold text-text-secondary max-w-md">
            Common situations where digital screenshots or logs get deleted or rejected by landlords, clients, or authorities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Rental Security Deposits</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              "My landlord threatened to lock me out and refused to return my ₹40,000 security deposit. He deleted our WhatsApp chat. I had no backup, and police asked for verified screenshots."
            </p>
            <span className="text-[10px] text-text-muted font-bold mt-auto">— Sneha R., Tenant in Bengaluru</span>
          </Card>

          <Card className="p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Unpaid Freelance Work</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              "I built a website for a client who blocked me on Slack once the files were hosted. They claimed I never delivered. I couldn't prove my delivery timeline in the small claims portal."
            </p>
            <span className="text-[10px] text-text-muted font-bold mt-auto">— Aman K., Developer in Noida</span>
          </Card>

          <Card className="p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Online Marketplace Scams</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              "Paid ₹12,000 for a phone on social media, got a stone inside the package. The page was deleted within an hour. The cyber cell told me screenshots weren't enough without system metadata."
            </p>
            <span className="text-[10px] text-text-muted font-bold mt-auto">— Vinay M., Student in Mumbai</span>
          </Card>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-bg-secondary/20 border-y border-border px-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 flex flex-col gap-5">
            <Badge variant="primary" size="sm" className="w-max">Simple 3-Step Flow</Badge>
            <h2 className="text-3xl font-bold leading-tight">How SaakshyaAI Secures Your Rights</h2>
            <p className="text-xs font-semibold text-text-secondary leading-relaxed">
              Our automated process locks down files, records digital system fingerprints, and generates ready-made documentation that adheres to the new Bharatiya Sakshya Adhiniyam standards.
            </p>
            <Button variant="accent" onClick={() => navigate('/signup')} className="w-max mt-2">
              Start Protecting Now
            </Button>
          </div>

          <div className="w-full md:w-2/3 grid sm:grid-cols-3 gap-6">
            <Card variant="solid" hoverEffect={false} className="p-6 relative">
              <div className="text-4xl font-extrabold text-primary-500/20 absolute top-4 right-4 font-mono">01</div>
              <div className="w-10 h-10 rounded-lg bg-primary-600/10 border border-primary-500/20 text-primary-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-text-primary">1. Smart Capture</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Upload files, screenshots, or record audio. We capture system timestamps, device user-agents, network IPs, and GPS coordinates automatically.
              </p>
            </Card>

            <Card variant="solid" hoverEffect={false} className="p-6 relative">
              <div className="text-4xl font-extrabold text-primary-500/20 absolute top-4 right-4 font-mono">02</div>
              <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400 flex items-center justify-center mb-4">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-text-primary">2. Cryptographic Lock</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                We compute client-side SHA-256 hash digests immediately. This guarantees that your files haven't been edited or altered since upload.
              </p>
            </Card>

            <Card variant="solid" hoverEffect={false} className="p-6 relative">
              <div className="text-4xl font-extrabold text-primary-500/20 absolute top-4 right-4 font-mono">03</div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-text-primary">3. Legal Export</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Generate pre-filled Section 65B Certificates, draft legal notices, or compile portal-ready complaints with automated AI formatting.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Features Grid Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <h2 className="text-3xl font-bold">Engineered for Digital Truth</h2>
          <p className="text-sm font-semibold text-text-secondary max-w-md">
            Every tool you need to preserve evidence, build cases, and know your rights.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col gap-3">
            <Zap className="w-6 h-6 text-primary-400" />
            <h4 className="font-bold text-sm">AI-Guided Capture Wizard</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Step-by-step guidance tailors checklist requests based on your case type so you never forget crucial screenshots or bank transaction details.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-3">
            <Fingerprint className="w-6 h-6 text-primary-400" />
            <h4 className="font-bold text-sm">SHA-256 Integrity Audits</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Generates instantly verifiable cryptographic hash footprints. You can trigger hash recalculations at any time to verify that no pixel has altered.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-3">
            <FileText className="w-6 h-6 text-primary-400" />
            <h4 className="font-bold text-sm">Section 65B Generator</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Pre-fills all system metadata, browser specifications, filenames, and hashes into standard Indian court-ready admissibility forms.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-3">
            <Clock className="w-6 h-6 text-primary-400" />
            <h4 className="font-bold text-sm">Verifiable Chain of Custody</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Keeps a secure, immutable log of who accessed, downloaded, or shared evidence files to protect you from claims of evidence contamination.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-3">
            <BookOpen className="w-6 h-6 text-primary-400" />
            <h4 className="font-bold text-sm">AI Legal Notice Writer</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Drafts professional notices based on your compiled evidence to send to landlords, employers, or clients before initiating costly legal actions.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-3">
            <HelpCircle className="w-6 h-6 text-primary-400" />
            <h4 className="font-bold text-sm">Know Your Rights AI</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Explain your dispute in plain language, and our localized legal AI summarizes your exact legal options, acts, and links to government ODR portals.
            </p>
          </Card>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-20 px-6 text-center bg-gradient-to-t from-bg-secondary/40 via-bg-primary to-bg-primary relative z-10 border-t border-border">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <ShieldCheck className="w-12 h-12 text-accent-500 animate-shield-pulse" />
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Ready to Protect Your Proofs?
          </h2>
          <p className="text-xs md:text-sm font-semibold text-text-secondary leading-relaxed max-w-lg">
            Create your account today and unlock a fully secured evidence vault. Calculate hashes, build timelines, and verify system metadata for free.
          </p>
          <Button variant="accent" size="lg" onClick={() => navigate('/signup')} className="mt-2 font-bold px-8">
            Create Your Free Vault
          </Button>
          <div className="flex gap-4 text-[10px] text-text-muted mt-2 select-none font-bold">
            <span>✓ No CC required</span>
            <span>•</span>
            <span>✓ Secure Encrypted Files</span>
            <span>•</span>
            <span>✓ Verifiable Hashing</span>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto border-t border-border bg-bg-secondary/20 py-8 px-6 text-xs text-text-muted select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-text-primary">SaakshyaAI</span>
          </div>

          <p>© {new Date().getFullYear()} SaakshyaAI. Built for security, truth, and transparency in India.</p>

          <div className="flex gap-4 text-text-secondary font-semibold">
            <Link to="/login" className="hover:text-text-primary transition">Login</Link>
            <Link to="/signup" className="hover:text-text-primary transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
