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
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
          <div className="bg-[#FFFFFF] rounded-3xl border border-border p-10 max-w-md w-full text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[#DC2626]" style={{ fontSize: 26 }}>
                error
              </span>
            </div>
            <div>
              <h2 className="font-headline text-xl font-extrabold text-[#0F172A] tracking-tight mb-1">
                Something went wrong
              </h2>
              <p className="text-sm text-[#64748B]">
                An unexpected error occurred. Try refreshing the page.
              </p>
              {import.meta.env.DEV && (
                <pre className="mt-4 text-left text-[10px] text-red-400 bg-[#FFF1F0] rounded-xl p-3 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-[#111827] text-white font-bold text-sm hover:bg-[#0B1220] transition-all"
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
