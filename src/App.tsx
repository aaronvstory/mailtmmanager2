import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Inbox } from './pages/Inbox';
import { authTokenAtom, activeAccountAtom, storedAccountsAtom } from './lib/store';
import { mailTM } from './lib/api';
import { useTheme } from './lib/theme';

const queryClient = new QueryClient();

function App() {
  // Initialize theme at the root level
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [token] = useAtom(authTokenAtom);
  const [activeAccountId] = useAtom(activeAccountAtom);
  const [storedAccounts] = useAtom(storedAccountsAtom);

  const activeAccount = storedAccounts.find(account => account.id === activeAccountId);

  React.useEffect(() => {
    if (activeAccount) {
      mailTM.setToken(activeAccount.token);
    } else if (!token) {
      navigate('/login');
    }
  }, [activeAccount, token, navigate]);

  if (!token && !activeAccount) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Inbox />} />
      </Route>
    </Routes>
  );
}

export default App;

export default App;
