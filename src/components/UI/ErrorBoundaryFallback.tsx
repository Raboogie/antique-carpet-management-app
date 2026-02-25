import React from 'react';

// Props for the fallback component provided by react-error-boundary
import { FallbackProps } from 'react-error-boundary';
import '../../Css/UI/ErrorBoundaryFallback.css';

/**
 * A full-page error fallback. Useful for the Root boundary or page-level boundaries.
 */
export const FullPageErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="full-page-error-container">
      <h2>Oops! Something went wrong.</h2>
      <p className="full-page-error-message">
        We're sorry, but an unexpected error occurred.
      </p>
      {/* Optionally display the error message in development/staging, but maybe hide in prod */}
      <pre className="full-page-error-details">
        {error instanceof Error ? error.message : String(error)}
      </pre>
      <button 
        onClick={resetErrorBoundary}
        className="full-page-error-retry-btn"
      >
        Try Again
      </button>
    </div>
  );
};

/**
 * A smaller widget-level error fallback. Useful for specific components like forms or image grids.
 */
export const WidgetErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="widget-error-container">
      <h4>Component Error</h4>
      <p className="widget-error-message">
        {error instanceof Error ? error.message : String(error)}
      </p>
      <button 
        onClick={resetErrorBoundary}
        className="widget-error-retry-btn"
      >
        Retry
      </button>
    </div>
  );
};
