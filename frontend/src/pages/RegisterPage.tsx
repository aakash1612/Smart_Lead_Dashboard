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
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']),
});

type FormData = z.infer<typeof schema>;

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'sales' },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success('Account created!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">SmartLeads</h1>
        </div>

        <div className="card p-8 shadow-xl">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-1">
            Create account
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Get started with SmartLeads today
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Full Name
              </label>
              <input
                {...register('name')}
                className="input-base"
                placeholder="Rahul Sharma"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

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
                  placeholder="Min. 6 characters"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Role
              </label>
              <select {...register('role')} className="input-base" disabled={isLoading}>
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {isLoading && <Spinner size="sm" />}
              Create Account
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
