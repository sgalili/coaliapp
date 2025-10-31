import React from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error for debugging in preview
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
          color: 'white',
          textAlign: 'center',
          padding: 24
        }}>
          <div>
            <h1 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ opacity: 0.8 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
