import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { Mail, Lock, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { mailTM } from '../lib/api';
import { authTokenAtom, currentUserAtom } from '../lib/store';

export function Register() {
  const navigate = useNavigate();
  const [, setToken] = useAtom(authTokenAtom);
  const [, setCurrentUser] = useAtom(currentUserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { data: domains, isLoading: isLoadingDomains } = useQuery({
    queryKey: ['domains'],
    queryFn: () => mailTM.getDomains(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!domains?.length) {
      toast.error('No available domains');
      return;
    }

    setIsLoading(true);

    try {
      // Automatically use the first available domain
      const domain = domains[0].domain;
      const email = `${formData.username}@${domain}`;

      await mailTM.createAccount(email, formData.password);
      const token = await mailTM.login(email, formData.password);
      setToken(token);
      const user = await mailTM.getAccount();
      setCurrentUser(user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: unknown) { // eslint-disable-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let message = 'Failed to create account';
          if ((error as any).response?.data?.['hydra:description']) {
            message = (error as any).response?.data['hydra:description'] ?? message;
          }
          toast.error(message);
        } finally {
          setIsLoading(false);
        }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary">
            Or{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-accent-primary hover:text-accent-secondary"
            >
              sign in to your account
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="appearance-none rounded-t-md relative block w-full px-3 py-2 pl-10 bg-secondary border border-border placeholder-[var(--placeholder-color)] text-[var(--text-primary)] focus:outline-none focus:ring-accent-primary focus:border-accent-primary focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
                {domains?.length > 0 && (
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary">
                    @{domains[0].domain}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 bg-secondary border border-border placeholder-[var(--placeholder-color)] text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 pl-10 bg-secondary border border-border placeholder-[var(--placeholder-color)] text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isLoadingDomains}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-accent-primary hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
