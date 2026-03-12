import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { authService } from '@/services/authService';
import { STORAGE_KEYS } from '@/constants';
import { useAppDispatch } from '@/hooks/useRedux';
import { setUser } from '@/features/authSlice';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');
      const response = await authService.login(data);
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      dispatch(setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role as 'admin' | 'hr' | 'manager',
      }));
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eff4f1] px-4 py-10">
      <div className="absolute inset-0 bg-mesh-soft opacity-100" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/80 to-transparent" />
      <Card className="relative w-full max-w-md border-white/80 bg-white/92 shadow-[0_28px_60px_-34px_rgba(18,38,31,0.42)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-sm">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-700">HR Workspace</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f3733]">HR Document Generator</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to manage employees, letters, payroll, and history.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@company.com"
            {...register('email', { required: true })}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', { required: true })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50/80 p-3">
          <p className="mb-1 text-xs font-semibold text-primary-900">First time? Register a user:</p>
          <p className="font-mono text-xs text-primary-700">POST /api/auth/register</p>
          <p className="mt-2 text-xs text-primary-700">Then login with your credentials</p>
        </div>
      </Card>
    </div>
  );
};
