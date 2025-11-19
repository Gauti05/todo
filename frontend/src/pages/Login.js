import React, { useContext, useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onSubmit = async data => {
    setLoading(true);
    clearErrors('server');
    try {
      const res = await api.post('/auth/login', data);
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('server', { message: err.response?.data?.message || 'Login failed' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 animate-fadeIn">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="email" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className={`w-full p-2 border rounded mb-1 ${errors.email ? 'border-red-600' : 'border-gray-300'} dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            ref={(e) => {
              register('email').ref(e);
              emailRef.current = e;
            }}
            disabled={loading}
          />
          {errors.email && <p className="text-red-600 mb-2">{errors.email.message}</p>}

          <label htmlFor="password" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className={`w-full p-2 border rounded mb-1 ${errors.password ? 'border-red-600' : 'border-gray-300'} dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-sm text-blue-600 dark:text-blue-400 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-600 mb-2">{errors.password.message}</p>}

          {errors.server && <p className="text-red-600 mb-4">{errors.server.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
