import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { RegisterRequest } from '../../types/User';
import AuthForm from './AuthForm';

export default function Register() {
  const { register: registerUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setError('');
      await registerUser(data);
      navigate('/');
    } catch {
      setError(t('registrationFailed'));
    }
  };

  return (
    <AuthForm
      title={t('createAccountTitle')}
      subtitle={t('joinToday')}
      onSubmit={handleSubmit(onSubmit)}
      error={error}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('username')}</label>
        <input
          type="text"
          {...register('username', { required: t('usernameRequired') })}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="your_username"
        />
        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
        <input
          type="email"
          {...register('email', { required: t('emailRequired') })}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
        <input
          type="password"
          {...register('password', {
            required: t('passwordRequired'),
            minLength: { value: 8, message: t('passwordMin') },
          })}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? t('creatingAccount') : t('createAccount')}
      </button>

      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        {t('haveAccount')}{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </AuthForm>
  );
}
