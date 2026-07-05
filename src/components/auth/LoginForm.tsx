import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail } from 'lucide-react';
import { isSupabaseConfigured } from '@/services/supabase';

// 1. Define Zod Schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, submitting } = useAuth();
  const toast = useToast();

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Form Submit Handler
  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.email);
    if (result.error) {
      toast.danger(result.error);
    } else {
      if (isSupabaseConfigured()) {
        toast.success('Magic login link sent! Please check your inbox.');
      } else {
        toast.success('Successfully logged in (Demo Mode)!');
        if (onSuccess) onSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        {...register('email')}
        error={errors.email?.message}
        leftIcon={<Mail className="w-4 h-4" />}
        disabled={submitting}
      />
      <Button type="submit" loading={submitting} className="w-full mt-2">
        {isSupabaseConfigured() ? 'Send Magic Login Link' : 'Secure Login'}
      </Button>
    </form>
  );
};
