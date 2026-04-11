import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children:  ReactNode;
  /** Optional custom fallback. Defaults to a full-screen error card. */
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, send to your error tracking service (Sentry, etc.)
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[#131313] flex items-center justify-center p-8">
          <div className="glass-card rounded-3xl border border-[#4c4450]/20 p-10 max-w-md w-full text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[#ffb4ab]" style={{ fontSize: 26 }}>
                error
              </span>
            </div>
            <div>
              <h2 className="font-headline text-xl font-extrabold text-white tracking-tight mb-1">
                Something went wrong
              </h2>
              <p className="text-sm text-[#988d9c]">
                An unexpected error occurred. Try refreshing the page.
              </p>
              {import.meta.env.DEV && (
                <pre className="mt-4 text-left text-[10px] text-[#ffb4ab]/70 bg-[#1a1a1a] rounded-xl p-3 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-[#d394ff] text-[#5e2388] font-bold text-sm hover:bg-[#e0a8ff] transition-all"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
