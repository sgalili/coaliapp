import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedPage } from "@/components/ProtectedPage";
import Index from "./pages/Index";
import UserProfile from "./pages/UserProfile";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import PostDetailPage from "./pages/PostDetailPage";
import MessagesPage from "./pages/MessagesPage";
import TopTrustedPage from "./pages/TopTrustedPage";
import WalletPage from "./pages/WalletPage";
import ProfilePage from "./pages/ProfilePage";
import DataManagementPage from "./pages/DataManagementPage";
import NotificationsSettingsPage from "./pages/NotificationsSettingsPage";
import InviteFriendsPage from "./pages/InviteFriendsPage";
import MyStatsPage from "./pages/MyStatsPage";
import LanguageSettingsPage from "./pages/LanguageSettingsPage";
import { AuthPage } from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:newsId" element={<NewsDetailPage />} />
          <Route path="/news/:newsId/comment/:commentId" element={<NewsDetailPage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/user/:userId/post/:postId" element={<PostDetailPage />} />
          <Route path="/toptrusted" element={<TopTrustedPage />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/messages" element={<ProtectedPage><MessagesPage /></ProtectedPage>} />
          <Route path="/wallet" element={<ProtectedPage><WalletPage /></ProtectedPage>} />
          <Route path="/profile" element={<ProtectedPage><ProfilePage /></ProtectedPage>} />
          <Route path="/data-management" element={<ProtectedPage><DataManagementPage /></ProtectedPage>} />
          <Route path="/notifications-settings" element={<ProtectedPage><NotificationsSettingsPage /></ProtectedPage>} />
          <Route path="/invite-friends" element={<ProtectedPage><InviteFriendsPage /></ProtectedPage>} />
          <Route path="/my-stats" element={<ProtectedPage><MyStatsPage /></ProtectedPage>} />
          
          {/* Settings routes - can be public but some features require auth */}
          <Route path="/language-settings" element={<LanguageSettingsPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
