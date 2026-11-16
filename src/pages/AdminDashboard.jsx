import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import apiClient from "../lib/apiClient";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mockUsers, setMockUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms / Modals states
  const [editingProduct, setEditingProduct] = useState(null); // null means not editing/adding
  const [isAdding, setIsAdding] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    origin: "",
    category: "",
    is_organic: true,
    is_active: true,
    image_url: "",
    variants: [{ weight_grams: 250, price: 500, stock_quantity: 50 }],
  });
  const [imagePreview, setImagePreview] = useState("");

  // Check Admin permission
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "admin@example.com")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const userEmail = (user?.email || "").toLowerCase();
  const isAdmin = user && (user.role === "admin" || adminEmails.includes(userEmail));

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [user, authLoading, isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, orderRes] = await Promise.all([
        apiClient.get("/products/"),
        apiClient.get("/products/categories/"),
        apiClient.get("/orders/"),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setOrders(orderRes.data);

      // Load mock users from local storage
      const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
      setMockUsers(users);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  if (authLoading || loading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2.5rem", color: "var(--green-700)", marginBottom: 12 }} />
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  // Overview metrics
  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered" || o.status === "shipped")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  // Handlers for products
  const handleProductFormChange = (field, val) => {
    setProductForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleVariantChange = (idx, field, val) => {
    const updated = [...productForm.variants];
    updated[idx] = { ...updated[idx], [field]: val };
    setProductForm((prev) => ({ ...prev, variants: updated }));
  };

  const addVariantField = () => {
    setProductForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { weight_grams: 250, price: 500, stock_quantity: 50 }],
    }));
  };

  const removeVariantField = (idx) => {
    if (productForm.variants.length <= 1) return;
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const openAddForm = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setImagePreview("");
    setProductForm({
      name: "",
      slug: "",
      description: "",
      origin: "",
      category: categories[0]?.id || "",
      is_organic: true,
      is_active: true,
      image_url: "",
      variants: [{ weight_grams: 250, price: 500, stock_quantity: 50 }],
    });
  };

  const openEditForm = (prod) => {
    setIsAdding(false);
    setEditingProduct(prod);
    setImagePreview(prod.image_url || "");
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      description: prod.description || "",
      origin: prod.origin || "",
      category: prod.category || categories[0]?.id || "",
      is_organic: prod.is_organic,
      is_active: prod.is_active !== false,
      image_url: prod.image_url || "",
      variants: prod.variants?.length
        ? prod.variants.map((v) => ({ weight_grams: v.weight_grams, price: v.price, stock_quantity: v.stock_quantity }))
        : [{ weight_grams: 250, price: 500, stock_quantity: 50 }],
    });
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingProduct(null);
    setImagePreview("");
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        category: parseInt(productForm.category),
        variants: productForm.variants.map((v) => ({
          weight_grams: parseInt(v.weight_grams),
          price: parseFloat(v.price),
          stock_quantity: parseInt(v.stock_quantity),
        })),
      };

      if (isAdding) {
        if (!payload.slug) {
          payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        }
        await apiClient.post("/products/", payload);
      } else {
        await apiClient.put(`/products/${editingProduct.slug}/`, payload);
      }
      closeForm();
      fetchData();
      alert(`Product ${isAdding ? "added" : "updated"} successfully!`);
    } catch (err) {
      console.error(err);
      alert("Error saving product: " + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
    }
  };

  const handleDeleteProduct = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this product? This action is permanent.")) return;
    try {
      await apiClient.delete(`/products/${slug}/`);
      fetchData();
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting product.");
    }
  };

  // Handlers for orders
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient.patch(`/orders/${orderId}/`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      alert("Order status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  // Handlers for mock users (local storage integration)
  const toggleUserRole = (email) => {
    const users = [...mockUsers];
    const idx = users.findIndex((u) => u.email === email);
    if (idx !== -1) {
      users[idx].role = users[idx].role === "admin" ? "authenticated" : "admin";
      localStorage.setItem("mock_users", JSON.stringify(users));
      setMockUsers(users);
      alert(`User role updated for ${email}. Note: If this is you, sign out and sign back in to apply the changes.`);
    }
  };

  const toggleUserConfirmation = (email) => {
    const users = [...mockUsers];
    const idx = users.findIndex((u) => u.email === email);
    if (idx !== -1) {
      users[idx].confirmed = !users[idx].confirmed;
      localStorage.setItem("mock_users", JSON.stringify(users));
      setMockUsers(users);
      alert(`Confirmation status toggled for ${email}.`);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid var(--gold-500)", paddingBottom: 12, marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--green-900)", margin: 0 }}>
          <i className="fa-solid fa-gauge-high" style={{ marginRight: 10, color: "var(--gold-500)" }} /> Administrative Panel
        </h1>
        <button className="btn btn-outline" onClick={fetchData} style={{ padding: "8px 16px", fontSize: ".85rem" }}>
          <i className="fa-solid fa-arrows-rotate" /> Refresh
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Navigation Sidebar */}
        <div style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { id: "overview", label: "Dashboard Overview", icon: "fa-chart-pie" },
            { id: "products", label: "Manage Products", icon: "fa-box" },
            { id: "orders", label: "Manage Orders", icon: "fa-receipt" },
            { id: "users", label: "Manage Users (Mock)", icon: "fa-users" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                closeForm();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 18px",
                border: "none",
                borderRadius: "10px",
                fontSize: ".92rem",
                fontWeight: activeTab === tab.id ? 700 : 500,
                textAlign: "left",
                cursor: "pointer",
                backgroundColor: activeTab === tab.id ? "var(--green-800)" : "transparent",
                color: activeTab === tab.id ? "#ffffff" : "var(--green-900)",
                transition: "all var(--transition)",
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ width: 16 }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Panel Content */}
        <div style={{ flex: "1 1 600px" }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Stats Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "var(--green-50)", color: "var(--green-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                    <i className="fa-solid fa-money-bill-trend-up" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "var(--neutral-600)", fontWeight: 600 }}>TOTAL SALES</p>
                    <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--green-800)" }}>Rs. {totalRevenue.toLocaleString()}</h2>
                  </div>
                </div>

                <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "var(--gold-100)", color: "var(--gold-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                    <i className="fa-solid fa-basket-shopping" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "var(--neutral-600)", fontWeight: 600 }}>TOTAL ORDERS</p>
                    <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--green-800)" }}>{orders.length}</h2>
                  </div>
                </div>

                <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "var(--green-50)", color: "var(--green-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                    <i className="fa-solid fa-receipt" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "var(--neutral-600)", fontWeight: 600 }}>AVG. ORDER VALUE</p>
                    <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--green-800)" }}>Rs. {Math.round(avgOrderValue).toLocaleString()}</h2>
                  </div>
                </div>

                <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "var(--gold-100)", color: "var(--gold-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                    <i className="fa-solid fa-boxes-stacked" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: ".82rem", color: "var(--neutral-600)", fontWeight: 600 }}>PRODUCTS IN STORE</p>
                    <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--green-800)" }}>{products.length}</h2>
                  </div>
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: "1.1rem", borderBottom: "1px solid var(--gold-200)", paddingBottom: 10, marginBottom: 16 }}>
                  Order Fulfilment Status
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {["pending", "paid", "shipped", "delivered", "cancelled"].map((status) => {
                    const count = orders.filter((o) => o.status === status).length;
                    const colors = {
                      pending: { bg: "#fef3c7", text: "#d97706" },
                      paid: { bg: "#dbeafe", text: "#2563eb" },
                      shipped: { bg: "#fae8ff", text: "#c084fc" },
                      delivered: { bg: "#dcfce7", text: "#16a34a" },
                      cancelled: { bg: "#fee2e2", text: "#dc2626" },
                    };
                    return (
                      <div
                        key={status}
                        style={{
                          flex: "1 1 120px",
                          padding: "12px",
                          borderRadius: "8px",
                          backgroundColor: colors[status].bg,
                          color: colors[status].text,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        <div style={{ fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".04em" }}>{status}</div>
                        <div style={{ fontSize: "1.5rem", marginTop: 4 }}>{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === "products" && (
            <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {!editingProduct && !isAdding ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--green-900)" }}>Inventory Directory</h3>
                    <button className="btn btn-primary" onClick={openAddForm}>
                      <i className="fa-solid fa-plus" /> Add New Product
                    </button>
                  </div>

                  <div className="card" style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, fontSize: ".9rem" }}>
                      <thead>
                        <tr style={{ background: "var(--green-50)", borderBottom: "2px solid var(--gold-200)", textAlign: "left" }}>
                          <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Image</th>
                          <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Name</th>
                          <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Category</th>
                          <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Variants</th>
                          <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Status</th>
                          <th style={{ padding: "14px 16px", color: "var(--green-800)", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((prod) => (
                          <tr key={prod.id} style={{ borderBottom: "1px solid var(--neutral-200)" }}>
                            <td style={{ padding: "10px 16px" }}>
                              <img
                                src={prod.image_url || `https://placehold.co/50x50/d8ead9/143d19?text=${encodeURIComponent(prod.name)}`}
                                alt={prod.name}
                                style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid var(--gold-200)" }}
                              />
                            </td>
                            <td style={{ padding: "10px 16px", fontWeight: 600, color: "var(--green-900)" }}>{prod.name}</td>
                            <td style={{ padding: "10px 16px", color: "var(--neutral-700)" }}>{prod.category_name}</td>
                            <td style={{ padding: "10px 16px" }}>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {prod.variants?.map((v) => (
                                  <span key={v.id} style={{ fontSize: ".74rem", background: "var(--gold-100)", border: "1px solid var(--gold-200)", padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap" }}>
                                    {v.weight_grams}g (Rs.{Math.round(v.price)})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                              <span style={{ fontSize: ".76rem", fontWeight: "bold", color: prod.is_active !== false ? "green" : "red" }}>
                                {prod.is_active !== false ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td style={{ padding: "10px 16px", textAlign: "right" }}>
                              <div style={{ display: "inline-flex", gap: 8 }}>
                                <button className="btn btn-ghost" onClick={() => openEditForm(prod)} style={{ padding: "6px 10px" }}>
                                  <i className="fa-regular fa-pen-to-square" /> Edit
                                </button>
                                <button className="btn-danger" onClick={() => handleDeleteProduct(prod.slug)}>
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* Add / Edit Form */
                <div className="card" style={{ padding: 24 }}>
                  <h3 style={{ fontSize: "1.2rem", color: "var(--green-800)", borderBottom: "1px solid var(--gold-200)", paddingBottom: 10, marginBottom: 18 }}>
                    {isAdding ? "Add New Premium Product" : `Edit Product Details: ${editingProduct?.name}`}
                  </h3>

                  <form onSubmit={handleProductSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label className="form-label">Product Name</label>
                        <input
                          className="input"
                          value={productForm.name}
                          onChange={(e) => handleProductFormChange("name", e.target.value)}
                          placeholder="e.g. Premium Kagzi Almonds"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">URL Slug (leave blank to auto-generate)</label>
                        <input
                          className="input"
                          value={productForm.slug}
                          onChange={(e) => handleProductFormChange("slug", e.target.value)}
                          placeholder="e.g. premium-kagzi-almonds"
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label className="form-label">Category</label>
                        <select
                          className="input"
                          value={productForm.category}
                          onChange={(e) => handleProductFormChange("category", e.target.value)}
                          required
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Origin Sourced From</label>
                        <input
                          className="input"
                          value={productForm.origin}
                          onChange={(e) => handleProductFormChange("origin", e.target.value)}
                          placeholder="e.g. Gilgit-Baltistan"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Product Image</label>
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="preview"
                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1.5px solid var(--gold-300)", flexShrink: 0 }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <label
                            htmlFor="product-image-upload"
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "11px 16px", border: "1.5px dashed var(--gold-400)",
                              borderRadius: 10, cursor: "pointer",
                              background: "var(--gold-100)", color: "var(--green-800)",
                              fontWeight: 600, fontSize: ".9rem", transition: "all .18s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold-600)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--gold-400)"}
                          >
                            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "1.2rem", color: "var(--gold-600)" }} />
                            {imagePreview ? "Change Image" : "Upload from Device"}
                          </label>
                          <input
                            id="product-image-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const dataUrl = ev.target.result;
                                setImagePreview(dataUrl);
                                handleProductFormChange("image_url", dataUrl);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <p style={{ fontSize: ".76rem", color: "var(--neutral-600)", marginTop: 6 }}>
                            PNG, JPG, WEBP — recommended 600×600px or larger.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Description</label>
                      <textarea
                        className="input"
                        rows={3}
                        value={productForm.description}
                        onChange={(e) => handleProductFormChange("description", e.target.value)}
                        placeholder="Detail the taste, packaging, health benefits..."
                      />
                    </div>

                    <div style={{ display: "flex", gap: 24, padding: "4px 0" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={productForm.is_organic}
                          onChange={(e) => handleProductFormChange("is_organic", e.target.checked)}
                        />
                        100% Organic certified
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={productForm.is_active}
                          onChange={(e) => handleProductFormChange("is_active", e.target.checked)}
                        />
                        Product Active (visible to customers)
                      </label>
                    </div>

                    {/* Variants list builder */}
                    <div style={{ borderTop: "1px dashed var(--gold-300)", paddingTop: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <h4 style={{ margin: 0, color: "var(--green-900)" }}>Product Variants</h4>
                        <button type="button" className="btn btn-outline" onClick={addVariantField} style={{ padding: "4px 10px", fontSize: ".8rem" }}>
                          <i className="fa-solid fa-plus" /> Add Variant
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {productForm.variants.map((variant, idx) => (
                          <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: ".76rem", color: "var(--neutral-600)" }}>Weight (grams)</label>
                              <input
                                className="input"
                                type="number"
                                value={variant.weight_grams}
                                onChange={(e) => handleVariantChange(idx, "weight_grams", e.target.value)}
                                placeholder="e.g. 250"
                                required
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: ".76rem", color: "var(--neutral-600)" }}>Price (Rs.)</label>
                              <input
                                className="input"
                                type="number"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                                placeholder="e.g. 1200"
                                required
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: ".76rem", color: "var(--neutral-600)" }}>Stock Qty</label>
                              <input
                                className="input"
                                type="number"
                                value={variant.stock_quantity}
                                onChange={(e) => handleVariantChange(idx, "stock_quantity", e.target.value)}
                                placeholder="e.g. 50"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariantField(idx)}
                              disabled={productForm.variants.length <= 1}
                              style={{
                                border: "none",
                                background: "none",
                                color: "#dc2626",
                                fontSize: "1.1rem",
                                padding: "14px 4px 0",
                                cursor: "pointer",
                                opacity: productForm.variants.length <= 1 ? 0.3 : 1,
                              }}
                            >
                              <i className="fa-solid fa-circle-minus" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", borderTop: "1px solid var(--gold-200)", paddingTop: 16, marginTop: 8 }}>
                      <button type="button" className="btn btn-ghost" onClick={closeForm}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="fa-solid fa-save" /> Save Product
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS MANAGER */}
          {activeTab === "orders" && (
            <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--green-900)" }}>Customer Order Logs</h3>

              <div className="card" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800, fontSize: ".9rem" }}>
                  <thead>
                    <tr style={{ background: "var(--green-50)", borderBottom: "2px solid var(--gold-200)", textAlign: "left" }}>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Order Date</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Tracking ID</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Contact</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Items Purchased</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Total Amt</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: "1px solid var(--neutral-200)" }}>
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                          {new Date(ord.created_at).toLocaleDateString("en-PK", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <code style={{ fontSize: ".82rem", background: "var(--neutral-100)", padding: "4px 8px", borderRadius: 6 }}>
                            {ord.tracking_id?.slice(0, 8)}...
                          </code>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: 0, fontWeight: "600", fontSize: ".84rem" }}>{ord.phone}</p>
                          <p style={{ margin: 0, fontSize: ".76rem", color: "var(--neutral-600)", textOverflow: "ellipsis", overflow: "hidden", maxWidth: 160 }} title={ord.shipping_address}>
                            {ord.shipping_address}
                          </p>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {ord.items?.map((item) => (
                              <span key={item.id} style={{ fontSize: ".78rem" }}>
                                {item.product_name} ({item.weight_grams}g) × {item.quantity}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: "bold", color: "var(--green-950)" }}>
                          Rs. {Number(ord.total_amount).toLocaleString()}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <select
                            className="input"
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              fontSize: ".82rem",
                              width: "auto",
                              fontWeight: "bold",
                              borderRadius: 6,
                              backgroundColor:
                                ord.status === "delivered"
                                  ? "#dcfce7"
                                  : ord.status === "cancelled"
                                  ? "#fee2e2"
                                  : ord.status === "pending"
                                  ? "#fef3c7"
                                  : "#dbeafe",
                              color:
                                ord.status === "delivered"
                                  ? "#15803d"
                                  : ord.status === "cancelled"
                                  ? "#b91c1c"
                                  : ord.status === "pending"
                                  ? "#b45309"
                                  : "#1d4ed8",
                              borderColor: "transparent",
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MOCK USERS MANAGER */}
          {activeTab === "users" && (
            <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="alert alert-info" style={{ margin: 0 }}>
                <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }} /> Manage locally registered test accounts. Use these to switch roles, confirm emails, or debug checkout workflows.
              </div>

              <div className="card" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, fontSize: ".9rem" }}>
                  <thead>
                    <tr style={{ background: "var(--green-50)", borderBottom: "2px solid var(--gold-200)", textAlign: "left" }}>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>User ID (UUID)</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Email Address</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>Email Verified</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)" }}>System Role</th>
                      <th style={{ padding: "14px 16px", color: "var(--green-800)", textAlign: "right" }}>Toggle Settings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((mu) => (
                      <tr key={mu.id} style={{ borderBottom: "1px solid var(--neutral-200)" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <code style={{ fontSize: ".8rem" }}>{mu.id}</code>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: "600" }}>{mu.email}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ color: mu.confirmed ? "green" : "red", fontWeight: "bold" }}>
                            {mu.confirmed ? "Confirmed" : "Pending"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: ".76rem", background: mu.role === "admin" ? "var(--accent)" : "var(--neutral-200)", color: mu.role === "admin" ? "var(--green-900)" : "var(--neutral-700)", padding: "3px 8px", borderRadius: 4, fontWeight: "bold" }}>
                            {mu.role === "admin" ? "Admin" : "Customer"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 8 }}>
                            <button className="btn btn-ghost" onClick={() => toggleUserConfirmation(mu.email)} style={{ padding: "5px 8px", fontSize: ".78rem" }}>
                              {mu.confirmed ? "Un-verify" : "Verify Email"}
                            </button>
                            <button className="btn btn-outline" onClick={() => toggleUserRole(mu.email)} style={{ padding: "5px 8px", fontSize: ".78rem" }}>
                              {mu.role === "admin" ? "Make Customer" : "Make Admin"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
