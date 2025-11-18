"use client";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import ToastContainer, { notify } from "./Toast";
import CarouselFormSection from "./CarouselFormSection";
import CarouselSlidesList from "./CarouselSlidesList";
import ProductFormSection from "./ProductFormSection";
import OrderManagementSection from "./OrderManagementSection";
import HomepageManagementSection from "./HomepageManagementSection";
import SeoSettingsSection from "./SeoSettingsSection";
import { supabaseBrowser } from "../../lib/supabaseClient";


const DRAFT_STORAGE_KEY = "zaxis_product_form_draft";

function Toolbar({ children }) {
  return <div className="admin-toolbar">{children}</div>;
}

export default function AdminDashboardClient() {
  const [tab, setTab] = useState("products");

  // Shared state: products, orders, carousel, categories
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({ products: false, orders: false, carousel: false, categories: false });

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
    seoDescription: "",
    variants: [],
    specifications: [],
    images: []
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
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
      // Request related data (variants, specifications, images) for admin panel
      const res = await fetch("/api/products?includeRelated=true");
      console.log('[fetchProducts] response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[fetchProducts] API error:', { status: res.status, error: errorText });
        notify(`Failed to load products: ${res.status}`, "error");
        setProducts([]);
        return;
      }

      const data = await res.json();
      console.log('[fetchProducts] received data:', { count: Array.isArray(data) ? data.length : 'not-array', data });
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[fetchProducts] exception:', e);
      notify("Failed to load products: " + e.message, "error");
      setProducts([]);
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

  async function fetchCategories() {
    try {
      setLoading((l) => ({ ...l, categories: true }));
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      notify("Failed to load categories", "error");
    } finally {
      setLoading((l) => ({ ...l, categories: false }));
    }
  }

  // Realtime updates via Supabase if configured
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCarouselSlides();
    fetchCategories();
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

  function resetProductForm() {
    setProductForm({
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
      seoDescription: "",
      variants: [],
      specifications: [],
      images: []
    });
  }

  function startEditProduct(product) {
    setProductForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      sku: product.sku || "",
      inventory: product.inventory || "",
      imageFiles: [],
      imageUrl: product.image_url || "",
      categories: product.category || "",
      tags: product.tags || "",
      seoTitle: product.seo_title || "",
      seoDescription: product.seo_description || "",
      variants: product.variants || [],
      specifications: product.specifications || [],
      images: product.images || []
    });
    setEditingProductId(product.id);
    setIsEditMode(true);
    // Scroll to form
    setTimeout(() => {
      document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function cancelEditProduct() {
    resetProductForm();
    setIsEditMode(false);
    setEditingProductId(null);
  }

  async function addProduct(e) {
    e.preventDefault();
    const price = Number(productForm.price);
    if (!productForm.title || Number.isNaN(price) || price < 0) {
      notify("Please provide a valid title and price", "error");
      return;
    }

    // Validate that either imageUrl is provided or image was uploaded
    if (!productForm.imageUrl) {
      notify("Please provide an image URL or upload an image", "error");
      return;
    }

    // Build payload with all product information
    const payload = {
      title: productForm.title,
      price,
      image_url: productForm.imageUrl,
      description: productForm.description || "",
      sku: productForm.sku || "",
      inventory: productForm.inventory ? Number(productForm.inventory) : 0,
      category: productForm.categories || "",
      tags: productForm.tags || "",
      seo_title: productForm.seoTitle || "",
      seo_description: productForm.seoDescription || "",
      variants: productForm.variants || [],
      specifications: productForm.specifications || [],
      images: productForm.images || []
    };

    console.log('[addProduct] payload being sent', {
      hasVariants: payload.variants.length > 0,
      variantCount: payload.variants.length,
      variants: payload.variants,
      hasImages: payload.images.length > 0,
      imageCount: payload.images.length,
      images: payload.images,
      hasSpecs: payload.specifications.length > 0,
      specCount: payload.specifications.length,
      specifications: payload.specifications
    });

    // If in edit mode, update the product
    if (isEditMode && editingProductId) {
      const updatePayload = { ...payload, _method: "PUT", id: editingProductId };
      console.log('[addProduct:update] sending update request', {
        productId: editingProductId,
        payloadKeys: Object.keys(updatePayload),
        hasVariants: !!updatePayload.variants,
        variantCount: updatePayload.variants?.length || 0,
        hasSpecs: !!updatePayload.specifications,
        specCount: updatePayload.specifications?.length || 0,
        specifications: updatePayload.specifications,
        hasImages: !!updatePayload.images,
        imageCount: updatePayload.images?.length || 0
      });

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });

      const json = await res.json().catch(() => ({}));
      console.log('[addProduct:update] response received', { status: res.status, ok: res.ok, json });

      if (res.ok) {
        notify("Product updated successfully!", "success");
        try { await logAudit({ action: "product_update", payload: { id: editingProductId, ...payload } }); } catch {}
        resetProductForm();
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
          } catch (error) {
            console.error("Failed to clear product draft after update", error);
          }
        }
        setIsEditMode(false);
        setEditingProductId(null);
        fetchProducts();
      } else {
        const reason = json?.error || (Array.isArray(json?.details) ? json.details.join(", ") : "Failed to update product");
        console.error('[addProduct:update] error response:', { status: res.status, json, reason });
        notify(reason, "error");
      }
      return;
    }

    // Otherwise, add new product
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      notify("Product added successfully!", "success");
      try { await logAudit({ action: "product_add", payload }); } catch {}
      resetProductForm();
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch (error) {
          console.error("Failed to clear product draft after add", error);
        }
      }
      fetchProducts();
    } else {
      const reason = json?.error || (Array.isArray(json?.details) ? json.details.join(", ") : "Failed to add product");
      console.error('[addProduct:create] error response:', { status: res.status, json });
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
            { key: "seo", label: "🔍 SEO Settings", icon: "🔍" },
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

          <ProductFormSection
            productForm={productForm}
            setProductForm={setProductForm}
            onSubmit={addProduct}
            categories={categories}
            onCategoriesUpdate={fetchCategories}
            isEditMode={isEditMode}
            onCancelEdit={cancelEditProduct}
          />
          {productPreviewImages().length > 0 && (
            <div className="grid three" style={{ marginTop: 12 }}>
              {productPreviewImages().map((src, i) => (
                <img key={i} src={src} alt={`Preview ${i + 1}`} style={{ width: "100%", borderRadius: 8 }} />
              ))}
            </div>
          )}

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
                        <button className="btn btn-secondary" onClick={() => startEditProduct(p)}>Edit</button>
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

      {/* SEO Settings Management */}
      {tab === "seo" && (
        <section className="admin-panel" role="tabpanel">
          <h2 className="admin-section-title">🔍 SEO Settings</h2>
          <p className="admin-section-subtitle">Manage SEO metadata for individual products</p>
          <SeoSettingsSection products={products} />
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
          <h2 className="admin-section-title">📦 Order Management</h2>
          <p className="admin-section-subtitle">View and manage customer orders</p>

          <OrderManagementSection
            orders={orders}
            loading={loading.orders}
            onStatusUpdate={updateOrderStatus}
            onExport={exportOrdersCSV}
          />
        </section>
      )}

      {/* Homepage Customization */}
      {tab === "homepage" && (
        <section className="admin-panel" role="tabpanel">
          <HomepageManagementSection
            homeConfig={homeConfig}
            setHomeConfig={setHomeConfig}
            products={products}
            onSave={saveHomeConfig}
          />
        </section>
      )}

        <ToastContainer />
      </div>
    </div>
  );
}
