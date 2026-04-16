import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

// Aggressively suppress all promise rejections with service instability errors
const suppressedErrors = new Set<string>();

// Suppress external errors from extensions and third-party scripts
window.addEventListener('error', (event) => {
  // Filter out errors from chrome extensions and external sources
  if (event.filename?.includes('chrome-extension://') || 
      event.message?.includes('PC plat') ||
      event.filename?.includes('extension://') ||
      event.message?.includes('Failed to load resource') ||
      event.message?.includes('Service is currently unstable')) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
}, true);

// Suppress unhandled promise rejections from external sources
window.addEventListener('unhandledrejection', (event) => {
  // Check if the rejection is from external sources
  const errorString = event.reason?.toString() || '';
  const errorMessage = event.reason?.message || '';
  const errMsg = event.reason?.errMsg || '';
  const hasErrNo = event.reason && 'errNo' in event.reason;
  
  if (errorString.includes('chrome-extension') || 
      errorString.includes('hybridaction') ||
      errorString.includes('PC plat') ||
      errorString.includes('_bCrz') ||
      errorString.includes('Failed to fetch') ||
      errorMessage.includes('Service is currently unstable') ||
      errorMessage.includes('try later') ||
      errMsg.includes('Service is currently unstable') ||
      errMsg.includes('try later') ||
      errMsg.includes('unstable') ||
      (hasErrNo && event.reason.errNo === -2)) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    // Prevent the error from being logged
    return false;
  }
}, true);

// Override console.error to filter out extension-related errors
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const errorString = args.join(' ');
  const hasErrorObject = args.some((arg: any) => 
    arg && typeof arg === 'object' && 
    (arg.errMsg?.includes('Service is currently unstable') || arg.errNo === -2)
  );
  
  if (errorString.includes('hybridaction') || 
      errorString.includes('Failed to load resource') ||
      errorString.includes('chrome-extension') ||
      errorString.includes('_bCrz') ||
      errorString.includes(':8080/hybridaction') ||
      errorString.includes('Service is currently unstable') ||
      errorString.includes('try later') ||
      errorString.includes('PC plat') ||
      hasErrorObject) {
    return; // Suppress these errors
  }
  originalConsoleError.apply(console, args);
};

// Override console.warn to filter out extension-related warnings
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  const warnString = args.join(' ');
  if (warnString.includes('PC plat') || 
      warnString.includes('chrome-extension') ||
      warnString.includes('hybridaction')) {
    return; // Suppress these warnings
  }
  originalConsoleWarn.apply(console, args);
};

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
