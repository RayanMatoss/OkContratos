import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Contratos from "./pages/Contratos";
import Fornecedores from "./pages/Fornecedores";
import Ordens from "./pages/Ordens";
import Itens from "./pages/Itens"; // Adicionando a rota de Itens
import Relatorios from "./pages/Relatorios";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import TesteRecuperacao from "./pages/TesteRecuperacao";
import { MunicipioGuard } from "@/components/MunicipioGuard";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, municipio, loading } = useAuth();
  if (loading) return null;
  if (!user || !municipio) {
    return <Navigate to="/login" />;
  }
  return (
    <MunicipioGuard>
      {children}
    </MunicipioGuard>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/teste-recuperacao" element={<TesteRecuperacao />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Navigate to="/dashboard" />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="contratos" element={<Contratos />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="ordens" element={<Ordens />} />
        <Route path="itens" element={<Itens />} /> {/* Rota de Itens */}
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Create the query client inside the component
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
