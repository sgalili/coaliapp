import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import MyGovPage from "./pages/MyGovPage";
import MyGovGeneratePage from "./pages/MyGovGeneratePage";
import MyGovPopularPage from "./pages/MyGovPopularPage";
import MyGovSharePage from "./pages/MyGovSharePage";
import { AuthPage } from "./pages/AuthPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import DecisionsPage from "./pages/DecisionsPage";
import VoteFeedPage from "./pages/VoteFeedPage";
import NotFound from "./pages/NotFound";
import { PollProvider } from "./contexts/PollContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PollProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:newsId" element={<NewsDetailPage />} />
            <Route path="/news/:newsId/comment/:commentId" element={<NewsDetailPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/user/:userId/post/:postId" element={<PostDetailPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/toptrusted" element={<TopTrustedPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notification" element={<NotificationsPage />} />
            <Route path="/data-management" element={<DataManagementPage />} />
            <Route path="/notifications-settings" element={<NotificationsSettingsPage />} />
            <Route path="/invite-friends" element={<InviteFriendsPage />} />
            <Route path="/my-stats" element={<MyStatsPage />} />
            <Route path="/language-settings" element={<LanguageSettingsPage />} />
          <Route path="/mygov" element={<MyGovPage />} />
          <Route path="/mygov/generate" element={<MyGovGeneratePage />} />
          <Route path="/mygov/popular" element={<MyGovPopularPage />} />
          <Route path="/mygov/share/:shareId" element={<MyGovSharePage />} />
            <Route path="/decisions" element={<DecisionsPage />} />
            <Route path="/decisions/:cardId" element={<DecisionsPage />} />
            <Route path="/votefeed" element={<VoteFeedPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PollProvider>
  </QueryClientProvider>
);

export default App;
