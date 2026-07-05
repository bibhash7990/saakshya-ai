import React from 'react';
import { Button } from '../ui/Button';

interface SocialLoginProps {
  onClick: () => void;
  loading?: boolean;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ onClick, loading }) => {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      loading={loading}
      className="w-full flex items-center justify-center gap-2.5 font-semibold text-text-primary"
      leftIcon={
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5.04c1.7 0 3.2.6 4.4 1.7L20.2 3A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.2 6.7L5.5 10A7.1 7.1 0 0 1 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5A5.6 5.6 0 0 1 16 18.2l4.2 3.3a11.9 11.9 0 0 0 3.3-9.2z"
          />
          <path
            fill="#FBBC05"
            d="M5.5 14a7.1 7.1 0 0 1 0-4L1.2 6.7A11.9 11.9 0 0 0 0 12c0 1.9.5 3.7 1.2 5.3l4.3-3.3z"
          />
          <path
            fill="#34A853"
            d="M12 19a7.1 7.1 0 0 1-6.5-4.3L1.2 18A11.9 11.9 0 0 0 12 24c3.2 0 6-1 8.2-3l-4.2-3.3A7.1 7.1 0 0 1 12 19z"
          />
        </svg>
      }
    >
      Continue with Google
    </Button>
  );
};
