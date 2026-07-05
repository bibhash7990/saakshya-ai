import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, User, Lock } from 'lucide-react';
import { isSupabaseConfigured } from '@/services/supabase';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long').regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const { register: authRegister, submitting } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const result = await authRegister(data.email, data.fullName, data.password);
    if (result.error) {
      toast.danger(result.error);
    } else {
      toast.success('Registration successful! Check email to verify (or login instantly).');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        type="text"
        label="Full Name"
        placeholder="Enter your name"
        {...register('fullName')}
        error={errors.fullName?.message}
        leftIcon={<User className="w-4 h-4" />}
        disabled={submitting}
      />
      <Input
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        {...register('email')}
        error={errors.email?.message}
        leftIcon={<Mail className="w-4 h-4" />}
        disabled={submitting}
      />
      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
        leftIcon={<Lock className="w-4 h-4" />}
        disabled={submitting}
      />
      <Button type="submit" loading={submitting} className="w-full mt-2">
        Secure Register
      </Button>
    </form>
  );
};
