import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ProtectedPageProps {
  children: ReactNode;
  fallbackRoute?: string;
}

export const ProtectedPage = ({ children, fallbackRoute = '/auth' }: ProtectedPageProps) => {
  const { user, loading, initializing } = useAuth();

  // Show loading spinner while checking authentication
  if (loading || initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to={fallbackRoute} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};