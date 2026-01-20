import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import FeedPage from "./pages/dashboard/FeedPage";
import AccountPage from "./pages/dashboard/AccountPage";
import SupportPage from "./pages/dashboard/SupportPage";
import AuthSignIn from "./pages/AuthSignIn";
import ToolsLayout from "./components/dashboard/ToolsLayout";
import AgentLLMPage from "./pages/dashboard/AgentLLMPage";
import ImageToolsPage from "./pages/dashboard/ImageToolsPage";
import VideoToolsPage from "./pages/dashboard/VideoToolsPage";
import AgentStorePage from "./pages/dashboard/AgentStorePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/sign-in" element={<AuthSignIn />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="tools" element={<ToolsLayout />}>
              <Route path="agent" element={<AgentLLMPage />} />
              <Route path="image" element={<ImageToolsPage />} />
              <Route path="video" element={<VideoToolsPage />} />
            </Route>
            <Route path="account" element={<AccountPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="agent-store" element={<AgentStorePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
