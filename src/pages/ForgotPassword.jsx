import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    const { error } = await sendPasswordReset(email);
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  const cardStyle = {
    width: "100%", maxWidth: 420,
    background: "var(--surface)", backdropFilter: "blur(12px)",
    borderRadius: 20,
    boxShadow: "var(--shadow-lg)",
    padding: "40px 36px",
    animation: "fadeInUp .4s ease both",
  };

  if (sent) {
    return (
      <div style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...cardStyle, border: "1px solid #bbf7d0", textAlign: "center" }}>
          <i className="fa-solid fa-paper-plane" style={{ fontSize: "3.2rem", color: "var(--green-500)", marginBottom: 16 }} />
          <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-600)" }}>Link sent!</h1>
          <p style={{ color: "var(--green-700)", margin: "12px 0 20px" }}>
            If an account exists for <strong>{email}</strong>, we've sent a password reset link.
          </p>
          <div className="alert alert-info" style={{ textAlign: "left" }}>
            <i className="fa-solid fa-lightbulb" style={{ marginRight: 6 }} /> <strong>Using mock auth?</strong> Open the "✉️ Test Inbox" at the bottom-right to get the reset link.
          </div>
          <Link to="/login" className="btn btn-outline btn-full" style={{ marginTop: 16, display: "inline-flex" }}>
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ ...cardStyle, border: "1px solid var(--gold-300)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/logo.png" alt="KhaasDry Logo" style={{ height: 60, margin: "0 auto 12px" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-800)", margin: "0 0 4px" }}>Reset password</h1>
          <p style={{ color: "var(--neutral-600)", fontSize: ".9rem", margin: 0 }}>
            Enter your email and we'll send you a secure reset link.
          </p>
        </div>

        {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }} />{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="form-label">Email address</label>
            <input id="forgot-email" className="input" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button
            id="forgot-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ padding: "13px" }}
          >
            {loading ? <><span className="spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }}></span> Sending…</> : <><i className="fa-regular fa-paper-plane" style={{ marginRight: 6 }} /> Send reset link</>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: ".9rem", color: "var(--neutral-700)" }}>
          <Link to="/login" style={{ color: "var(--green-800)", fontWeight: 700 }}>← Back to login</Link>
        </p>
      </div>
    </div>
  );
}