import React from 'react';

const LoadingIndicator: React.FC = () => (
  <div data-testid="loading-indicator" className="loading-indicator">
    <span className="loading-dot" style={{ animationDelay: '-0.32s' }} />
    <span className="loading-dot" style={{ animationDelay: '-0.16s' }} />
    <span className="loading-dot" style={{ animationDelay: '0s' }} />
  </div>
);

export default LoadingIndicator;
