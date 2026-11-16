import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const lowestPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => Number(v.price)))
    : null;
  const lowestVariant = product.variants?.find((v) => Number(v.price) === lowestPrice);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (lowestVariant) addToCart(product, lowestVariant, 1);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={product.image_url || `https://placehold.co/400x260/d8ead9/143d19?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          style={{ width: "100%", height: 200, objectFit: "cover", transition: "transform .45s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.07)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        {product.is_organic && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: "#143d19", color: "#d4af50",
            fontSize: ".72rem", fontWeight: 700,
            padding: "3px 10px", borderRadius: 999,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <i className="fa-solid fa-leaf" style={{ fontSize: ".65rem" }} /> Organic
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <h3 style={{ fontSize: "1rem", fontFamily: "'Playfair Display', serif", color: "#0d2e12", margin: 0 }}>
          {product.name}
        </h3>
        <p style={{ fontSize: ".8rem", color: "#4a8a4e", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
          <i className="fa-solid fa-location-dot" style={{ fontSize: ".75rem" }} /> {product.origin}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 10 }}>
          {lowestPrice && (
            <span style={{ fontWeight: 700, color: "#0d2e12", fontSize: ".95rem" }}>
              From Rs.&nbsp;{lowestPrice}
            </span>
          )}
          <button
            onClick={handleQuickAdd}
            style={{
              background: "linear-gradient(135deg, #1e5223, #0d2e12)",
              color: "#d4af50", border: "none", borderRadius: 8,
              padding: "6px 13px", fontSize: ".78rem", fontWeight: 700,
              cursor: "pointer", transition: "filter .18s",
              display: "flex", alignItems: "center", gap: 5,
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            <i className="fa-solid fa-cart-plus" /> Add
          </button>
        </div>
      </div>
    </Link>
  );
}
