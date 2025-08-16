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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
          <Route path="/data-management" element={<DataManagementPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
