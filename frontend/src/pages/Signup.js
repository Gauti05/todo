import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm();
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const onSubmit = async data => {
    setLoading(true);
    clearErrors('server');
    try {
      await api.post('/auth/signup', data);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError('server', { message: err.response?.data?.message || 'Signup failed' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 animate-fadeIn">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="name" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Name</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className={`w-full p-2 border rounded mb-1 ${errors.name ? 'border-red-600' : 'border-gray-300'} dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500`}
            ref={(e) => {
              register('name').ref(e);
              nameRef.current = e;
            }}
            disabled={loading}
          />
          {errors.name && <p className="text-red-600 mb-2">{errors.name.message}</p>}

          <label htmlFor="email" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className={`w-full p-2 border rounded mb-1 ${errors.email ? 'border-red-600' : 'border-gray-300'} dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500`}
            disabled={loading}
          />
          {errors.email && <p className="text-red-600 mb-2">{errors.email.message}</p>}

          <label htmlFor="password" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum length is 6' }
              })}
              className={`w-full p-2 border rounded mb-1 ${errors.password ? 'border-red-600' : 'border-gray-300'} dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-sm text-green-600 dark:text-green-400 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-600 mb-2">{errors.password.message}</p>}

          <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) => value === watch('password') || 'Passwords do not match'
              })}
              className={`w-full p-2 border rounded mb-1 ${errors.confirmPassword ? 'border-red-600' : 'border-gray-300'} dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-sm text-green-600 dark:text-green-400 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 mb-2">{errors.confirmPassword.message}</p>}

          {errors.server && <p className="text-red-600 mb-4">{errors.server.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 dark:hover:bg-green-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 dark:text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
