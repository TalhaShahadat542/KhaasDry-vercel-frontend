import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";

export default function AuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // supabase-js reads the confirmation token out of the URL automatically on
    // load and turns it into a session — we just wait for `user` to populate.
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (timedOut && !user) {
    return (
      <div style={{ padding: 16, maxWidth: 360 }}>
        <h1>Confirmation link issue</h1>
        <p>
          This link may have expired or already been used. Try{" "}
          <Link to="/login">logging in</Link>, or sign up again to get a fresh link.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <p>Confirming your email...</p>
    </div>
  );
}