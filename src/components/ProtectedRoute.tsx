import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute: Auth check - loading:', loading, 'user:', !!user, 'pathname:', location.pathname);
  }, [loading, user, location.pathname]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    console.log('ProtectedRoute: User not authenticated, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};