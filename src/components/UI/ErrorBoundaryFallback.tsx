import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import '../../Css/UI/ErrorBoundaryFallback.css';

export const FullPageErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="full-page-error-container">
      <h2>Oops! Something went wrong.</h2>
      <p className="full-page-error-message">
        We're sorry, but an unexpected error occurred.
      </p>
      {/* Hide in prod */}
      {/* <pre className="full-page-error-details">
        {error instanceof Error ? error.message : String(error)}
      </pre> */}
      <button 
        onClick={resetErrorBoundary}
        className="full-page-error-retry-btn"
      >
        Try Again
      </button>
    </div>
  );
};


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
