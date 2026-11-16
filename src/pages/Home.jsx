import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import apiClient from "../lib/apiClient";
import ProductCard from "../components/ProductCard.jsx";

const FEATURES = [
  { icon: "fa-leaf",        title: "100% Organic",    desc: "Certified, traceable, pesticide-free batches" },
  { icon: "fa-mountain",    title: "Source Direct",    desc: "From Gilgit, Kashmir & California farms" },
  { icon: "fa-box-archive", title: "Fresh Sealed",     desc: "Nitrogen-flushed vacuum packs for max freshness" },
  { icon: "fa-truck-fast",  title: "Fast Delivery",    desc: "Nationwide delivery within 3–5 working days" },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat !== null) {
      setCategory(urlCat);
    }
  }, [searchParams]);
  const [categories, setCategories] = useState([
    { name: "All",       slug: "" },
    { name: "Almonds",   slug: "almonds" },
    { name: "Walnuts",   slug: "walnuts" },
    { name: "Shilajit",  slug: "shilajit" },
    { name: "Pine Nuts", slug: "pine-nuts" },
    { name: "Dates",     slug: "dates" },
  ]);

  useEffect(() => {
    apiClient
      .get("/products/categories/")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCategories([{ name: "All", slug: "" }, ...res.data]);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search)   params.set("search",   search);
    apiClient
      .get(`/products/?${params}`)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="hero" style={{ margin: "20px 20px 0", borderRadius: 24, overflow: "hidden", position: "relative" }}>

        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/videos/hero-bg.mp4"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: 0.85,
          }}
        />

        {/* Semi-transparent dark overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, rgba(7, 26, 9, 0.6) 0%, rgba(7, 26, 9, 0.85) 100%)",
          zIndex: 1,
        }} />

        {/* Floating ambient particles */}
        {[
          { size: 6,  top: "12%", left: "8%",  delay: "0s",    dur: "6s"  },
          { size: 4,  top: "70%", left: "5%",  delay: "1.2s",  dur: "8s"  },
          { size: 8,  top: "20%", left: "88%", delay: "0.4s",  dur: "7s"  },
          { size: 5,  top: "60%", left: "92%", delay: "2s",    dur: "5.5s"},
          { size: 3,  top: "40%", left: "15%", delay: "0.8s",  dur: "9s"  },
          { size: 7,  top: "82%", left: "78%", delay: "1.6s",  dur: "6.5s"},
          { size: 4,  top: "30%", left: "50%", delay: "3s",    dur: "7.5s"},
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            width: p.size, height: p.size,
            background: "rgba(212,175,80,.55)",
            top: p.top, left: p.left,
            animation: `heroFloat ${p.dur} ease-in-out ${p.delay} infinite`,
            zIndex: 2, pointerEvents: "none",
          }} />
        ))}

        <style>{`
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0px) scale(1); opacity: .55; }
            50%       { transform: translateY(-18px) scale(1.3); opacity: 1; }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,80,.0); transform: scale(1); }
            50%       { box-shadow: 0 0 40px 16px rgba(212,175,80,.28); transform: scale(1.04); }
          }
          @keyframes heroTextIn {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmerBar {
            0%   { background-position: -300% 0; }
            100% { background-position: 300% 0; }
          }
        `}</style>

        {/* Content wrap above video layer */}
        <div style={{ position: "relative", zIndex: 10 }}>
          {/* Inline SVG logo with glow ring */}
          <div style={{ position: "relative", zIndex: 1, marginBottom: 24, display: "flex", justifyContent: "center" }}>
            <div style={{
              display: "inline-flex", padding: 18, borderRadius: "50%",
              border: "1.5px solid rgba(212,175,80,.35)",
              background: "rgba(0,0,0,.15)",
              backdropFilter: "blur(8px)",
              animation: "glowPulse 3.5s ease-in-out infinite",
            }}>
              <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* outer almond shape */}
                <ellipse cx="34" cy="34" rx="26" ry="16" transform="rotate(-35 34 34)" fill="none" stroke="#d4af50" strokeWidth="2"/>
                {/* inner almond */}
                <ellipse cx="34" cy="34" rx="14" ry="8" transform="rotate(-35 34 34)" fill="none" stroke="#d4af50" strokeWidth="1.4" strokeDasharray="3 2"/>
                {/* stem */}
                <line x1="34" y1="12" x2="34" y2="56" stroke="#d4af50" strokeWidth="1.4" strokeLinecap="round"/>
                {/* cross veins */}
                <line x1="22" y1="27" x2="46" y2="41" stroke="#d4af50" strokeWidth="1" strokeLinecap="round" opacity=".6"/>
                <line x1="22" y1="41" x2="46" y2="27" stroke="#d4af50" strokeWidth="1" strokeLinecap="round" opacity=".6"/>
              </svg>
            </div>
          </div>

          {/* KhaasDry wordmark */}
          <div style={{ position: "relative", zIndex: 1, marginBottom: 8, animation: "heroTextIn .7s ease .1s both" }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(.85rem, 2vw, 1.05rem)",
              letterSpacing: "0.28em", textTransform: "uppercase",
              background: "linear-gradient(90deg, #b8962e 0%, #d4af50 40%, #f5e9b8 60%, #d4af50 80%, #b8962e 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmerBar 3s linear infinite",
              margin: 0,
            }}>✦ KhaasDry ✦</p>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", position: "relative", zIndex: 1, animation: "heroTextIn .7s ease .25s both" }}>
            Premium Dry Fruits, Nuts &amp; Pure Shilajit
          </h1>
          <p style={{ position: "relative", zIndex: 1, animation: "heroTextIn .7s ease .4s both" }}>
            Direct from Gilgit-Baltistan &amp; Kashmir — certified organic, freshly vacuum-sealed, and delivered nationwide.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1, animation: "heroTextIn .7s ease .55s both" }}>
            <Link to="/gift-builder" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "linear-gradient(135deg, #d4af50, #b8962e)", color: "#0d2e12",
              padding: "12px 28px", borderRadius: 12, fontWeight: 700, fontSize: "1rem",
              boxShadow: "0 4px 16px rgba(201,168,76,.45)", transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <i className="fa-solid fa-gift" /> Build a Gift Box
            </Link>
            <a href="#products" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.9)",
              border: "1.5px solid rgba(255,255,255,.3)",
              padding: "12px 28px", borderRadius: 12, fontWeight: 600, fontSize: "1rem",
              transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <i className="fa-solid fa-arrow-down" style={{ animation: "heroFloat 2s ease-in-out infinite" }} /> Browse Products
            </a>
          </div>
        </div>
      </div>

      {/* ── Feature tiles ───────────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16, maxWidth: 1200, margin: "28px auto", padding: "0 20px",
      }}>
        {FEATURES.map((f) => (
          <div key={f.title} className="card" style={{ padding: "20px 16px", textAlign: "center", cursor: "default" }}>
            <i className={`fa-solid ${f.icon}`}
              style={{ fontSize: "1.8rem", color: "#143d19", marginBottom: 10, display: "block" }} />
            <h3 style={{ margin: "0 0 4px" }}>{f.title}</h3>
            <p style={{ fontSize: ".82rem", margin: 0, color: "#4a8a4e" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Products ─────────────────────────────────────────── */}
      <div id="products" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 48px" }}>
        <h2 className="section-title">Our Products</h2>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <i className="fa-solid fa-magnifying-glass" style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              color: "#9a7a1e", fontSize: ".9rem",
            }} />
            <input
              className="input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 280, paddingLeft: 36 }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <button key={c.slug} onClick={() => setCategory(c.slug)} style={{
                padding: "7px 16px", borderRadius: 999, border: "1.5px solid",
                fontSize: ".84rem", fontWeight: 600, cursor: "pointer", transition: "all .18s",
                borderColor: category === c.slug ? "#143d19" : "#c9a84c",
                background:  category === c.slug ? "#143d19" : "transparent",
                color:       category === c.slug ? "#fff"    : "#143d19",
              }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="product-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card" style={{ height: 320 }}>
                <div className="skeleton" style={{ height: 200, borderRadius: "12px 12px 0 0" }} />
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="skeleton" style={{ height: 20, width: "70%" }} />
                  <div className="skeleton" style={{ height: 14, width: "45%" }} />
                  <div className="skeleton" style={{ height: 16, width: "55%", marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a8a4e" }}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: "3rem", marginBottom: 12, display: "block" }} />
            <h3>No products found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p, i) => (
              <div key={p.id} className="fade-in-up" style={{ animationDelay: `${i * .06}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
