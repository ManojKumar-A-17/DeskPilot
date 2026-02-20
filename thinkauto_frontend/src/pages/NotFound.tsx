import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Only log errors for actual app routes (not external/extension requests)
    const isAppRoute = location.pathname.startsWith('/employee') || 
                       location.pathname.startsWith('/technician') || 
                       location.pathname.startsWith('/admin') ||
                       location.pathname.startsWith('/login') ||
                       location.pathname.startsWith('/signup') ||
                       (!location.pathname.includes('hybridaction') && 
                        !location.pathname.includes('chrome-extension'));
    
    if (isAppRoute && location.pathname !== '/') {
      console.warn("404: Route not found -", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
