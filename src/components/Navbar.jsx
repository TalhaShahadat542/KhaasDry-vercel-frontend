import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "admin@example.com")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const userEmail = (user?.email || "").toLowerCase();
  const isAdmin = user && (user.role === "admin" || adminEmails.includes(userEmail));

  const linkStyle = (to) => ({
    display: "flex", alignItems: "center", gap: 7,
    padding: "7px 14px", borderRadius: 8,
    fontSize: ".88rem", fontWeight: isActive(to) ? 700 : 400,
    color: isActive(to) ? "#d4af50" : "rgba(255,255,255,.80)",
    background: isActive(to) ? "rgba(255,255,255,.10)" : "transparent",
    transition: "all .18s", whiteSpace: "nowrap",
  });

  return (
    <nav style={{
      background: "linear-gradient(135deg, #0d2e12 0%, #143d19 60%, #1e5223 100%)",
      boxShadow: "0 4px 24px rgba(0,0,0,.3)",
      position: "sticky", top: 0, zIndex: 100,
      borderBottom: "2px solid rgba(201,168,76,.35)",
    }}>
      {/* ── Main bar ── */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 16px",
        display: "flex", alignItems: "center", height: 64, gap: 6,
      }}>

        {/* Logo — inline SVG */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 10, flexShrink: 0 }}>
          <svg width="120" height="36" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="13" cy="20" rx="11" ry="7" transform="rotate(-30 13 20)" fill="none" stroke="#d4af50" strokeWidth="1.6"/>
            <ellipse cx="13" cy="20" rx="6" ry="3.5" transform="rotate(-30 13 20)" fill="none" stroke="#d4af50" strokeWidth="1"/>
            <line x1="13" y1="13" x2="13" y2="27" stroke="#d4af50" strokeWidth="1" strokeLinecap="round"/>
            <text x="28" y="25" fontFamily="'Playfair Display', Georgia, serif" fontSize="16" fontWeight="700" fill="#d4af50" letterSpacing="0.3">KhaasDry</text>
          </svg>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop-links" style={{ display: "flex", gap: 2, flex: 1, flexWrap: "nowrap", overflow: "hidden" }}>
          {[
            ["/", "fa-store", "Shop"],
            ["/gift-builder", "fa-gift", "Gift Builder"],
            ["/wishlist", "fa-heart", "Wishlist"],
            ["/blog", "fa-book-open", "Blog"],
            ...(isAdmin ? [["/admin", "fa-gauge-high", "Admin Panel"]] : []),
          ].map(([to, icon, label]) => (
            <Link key={to} to={to} style={linkStyle(to)}
              onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.background = "rgba(255,255,255,.07)"; }}
              onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.background = "transparent"; }}
            >
              <i className={`fa-solid ${icon}`} style={{ width: 14, textAlign: "center" }} />
              {label}
            </Link>
          ))}
        </div>

        {/* Spacer pushes auth/cart to the right */}
        <div style={{ flex: 1 }} className="nav-spacer" />

        {/* Cart — always visible */}
        <Link to="/cart" style={{
          position: "relative", display: "flex", alignItems: "center", gap: 6,
          padding: "7px 13px", borderRadius: 8,
          background: "rgba(201,168,76,.15)", border: "1px solid rgba(201,168,76,.4)",
          color: "#d4af50", fontWeight: 600, fontSize: ".88rem", transition: "all .18s", flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,.28)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(201,168,76,.15)"}
        >
          <i className="fa-solid fa-cart-shopping" />
          <span style={{ display: "none" }} className="cart-label">Cart</span>
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -7, right: -7,
              background: "linear-gradient(135deg, #d4af50, #b8962e)", color: "#0d2e12",
              borderRadius: 9999, fontSize: ".65rem", fontWeight: 800,
              minWidth: 19, height: 19, display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #0d2e12",
            }}>{cartCount}</span>
          )}
        </Link>

        {/* Desktop auth section */}
        <div className="nav-desktop-auth" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <>
              <span style={{ fontSize: ".8rem", color: "rgba(255,255,255,.7)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <i className="fa-regular fa-user" style={{ marginRight: 4 }} />{user.email}
              </span>
              <button onClick={signOut} style={{
                background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)",
                color: "rgba(255,255,255,.85)", borderRadius: 8, padding: "7px 13px",
                fontWeight: 600, fontSize: ".84rem", cursor: "pointer", transition: "all .18s",
                display: "flex", alignItems: "center", gap: 6,
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.08)"}
              >
                <i className="fa-solid fa-right-from-bracket" /> Sign out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/login" style={{
                padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: ".88rem",
                color: "rgba(255,255,255,.85)", background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.2)", transition: "all .18s",
                display: "flex", alignItems: "center", gap: 6,
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.08)"}
              >
                <i className="fa-solid fa-right-to-bracket" /> Login
              </Link>
              <Link to="/signup" style={{
                padding: "7px 14px", borderRadius: 8, fontWeight: 700, fontSize: ".88rem",
                background: "linear-gradient(135deg, #d4af50, #b8962e)", color: "#0d2e12",
                transition: "all .18s", display: "flex", alignItems: "center", gap: 6,
              }}
                onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
                onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
              >
                <i className="fa-solid fa-user-plus" /> Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger button — hidden on desktop */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",           /* shown by CSS media query */
            alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: 9,
            background: menuOpen ? "rgba(201,168,76,.2)" : "rgba(255,255,255,.07)",
            border: "1px solid rgba(201,168,76,.35)",
            color: "#d4af50", fontSize: "1.15rem",
            cursor: "pointer", transition: "all .18s", flexShrink: 0, marginLeft: 6,
          }}
          aria-label="Toggle navigation"
        >
          <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
        </button>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {/* Nav links */}
          {[
            ["/", "fa-store", "Shop"],
            ["/gift-builder", "fa-gift", "Gift Builder"],
            ["/wishlist", "fa-heart", "Wishlist"],
            ["/blog", "fa-book-open", "Blog"],
            ...(isAdmin ? [["/admin", "fa-gauge-high", "Admin Panel"]] : []),
          ].map(([to, icon, label]) => (
            <Link key={to} to={to} style={{
              background: isActive(to) ? "rgba(255,255,255,.12)" : "transparent",
              color: isActive(to) ? "#d4af50" : "rgba(255,255,255,.88)",
              fontWeight: isActive(to) ? 700 : 600,
            }}>
              <i className={`fa-solid ${icon}`} style={{ width: 18 }} /> {label}
            </Link>
          ))}

          <hr className="nav-divider" />

          {/* Auth section */}
          <div className="nav-mobile-auth">
            {user ? (
              <>
                <div style={{ padding: "6px 14px", color: "rgba(255,255,255,.6)", fontSize: ".82rem" }}>
                  <i className="fa-regular fa-user" style={{ marginRight: 6 }} />{user.email}
                </div>
                <button onClick={() => { signOut(); setMenuOpen(false); }}
                  style={{ color: "#ef9999" }}
                >
                  <i className="fa-solid fa-right-from-bracket" style={{ width: 18 }} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn-outline">
                  <i className="fa-solid fa-right-to-bracket" style={{ width: 18 }} /> Login
                </Link>
                <Link to="/signup" className="nav-btn-gold">
                  <i className="fa-solid fa-user-plus" style={{ width: 18 }} /> Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
