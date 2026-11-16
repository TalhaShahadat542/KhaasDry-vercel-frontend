import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

// Helper to generate a UUID v4 for mock user IDs
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper to create mock JWTs for local backend validation
function createMockJWT(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const encode = (obj) => {
    try {
      return btoa(JSON.stringify(obj))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    } catch (e) {
      return "";
    }
  };
  return `mock.${encode(header)}.${encode(payload)}.signature`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  const isPlaceholder =
    !supabase ||
    !import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL.includes("your-project-ref");

  useEffect(() => {
    if (isPlaceholder || !supabase) {
      // --- Mock Auth Initialization ---
      const checkMockSession = () => {
        const mockSession = localStorage.getItem("mock_session");
        if (mockSession) {
          try {
            const parsed = JSON.parse(mockSession);
            setUser(parsed.user);
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }

        // Process email confirmation/recovery parameters
        const searchParams = new URLSearchParams(window.location.search);
        const type = searchParams.get("type");
        const email = searchParams.get("email");

        if (type === "signup" && email) {
          // Complete email confirmation
          try {
            const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
            const uIndex = users.findIndex((u) => u.email === email);
            if (uIndex !== -1) {
              users[uIndex].confirmed = true;
              localStorage.setItem("mock_users", JSON.stringify(users));

              const userObj = { sub: users[uIndex].id, email: users[uIndex].email, role: "authenticated" };
              const token = createMockJWT(userObj);
              localStorage.setItem(
                "mock_session",
                JSON.stringify({ user: userObj, access_token: token })
              );
              setUser(userObj);
            }
          } catch (e) {
            // ignore
          }
          // Remove query params
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (type === "recovery" && email) {
          setPasswordRecovery(true);
          // Keep active recovery email in memory
          window.activeRecoveryEmail = email;
        }
        setLoading(false);
      };

      checkMockSession();
    } else {
      // --- Real Supabase Initialization ---
      let authSubscription = null;
      try {
        supabase.auth
          .getSession()
          .then(({ data }) => {
            setUser(data?.session?.user ?? null);
          })
          .catch((err) => {
            console.warn("Supabase getSession failed:", err);
            setUser(null);
          })
          .finally(() => {
            setLoading(false);
          });

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
          if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
          if (event === "SIGNED_OUT") setPasswordRecovery(false);
        });
        authSubscription = listener?.subscription;
      } catch (err) {
        console.warn("Supabase onAuthStateChange error:", err);
        setLoading(false);
      }

      return () => {
        try {
          if (authSubscription) {
            authSubscription.unsubscribe();
          }
        } catch (e) {
          // ignore
        }
      };
    }
  }, [isPlaceholder]);

  // Sends a confirmation email or inserts into mock inbox
  const signUp = async (email, password) => {
    if (isPlaceholder) {
      const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
      if (users.find((u) => u.email === email)) {
        return { data: null, error: { message: "User already exists." } };
      }
      const newMockUser = { id: generateUUID(), email, password, confirmed: false };
      users.push(newMockUser);
      localStorage.setItem("mock_users", JSON.stringify(users));

      // Deliver confirmation email to mock inbox
      const emails = JSON.parse(localStorage.getItem("mock_emails") || "[]");
      emails.unshift({
        id: Date.now(),
        to: email,
        subject: "Confirm your signup - Dry Fruits Store",
        link: `${window.location.origin}/auth/callback?type=signup&email=${encodeURIComponent(email)}`,
      });
      localStorage.setItem("mock_emails", JSON.stringify(emails));

      return { data: { user: newMockUser }, error: null };
    }

    return supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signIn = async (email, password) => {
    if (isPlaceholder) {
      const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const matched = users.find((u) => u.email === email);
      if (!matched || matched.password !== password) {
        return { data: null, error: { message: "Invalid login credentials." } };
      }
      if (!matched.confirmed) {
        return { data: null, error: { message: "Please confirm your email first." } };
      }

      const userObj = { sub: matched.id, email: matched.email, role: "authenticated" };
      const token = createMockJWT(userObj);
      localStorage.setItem(
        "mock_session",
        JSON.stringify({ user: userObj, access_token: token })
      );
      setUser(userObj);
      return { data: { user: userObj }, error: null };
    }

    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (isPlaceholder) {
      localStorage.removeItem("mock_session");
      setUser(null);
      setPasswordRecovery(false);
      return { error: null };
    }
    return supabase.auth.signOut();
  };

  const resendConfirmation = async (email) => {
    if (isPlaceholder) {
      const emails = JSON.parse(localStorage.getItem("mock_emails") || "[]");
      emails.unshift({
        id: Date.now(),
        to: email,
        subject: "Confirm your signup - Dry Fruits Store (Resent)",
        link: `${window.location.origin}/auth/callback?type=signup&email=${encodeURIComponent(email)}`,
      });
      localStorage.setItem("mock_emails", JSON.stringify(emails));
      return { error: null };
    }

    return supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const sendPasswordReset = async (email) => {
    if (isPlaceholder) {
      const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
      if (!users.find((u) => u.email === email)) {
        return { error: { message: "Email not found." } };
      }
      const emails = JSON.parse(localStorage.getItem("mock_emails") || "[]");
      emails.unshift({
        id: Date.now(),
        to: email,
        subject: "Reset your password - Dry Fruits Store",
        link: `${window.location.origin}/reset-password?type=recovery&email=${encodeURIComponent(email)}`,
      });
      localStorage.setItem("mock_emails", JSON.stringify(emails));
      return { error: null };
    }

    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const updatePassword = async (newPassword) => {
    if (isPlaceholder) {
      const email = window.activeRecoveryEmail;
      if (!email) {
        return { error: { message: "No active password recovery session found." } };
      }
      const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const uIndex = users.findIndex((u) => u.email === email);
      if (uIndex !== -1) {
        users[uIndex].password = newPassword;
        localStorage.setItem("mock_users", JSON.stringify(users));

        const userObj = { sub: users[uIndex].id, email: users[uIndex].email, role: "authenticated" };
        const token = createMockJWT(userObj);
        localStorage.setItem(
          "mock_session",
          JSON.stringify({ user: userObj, access_token: token })
        );
        setUser(userObj);
        setPasswordRecovery(false);
        window.activeRecoveryEmail = null;
        return { data: { user: userObj }, error: null };
      }
      return { error: { message: "User not found." } };
    }

    return supabase.auth.updateUser({ password: newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        passwordRecovery,
        signUp,
        signIn,
        signOut,
        resendConfirmation,
        sendPasswordReset,
        updatePassword,
      }}
    >
      {children}
      {isPlaceholder && <MockInboxWidget />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// --- Beautiful Floating Glassmorphic Mock Email Inbox ---
function MockInboxWidget() {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const checkEmails = () => {
      const stored = JSON.parse(localStorage.getItem("mock_emails") || "[]");
      setEmails(stored);
    };
    checkEmails();
    const interval = setInterval(checkEmails, 1000);
    return () => clearInterval(interval);
  }, []);

  const clearInbox = () => {
    localStorage.setItem("mock_emails", "[]");
    setEmails([]);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#b45309",
          color: "#fef3c7",
          border: "1px solid #d97706",
          padding: "12px 20px",
          borderRadius: "50px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 9999,
          fontFamily: "inherit",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <span>✉️</span> Test Inbox ({emails.length})
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        width: "360px",
        maxHeight: "450px",
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        backdropFilter: "blur(12px)",
        color: "#f8fafc",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          background: "rgba(15, 23, 42, 0.4)",
        }}
      >
        <span style={{ fontSize: "14px", color: "#fef3c7" }}>✉️ Mock Email Inbox (Test)</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={clearInbox}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "12px",
              padding: 0,
            }}
          >
            Clear
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#f8fafc",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "18px",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div
        style={{
          padding: "12px",
          overflowY: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {emails.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", margin: "40px 0" }}>
            No emails received. Sign up or request password reset to generate mock emails.
          </p>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "13px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ fontWeight: "600", marginBottom: "4px", color: "#e2e8f0" }}>
                To: <span style={{ color: "#fbbf24" }}>{email.to}</span>
              </div>
              <div style={{ color: "#94a3b8", marginBottom: "8px", fontSize: "12px" }}>
                {email.subject}
              </div>
              <a
                href={email.link}
                onClick={() => setOpen(false)}
                style={{
                  display: "inline-block",
                  backgroundColor: "#d97706",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "12px",
                  transition: "background 0.2s",
                }}
              >
                Click Confirmation Link
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}