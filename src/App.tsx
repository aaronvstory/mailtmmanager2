import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Inbox } from "./pages/Inbox";
import {
  authTokenAtom,
  activeAccountAtom,
  storedAccountsAtom,
} from "./lib/store";
import { mailTM } from "./lib/api";
import { useTheme } from "./lib/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [token] = useAtom(authTokenAtom);
  const [activeAccountId] = useAtom(activeAccountAtom);
  const [storedAccounts] = useAtom(storedAccountsAtom);

  const activeAccount = storedAccounts.find(
    (account) => account.id === activeAccountId
  );

  React.useEffect(() => {
    if (activeAccount) {
      mailTM.setToken(activeAccount.token);
    }
  }, [activeAccount]);

  if (!token && !activeAccount) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  useTheme();
  const [token] = useAtom(authTokenAtom);

  React.useEffect(() => {
    if (token) {
      mailTM.setToken(token);
    }
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
