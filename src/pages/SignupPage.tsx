import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { SignupForm } from '@/components/auth/SignupForm';
import { SocialLogin } from '@/components/auth/SocialLogin';
import { ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '@/services/supabase';

export const SignupPage: React.FC = () => {
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
            Protect What's Yours, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500">
              Verify with Integrity.
            </span>
          </h1>
          <p className="text-sm font-semibold text-text-secondary leading-relaxed">
            Create cases, compile files, lock down cryptographic checksum hashes, and generate legally compliant proof-files easily in a private workspace.
          </p>

          <div className="flex flex-col gap-3.5 mt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">Metadata Vaulting</p>
                <p className="text-xs text-text-muted">Captures device name, OS details, IP networks, and browser origins securely.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">Encrypted Storage Logs</p>
                <p className="text-xs text-text-muted">Maintains a continuous verification audit path matching the Indian Evidence Act standards.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">AI Legal Rights Explorer</p>
                <p className="text-xs text-text-muted">Provides helpful summaries of local laws, claims portals, and action guidelines.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted z-10">
          <Lock className="w-3.5 h-3.5" />
          <span>FIPS 140-2 data compliance audit path</span>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Right side: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight">Create Secure Account</h2>
            <p className="text-xs font-semibold text-text-secondary">
              {!isSupabaseConfigured() && (
                <span className="text-accent-500 mr-1">[Demo Mode]</span>
              )}
              Register to begin securing your files
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <SignupForm onSuccess={() => navigate('/dashboard')} />

            {/* Hiding Google Login for now
            <div className="relative flex items-center justify-center my-2 select-none">
              <div className="absolute w-full border-t border-border" />
              <span className="relative px-3 bg-bg-primary text-[10px] font-bold text-text-muted uppercase">
                Or secure auth
              </span>
            </div>

            <SocialLogin onClick={loginWithGoogle} loading={submitting} />
            */}
          </div>

          <p className="text-xs text-center text-text-secondary mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-500 font-bold underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;
