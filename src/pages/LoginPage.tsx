import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLogin } from '@/components/auth/SocialLogin';
import { ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '@/services/supabase';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { loginWithGoogle, submitting } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-stretch text-text-primary bg-bg-primary overflow-hidden">
      {/* Left side: Premium branding & copy */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-bg-secondary via-bg-primary to-primary-950 border-r border-border relative">
        <div className="flex items-center gap-2.5 z-10 select-none">
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-glow">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-wider text-text-primary">
            Saakshya<span className="text-primary-500">AI</span>
          </span>
        </div>

        <div className="my-auto max-w-lg flex flex-col gap-6 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Your Digital Evidence, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500">
              Legally Secured.
            </span>
          </h1>
          <p className="text-sm font-semibold text-text-secondary leading-relaxed">
            Ensure your digital proofs are court-admissible in India. Capture, verify metadata, calculate SHA-256 hash digests, and automatically build legal documentation.
          </p>

          <div className="flex flex-col gap-3.5 mt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">SHA-256 Hash Auditing</p>
                <p className="text-xs text-text-muted">Calculates checksums at upload to guarantee content integrity.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">Section 65B Admissibility Certificates</p>
                <p className="text-xs text-text-muted">Generates legal certification as per the Indian Evidence Act / BSA.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">Smart Case Timeline</p>
                <p className="text-xs text-text-muted">Structures evidence into chronological event charts with AI guides.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted z-10">
          <Lock className="w-3.5 h-3.5" />
          <span>AES-256 client side validation enabled</span>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight">Access Your Vault</h2>
            <p className="text-xs font-semibold text-text-secondary">
              {!isSupabaseConfigured() && (
                <span className="text-accent-500 mr-1">[Demo Mode]</span>
              )}
              {isSupabaseConfigured()
                ? 'Enter email to receive passwordless verification link'
                : 'Enter any email to log in instantly'}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <LoginForm onSuccess={() => navigate('/dashboard')} />

            <div className="relative flex items-center justify-center my-2 select-none">
              <div className="absolute w-full border-t border-border" />
              <span className="relative px-3 bg-bg-primary text-[10px] font-bold text-text-muted uppercase">
                Or secure auth
              </span>
            </div>

            <SocialLogin onClick={loginWithGoogle} loading={submitting} />
          </div>

          <p className="text-xs text-center text-text-secondary mt-2">
            New to SaakshyaAI?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-500 font-bold underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
