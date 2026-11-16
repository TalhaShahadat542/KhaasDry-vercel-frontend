import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../contexts/CartContext.jsx";
import apiClient from "../lib/apiClient.js";

export default function GiftBuilder() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gift Box configuration
  const [selectedBox, setSelectedBox] = useState({
    id: "royal-velvet",
    name: "Royal Velvet Box",
    price: 500,
    color: "#143d19",
  });
  const [selectedItems, setSelectedItems] = useState([]); // Array of variants
  const [ribbonMessage, setRibbonMessage] = useState("");

  const boxOptions = [
    { id: "royal-velvet", name: "Royal Velvet Box", price: 500, color: "#143d19", desc: "A luxurious velvet finish box in brand forest green" },
    { id: "rustic-wooden", name: "Rustic Wooden Chest", price: 800, color: "#7c2d12", desc: "A handmade, antique style wooden box" },
    { id: "gold-classic", name: "Premium Gold Box", price: 300, color: "#c9a84c", desc: "Sleek, textured gold cardboard box" },
  ];

  useEffect(() => {
    apiClient
      .get("/products/")
      .then((res) => {
        const allVariants = [];
        res.data?.forEach((prod) => {
          prod.variants?.forEach((v) => {
            allVariants.push({
              ...v,
              productName: prod.name,
              image_url: prod.image_url,
            });
          });
        });
        setProducts(allVariants);
      })
      .catch((err) => console.error("Error loading gift builder products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectItem = (variant) => {
    if (selectedItems.find((item) => item.id === variant.id)) {
      setSelectedItems((prev) => prev.filter((item) => item.id !== variant.id));
    } else {
      if (selectedItems.length >= 4) {
        alert("You can add a maximum of 4 items to a single gift box.");
        return;
      }
      setSelectedItems((prev) => [...prev, variant]);
    }
  };

  const calculateTotal = () => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
    return selectedBox.price + itemsTotal;
  };

  const handleAddBoxToCart = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least 1 item to pack into the gift box.");
      return;
    }

    const total = calculateTotal();
    const contentsDesc = selectedItems.map((item) => `${item.productName} (${item.weight_grams}g)`).join(", ");
    
    const giftProduct = {
      id: "giftbox-" + Date.now(),
      name: `Custom Gift Box (${selectedBox.name})`,
      image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
    };

    const giftVariant = {
      id: "giftvariant-" + Date.now(),
      weight_grams: selectedItems.reduce((sum, item) => sum + item.weight_grams, 0),
      price: total,
      stock_quantity: 99,
      description: `Box Style: ${selectedBox.name}. Contents: ${contentsDesc}. Ribbon: "${ribbonMessage || "None"}"`,
    };

    addToCart(giftProduct, giftVariant, 1);
    alert("Your custom Gift Box has been successfully added to your cart!");
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "60px 20px" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2.5rem", color: "var(--green-700)", marginBottom: 12 }} />
        <p>Loading premium ingredients...</p>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: "950px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ color: "var(--green-800)", margin: "0 0 8px 0" }}>
          <i className="fa-solid fa-gift" style={{ marginRight: 10 }} /> Interactive Gift Box Builder
        </h1>
        <p style={{ color: "var(--neutral-700)", fontSize: "16px", margin: 0 }}>
          Create a personalized dry fruit assortment chest for your loved ones in 3 easy steps.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
        {/* Left Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Step 1: Select Box */}
          <div className="card" style={{ padding: "20px" }}>
            <h2 style={{ color: "var(--green-800)", fontSize: "18px", margin: "0 0 16px 0", fontFamily: "var(--font-serif)" }}>
              Step 1: Choose Box Style
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {boxOptions.map((box) => (
                <div
                  key={box.id}
                  onClick={() => setSelectedBox(box)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    border: selectedBox.id === box.id ? "2px solid var(--green-700)" : "1px solid var(--neutral-200)",
                    backgroundColor: selectedBox.id === box.id ? "var(--green-50)" : "#ffffff",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "var(--green-900)" }}>
                      <span style={{ color: box.color, marginRight: "8px" }}><i className="fa-solid fa-square" /></span>
                      {box.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "var(--neutral-600)" }}>{box.desc}</p>
                  </div>
                  <span style={{ fontWeight: "bold", color: "var(--green-800)" }}>Rs. {box.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Select Items */}
          <div className="card" style={{ padding: "20px" }}>
            <h2 style={{ color: "var(--green-800)", fontSize: "18px", margin: "0 0 4px 0", fontFamily: "var(--font-serif)" }}>
              Step 2: Pack Ingredients
            </h2>
            <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "var(--neutral-600)" }}>
              Choose 1 to 4 items to fill the box (Selected: {selectedItems.length}/4)
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {products.map((item) => {
                const isSelected = selectedItems.find((si) => si.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                      border: isSelected ? "2px solid var(--green-700)" : "1px solid var(--neutral-200)",
                      backgroundColor: isSelected ? "var(--green-50)" : "#ffffff",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <img
                      src={item.image_url || `https://placehold.co/50x50/d8ead9/143d19?text=${encodeURIComponent(item.productName)}`}
                      alt={item.productName}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <h4 style={{ margin: "0 0 2px 0", fontSize: "13px", color: "var(--green-900)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {item.productName}
                      </h4>
                      <p style={{ margin: 0, fontSize: "11px", color: "var(--neutral-600)" }}>
                        {item.weight_grams}g — Rs. {item.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Ribbon message */}
          <div className="card" style={{ padding: "20px" }}>
            <h2 style={{ color: "var(--green-800)", fontSize: "18px", margin: "0 0 12px 0", fontFamily: "var(--font-serif)" }}>
              Step 3: Customize Ribbon Message (Optional)
            </h2>
            <div style={{ position: "relative" }}>
              <i className="fa-solid fa-ribbon" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--accent)" }} />
              <input
                type="text"
                placeholder="e.g. Wishing you a healthy year ahead!"
                value={ribbonMessage}
                onChange={(e) => setRibbonMessage(e.target.value)}
                style={{ width: "100%", padding: "11px 11px 11px 36px", borderRadius: "8px", border: "1.5px solid var(--neutral-250)", boxSizing: "border-box", outline: "none" }}
              />
            </div>
          </div>

        </div>

        {/* Right Preview */}
        <div style={{ position: "sticky", top: "86px", height: "fit-content", backgroundColor: "var(--green-800)", color: "#ffffff", padding: "24px", borderRadius: "20px", boxShadow: "var(--shadow-lg)", border: "2px solid var(--gold-400)" }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.2)", paddingBottom: "10px", color: "var(--gold-300)", fontFamily: "var(--font-serif)" }}>
            <i className="fa-solid fa-box-open" style={{ marginRight: 8 }} /> Gift Chest Preview
          </h2>

          {/* Visual Box Chest rendering */}
          <div style={{ height: "160px", backgroundColor: selectedBox.color, border: "6px solid var(--gold-600)", borderRadius: "12px", display: "flex", flexWrap: "wrap", padding: "12px", gap: "8px", boxSizing: "border-box", position: "relative", marginBottom: "20px", boxShadow: "inset 0 4px 8px rgba(0,0,0,0.5)" }}>
            {selectedItems.length === 0 ? (
              <p style={{ margin: "auto", color: "var(--gold-200)", fontSize: "14px", opacity: 0.8, textAlign: "center" }}>
                Select items to pack inside your box
              </p>
            ) : (
              selectedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    flex: "1 1 calc(50% - 8px)",
                    height: "calc(50% - 4px)",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    border: "1px dashed rgba(255, 255, 255, 0.5)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "var(--gold-100)",
                    boxSizing: "border-box",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  {item.productName} ({item.weight_grams}g)
                </div>
              ))
            )}
            {ribbonMessage && (
              <div style={{ position: "absolute", bottom: "-10px", left: "10%", right: "10%", backgroundColor: "#dc2626", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}>
                <i className="fa-solid fa-ribbon" style={{ marginRight: 5 }} /> "{ribbonMessage}"
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span>Base Box ({selectedBox.name})</span>
              <span>Rs. {selectedBox.price}</span>
            </div>
            {selectedItems.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", opacity: 0.9 }}>
                <span>+ {item.productName} ({item.weight_grams}g)</span>
                <span>Rs. {item.price}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "12px", marginTop: "8px", color: "var(--gold-300)" }}>
              <span>Grand Total</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
          </div>

          <button
            onClick={handleAddBoxToCart}
            className="btn btn-gold btn-full"
            style={{ padding: "14px", fontSize: "16px", fontWeight: "bold" }}
          >
            Add Gift Box to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
