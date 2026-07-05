import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { Loader } from '../ui/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = authService.initAuthListener();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <Loader fullScreen text="Verifying secure session..." />;
  }

  return isAuthenticated ? <>{children}</> : null;
};
