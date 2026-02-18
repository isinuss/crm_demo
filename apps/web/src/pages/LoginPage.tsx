import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN, REGISTER } from '@/graphql/queries';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [login, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      setAuth(data.login.token, data.login.user);
      navigate('/');
    },
    onError: (err) => setError(err.message),
  });

  const [register, { loading: registerLoading }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      setAuth(data.register.token, data.register.user);
      navigate('/');
    },
    onError: (err) => setError(err.message),
  });

  const loading = loginLoading || registerLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      register({ variables: { email, password, firstName, lastName } });
    } else {
      login({ variables: { email, password } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-900">CRM Demo</h1>
          <p className="text-gray-500 mt-2">
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : isRegister
                ? 'Create Account'
                : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
