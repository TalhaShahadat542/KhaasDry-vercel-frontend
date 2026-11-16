import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import apiClient from "../lib/apiClient";
import { useCart } from "../contexts/CartContext.jsx";

function StarRating({ rating, max = 5, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "inline-flex", gap: 3 }}>
      {[...Array(max)].map((_, i) => {
        const val = i + 1;
        const isActive = val <= (hovered || rating);
        return (
          <i
            key={i}
            onClick={() => onChange && onChange(val)}
            onMouseEnter={() => onChange && setHovered(val)}
            onMouseLeave={() => onChange && setHovered(0)}
            className={`${isActive ? "fa-solid" : "fa-regular"} fa-star`}
            style={{
              fontSize: onChange ? "1.4rem" : "1.1rem",
              cursor: onChange ? "pointer" : "default",
              color: isActive ? "var(--gold-500)" : "var(--neutral-300)",
              transition: "color .15s, transform .1s",
            }}
          />
        );
      })}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct]           = useState(null);
  const [selectedVariant, setVariant]   = useState(null);
  const [added, setAdded]               = useState(false);
  const [favorited, setFavorited]       = useState(false);
  const [reviews, setReviews]           = useState([]);
  const [revName, setRevName]           = useState("");
  const [revRating, setRevRating]       = useState(5);
  const [revText, setRevText]           = useState("");
  const [fetchError, setFetchError]     = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setFetchError(null);
    apiClient.get(`/products/${slug}/`).then((res) => {
      const p = res.data;
      setProduct(p);
      setVariant(p.variants?.[0] ?? null);

      const wl = JSON.parse(localStorage.getItem("dryfruits_wishlist") || "[]");
      setFavorited(wl.some((i) => i.id === p.id));

      const saved = JSON.parse(localStorage.getItem(`dryfruits_reviews_${slug}`) || "[]");
      if (saved.length === 0) {
        const defaults = [
          { name: "Ahmed Khan",   rating: 5, text: "Excellent quality! Very fresh and packaging was top-notch.", date: "July 10, 2026" },
          { name: "Ayesha Malik", rating: 4, text: "Tastier and crunchier than what I buy from local markets.",  date: "July 12, 2026" },
        ];
        setReviews(defaults);
        localStorage.setItem(`dryfruits_reviews_${slug}`, JSON.stringify(defaults));
      } else {
        setReviews(saved);
      }
    }).catch((err) => {
      const status = err?.response?.status;
      if (status === 404) {
        setFetchError("Product not found. It may have been removed or the URL is incorrect.");
      } else {
        setFetchError("Could not load product. Please check your connection and try again.");
      }
    });
  }, [slug]);

  const toggleWishlist = () => {
    if (!product) return;
    const wl = JSON.parse(localStorage.getItem("dryfruits_wishlist") || "[]");
    const updated = favorited ? wl.filter((i) => i.id !== product.id) : [...wl, product];
    localStorage.setItem("dryfruits_wishlist", JSON.stringify(updated));
    setFavorited(!favorited);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShopNow = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, 1);
    navigate("/checkout");
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!revName || !revText) return;
    const newRev = { name: revName, rating: revRating, text: revText, date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem(`dryfruits_reviews_${slug}`, JSON.stringify(updated));
    setRevName(""); setRevText(""); setRevRating(5);
  };

  if (fetchError) {
    return (
      <div className="page" style={{ maxWidth: 780 }}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "3rem", color: "var(--accent)", marginBottom: 16, display: "block" }} />
          <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--green-900)" }}>Oops!</h2>
          <p style={{ color: "var(--neutral-600)" }}>{fetchError}</p>
          <a href="/" className="btn btn-primary" style={{ display: "inline-flex", marginTop: 16 }}>← Back to Shop</a>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page" style={{ maxWidth: 780 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div className="skeleton" style={{ flex: "1 1 300px", height: 360, borderRadius: 16 }} />
          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="skeleton" style={{ height: 32, width: "80%" }} />
            <div className="skeleton" style={{ height: 20, width: "55%" }} />
            <div className="skeleton" style={{ height: 80, width: "100%", marginTop: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 0;

  return (
    <div className="page fade-in-up" style={{ maxWidth: 780 }}>
      {/* Image + Info */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, marginBottom: 36 }}>
        {/* Image */}
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid var(--gold-200)", aspectRatio: "1 / 1" }}>
          <img src={product.image_url || `https://placehold.co/600x600/d8ead9/143d19?text=${encodeURIComponent(product.name)}`}
            alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
            onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          />
          {product.is_organic && (
            <span style={{
              position: "absolute", top: 12, left: 12,
              background: "var(--primary)", color: "var(--accent)",
              fontSize: ".78rem", fontWeight: 700,
              padding: "4px 12px", borderRadius: 999,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <i className="fa-solid fa-leaf" /> Organic
            </span>
          )}
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-900)", margin: 0, lineHeight: 1.2 }}>{product.name}</h1>
            <button onClick={toggleWishlist} style={{
              background: "none", border: "none", fontSize: "1.6rem", cursor: "pointer",
              color: favorited ? "var(--green-700)" : "var(--neutral-300)",
              animation: favorited ? "heartbeat .3s ease" : "none",
              flexShrink: 0, paddingLeft: 8,
            }}>
              <i className={favorited ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
            </button>
          </div>

          {/* Rating summary */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StarRating rating={Math.round(avgRating)} />
            <span style={{ fontSize: ".85rem", color: "var(--green-700)", fontWeight: 600 }}>
              {avgRating.toFixed(1)} / 5 ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>

          <p style={{ fontSize: ".88rem", color: "var(--neutral-700)", margin: 0 }}>
            <strong>Origin:</strong> {product.origin}
          </p>
          <p style={{ color: "var(--neutral-800)", lineHeight: 1.7, margin: 0 }}>{product.description}</p>

          {/* Size selector */}
          <div>
            <p style={{ fontWeight: 700, color: "var(--green-800)", fontSize: ".82rem", marginBottom: 8, letterSpacing: ".04em" }}>SELECT SIZE</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  style={{
                    padding: "9px 16px", borderRadius: 999, border: "2px solid",
                    fontSize: ".84rem", fontWeight: 700, cursor: "pointer",
                    transition: "all .18s",
                    borderColor: v.id === selectedVariant?.id ? "var(--green-700)" : "var(--gold-400)",
                    background:  v.id === selectedVariant?.id ? "var(--green-700)" : "#fff",
                    color:       v.id === selectedVariant?.id ? "#fff"               : "var(--green-800)",
                  }}
                >
                  {v.weight_grams}g — Rs.&nbsp;{v.price}
                </button>
              ))}
            </div>
          </div>

          {selectedVariant && (
            <div style={{ padding: "10px 14px", background: "var(--gold-100)", border: "1px solid var(--gold-200)", borderRadius: 10, fontSize: ".82rem", color: "var(--green-850)" }}>
              {selectedVariant.stock_quantity > 0
                ? <><i className="fa-solid fa-circle-check" style={{ color: "var(--green-600)", marginRight: 6 }} /> In stock — {selectedVariant.stock_quantity} units available</>
                : <><i className="fa-solid fa-circle-xmark" style={{ color: "red", marginRight: 6 }} /> Out of stock</>}
            </div>
          )}

          <button
            className="btn btn-primary"
            disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
            onClick={handleAddToCart}
            style={{ padding: "13px", marginTop: 4, fontSize: "1rem" }}
          >
            {added ? (
              <><i className="fa-solid fa-check" style={{ marginRight: 6 }} /> Added to cart!</>
            ) : selectedVariant?.stock_quantity === 0 ? (
              "Out of stock"
            ) : (
              <><i className="fa-solid fa-cart-shopping" style={{ marginRight: 8 }} /> Add to Cart</>
            )}
          </button>

          {/* Shop Now — add to cart then go straight to checkout */}
          <button
            onClick={handleShopNow}
            disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
            style={{
              width: "100%",
              padding: "13px",
              marginTop: 10,
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "0.03em",
              borderRadius: 12,
              border: "2px solid #d4af50",
              background: selectedVariant?.stock_quantity === 0
                ? "rgba(201,168,76,.1)"
                : "linear-gradient(135deg, #d4af50 0%, #b8962e 100%)",
              color: selectedVariant?.stock_quantity === 0 ? "#b8962e" : "#0d2e12",
              cursor: (!selectedVariant || selectedVariant.stock_quantity === 0) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              boxShadow: "0 4px 18px rgba(201,168,76,.35)",
              transition: "all .2s",
              opacity: (!selectedVariant || selectedVariant.stock_quantity === 0) ? 0.55 : 1,
            }}
            onMouseEnter={e => {
              if (selectedVariant?.stock_quantity > 0) {
                e.currentTarget.style.filter = "brightness(1.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <i className="fa-solid fa-bolt" />
            Shop Now
          </button>
        </div>
      </div>

      {/* ── Reviews ──────────────────────────────────────────── */}
      <div style={{ borderTop: "2px solid var(--gold-200)", paddingTop: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: 20, color: "var(--green-900)" }}>Customer Reviews</h2>

        {/* Write review form */}
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 14px", color: "var(--green-900)" }}>Write a review</h3>
          <form onSubmit={handleReview} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label">Your Name</label>
                <input className="input" placeholder="e.g. Ahmed Khan"
                  value={revName} onChange={(e) => setRevName(e.target.value)} required />
              </div>
              <div style={{ minWidth: 160 }}>
                <label className="form-label">Rating</label>
                <div style={{ paddingTop: 8 }}>
                  <StarRating rating={revRating} onChange={setRevRating} />
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">Review</label>
              <textarea className="input" placeholder="Share your experience with this product…"
                value={revText} onChange={(e) => setRevText(e.target.value)}
                required rows={3} style={{ resize: "vertical" }} />
            </div>
            <div>
              <button type="submit" className="btn btn-outline" style={{ padding: "8px 20px" }}>
                <i className="fa-regular fa-paper-plane" style={{ marginRight: 6 }} /> Submit Review
              </button>
            </div>
          </form>
        </div>

        {/* Reviews list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reviews.map((rev, i) => (
            <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid var(--neutral-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--green-600), var(--green-800))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--gold-200)", flexShrink: 0 }}>
                    {rev.name[0].toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 700, color: "var(--green-900)" }}>{rev.name}</span>
                </div>
                <StarRating rating={rev.rating} />
              </div>
              <p style={{ margin: "0 0 4px", color: "var(--neutral-850)" }}>{rev.text}</p>
              <span style={{ fontSize: ".78rem", color: "var(--neutral-600)" }}>{rev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
