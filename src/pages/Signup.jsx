import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";

export default function Signup() {
  const { signUp, resendConfirmation } = useAuth();
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [resent,    setResent]    = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    const { data, error } = await signUp(email, password);
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data?.user?.identities?.length === 0) {
      setError("That email is already registered. Try logging in instead.");
      return;
    }
    setSubmitted(true);
  };

  const handleResend = async () => {
    await resendConfirmation(email);
    setResent(true);
  };

  const cardStyle = {
    width: "100%", maxWidth: 420,
    background: "var(--surface)", backdropFilter: "blur(12px)",
    borderRadius: 20,
    boxShadow: "var(--shadow-lg)",
    padding: "40px 36px",
    animation: "fadeInUp .4s ease both",
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...cardStyle, border: "1px solid #bbf7d0", textAlign: "center" }}>
          <i className="fa-regular fa-envelope-open" style={{ fontSize: "3.2rem", color: "var(--green-500)", marginBottom: 16 }} />
          <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-600)" }}>Check your inbox</h1>
          <p style={{ color: "var(--green-700)", margin: "12px 0 20px" }}>
            We sent a confirmation link to <strong>{email}</strong>.<br />
            Click it to activate your account, then come back and log in.
          </p>
          <div className="alert alert-info" style={{ textAlign: "left" }}>
            <i className="fa-solid fa-lightbulb" style={{ marginRight: 6 }} /> <strong>Using mock auth?</strong> Open the "✉️ Test Inbox" button at the bottom-right of the screen.
          </div>
          <button
            onClick={handleResend}
            disabled={resent}
            className="btn btn-outline btn-full"
            style={{ marginTop: 12 }}
          >
            {resent ? <><i className="fa-solid fa-check" style={{ marginRight: 6 }} /> Confirmation email resent!</> : <><i className="fa-solid fa-paper-plane" style={{ marginRight: 6 }} /> Resend email</>}
          </button>
          <p style={{ marginTop: 16, fontSize: ".9rem" }}>
            <Link to="/login" style={{ color: "var(--green-800)", fontWeight: 700 }}>← Back to login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ ...cardStyle, border: "1px solid var(--gold-300)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/logo.png" alt="KhaasDry Logo" style={{ height: 60, margin: "0 auto 12px" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-800)", margin: "0 0 4px" }}>Create account</h1>
          <p style={{ color: "var(--neutral-600)", fontSize: ".9rem", margin: 0 }}>Join thousands of health-conscious shoppers</p>
        </div>

        {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }} />{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="form-label">Email address</label>
            <input id="signup-email" className="input" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input id="signup-password" className="input" type="password" placeholder="Min 6 characters"
              minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button
            id="signup-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 4, padding: "13px" }}
          >
            {loading ? <><span className="spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }}></span> Creating account…</> : <><i className="fa-solid fa-user-plus" style={{ marginRight: 6 }} /> Create account</>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: ".9rem", color: "var(--neutral-700)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--green-800)", fontWeight: 700 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}