import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { Briefcase, Lock, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const fillDemoCredentials = () => {
    setEmail('admin@example.com');
    setPassword('password');
    setErrors({});
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    // Client-side quick checks
    const clientErrors = {};
    if (!email.trim()) clientErrors.email = ['Email address is required.'];
    if (!password) clientErrors.password = ['Password is required.'];

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 401) {
        setGeneralError(err.response.data.message || 'Invalid email or password.');
      } else {
        setGeneralError(err.response?.data?.message || 'Unable to connect to server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-3.5">
            <Briefcase className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight m-0">
            ProjectPulse
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Client & Project Management Platform
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 m-0">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials to access the workspace
            </p>
          </div>

          {generalError && (
            <Alert
              type="error"
              message={generalError}
              className="mb-5"
              onClose={() => setGeneralError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              icon={Mail}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Helper Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="bg-indigo-50/70 border border-indigo-100/80 rounded-xl p-3.5 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                  Demo Credentials
                </span>
                <span className="text-xs text-indigo-700">
                  admin@example.com / password
                </span>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-fill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
