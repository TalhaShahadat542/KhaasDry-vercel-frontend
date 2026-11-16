import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) navigate("/login?redirect=/checkout");
    else       navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-narrow" style={{ textAlign: "center", paddingTop: 60 }}>
        <i className="fa-solid fa-basket-shopping" style={{ fontSize: "4rem", color: "var(--green-400)", marginBottom: 16 }} />
        <h1 style={{ fontFamily: "var(--font-serif)" }}>Your cart is empty</h1>
        <p style={{ color: "var(--neutral-600)", marginBottom: 28 }}>
          Fill it with some premium dry fruits and organic shilajit!
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: "inline-flex" }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <h1 style={{ fontFamily: "var(--font-serif)", borderBottom: "3px solid var(--gold-500)", paddingBottom: 10, marginBottom: 28 }}>
        Shopping Cart
      </h1>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Cart Items */}
        <div style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", gap: 14 }}>
          {cartItems.map((item) => (
            <div key={item.variant.id} className="card" style={{
              display: "flex", gap: 16, padding: 16, alignItems: "center",
            }}>
              <img
                src={item.product.image_url || `https://placehold.co/90x90/d8ead9/143d19?text=${encodeURIComponent(item.product.name)}`}
                alt={item.product.name}
                style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid var(--gold-200)", flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 2px", fontSize: "1rem", fontFamily: "var(--font-serif)", color: "var(--green-900)" }}>
                  {item.product.name}
                </h3>
                <p style={{ margin: "0 0 10px", fontSize: ".82rem", color: "var(--neutral-600)" }}>
                  {item.variant.weight_grams}g — Rs.&nbsp;{item.variant.price} each
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="qty-ctrl">
                    <button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="btn-danger" onClick={() => removeFromCart(item.variant.id)}>
                    <i className="fa-solid fa-trash-can" style={{ marginRight: 4 }} /> Remove
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--green-900)", margin: 0 }}>
                  Rs.&nbsp;{(Number(item.variant.price) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Panel */}
        <div style={{ flex: "0 1 280px" }}>
          <div className="card" style={{ padding: 22, position: "sticky", top: 80 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 18px", borderBottom: "1px solid var(--gold-200)", paddingBottom: 10 }}>
              Order Summary
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem", color: "var(--neutral-700)" }}>
                <span>Subtotal</span>
                <span>Rs.&nbsp;{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem", color: "var(--neutral-700)" }}>
                <span>Shipping</span>
                <span style={{ color: "var(--green-500)", fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", color: "var(--green-900)", borderTop: "1px dashed var(--gold-200)", paddingTop: 12 }}>
                <span>Total</span>
                <span>Rs.&nbsp;{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary btn-full" style={{ padding: "13px" }}>
              Proceed to Checkout <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }} />
            </button>
            <Link to="/" style={{ display: "block", textAlign: "center", marginTop: 12, color: "var(--green-700)", fontSize: ".85rem", fontWeight: 600 }}>
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
