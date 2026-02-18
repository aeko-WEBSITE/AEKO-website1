import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import FeedPage from "./pages/dashboard/FeedPage";
import AccountPage from "./pages/dashboard/AccountPage";
import CreationHistoryPage from "./pages/dashboard/CreationHistoryPage";
import SupportPage from "./pages/dashboard/SupportPage";
import AuthSignIn from "./pages/AuthSignIn";
import ToolsLayout from "./components/dashboard/ToolsLayout";
import AgentLLMPage from "./pages/dashboard/AgentLLMPage";
import ImageToolsPage from "./pages/dashboard/ImageToolsPage";
import VideoToolsPage from "./pages/dashboard/VideoToolsPage";
import AgentStorePage from "./pages/dashboard/AgentStorePage";
import ToolsPage from "./pages/dashboard/ToolsPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminConfigPage from "./pages/admin/AdminConfigPage";
import AdminWalletPage from "./pages/admin/AdminWalletPage";
import AdminPackagesPage from "./pages/admin/AdminPackagesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminTokensPage from "./pages/admin/AdminTokensPage";
import PaymentPage from "./pages/PaymentPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/auth/sign-in" element={<AuthSignIn />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="feed" element={<FeedPage />} />
                <Route path="tools" element={<ToolsPage />} />
                <Route path="tools-old" element={<ToolsLayout />}>
                  <Route path="agent" element={<AgentLLMPage />} />
                  <Route path="image" element={<ImageToolsPage />} />
                  <Route path="video" element={<VideoToolsPage />} />
                </Route>
                <Route path="account" element={<AccountPage />} />
                <Route path="creation-history" element={<CreationHistoryPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="agent-store" element={<AgentStorePage />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="configs" element={<AdminConfigPage />} />
                <Route path="wallet" element={<AdminWalletPage />} />
                <Route path="packages" element={<AdminPackagesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="tokens" element={<AdminTokensPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
