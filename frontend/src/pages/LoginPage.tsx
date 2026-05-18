import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/Spinner';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              SmartLeads
            </h1>
          </div>
        </div>

        <div className="card p-8 shadow-xl">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-1">
            Welcome back
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-base"
                placeholder="you@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-base pr-10"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {isLoading && <Spinner size="sm" />}
              Sign In
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--accent)] hover:underline font-medium">
              Register
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-5 p-3 bg-[var(--bg-muted)] rounded-lg">
            <p className="text-xs text-[var(--text-muted)] font-medium mb-1">Demo Credentials</p>
            <p className="text-xs text-[var(--text-secondary)]">Admin: admin@smartleads.com / admin123</p>
            <p className="text-xs text-[var(--text-secondary)]">Sales: sales@smartleads.com / sales123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
