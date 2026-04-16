import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Filter out errors from extensions
    const errorString = error?.toString() || '';
    const errorMessage = error?.message || '';
    if (errorString.includes('chrome-extension') || 
        errorString.includes('hybridaction') ||
        errorString.includes('PC plat') ||
        errorMessage.includes('Service is currently unstable') ||
        errorMessage.includes('try later')) {
      return { hasError: false }; // Ignore these errors
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Filter out errors from extensions
    const errorString = error?.toString() || '';
    const errorMessage = error?.message || '';
    if (errorString.includes('chrome-extension') || 
        errorString.includes('hybridaction') ||
        errorString.includes('PC plat') ||
        errorMessage.includes('Service is currently unstable') ||
        errorMessage.includes('try later')) {
      return; // Ignore these errors
    }
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
            <p className="mb-4 text-xl text-muted-foreground">
              Something went wrong
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
