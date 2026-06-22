import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) { return { error }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "monospace" }}>
          <h2 style={{ color: "red" }}>Something went wrong:</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 16 }}>
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
