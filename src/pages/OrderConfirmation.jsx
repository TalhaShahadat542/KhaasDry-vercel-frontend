import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const STEPS = [
  { label: "Order Placed",       desc: "We received your order",                  done: true  },
  { label: "Payment Processed",  desc: "Transaction confirmed successfully",       done: true  },
  { label: "Packing & QC",       desc: "Vacuum-sealed, freshness-checked",        done: false },
  { label: "Shipped",            desc: "Courier dispatched with tracking updates", done: false },
  { label: "Delivered",          desc: "Enjoy your premium dry fruits!",          done: false },
];

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const trackingId = params.get("tracking_id");
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="page-narrow" style={{ textAlign: "center" }}>
      {/* Pulsing checkmark */}
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 88, height: 88, borderRadius: "50%",
        background: "linear-gradient(135deg, var(--green-100), var(--green-200))",
        color: "var(--green-700)", fontSize: "2.6rem",
        boxShadow: "0 0 0 0 rgba(20,61,25,.4)",
        animation: "pulse-ring 2s ease-in-out infinite",
        marginBottom: 24,
      }}>
        <i className="fa-solid fa-circle-check" />
      </div>

      <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-800)" }}>Order Placed!</h1>
      <p style={{ color: "var(--green-700)", margin: "8px 0 28px" }}>
        Thank you! Your premium dry fruits are being prepared with care.
      </p>

      {/* Tracking ID card */}
      {trackingId && (
        <div style={{
          background: "var(--green-50)", border: "1px solid var(--green-200)",
          borderRadius: 14, padding: "18px 22px", marginBottom: 32,
          display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%",
        }}>
          <span style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--green-700)" }}>
            Order Tracking ID
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <code style={{
              fontWeight: 700, fontSize: ".95rem", color: "var(--green-900)",
              background: "#fff", padding: "6px 14px", borderRadius: 8,
              border: "1px solid var(--green-200)", letterSpacing: ".04em",
            }}>
              {trackingId}
            </code>
            <button
              onClick={copyId}
              className="btn btn-primary"
              style={{
                padding: "7px 14px", fontWeight: 700, fontSize: ".82rem",
              }}
            >
              {copied ? <><i className="fa-solid fa-check" /> Copied</> : <><i className="fa-regular fa-copy" /> Copy</>}
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="card" style={{ padding: 24, textAlign: "left", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", margin: "0 0 20px" }}>
          Order Status
        </h2>
        <div className="timeline">
          {STEPS.map((step, idx) => (
            <div key={idx} style={{ display: "flex", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                  background: step.done ? "var(--green-500)" : "var(--neutral-300)",
                  boxShadow: step.done ? "0 0 0 3px rgba(45,107,49,.2)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ".7rem", color: "#fff", fontWeight: 700,
                }}>
                  {step.done ? <i className="fa-solid fa-check" style={{ fontSize: ".6rem" }} /> : ""}
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: step.done ? "var(--green-500)" : "var(--neutral-200)", margin: "4px 0 -10px" }} />
                )}
              </div>
              <div style={{ paddingBottom: idx < STEPS.length - 1 ? 16 : 0 }}>
                <p style={{ margin: "0 0 2px", fontWeight: 600, color: step.done ? "var(--neutral-900)" : "var(--neutral-600)", fontSize: ".95rem" }}>
                  {step.label}
                </p>
                <p style={{ margin: 0, fontSize: ".82rem", color: "var(--neutral-600)" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/" className="btn btn-primary" style={{ display: "inline-flex" }}>
        <i className="fa-solid fa-store" style={{ marginRight: 6 }} /> Continue Shopping
      </Link>
    </div>
  );
}
