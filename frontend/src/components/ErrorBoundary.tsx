// app/components/ErrorBoundary.tsx

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            We're sorry — an unexpected error occurred.
          </p>
          <Button onClick={this.handleReload}>Reload Page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
