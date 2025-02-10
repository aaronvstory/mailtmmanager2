import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Mail, Lock, Loader } from "lucide-react";
import { toast } from "sonner";
import { mailTM } from "../lib/api";
import {
  authTokenAtom,
  currentUserAtom,
  storedAccountsAtom,
  activeAccountAtom,
} from "../lib/store";

export function Login() {
  const navigate = useNavigate();
  const [, setToken] = useAtom(authTokenAtom);
  const [, setCurrentUser] = useAtom(currentUserAtom);
  const [storedAccounts, setStoredAccounts] = useAtom(storedAccountsAtom);
  const [, setActiveAccount] = useAtom(activeAccountAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await mailTM.login(formData.email, formData.password);
      const user = await mailTM.getAccount();

      // Store the account
      const newAccount = {
        id: user.id,
        email: user.address,
        token,
        lastActive: new Date().toISOString(),
      };

      // Update stored accounts
      const existingAccountIndex = storedAccounts.findIndex(
        (account) => account.id === user.id
      );

      if (existingAccountIndex >= 0) {
        const updatedAccounts = [...storedAccounts];
        updatedAccounts[existingAccountIndex] = newAccount;
        setStoredAccounts(updatedAccounts);
      } else {
        setStoredAccounts([...storedAccounts, newAccount]);
      }

      // Set current session
      setToken(token);
      setCurrentUser(user);
      setActiveAccount(user.id);

      toast.success("Successfully logged in!");
      navigate("/");

      // Update stored accounts
      const existingAccountIndex2 = storedAccounts.findIndex(
        (account) => account.id === user.id
      );
      if (existingAccountIndex2 >= 0) {
              // Update existing account
              const updatedAccounts = [...storedAccounts];
              updatedAccounts[existingAccountIndex2] = newAccount;
              setStoredAccounts(updatedAccounts);
            } else {
              // Add new account
              setStoredAccounts([...storedAccounts, newAccount]);
            }

      // Set active account and auth state
      setActiveAccount(user.id);
      setToken(token);
      setCurrentUser(user);

      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Invalid credentials. Please try again.";
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary">
            Or{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-accent-primary hover:text-accent-secondary"
            >
              create a new account
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 bg-secondary border border-border placeholder-[var(--placeholder-color)] text-[var(--text-primary)] rounded-t-md focus:outline-none focus:ring-accent-primary focus:border-accent-primary focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 bg-secondary border border-border placeholder-[var(--placeholder-color)] text-[var(--text-primary)] rounded-b-md focus:outline-none focus:ring-accent-primary focus:border-accent-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-accent-primary hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
