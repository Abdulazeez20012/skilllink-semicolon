import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Logo from '../components/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { ROUTES } from '../constants';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Set initial state based on the current route
  useEffect(() => {
    setIsSignup(location.pathname === ROUTES.SIGNUP);
  }, [location.pathname]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignup) {
        await register({ name, email, password, role });
        showToast('Account created successfully!', 'success');
      } else {
        await login({ email, password });
      }
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      showToast(isSignup ? 'Registration failed. Please try again.' : 'Login failed. Please check your credentials.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary dark:bg-neutral-soft-black">
      <ToastComponent />
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-secondary dark:bg-neutral-gray-dark rounded-2xl shadow-2xl overflow-hidden animate-fade-in-zoom">
        {/* Left Side (Branding) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary to-red-700 text-secondary relative overflow-hidden animate-gradient-bg [background-size:200%]">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
                <Logo size={64} />
                <h1 className="text-4xl font-bold font-heading mt-4">SkillLink</h1>
                <p className="mt-2 text-white/80">by Semicolon</p>
                <p className="mt-8 text-lg">Empowering the future of learning, one assignment at a time.</p>
            </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold font-heading text-neutral-soft-black dark:text-secondary mb-2">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-neutral-gray-light mb-8">{isSignup ? 'Join the community.' : 'Sign in to continue.'}</p>
          
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="mb-4">
                <Input
                  label="Full Name"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            
            {isSignup && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-gray-light mb-2">I am a...</label>
                <div className="grid grid-cols-3 gap-2 bg-neutral-light-gray dark:bg-neutral-gray-medium rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.STUDENT)}
                    className={`py-2 px-3 rounded-md transition-colors duration-300 text-sm font-medium ${role === UserRole.STUDENT ? 'bg-primary text-white shadow' : 'text-neutral-gray-light hover:bg-neutral-light-gray/50 dark:hover:bg-neutral-gray-dark/50'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.FACILITATOR)}
                    className={`py-2 px-3 rounded-md transition-colors duration-300 text-sm font-medium ${role === UserRole.FACILITATOR ? 'bg-primary text-white shadow' : 'text-neutral-gray-light hover:bg-neutral-light-gray/50 dark:hover:bg-neutral-gray-dark/50'}`}
                  >
                    Facilitator
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.ADMIN)}
                    className={`py-2 px-3 rounded-md transition-colors duration-300 text-sm font-medium ${role === UserRole.ADMIN ? 'bg-primary text-white shadow' : 'text-neutral-gray-light hover:bg-neutral-light-gray/50 dark:hover:bg-neutral-gray-dark/50'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="mt-8">
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" color="white" /> : (isSignup ? 'Sign Up' : 'Login')}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-gray-light">
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <Link to={isSignup ? ROUTES.LOGIN : ROUTES.SIGNUP} className="font-medium text-primary hover:underline">
                  {isSignup ? 'Log In' : 'Sign Up'}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;