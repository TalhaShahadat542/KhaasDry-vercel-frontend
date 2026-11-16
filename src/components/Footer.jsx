import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Modals state: null | 'track' | 'shipping' | 'returns' | 'storage' | 'corporate' | 'privacy' | 'terms'
  const [activeModal, setActiveModal] = useState(null);

  // Order Tracker state inside modal
  const [trackNumber, setTrackNumber] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    setErrorMsg("");
    setSubscribed(true);
  };

  const copyPromoCode = () => {
    navigator.clipboard?.writeText("KHAAS10");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackNumber.trim()) return;
    setTrackLoading(true);
    setTrackResult(null);

    // Realistic lookup simulation
    setTimeout(() => {
      setTrackLoading(false);
      const cleanId = trackNumber.trim().toUpperCase();
      setTrackResult({
        orderId: cleanId.startsWith("KD-") ? cleanId : `KD-${cleanId}`,
        courier: "Trax / TCS Express Cold-Air",
        status: "In Transit",
        estimatedDelivery: "Within 24–48 Hours",
        destination: "Customer Address",
        steps: [
          { title: "Harvest Selected & Nitrogen Packed", location: "Gilgit Depot Hub", done: true, time: "Yesterday, 10:30 AM" },
          { title: "Quality Lab Checked & Dispatched", location: "Northern Hub, Gilgit", done: true, time: "Yesterday, 04:15 PM" },
          { title: "Arrived at Regional Distribution Hub", location: "Islamabad Sorting Facility", done: true, time: "Today, 08:20 AM" },
          { title: "Out for Courier Delivery", location: "Local Station", done: false, time: "Expected by 05:00 PM" },
        ],
      });
    }, 600);
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/?category=${categorySlug}`);
    setTimeout(() => {
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <footer className="khaas-footer">
      <div className="khaas-footer-container">

        {/* ── 1. Luxury Trust Guarantees Ribbon ── */}
        <div className="khaas-trust-ribbon">
          <div className="khaas-trust-item">
            <div className="khaas-trust-icon-box">
              <i className="fa-solid fa-truck-fast" />
            </div>
            <div>
              <h4>Express Fresh Delivery</h4>
              <p>Free delivery over Rs.&nbsp;3,500. Temperature-safe nitrogen sealed transit across Pakistan.</p>
            </div>
          </div>

          <div className="khaas-trust-item">
            <div className="khaas-trust-icon-box">
              <i className="fa-solid fa-mountain" />
            </div>
            <div>
              <h4>Himalayan Single-Origin</h4>
              <p>Hand-harvested from high-altitude orchards in Hunza, Gilgit-Baltistan &amp; Kaghan.</p>
            </div>
          </div>

          <div className="khaas-trust-item">
            <div className="khaas-trust-icon-box">
              <i className="fa-solid fa-certificate" />
            </div>
            <div>
              <h4>100% Raw &amp; Certified</h4>
              <p>Zero preservatives, non-irradiated, heavy metal-tested authentic Himalayan Shilajit.</p>
            </div>
          </div>

          <div className="khaas-trust-item">
            <div className="khaas-trust-icon-box">
              <i className="fa-solid fa-gift" />
            </div>
            <div>
              <h4>Royal Bespoke Gifting</h4>
              <p>Artisanal wooden gift boxes, satin ribbons, and handwritten calligraphic cards.</p>
            </div>
          </div>
        </div>

        {/* ── 2. VIP Harvest Club Newsletter ── */}
        <div className="khaas-newsletter-section">
          <div className="khaas-newsletter-card">
            <div className="khaas-newsletter-info">
              <span className="khaas-newsletter-tag">
                <i className="fa-solid fa-crown" style={{ fontSize: ".7rem" }} /> Exclusive Harvest Club
              </span>
              <h3 className="khaas-newsletter-title">
                Experience the <span>Khaas</span> Difference
              </h3>
              <p className="khaas-newsletter-desc">
                Subscribe to receive <strong>10% OFF</strong> your first order, seasonal Karakoram crop announcements, and our traditional Ayurvedic longevity recipe guides.
              </p>
            </div>

            <div className="khaas-newsletter-form-wrap">
              {!subscribed ? (
                <form onSubmit={handleSubscribe}>
                  <div className="khaas-newsletter-form">
                    <input
                      type="email"
                      className="khaas-newsletter-input"
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="khaas-newsletter-btn">
                      <span>Join Club</span>
                      <i className="fa-solid fa-arrow-right" style={{ fontSize: ".8rem" }} />
                    </button>
                  </div>
                  {errorMsg && (
                    <p style={{ color: "#f87171", fontSize: ".8rem", margin: "6px 0 0" }}>{errorMsg}</p>
                  )}
                  <div className="khaas-newsletter-promise">
                    <i className="fa-solid fa-shield-halved" style={{ color: "#d4af50" }} />
                    <span>Pure privacy. Zero spam. Unsubscribe anytime with 1-click.</span>
                  </div>
                </form>
              ) : (
                <div className="khaas-newsletter-success">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <i className="fa-solid fa-circle-check" style={{ color: "#4ade80", fontSize: "1.4rem" }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: ".92rem", color: "#f5e9b8" }}>Welcome to Khaas Club!</div>
                      <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,.8)" }}>Use your 10% coupon at checkout:</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="khaas-promo-badge">KHAAS10</span>
                    <button type="button" onClick={copyPromoCode} className="khaas-copy-btn">
                      {copiedCode ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Main Footer Grid ── */}
        <div className="khaas-footer-main">

          {/* Column 1: Brand & Heritage */}
          <div>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="10" fill="#0d2e12" stroke="#d4af50" strokeWidth="1.5"/>
                <ellipse cx="19" cy="19" rx="13" ry="8" transform="rotate(-32 19 19)" fill="none" stroke="#d4af50" strokeWidth="1.8"/>
                <ellipse cx="19" cy="19" rx="7" ry="4" transform="rotate(-32 19 19)" fill="none" stroke="#d4af50" strokeWidth="1.2" strokeDasharray="2 1.5"/>
                <line x1="19" y1="8" x2="19" y2="30" stroke="#d4af50" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <div>
                <span style={{
                  fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                  fontSize: "1.45rem",
                  fontWeight: 700,
                  color: "#d4af50",
                  letterSpacing: "0.04em",
                  display: "block",
                  lineHeight: 1.1,
                }}>KhaasDry</span>
                <span style={{ fontSize: ".7rem", letterSpacing: "0.2em", color: "#a9ccab", textTransform: "uppercase" }}>
                  Artisanal Harvests
                </span>
              </div>
            </Link>

            <span className="khaas-urdu-slogan">خاص معیار، قدرتی ذائقہ</span>

            <p className="khaas-brand-bio">
              Pakistan's premier purveyor of single-origin mountain dry fruits, wild Karakoram pine nuts, and raw Himalayan Shilajit. Ethically wildcrafted and delivered with royal freshness.
            </p>

            <div className="khaas-origin-tag">
              <i className="fa-solid fa-location-dot" style={{ color: "#d4af50" }} />
              <span>Gilgit-Baltistan • Kaghan Valley • Hunza</span>
            </div>

            <div className="khaas-social-row">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="khaas-social-icon" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="khaas-social-icon" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="khaas-social-icon" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="khaas-social-icon" aria-label="YouTube">
                <i className="fa-brands fa-youtube" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="khaas-social-icon" aria-label="TikTok">
                <i className="fa-brands fa-tiktok" />
              </a>
            </div>
          </div>

          {/* Column 2: Royal Collections */}
          <div>
            <h4 className="khaas-col-title">Royal Collections</h4>
            <ul className="khaas-link-list">
              <li>
                <button type="button" onClick={() => handleCategoryClick("")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Shop All Harvests</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("almonds")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Hunza Mamra Almonds</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("walnuts")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Kaghan Valley Walnuts</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("shilajit")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Pure Himalayan Shilajit</span>
                  <span className="khaas-badge-new">Rare</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("pine-nuts")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Chilgoza (Wild Pine Nuts)</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("dates")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Medjool &amp; Ajwa Dates</span>
                </button>
              </li>
              <li>
                <Link to="/gift-builder" className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Custom Gift Box Builder</span>
                  <span className="khaas-badge-new">Popular</span>
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Saved Wishlist</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Services */}
          <div>
            <h4 className="khaas-col-title">Care &amp; Services</h4>
            <ul className="khaas-link-list">
              <li>
                <button type="button" onClick={() => setActiveModal("track")} className="khaas-footer-link">
                  <i className="fa-solid fa-magnifying-glass khaas-link-arrow" />
                  <span>Track Your Order</span>
                  <span className="khaas-badge-new" style={{ background: "rgba(212,175,80,.25)", color: "#d4af50" }}>Live</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveModal("shipping")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Shipping &amp; Delivery Policy</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveModal("returns")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>7-Day Freshness Guarantee</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveModal("storage")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Dry Fruits Storage Guide</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveModal("corporate")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Corporate &amp; Wedding Favours</span>
                </button>
              </li>
              <li>
                <Link to="/blog" className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Himalayan Longevity Blog</span>
                </Link>
              </li>
              <li>
                <button type="button" onClick={() => setActiveModal("terms")} className="khaas-footer-link">
                  <i className="fa-solid fa-chevron-right khaas-link-arrow" />
                  <span>Quality Lab Certification</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Concierge & Support */}
          <div>
            <h4 className="khaas-col-title">Concierge &amp; Reach Us</h4>

            <div className="khaas-concierge-card">
              <div className="khaas-status-row">
                <span className="khaas-status-badge">
                  <span className="khaas-pulse-dot" /> Concierge Online Now
                </span>
                <span style={{ fontSize: ".72rem", color: "#d4af50" }}>Avg reply: ~5 mins</span>
              </div>
              <a
                href="https://wa.me/923001234567?text=Hello%20KhaasDry%20Concierge,%20I%20would%20like%20assistance%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="khaas-wa-btn"
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.1rem" }} />
                <span>Chat with Concierge</span>
              </a>
            </div>

            <div className="khaas-contact-details">
              <div className="khaas-contact-row">
                <i className="fa-solid fa-phone" />
                <div>
                  <span style={{ display: "block", fontSize: ".75rem", color: "rgba(255,255,255,.5)" }}>Helpline (Mon–Sat, 9AM–9PM)</span>
                  <a href="tel:+923001234567">+92 (300) 123-4567</a>
                </div>
              </div>

              <div className="khaas-contact-row">
                <i className="fa-solid fa-envelope" />
                <div>
                  <span style={{ display: "block", fontSize: ".75rem", color: "rgba(255,255,255,.5)" }}>Inquiries &amp; Bulk Orders</span>
                  <a href="mailto:concierge@khaasdry.com">concierge@khaasdry.com</a>
                </div>
              </div>

              <div className="khaas-contact-row">
                <i className="fa-solid fa-location-dot" />
                <div>
                  <span style={{ display: "block", fontSize: ".75rem", color: "rgba(255,255,255,.5)" }}>Islamabad Flagship Experience</span>
                  <span>Shop 4, Karakoram Arcade, F-7 Markaz, Islamabad</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── 4. Sub-Footer Bar ── */}
        <div className="khaas-footer-bottom">
          <div className="khaas-center-gem">◆</div>

          <div>
            <p className="khaas-copyright">
              © {new Date().getFullYear()} KhaasDry Artisanal Harvests. All rights reserved. Crafted with pure mountain reverence.
            </p>
          </div>

          <div className="khaas-payment-badges">
            <span className="khaas-pay-badge">
              <i className="fa-solid fa-money-bill-wave" /> Cash on Delivery
            </span>
            <span className="khaas-pay-badge">
              <i className="fa-solid fa-mobile-screen" /> JazzCash / Easypaisa
            </span>
            <span className="khaas-pay-badge">
              <i className="fa-regular fa-credit-card" /> Visa &amp; Mastercard
            </span>
            <span className="khaas-pay-badge">
              <i className="fa-solid fa-lock" /> 256-Bit SSL
            </span>
          </div>

          <div className="khaas-bottom-actions">
            <div className="khaas-legal-links">
              <button type="button" onClick={() => setActiveModal("privacy")} className="khaas-legal-btn">
                Privacy Policy
              </button>
              <span style={{ color: "rgba(255,255,255,.2)" }}>•</span>
              <button type="button" onClick={() => setActiveModal("terms")} className="khaas-legal-btn">
                Terms of Service
              </button>
            </div>

            <button type="button" onClick={scrollToTop} className="khaas-back-to-top" aria-label="Back to Top">
              <span>Top</span>
              <i className="fa-solid fa-arrow-up" style={{ fontSize: ".75rem" }} />
            </button>
          </div>
        </div>

      </div>

      {/* ── 5. Interactive Info Modals ── */}
      {activeModal && (
        <div className="khaas-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="khaas-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="khaas-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            {/* Modal: Track Order */}
            {activeModal === "track" && (
              <div>
                <div className="khaas-modal-header">
                  <div className="khaas-modal-icon">
                    <i className="fa-solid fa-truck-ramp-box" />
                  </div>
                  <div>
                    <h3 className="khaas-modal-title">Live Order Tracker</h3>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "#a9ccab" }}>
                      Track cold-air parcel dispatched from Northern Depots
                    </p>
                  </div>
                </div>

                <form onSubmit={handleTrackSubmit}>
                  <p style={{ fontSize: ".88rem", color: "rgba(255,255,255,.8)" }}>
                    Enter your Order ID (e.g., <strong>KD-7412</strong>) or phone number provided at checkout:
                  </p>
                  <div className="khaas-tracker-input-group">
                    <input
                      type="text"
                      className="khaas-tracker-input"
                      placeholder="e.g. KD-7412 or 03001234567"
                      value={trackNumber}
                      onChange={(e) => setTrackNumber(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="khaas-newsletter-btn"
                      disabled={trackLoading}
                      style={{ borderRadius: 10 }}
                    >
                      {trackLoading ? "Locating..." : "Track Parcel"}
                    </button>
                  </div>
                </form>

                {trackResult && (
                  <div style={{ background: "rgba(0,0,0,.35)", borderRadius: 12, padding: 18, marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)", display: "block" }}>Order Reference</span>
                        <strong style={{ color: "#d4af50", fontSize: "1.1rem" }}>{trackResult.orderId}</strong>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)", display: "block" }}>Status</span>
                        <span style={{ color: "#4ade80", fontWeight: 700, fontSize: ".9rem" }}>{trackResult.status}</span>
                      </div>
                    </div>

                    <div className="khaas-tracker-timeline">
                      {trackResult.steps.map((st, i) => (
                        <div key={i} className="khaas-timeline-step">
                          <span className={`khaas-timeline-dot ${st.done ? "" : "pending"}`} />
                          <div style={{ fontWeight: 600, color: st.done ? "#fff" : "rgba(255,255,255,.45)" }}>
                            {st.title}
                          </div>
                          <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,.6)" }}>
                            {st.location} • {st.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal: Shipping Policy */}
            {activeModal === "shipping" && (
              <div>
                <div className="khaas-modal-header">
                  <div className="khaas-modal-icon">
                    <i className="fa-solid fa-dolly" />
                  </div>
                  <div>
                    <h3 className="khaas-modal-title">Shipping &amp; Delivery Policy</h3>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "#a9ccab" }}>
                      Safe, sealed &amp; pristine mountain harvests nationwide
                    </p>
                  </div>
                </div>
                <div className="khaas-modal-content">
                  <h5>Delivery Timelines</h5>
                  <ul>
                    <li><strong>Islamabad &amp; Rawalpindi:</strong> 24 to 36 hours.</li>
                    <li><strong>Lahore, Karachi, Peshawar, Faisalabad:</strong> 2 to 3 business days.</li>
                    <li><strong>Other Cities &amp; Remote Regions:</strong> 3 to 5 business days via TCS &amp; Trax Express.</li>
                  </ul>
                  <h5>Shipping Rates &amp; Free Shipping</h5>
                  <ul>
                    <li>Orders <strong>Rs.&nbsp;3,500 and above:</strong> Free Nationwide Shipping.</li>
                    <li>Standard Flat Rate for orders below Rs.&nbsp;3,500: Rs.&nbsp;250 nationwide.</li>
                  </ul>
                  <h5>Nitrogen-Flushed Vacuum Packaging</h5>
                  <p>
                    All dry fruits, nuts, and Shilajit are hermetically sealed in oxygen-deprived food-grade pouches or airtight gold tins. This preserves the natural crunch, healthy oils, and delicate aroma for up to 12 months.
                  </p>
                </div>
              </div>
            )}

            {/* Modal: Returns & Guarantee */}
            {activeModal === "returns" && (
              <div>
                <div className="khaas-modal-header">
                  <div className="khaas-modal-icon">
                    <i className="fa-solid fa-handshake-angle" />
                  </div>
                  <div>
                    <h3 className="khaas-modal-title">7-Day Freshness Guarantee</h3>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "#a9ccab" }}>
                      100% Satisfaction or Immediate Replacement / Refund
                    </p>
                  </div>
                </div>
                <div className="khaas-modal-content">
                  <p>
                    At KhaasDry, we stand behind the immaculate taste, texture, and origin of every harvest batch. If you are not delighted with your purchase:
                  </p>
                  <h5>Our No-Hassle Guarantee:</h5>
                  <ul>
                    <li><strong>7-Day Claim Window:</strong> Notify our WhatsApp Concierge within 7 days of package delivery.</li>
                    <li><strong>Taste &amp; Purity Assurance:</strong> If nuts are bitter, damp, or not matching specifications, we dispatch a fresh batch free of cost.</li>
                    <li><strong>Direct Refunds:</strong> Refunds processed directly to your JazzCash, Easypaisa, or Bank Account within 24–48 hours.</li>
                  </ul>
                  <p>
                    WhatsApp us directly at <strong>+92 (300) 123-4567</strong> with your Order ID and photo of the issue.
                  </p>
                </div>
              </div>
            )}

            {/* Modal: Storage Guide */}
            {activeModal === "storage" && (
              <div>
                <div className="khaas-modal-header">
                  <div className="khaas-modal-icon">
                    <i className="fa-solid fa-jar" />
                  </div>
                  <div>
                    <h3 className="khaas-modal-title">Dry Fruits Storage &amp; Longevity Guide</h3>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "#a9ccab" }}>
                      Keep natural oils, nutrients, and crunch at peak quality
                    </p>
                  </div>
                </div>
                <div className="khaas-modal-content">
                  <h5>Hunza Almonds &amp; Walnuts</h5>
                  <p>
                    Walnut and almond kernels contain healthy unsaturated fats. Keep them in an airtight glass jar in a cool pantry or refrigerator (below 15°C) to prevent natural oil oxidation.
                  </p>
                  <h5>Pure Himalayan Shilajit</h5>
                  <p>
                    Store your Shilajit jar at room temperature. In cold temperatures, it hardens into glass-like resin; in warmer weather, it softens into a rich honey-like paste. Both states are 100% natural and effective.
                  </p>
                  <h5>Chilgoza (Pine Nuts)</h5>
                  <p>
                    Wild pine nuts have very delicate fats. If consuming over 2 weeks, store in the freezer inside an airtight ziplock or glass container. They can be enjoyed directly from cold!
                  </p>
                </div>
              </div>
            )}

            {/* Modal: Corporate Gifting */}
            {activeModal === "corporate" && (
              <div>
                <div className="khaas-modal-header">
                  <div className="khaas-modal-icon">
                    <i className="fa-solid fa-gifts" />
                  </div>
                  <div>
                    <h3 className="khaas-modal-title">Corporate &amp; Wedding Gifting</h3>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "#a9ccab" }}>
                      Bespoke VIP luxury boxes customized with your crest
                    </p>
                  </div>
                </div>
                <div className="khaas-modal-content">
                  <p>
                    Make a distinguished, enduring impression. KhaasDry crafts artisanal wooden dry fruit caskets, velvet-lined gift hampers, and custom engraved brass boxes for corporate celebrations, Eid hampers, and royal weddings.
                  </p>
                  <h5>Customization Options:</h5>
                  <ul>
                    <li>Custom laser-engraved company logos or couple monogram.</li>
                    <li>Selection of premium combinations (Mamra Almonds, Kaghan Walnuts, Roasted Pistachios, Wild Shilajit &amp; Kashmiri Saffron).</li>
                    <li>Tiered wholesale pricing starting from 15 boxes.</li>
                    <li>Individual drop-shipping directly to clients across Pakistan.</li>
                  </ul>
                  <div style={{ marginTop: 20 }}>
                    <a
                      href="https://wa.me/923001234567?text=Hi%20KhaasDry,%20I%20am%20interested%20in%20Corporate/Wedding%20gifting%20boxes."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="khaas-wa-btn"
                    >
                      <i className="fa-brands fa-whatsapp" />
                      <span>Request Gifting Catalog &amp; Quote</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Privacy Policy */}
            {activeModal === "privacy" && (
              <div>
                <div className="khaas-modal-header">
                  <div className="khaas-modal-icon">
                    <i className="fa-solid fa-user-shield" />
                  </div>
                  <div>
                    <h3 className="khaas-modal-title">Privacy &amp; Data Security</h3>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "#a9ccab" }}>
                      Your trust is our paramount commitment
                    </p>
                  </div>
                </div>
                <div className="khaas-modal-content">
                  <p>
                    At KhaasDry, we hold your personal information in strict confidence. We collect only what is strictly necessary to process your harvest order, fulfill delivery, and provide customer support.
                  </p>
                  <h5>Data Practices:</h5>
                  <ul>
                    <li>We never sell, rent, or trade your contact info or purchase history.</li>
                    <li>Payment credentials are processed via PCI-DSS compliant gateways with 256-bit SSL encryption.</li>
                    <li>You can request complete erasure of your customer record at any time.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal: Terms & Quality Certification */}
            {activeModal === "terms" && (
              <div>
                <div className="khaas-modal-header">
                  <div className="khaas-modal-icon">
                    <i className="fa-solid fa-file-contract" />
                  </div>
                  <div>
                    <h3 className="khaas-modal-title">Terms &amp; Lab Quality Certification</h3>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "#a9ccab" }}>
                      Certified authenticity from Karakoram highlands
                    </p>
                  </div>
                </div>
                <div className="khaas-modal-content">
                  <p>
                    Every batch of KhaasDry products undergoes laboratory testing for moisture content, aflatoxin limits, microbial safety, and heavy metals (specifically for Shilajit resin).
                  </p>
                  <h5>Authenticity Terms:</h5>
                  <ul>
                    <li>100% wild harvested or certified organic smallholder farms.</li>
                    <li>All weights listed represent net weight excluding packaging.</li>
                    <li>Orders placed are confirmed via SMS/WhatsApp before final courier dispatch.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </footer>
  );
}
