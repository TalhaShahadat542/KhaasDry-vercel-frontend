import { useState } from "react";
import { Link } from "react-router-dom";

const POSTS = [
  {
    slug: "himalayan-shilajit-benefits",
    category: "Shilajit",
    date: "July 15, 2026",
    readTime: "5 min read",
    icon: "fa-mountain-sun",
    title: "Pure Himalayan Shilajit: Science-backed Health Benefits",
    excerpt: "Discover the miraculous resin collected from Karakoram mountain fissures above 16,000 ft. Learn how Shilajit boosts testosterone, cellular energy (ATP), and acts as a powerful anti-aging adaptogen.",
    tags: ["Shilajit", "Testosterone", "Energy", "Adaptogen"],
    body: `Purified Himalayan Shilajit is a thick, tar-like resin that seeps from high-altitude mountain fissures. 
For thousands of years it has been celebrated in Ayurveda as a Rasayana — a class of rejuvenating tonics.

Modern science has validated several claims: Shilajit is rich in fulvic acid (a powerful antioxidant and 
anti-inflammatory), dibenzo-α-pyrones, and over 84 trace minerals. Studies show it can significantly 
raise testosterone levels in healthy men, improve mitochondrial function, and reduce chronic fatigue.

**How to use:** Dissolve a pea-sized amount (~300–500mg) in warm water or milk. Best taken in the morning on an empty stomach for maximum absorption.`,
  },
  {
    slug: "almonds-vs-walnuts-brain",
    category: "Nutrition Science",
    date: "July 12, 2026",
    readTime: "4 min read",
    icon: "fa-brain",
    title: "Almonds vs. Walnuts: Which Nut Wins for Brain Health?",
    excerpt: "A deep-dive comparison of Vitamin E (almonds) vs. Omega-3 ALA (walnuts). Both are proven brain-boosters — but which one should you prioritise based on your health goals?",
    tags: ["Almonds", "Walnuts", "Brain Health", "Omega-3"],
    body: `Both almonds and walnuts are powerhouses — but they work via different mechanisms.

**Almonds** are one of the richest food sources of Vitamin E (tocopherols), which protect neurons from 
oxidative stress. A handful (~28g) provides 37% of your daily Vitamin E needs. They also deliver magnesium 
and L-carnitine which support neurotransmitter synthesis.

**Walnuts** contain alpha-linolenic acid (ALA), a plant-based Omega-3 that the body converts to DHA — 
the primary structural fat in the brain. The unique folded shape of a walnut isn't coincidence; it almost 
mirrors the wrinkled cortex of the human brain.

**Verdict:** For long-term cognitive protection → almonds. For mood and anti-inflammation → walnuts. Eat both.`,
  },
  {
    slug: "dates-post-workout-energy",
    category: "Sports Nutrition",
    date: "July 8, 2026",
    readTime: "3 min read",
    icon: "fa-dumbbell",
    title: "Dates: The Perfect Natural Pre & Post-Workout Snack",
    excerpt: "Skip the artificial energy gels. Organic Ajwa or Medjool dates restore glycogen at the same speed as glucose — with the bonus of potassium, magnesium, and fibre for athletic recovery.",
    tags: ["Dates", "Recovery", "Natural Energy", "Sports"],
    body: `Dates have a glycaemic index of ~42–62 (varies by variety), which makes them a moderate-GI food — 
fast enough to restore muscle glycogen post-workout, slow enough to avoid an insulin spike pre-workout.

Each 100g of Medjool dates delivers: 277 kcal, 2.5g protein, 75g carbs (mostly glucose + fructose), 
696mg potassium, and 54mg magnesium. The potassium is critical — it prevents cramping and controls 
muscle contraction.

**Practical protocol:** 2–3 dates 30 minutes before training for sustained energy, or 3–4 dates within 
30 minutes post-training with a protein source for optimal glycogen resynthesis.`,
  },
];

export default function Blog() {
  return (
    <div className="page">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", borderBottom: "none", margin: "0 0 10px", color: "var(--green-900)" }}>
          <i className="fa-solid fa-book-open" style={{ marginRight: 10, color: "var(--accent)" }} /> Nutrition Blog
        </h1>
        <p style={{ color: "var(--neutral-700)", fontSize: "1.05rem", maxWidth: 560, margin: "0 auto" }}>
          Evidence-based articles on organic superfoods, premium dry fruits, and traditional Himalayan minerals.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {POSTS.map((post) => (
          <BlogPost key={post.slug} post={post} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: 48, padding: "32px", background: "linear-gradient(135deg, var(--green-800), var(--green-950))", borderRadius: 20, color: "#fff", border: "1px solid var(--gold-400)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-300)", margin: "0 0 10px" }}>
          Ready to try these superfoods?
        </h2>
        <p style={{ color: "rgba(255,255,255,.8)", margin: "0 0 20px" }}>
          All products are freshly sourced, vacuum-sealed, and delivered to your door.
        </p>
        <Link to="/" className="btn btn-gold" style={{ fontWeight: 700, fontSize: "1rem" }}>
          Shop Now <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }} />
        </Link>
      </div>
    </div>
  );
}

function BlogPost({ post }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="card" style={{ padding: "28px 28px", overflow: "visible" }}>
      {/* Meta */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ background: "var(--green-50)", color: "var(--green-800)", padding: "3px 10px", borderRadius: 999, fontSize: ".75rem", fontWeight: 700, border: "1px solid var(--green-200)" }}>
          {post.category}
        </span>
        <span style={{ color: "var(--neutral-600)", fontSize: ".8rem" }}><i className="fa-regular fa-calendar-days" style={{ marginRight: 5 }} /> {post.date}</span>
        <span style={{ color: "var(--neutral-300)", fontSize: ".8rem" }}>•</span>
        <span style={{ color: "var(--neutral-600)", fontSize: ".8rem" }}><i className="fa-regular fa-clock" style={{ marginRight: 5 }} /> {post.readTime}</span>
      </div>

      {/* Title */}
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--green-900)", margin: "0 0 10px", lineHeight: 1.3 }}>
        <i className={`fa-solid ${post.icon}`} style={{ marginRight: 10, color: "var(--accent)" }} />{post.title}
      </h2>

      <p style={{ color: "var(--neutral-800)", lineHeight: 1.7, margin: "0 0 14px" }}>{post.excerpt}</p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {post.tags.map((t) => (
          <span key={t} style={{ background: "var(--neutral-100)", color: "var(--neutral-700)", padding: "2px 8px", borderRadius: 999, fontSize: ".75rem", fontWeight: 500 }}>
            #{t}
          </span>
        ))}
      </div>

      {/* Expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="btn btn-ghost"
        style={{ padding: "6px 12px", fontSize: ".85rem" }}
      >
        {expanded ? "← Show less" : "Read full article →"}
      </button>

      {expanded && (
        <div style={{ marginTop: 18, padding: "18px 0 0", borderTop: "1px dashed var(--gold-300)", color: "var(--neutral-850)", lineHeight: 1.8, fontSize: ".95rem", whiteSpace: "pre-line", animation: "fadeInUp .3s ease" }}>
          {post.body}
        </div>
      )}
    </article>
  );
}
