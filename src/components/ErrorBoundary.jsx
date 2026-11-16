import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#faf8f5",
          fontFamily: "system-ui, sans-serif",
          color: "#0d2e12",
          textAlign: "center",
        }}>
          <h2 style={{ fontFamily: "serif", fontSize: "1.8rem", marginBottom: 12 }}>
            Something went wrong loading KhaasDry
          </h2>
          <p style={{ maxWidth: 500, color: "#555", marginBottom: 20 }}>
            {this.state.error?.message || "An unexpected error occurred while rendering the page."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#143d19",
              color: "#d4af50",
              border: "none",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

