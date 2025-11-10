"use client";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import ToastContainer, { notify } from "./Toast";
import CarouselFormSection from "./CarouselFormSection";
import CarouselSlidesList from "./CarouselSlidesList";
import { supabaseBrowser } from "../../lib/supabaseClient";

function Toolbar({ children }) {
  return <div className="admin-toolbar">{children}</div>;
}

export default function AdminDashboardClient() {
  const [tab, setTab] = useState("products");

  // Shared state: products, orders, carousel
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loading, setLoading] = useState({ products: false, orders: false, carousel: false });

  // Product form state
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    sku: "",
    inventory: "",
    imageFiles: [],
    imageUrl: "",
    categories: "",
    tags: "",
    seoTitle: "",
    seoDescription: ""
  });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, title: "" });

  // Search/filter
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (p.title || "").toLowerCase().includes(search.toLowerCase()))
      .filter((p) => {
        const price = Number(p.price || 0);
        return price >= priceRange[0] && price <= priceRange[1];
      });
  }, [products, search, priceRange]);

  async function fetchProducts() {
    try {
      setLoading((l) => ({ ...l, products: true }));
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      notify("Failed to load products", "error");
    } finally {
      setLoading((l) => ({ ...l, products: false }));
    }
  }

  async function fetchOrders() {
    try {
      setLoading((l) => ({ ...l, orders: true }));
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      notify("Failed to load orders", "error");
    } finally {
      setLoading((l) => ({ ...l, orders: false }));
    }
  }

  async function fetchCarouselSlides() {
    try {
      setLoading((l) => ({ ...l, carousel: true }));
      const res = await fetch("/api/admin/carousel");
      const data = await res.json();
      setCarouselSlides(Array.isArray(data) ? data : []);
    } catch (e) {
      notify("Failed to load carousel slides", "error");
    } finally {
      setLoading((l) => ({ ...l, carousel: false }));
    }
  }

  // Realtime updates via Supabase if configured
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCarouselSlides();
    let productChannel, orderChannel, carouselChannel;
    try {
      productChannel = supabaseBrowser
        .channel("admin-products")
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => fetchProducts())
        .subscribe();
      orderChannel = supabaseBrowser
        .channel("admin-orders")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
        .subscribe();
      carouselChannel = supabaseBrowser
        .channel("admin-carousel")
        .on("postgres_changes", { event: "*", schema: "public", table: "hero_slides" }, () => fetchCarouselSlides())
        .subscribe();
    } catch {
      // Ignore if realtime not available
    }
    return () => {
      try { supabaseBrowser.removeChannel(productChannel); } catch {}
      try { supabaseBrowser.removeChannel(orderChannel); } catch {}
      try { supabaseBrowser.removeChannel(carouselChannel); } catch {}
    };
  }, []);

  function productPreviewImages() {
    return productForm.imageFiles.map((file) => URL.createObjectURL(file));
  }

  async function addProduct(e) {
    e.preventDefault();
    const price = Number(productForm.price);
    if (!productForm.title || Number.isNaN(price) || price < 0) {
      notify("Please provide a valid title and price", "error");
      return;
    }
    // Persist primary image_url; multiple files need storage integration
    const payload = {
      title: productForm.title,
      price,
      image_url: productForm.imageUrl || "",
      // extra fields kept in audit log for now
    };
    const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      notify("Product added", "success");
      try { await logAudit({ action: "product_add", payload }); } catch {}
      setProductForm((f) => ({ ...f, title: "", price: "", imageUrl: "" }));
      fetchProducts();
    } else {
      const reason = json?.error || (Array.isArray(json?.details) ? json.details.join(", ") : "Failed to add product");
      notify(reason, "error");
    }
  }

  async function updateProduct(p) {
    const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _method: "PUT", id: p.id, title: p.title, price: Number(p.price || 0), image_url: p.image_url || "" }) });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      notify("Product updated", "success");
      try { await logAudit({ action: "product_update", payload: { id: p.id } }); } catch {}
      fetchProducts();
    } else {
      notify(json?.error || "Update failed", "error");
    }
  }

  async function deleteProduct(id) {
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      notify("Product deleted", "success");
      try { await logAudit({ action: "product_delete", payload: { id } }); } catch {}
      fetchProducts();
    } else {
      notify(json?.error || "Delete failed", "error");
    }
    setConfirmDelete({ open: false, id: null, title: "" });
  }

  async function bulkImportCSV(file) {
    const text = await file.text();
    const rows = text.trim().split(/\r?\n/);
    // Expect header: title,price,image_url
    const header = rows[0].split(",").map((h) => h.trim());
    const idxTitle = header.indexOf("title");
    const idxPrice = header.indexOf("price");
    const idxImage = header.indexOf("image_url");
    let ok = 0, fail = 0;
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(",").map((c) => c.trim());
      const payload = { title: cols[idxTitle] || "", price: Number(cols[idxPrice] || 0), image_url: cols[idxImage] || "" };
      if (!payload.title) { fail++; continue; }
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) ok++; else fail++;
    }
    notify(`Import complete — ${ok} ok, ${fail} failed`, fail ? "error" : "success", 5000);
    fetchProducts();
  }

  function exportProductsCSV() {
    const header = ["id", "title", "price", "image_url"]; 
    const lines = [header.join(",")];
    products.forEach((p) => {
      lines.push([p.id, p.title, p.price, p.image_url || ""].join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "products_export.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // Orders
  const [orderSort, setOrderSort] = useState({ key: "id", dir: "desc" });
  function sortedOrders() {
    const copy = [...orders];
    copy.sort((a, b) => {
      const key = orderSort.key;
      const av = a[key]; const bv = b[key];
      if (av < bv) return orderSort.dir === "asc" ? -1 : 1;
      if (av > bv) return orderSort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }

  async function updateOrderStatus(id, status) {
    const res = await fetch(`/api/orders?id=${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _method: "PATCH", status }) });
    if (res.ok) {
      notify("Order status updated", "success");
      try { await logAudit({ action: "order_status", payload: { id, status } }); } catch {}
      fetchOrders();
    } else {
      notify("Failed to update status", "error");
    }
  }

  function exportOrdersCSV() {
    const header = ["id", "status", "amount", "customer_name", "customer_phone"]; 
    const lines = [header.join(",")];
    orders.forEach((o) => {
      const amount = (o.items || []).reduce((sum, i) => sum + (i.price || 0), 0);
      lines.push([o.id, o.status, amount, o.customer_name || "", o.customer_phone || ""].join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "orders_report.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // Homepage customization (config persisted via API with cookie fallback)
  const [homeConfig, setHomeConfig] = useState({
    banners: [],
    featuredMode: "manual", // manual | algorithm
    featuredManualIds: [],
    algorithm: { minPrice: 0, tagIncludes: [], limit: 6 },
    schedule: { start: "", end: "" },
    abTest: { enabled: false, variantA: {}, variantB: {} }
  });

  async function saveHomeConfig() {
    try {
      const res = await fetch("/api/admin/homepage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(homeConfig) });
      if (!res.ok) throw new Error("Save failed");
      notify("Homepage configuration saved", "success");
      try { await logAudit({ action: "homepage_save", payload: homeConfig }); } catch {}
    } catch {
      notify("Failed to save homepage config", "error");
    }
  }

  async function logAudit(entry) {
    try { await fetch("/api/admin/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) }); } catch {}
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Admin Header with Gradient */}
      <div className="admin-header-gradient">
        <div className="container">
          <div className="admin-header-content">
            <div>
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Manage your store, products, and orders</p>
            </div>
            <a href="/" className="btn btn-secondary">← Back to Store</a>
          </div>
        </div>
      </div>

      <div className="container admin-dashboard">
        {/* Navigation Tabs */}
        <nav className="admin-tabs-nav" role="tablist" aria-label="Admin sections">
          {[
            { key: "products", label: "📦 Products", icon: "📦" },
            { key: "carousel", label: "🎠 Carousel", icon: "🎠" },
            { key: "orders", label: "📋 Orders", icon: "📋" },
            { key: "homepage", label: "🏠 Homepage", icon: "🏠" }
          ].map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              className={`admin-tab ${tab === key ? "active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

      {/* Product Management */}
      {tab === "products" && (
        <section className="admin-panel" role="tabpanel">
          <Toolbar>
            <input
              className="input"
              placeholder="Search products by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
            <label className="inline">
              <span>Min ₹</span>
              <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} style={{ width: 100 }} />
            </label>
            <label className="inline">
              <span>Max ₹</span>
              <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} style={{ width: 100 }} />
            </label>
            <button className="btn" onClick={exportProductsCSV}>Export CSV</button>
            <label className="btn">
              Import CSV
              <input type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && bulkImportCSV(e.target.files[0])} />
            </label>
          </Toolbar>

          <form className="form" onSubmit={addProduct} aria-label="Add product">
            <h3>Add Product</h3>
            <div className="grid two">
              <label>
                Name
                <input required value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} />
              </label>
              <label>
                Price (₹)
                <input type="number" min="0" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              </label>
              <label>
                SKU
                <input value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
              </label>
              <label>
                Inventory
                <input type="number" min="0" value={productForm.inventory} onChange={(e) => setProductForm({ ...productForm, inventory: e.target.value })} />
              </label>
              <label className="col-span">
                Description
                <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              </label>
              <label>
                Primary Image URL
                <input value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} />
              </label>
              <label>
                Upload Images (preview only)
                <input type="file" multiple accept="image/*" onChange={(e) => setProductForm({ ...productForm, imageFiles: Array.from(e.target.files || []) })} />
              </label>
              <label>
                Categories
                <input value={productForm.categories} onChange={(e) => setProductForm({ ...productForm, categories: e.target.value })} />
              </label>
              <label>
                Tags
                <input value={productForm.tags} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })} />
              </label>
              <label>
                SEO Title
                <input value={productForm.seoTitle} onChange={(e) => setProductForm({ ...productForm, seoTitle: e.target.value })} />
              </label>
              <label>
                SEO Description
                <input value={productForm.seoDescription} onChange={(e) => setProductForm({ ...productForm, seoDescription: e.target.value })} />
              </label>
            </div>
            <button className="btn primary" type="submit">Save Product</button>
            {productPreviewImages().length > 0 && (
              <div className="grid three" style={{ marginTop: 12 }}>
                {productPreviewImages().map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i + 1}`} style={{ width: "100%", borderRadius: 8 }} />
                ))}
              </div>
            )}
          </form>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading.products && (
                  <tr><td colSpan={4}>Loading products…</td></tr>
                )}
                {!loading.products && filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td><img src={p.image_url || "/placeholder.svg"} alt={p.title} style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6 }} /></td>
                    <td>
                      <input className="input" value={p.title || ""} onChange={(e) => setProducts((list) => list.map((x) => x.id === p.id ? { ...x, title: e.target.value } : x))} />
                    </td>
                    <td>
                      <input className="input" type="number" value={p.price || 0} onChange={(e) => setProducts((list) => list.map((x) => x.id === p.id ? { ...x, price: Number(e.target.value) } : x))} />
                    </td>
                    <td>
                      <div className="inline">
                        <button className="btn" onClick={() => updateProduct(p)}>Save</button>
                        <button className="btn danger" onClick={() => setConfirmDelete({ open: true, id: p.id, title: p.title })}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading.products && filteredProducts.length === 0 && (
                  <tr><td colSpan={4}>No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <ConfirmDialog
            open={confirmDelete.open}
            title="Delete Product"
            message={`Are you sure you want to delete “${confirmDelete.title}”? This cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => deleteProduct(confirmDelete.id)}
            onCancel={() => setConfirmDelete({ open: false, id: null, title: "" })}
          />
        </section>
      )}

      {/* Carousel Management */}
      {tab === "carousel" && (
        <section className="admin-panel" role="tabpanel">
          <h2 className="admin-section-title">🎠 Carousel Management</h2>
          <p className="admin-section-subtitle">Manage hero carousel slides</p>

          <div className="admin-content-grid">
            <div className="admin-form-card">
              <h3>Add New Slide</h3>
              <CarouselFormSection onSuccess={() => fetchCarouselSlides()} />
            </div>
            <div className="admin-slides-card">
              <h3>Existing Slides</h3>
              <CarouselSlidesList slides={carouselSlides} onUpdate={() => fetchCarouselSlides()} />
            </div>
          </div>
        </section>
      )}

      {/* Order Management */}
      {tab === "orders" && (
        <section className="admin-panel" role="tabpanel">
          <Toolbar>
            <label className="inline">
              <span>Sort</span>
              <select value={`${orderSort.key}:${orderSort.dir}`} onChange={(e) => { const [key, dir] = e.target.value.split(":"); setOrderSort({ key, dir }); }}>
                <option value="id:desc">ID ↓</option>
                <option value="id:asc">ID ↑</option>
                <option value="status:asc">Status A→Z</option>
                <option value="status:desc">Status Z→A</option>
              </select>
            </label>
            <button className="btn" onClick={exportOrdersCSV}>Export Orders</button>
          </Toolbar>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading.orders && (<tr><td colSpan={7}>Loading orders…</td></tr>)}
                {!loading.orders && sortedOrders().map((o) => {
                  const amount = (o.items || []).reduce((sum, i) => sum + (i.price || 0), 0);
                  const date = o.created_at ? new Date(o.created_at).toLocaleString() : "—";
                  return (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{date}</td>
                      <td>
                        <select defaultValue={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="shipped">shipped</option>
                          <option value="completed">completed</option>
                        </select>
                      </td>
                      <td>₹{amount}</td>
                      <td>{o.customer_name || "—"} ({o.customer_phone || "—"})</td>
                      <td>{(o.items || []).map((i) => i.title).join(", ")}</td>
                      <td>
                        <a className="btn" href={`/admin/orders?id=${o.id}`}>View</a>
                      </td>
                    </tr>
                  );
                })}
                {!loading.orders && orders.length === 0 && (<tr><td colSpan={7}>No orders found.</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Homepage Customization */}
      {tab === "homepage" && (
        <section className="admin-panel" role="tabpanel">
          <Toolbar>
            <button className="btn primary" onClick={saveHomeConfig}>Save Config</button>
          </Toolbar>
          <div className="grid two">
            <div>
              <h3>Banner Management</h3>
              <label className="col-span">
                Upload Banners
                <input type="file" multiple accept="image/*" onChange={(e) => setHomeConfig({ ...homeConfig, banners: Array.from(e.target.files || []) })} />
              </label>
              <div className="grid three" style={{ marginTop: 12 }}>
                {homeConfig.banners.map((file, i) => (
                  <img key={i} src={URL.createObjectURL(file)} alt={`Banner ${i + 1}`} style={{ width: "100%", borderRadius: 8 }} />
                ))}
              </div>
              <label>
                Display Duration (days)
                <input type="number" min={0} onChange={(e) => setHomeConfig({ ...homeConfig, durationDays: Number(e.target.value) })} />
              </label>
              <label>
                Priority
                <input type="number" min={0} onChange={(e) => setHomeConfig({ ...homeConfig, priority: Number(e.target.value) })} />
              </label>
              <label className="inline">
                <input type="checkbox" checked={homeConfig.abTest.enabled} onChange={(e) => setHomeConfig({ ...homeConfig, abTest: { ...homeConfig.abTest, enabled: e.target.checked } })} />
                <span>Enable A/B Testing</span>
              </label>
            </div>
            <div>
              <h3>Featured Products</h3>
              <label className="inline">
                <span>Mode</span>
                <select value={homeConfig.featuredMode} onChange={(e) => setHomeConfig({ ...homeConfig, featuredMode: e.target.value })}>
                  <option value="manual">Manual</option>
                  <option value="algorithm">Algorithm</option>
                </select>
              </label>
              {homeConfig.featuredMode === "manual" ? (
                <div>
                  <p>Select products to feature:</p>
                  <div className="grid three">
                    {products.map((p) => (
                      <label key={p.id} className="card">
                        <input
                          type="checkbox"
                          checked={homeConfig.featuredManualIds.includes(p.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setHomeConfig((cfg) => ({
                              ...cfg,
                              featuredManualIds: checked
                                ? Array.from(new Set([...cfg.featuredManualIds, p.id]))
                                : cfg.featuredManualIds.filter((id) => id !== p.id)
                            }));
                          }}
                        />
                        <span style={{ marginLeft: 8 }}>{p.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p>Algorithm criteria:</p>
                  <label>
                    Min Price
                    <input type="number" value={homeConfig.algorithm.minPrice} onChange={(e) => setHomeConfig({ ...homeConfig, algorithm: { ...homeConfig.algorithm, minPrice: Number(e.target.value) } })} />
                  </label>
                  <label>
                    Limit
                    <input type="number" value={homeConfig.algorithm.limit} onChange={(e) => setHomeConfig({ ...homeConfig, algorithm: { ...homeConfig.algorithm, limit: Number(e.target.value) } })} />
                  </label>
                  <label>
                    Required Tags (comma-separated)
                    <input value={homeConfig.algorithm.tagIncludes.join(",")} onChange={(e) => setHomeConfig({ ...homeConfig, algorithm: { ...homeConfig.algorithm, tagIncludes: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) } })} />
                  </label>
                </div>
              )}
              <h3>Schedule Visibility</h3>
              <label>
                Start
                <input type="date" value={homeConfig.schedule.start} onChange={(e) => setHomeConfig({ ...homeConfig, schedule: { ...homeConfig.schedule, start: e.target.value } })} />
              </label>
              <label>
                End
                <input type="date" value={homeConfig.schedule.end} onChange={(e) => setHomeConfig({ ...homeConfig, schedule: { ...homeConfig.schedule, end: e.target.value } })} />
              </label>
            </div>
          </div>
        </section>
      )}

        <ToastContainer />
      </div>
    </div>
  );
}
