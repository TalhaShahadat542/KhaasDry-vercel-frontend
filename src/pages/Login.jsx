import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const { signIn, resendConfirmation } = useAuth();
  const navigate = useNavigate();
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [error,      setError]      = useState(null);
  const [unconfirmed,setUnconfirmed] = useState(false);
  const [resent,     setResent]     = useState(false);
  const [loading,    setLoading]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setUnconfirmed(false); setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("email not confirmed") || msg.includes("confirm your email")) {
        setUnconfirmed(true);
      } else {
        setError(error.message);
      }
      return;
    }
    const sp = new URLSearchParams(window.location.search);
    navigate(sp.get("redirect") || "/");
  };

  const handleResend = async () => {
    await resendConfirmation(email);
    setResent(true);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "var(--surface)", backdropFilter: "blur(12px)",
        border: "1px solid var(--gold-300)", borderRadius: 20,
        boxShadow: "var(--shadow-lg)",
        padding: "40px 36px",
        animation: "fadeInUp .4s ease both",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/logo.png" alt="KhaasDry Logo" style={{ height: 60, margin: "0 auto 12px" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-800)", margin: "0 0 4px" }}>Welcome back</h1>
          <p style={{ color: "var(--neutral-600)", fontSize: ".9rem", margin: 0 }}>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }} />{error}</div>}

        {unconfirmed && (
          <div className="alert alert-info">
            <strong>Email not confirmed.</strong> Check your inbox for the confirmation link.
            <button
              type="button"
              onClick={handleResend}
              disabled={resent}
              style={{ display: "block", marginTop: 8, background: "none", border: "none", color: "var(--green-800)", fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline" }}
            >
              {resent ? <><i className="fa-solid fa-check" style={{ marginRight: 5 }} /> Resent!</> : "Resend confirmation email"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="form-label">Email address</label>
            <input id="login-email" className="input" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input id="login-password" className="input" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div style={{ textAlign: "right", marginTop: -6 }}>
            <Link to="/forgot-password" style={{ fontSize: ".85rem", color: "var(--green-700)", fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 4, padding: "13px" }}
          >
            {loading ? <><span className="spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }}></span> Signing in…</> : <><i className="fa-solid fa-right-to-bracket" style={{ marginRight: 6 }} /> Sign in</>}
          </button>
        </form>

        <div style={{ marginTop: 16, borderTop: "1px dashed var(--gold-300)", paddingTop: 16, textAlign: "center" }}>
          <button
            type="button"
            className="btn btn-outline btn-full"
            style={{ padding: "8px", fontSize: ".82rem", gap: 6 }}
            onClick={() => {
              const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
              if (!users.find((u) => u.email === "admin@example.com")) {
                users.push({
                  id: "00000000-0000-4000-a000-000000000000",
                  email: "admin@example.com",
                  password: "password123",
                  confirmed: true,
                  role: "admin"
                });
                localStorage.setItem("mock_users", JSON.stringify(users));
              }
              setEmail("admin@example.com");
              setPassword("password123");
            }}
          >
            <i className="fa-solid fa-user-shield" /> Fill Admin Credentials (Debug)
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: ".9rem", color: "var(--neutral-700)" }}>
          No account? <Link to="/signup" style={{ color: "var(--green-800)", fontWeight: 700 }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}