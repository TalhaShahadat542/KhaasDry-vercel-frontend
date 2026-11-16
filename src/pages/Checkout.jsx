import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import apiClient from "../lib/apiClient.js";

const PAYMENT_METHODS = [
  { id: "cod",        icon: "fa-money-bill-wave",       label: "Cash on Delivery", sub: "Pay when delivered" },
  { id: "jazzcash",  icon: "fa-mobile-screen-button",   label: "JazzCash",          sub: "Mobile account" },
  { id: "easypaisa", icon: "fa-wallet",                 label: "Easypaisa",         sub: "Mobile account" },
  { id: "stripe",    icon: "fa-credit-card",            label: "Debit / Credit",    sub: "Visa, MasterCard" },
];

function fmtCard(val) {
  const digits = val.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") || digits;
}
function fmtExpiry(val) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
}

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [phone,   setPhone]   = useState("");
  const [address, setAddress] = useState("");
  const [method,  setMethod]  = useState("cod");

  const [wallet,     setWallet]     = useState("");
  const [cardName,   setCardName]   = useState("");
  const [cardNum,    setCardNum]    = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc,    setCardCvc]    = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?redirect=/checkout", { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Show spinner while auth state is being determined
  if (authLoading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2.5rem", color: "var(--green-700)", marginBottom: 12 }} />
        <p style={{ color: "var(--neutral-700)" }}>Checking session…</p>
      </div>
    );
  }

  // If not logged in (after auth resolves), show a redirect message while the
  // useEffect above fires
  if (!user) {
    return (
      <div className="page-narrow" style={{ textAlign: "center", paddingTop: 60 }}>
        <i className="fa-solid fa-lock" style={{ fontSize: "3rem", color: "var(--green-500)", marginBottom: 16 }} />
        <h2 style={{ fontFamily: "var(--font-serif)" }}>Sign in to continue</h2>
        <p style={{ color: "var(--neutral-600)", marginBottom: 24 }}>You must be logged in to place an order.</p>
        <Link to="/login?redirect=/checkout" className="btn btn-primary" style={{ display: "inline-flex" }}>
          Sign in
        </Link>
      </div>
    );
  }

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return;
    setSubmitting(true); setError(null);

    const payload = {
      shipping_address: address,
      phone,
      payment_method: method,
      // total_amount is re-computed server-side; we send a client value as a
      // hint only — the server will override it with the authoritative figure.
      total_amount: cartTotal,
      items: cartItems.map((i) => ({
        variant: i.variant.id,
        quantity: i.quantity,
        price_at_purchase: i.variant.price,  // server ignores this, recalculates
        // Pass gift box metadata so the server can persist it
        customization_details: i.variant.description
          ? JSON.stringify({
              description: i.variant.description,
              total_price: i.variant.price,
            })
          : null,
      })),
    };

    try {
      await new Promise((r) => setTimeout(r, 1200)); // simulate payment gateway delay
      const { data } = await apiClient.post("/orders/", payload);
      clearCart();
      navigate(`/order-confirmation?tracking_id=${data.tracking_id}`);
    } catch (err) {
      const detail = err.response?.data;
      if (typeof detail === "object" && detail !== null) {
        // Flatten Django REST framework field errors into a readable message
        const msgs = Object.values(detail).flat().join(" ");
        setError(msgs || "Something went wrong. Please try again.");
      } else {
        setError(detail || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <h1 style={{ fontFamily: "var(--font-serif)", borderBottom: "3px solid var(--gold-500)", paddingBottom: 10, marginBottom: 28 }}>
        <i className="fa-solid fa-lock" style={{ marginRight: 10, color: "var(--green-700)" }} /> Secure Checkout
      </h1>

      {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }} />{error}</div>}

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 40 }}>
          <i className="fa-solid fa-basket-shopping" style={{ fontSize: "3rem", color: "var(--green-400)", marginBottom: 16 }} />
          <p style={{ marginBottom: 20 }}>Your cart is empty. Add some products first.</p>
          <Link to="/" className="btn btn-primary" style={{ display: "inline-flex" }}>Browse Products</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
            {/* ─ Left: Shipping + Payment ─────────────────────────── */}
            <div style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Shipping */}
              <div className="card" style={{ padding: 24 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 18px", borderBottom: "1px solid var(--gold-200)", paddingBottom: 10 }}>
                  <i className="fa-solid fa-truck" style={{ marginRight: 8, color: "var(--green-700)" }} /> Shipping Details
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input className="input" type="tel" placeholder="+92 300 1234567"
                      value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div>
                    <label className="form-label">Shipping Address</label>
                    <textarea className="input" placeholder="House #, Street, City, Pakistan"
                      value={address} onChange={(e) => setAddress(e.target.value)}
                      required rows={3} style={{ resize: "vertical" }} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card" style={{ padding: 24 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 18px", borderBottom: "1px solid var(--gold-200)", paddingBottom: 10 }}>
                  <i className="fa-solid fa-credit-card" style={{ marginRight: 8, color: "var(--green-700)" }} /> Payment Method
                </h2>
                <div className="payment-grid" style={{ marginBottom: 18 }}>
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.id}
                      className={`payment-option ${method === m.id ? "active" : ""}`}
                      onClick={() => setMethod(m.id)}
                    >
                      <i className={`fa-solid ${m.icon} pay-icon`} style={{ fontSize: "1.5rem", display: "block", marginBottom: 6 }} />
                      <span className="pay-label">{m.label}</span>
                      <span className="pay-sub" style={{ display: "block", marginTop: 2 }}>{m.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Dynamic payment fields */}
                {method === "cod" && (
                  <div className="alert alert-info" style={{ margin: 0 }}>
                    <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }} /> Pay with cash at your door. No extra charges. Standard nationwide delivery applies.
                  </div>
                )}

                {(method === "jazzcash" || method === "easypaisa") && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <label className="form-label">
                      {method === "jazzcash" ? "JazzCash" : "Easypaisa"} Account Number
                    </label>
                    <input className="input" type="tel" placeholder="03XXXXXXXXX"
                      value={wallet} onChange={(e) => setWallet(e.target.value)} required />
                    <p style={{ fontSize: ".82rem", color: "var(--neutral-600)", margin: 0 }}>
                      You will receive a USSD/OTP push to confirm the payment.
                    </p>
                  </div>
                )}

                {method === "stripe" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <label className="form-label">Cardholder Name</label>
                      <input className="input" placeholder="Name on card"
                        value={cardName} onChange={(e) => setCardName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="form-label">Card Number</label>
                      <input className="input" placeholder="1234 5678 9012 3456"
                        value={cardNum} onChange={(e) => setCardNum(fmtCard(e.target.value))} maxLength={19} required />
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Expiry</label>
                        <input className="input" placeholder="MM/YY"
                          value={cardExpiry} onChange={(e) => setCardExpiry(fmtExpiry(e.target.value))} maxLength={5} required />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">CVC</label>
                        <input className="input" type="password" placeholder="•••"
                          value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g,"").slice(0,4))} required />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={submitting}
                style={{ padding: "15px", fontSize: "1.05rem" }}
              >
                {submitting ? (
                  <><span style={{ display: "inline-block", width: 18, height: 18, border: "2.5px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", marginRight: 8 }} />Processing…</>
                ) : (
                  `Confirm Order — Rs. ${cartTotal.toLocaleString()}`
                )}
              </button>
            </div>

            {/* ─ Right: Order Summary ─────────────────────────────── */}
            <div style={{ flex: "0 1 280px" }}>
              <div className="card" style={{ padding: 22, position: "sticky", top: 80 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", margin: "0 0 16px", borderBottom: "1px solid var(--gold-200)", paddingBottom: 10 }}>
                  Order Summary
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                  {cartItems.map((item) => (
                    <div key={item.variant.id} style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem", gap: 8 }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "var(--green-900)" }}>{item.product.name}</p>
                        <p style={{ margin: 0, color: "var(--neutral-600)", fontSize: ".78rem" }}>{item.variant.weight_grams}g × {item.quantity}</p>
                      </div>
                      <span style={{ fontWeight: 700, color: "var(--green-950)", flexShrink: 0 }}>
                        Rs.&nbsp;{(Number(item.variant.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px dashed var(--gold-200)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem", color: "var(--neutral-700)" }}>
                    <span>Shipping</span><span style={{ color: "var(--green-500)", fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", color: "var(--green-900)" }}>
                    <span>Total</span><span>Rs.&nbsp;{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
