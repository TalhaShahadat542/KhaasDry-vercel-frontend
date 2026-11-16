import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";

export default function ResetPassword() {
  const { passwordRecovery, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState(null);
  const [done,     setDone]     = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => navigate("/login"), 2500);
  };

  const card = {
    maxWidth: 420, width: "100%",
    background: "var(--surface)", backdropFilter: "blur(12px)",
    borderRadius: 20,
    boxShadow: "var(--shadow-lg)",
    padding: "40px 36px", textAlign: "center",
    animation: "fadeInUp .4s ease both",
  };

  if (done) {
    return (
      <div style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...card, border: "1px solid #bbf7d0" }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: "3.2rem", color: "var(--green-500)", marginBottom: 16 }} />
          <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-600)" }}>Password updated!</h1>
          <p style={{ color: "var(--green-700)", margin: "12px 0 0" }}>You will be redirected to login shortly…</p>
        </div>
      </div>
    );
  }

  if (!passwordRecovery) {
    return (
      <div style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...card, border: "1px solid var(--gold-300)" }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "3.2rem", color: "var(--accent)", marginBottom: 16 }} />
          <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-800)" }}>Link not active</h1>
          <p style={{ color: "var(--neutral-600)", margin: "12px 0 20px" }}>
            This page only works when you arrive via the password reset email link. If your link expired, request a new one.
          </p>
          <Link to="/forgot-password" className="btn btn-primary" style={{ display: "inline-flex" }}>
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ ...card, border: "1px solid var(--gold-300)", textAlign: "left" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/logo.png" alt="KhaasDry Logo" style={{ height: 60, margin: "0 auto 12px" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-800)", margin: "0 0 4px" }}>Set new password</h1>
          <p style={{ color: "var(--neutral-600)", fontSize: ".9rem", margin: 0 }}>Choose a strong password for your account.</p>
        </div>

        {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }} />{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="form-label">New password</label>
            <input id="reset-password" className="input" type="password" placeholder="Min 6 characters"
              minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Confirm password</label>
            <input id="reset-confirm" className="input" type="password" placeholder="Repeat password"
              minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>

          {/* Password strength indicator */}
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4].map((lvl) => {
              const strength = password.length < 6 ? 0 : password.length < 8 ? 1 : password.length < 10 ? 2 : password.match(/[A-Z]/) && password.match(/[0-9]/) ? 4 : 3;
              return (
                <div key={lvl} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: lvl <= strength
                    ? (strength >= 4 ? "var(--green-600)" : strength >= 3 ? "#84cc16" : strength >= 2 ? "var(--accent)" : "#ef4444")
                    : "var(--neutral-200)",
                  transition: "background .3s",
                }} />
              );
            })}
          </div>

          <button
            id="reset-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 4, padding: "13px" }}
          >
            {loading ? <><span className="spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }}></span> Updating…</> : <><i className="fa-solid fa-check" style={{ marginRight: 6 }} /> Update password</>}
          </button>
        </form>
      </div>
    </div>
  );
}