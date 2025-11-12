import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChannelProvider } from "@/contexts/ChannelContext";
import Index from "./pages/Index";
import UserProfile from "./pages/UserProfile";
import NewsPage from "./pages/NewsPage";
import ImpactPage from "./pages/ImpactPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import PostDetailPage from "./pages/PostDetailPage";
import MessagesPage from "./pages/MessagesPage";
import TopTrustedPage from "./pages/TopTrustedPage";
import WalletPage from "./pages/WalletPage";
import ProfilePage from "./pages/ProfilePage";
import DecisionsPage from "./pages/DecisionsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContent from "./pages/AdminContent";
import AdminUsers from "./pages/AdminUsers";
import AdminNotifications from "./pages/AdminNotifications";
import DataManagementPage from "./pages/DataManagementPage";
import EnhancedAdminDashboard from "./pages/EnhancedAdminDashboard";
import AdminChannelRequests from "./pages/AdminChannelRequests";
import AdminPublicRequests from "./pages/AdminPublicRequests";
import AdminAllChannels from "./pages/AdminAllChannels";
import NotificationsSettingsPage from "./pages/NotificationsSettingsPage";
import InviteFriendsPage from "./pages/InviteFriendsPage";
import MyStatsPage from "./pages/MyStatsPage";
import LanguageSettingsPage from "./pages/LanguageSettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import MyDelegatedVotesPage from "./pages/MyDelegatedVotesPage";
import ChannelManagement from "./pages/ChannelManagement";
import { AuthPage } from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { UserProvider } from "./contexts/UserContext";
import { DemoDataInitializer } from "./components/DemoDataInitializer";
import "./scripts/cleanupDuplicates"; // Make cleanup function available

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <DemoDataInitializer />
      <ChannelProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:newsId" element={<NewsDetailPage />} />
            <Route path="/news/:newsId/comment/:commentId" element={<NewsDetailPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/user/:userId/post/:postId" element={<PostDetailPage />} />
            <Route path="/toptrusted" element={<TopTrustedPage />} />
            <Route path="/decisions" element={<DecisionsPage />} />
            <Route path="/admin" element={<EnhancedAdminDashboard />} />
            <Route path="/admin/dashboard" element={<EnhancedAdminDashboard />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/channels" element={<AdminChannelRequests />} />
            <Route path="/admin/all-channels" element={<AdminAllChannels />} />
            <Route path="/admin/public-requests" element={<AdminPublicRequests />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            
            {/* Temporarily public for development - will add auth in Phase 2 */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-delegated-votes" element={<MyDelegatedVotesPage />} />
            <Route path="/channel/:channelId/manage" element={<ChannelManagement />} />
            <Route path="/data-management" element={<DataManagementPage />} />
            <Route path="/notifications-settings" element={<NotificationsSettingsPage />} />
            <Route path="/invite-friends" element={<InviteFriendsPage />} />
            <Route path="/my-stats" element={<MyStatsPage />} />
            
            {/* Settings routes - can be public but some features require auth */}
            <Route path="/language-settings" element={<LanguageSettingsPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ChannelProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
