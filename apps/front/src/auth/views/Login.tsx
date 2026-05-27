import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import { useLogin } from '../hooks/useLogin';
import { Card } from '../../common/ui/Card/Card';
import { Spinner } from '../../common/ui/Spinner/Spinner';

export const Login = () => {
  const { login, isSubmitting, submitError } = useLogin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login(values).finally(() => {
      reset();
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 ">
      <div className="w-full max-w-md rounded-2xl">
        <Card title="Login" description="Enter your credentials to continue">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            noValidate
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                placeholder="you@example.com"
              />

              {errors.email && (
                <p className="text-sm text-red-600">* {errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                placeholder="••••••••"
              />

              {errors.password && (
                <p className="text-sm text-red-600">* {errors.password.message}</p>
              )}
            </div>

            {submitError && (
              <div className="rounded-xl pb-2 text-sm text-red-600">* {submitError}</div>
            )}

            <button
              type="submit"
              role="button"
              disabled={isSubmitting}
              className="inline-flex relative w-full items-center justify-center rounded-xl cursor-pointer bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Spinner size="md" /> : 'Sign in'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};
