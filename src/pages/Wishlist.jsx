import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("dryfruits_wishlist");
    if (saved) {
      try { setWishlist(JSON.parse(saved)); }
      catch (e) { console.error(e); }
    }
  }, []);

  const remove = (id) => {
    const updated = wishlist.filter((p) => p.id !== id);
    setWishlist(updated);
    localStorage.setItem("dryfruits_wishlist", JSON.stringify(updated));
  };

  if (wishlist.length === 0) {
    return (
      <div className="page-narrow" style={{ textAlign: "center" }}>
        <i className="fa-regular fa-heart" style={{ fontSize: "4.5rem", color: "var(--neutral-300)", marginBottom: 16 }} />
        <h1 style={{ fontFamily: "var(--font-serif)" }}>Your wishlist is empty</h1>
        <p style={{ color: "var(--neutral-600)", marginBottom: 28 }}>
          Tap the heart icon on any product page to save your favorites here.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: "inline-flex" }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="section-title">
        My Wishlist ({wishlist.length})
      </h1>
      <div className="product-grid">
        {wishlist.map((product) => {
          const lowestPrice = product.variants?.length
            ? Math.min(...product.variants.map((v) => Number(v.price)))
            : null;
          return (
            <div key={product.id} className="card" style={{ position: "relative" }}>
              {/* Remove */}
              <button
                onClick={() => remove(product.id)}
                style={{
                  position: "absolute", top: 10, right: 10, zIndex: 2,
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(255,255,255,.9)", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#dc2626", fontSize: ".9rem", boxShadow: "0 2px 4px rgba(0,0,0,.15)",
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>

              <Link to={`/products/${product.slug}`} style={{ display: "flex", flexDirection: "column" }}>
                <img
                  src={product.image_url || `https://placehold.co/400x260/d8ead9/143d19?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  style={{ width: "100%", height: 180, objectFit: "cover", transition: "transform .4s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{ padding: "14px 16px" }}>
                  <h3 style={{ margin: "0 0 4px", fontFamily: "var(--font-serif)", color: "var(--green-900)" }}>{product.name}</h3>
                  <p style={{ margin: 0, fontSize: ".8rem", color: "var(--neutral-650)", display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="fa-solid fa-location-dot" /> {product.origin}
                  </p>
                  {lowestPrice && <p style={{ margin: "8px 0 0", fontWeight: 700, color: "var(--green-800)" }}>From Rs. {lowestPrice}</p>}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
