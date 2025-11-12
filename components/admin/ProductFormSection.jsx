'use client';

import { useState, useEffect } from 'react';
import { notify } from './Toast';
import { X, Plus, GripVertical } from 'lucide-react';

export default function ProductFormSection({
  productForm,
  setProductForm,
  onSubmit,
  categories = [],
  onCategoriesUpdate,
  isEditMode = false,
  onCancelEdit = null
}) {
  const [imagePreview, setImagePreview] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const [autoGenerateSKU, setAutoGenerateSKU] = useState(false);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    images: false,
    variants: false,
    specifications: false,
    seo: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate aspect ratio (1:1)
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const aspectRatio = img.width / img.height;
          if (Math.abs(aspectRatio - 1) > 0.05) {
            notify('Product image should be square (1:1 aspect ratio)', 'error');
            return;
          }
          setImagePreview(event.target.result);

          // Upload file to Supabase Storage
          await uploadImageToStorage(file);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToStorage = async (file) => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        notify(data.error || 'Failed to upload image', 'error');
        return;
      }

      // Set the image URL from the uploaded file
      setProductForm({ ...productForm, imageUrl: data.url });
      notify('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      notify('Failed to upload image: ' + error.message, 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const uploadVariantImage = async (file, variantIndex) => {
    try {
      setUploadingVariantIndex(variantIndex);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'product-variants');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        notify(data.error || 'Failed to upload variant image', 'error');
        return;
      }

      // Update the variant with the image URL
      updateVariant(variantIndex, 'image_url', data.url);
      notify('Variant image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Variant upload error:', error);
      notify('Failed to upload variant image: ' + error.message, 'error');
    } finally {
      setUploadingVariantIndex(null);
    }
  };

  const handleVariantImageChange = async (e, variantIndex) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadVariantImage(file, variantIndex);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      notify('Category name cannot be empty', 'error');
      return;
    }

    setIsAddingCategory(true);
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add category');
      }

      notify('Category added successfully!', 'success');
      setNewCategory('');
      setShowNewCategory(false);
      onCategoriesUpdate?.();
    } catch (err) {
      notify(err.message || 'An error occurred', 'error');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const generateSKU = () => {
    if (!productForm.title.trim()) {
      notify('Product name is required to generate SKU', 'error');
      return;
    }
    const baseSKU = productForm.title
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const sku = `${baseSKU}-${Date.now().toString().slice(-4)}`;
    setProductForm({ ...productForm, sku });
    notify(`SKU generated: ${sku}`, 'success');
  };

  const addVariant = () => {
    const variants = productForm.variants || [];
    variants.push({ variant_name: '', price: '', stock_quantity: '', sku: '' });
    setProductForm({ ...productForm, variants });
  };

  const updateVariant = (index, field, value) => {
    const variants = [...(productForm.variants || [])];
    variants[index] = { ...variants[index], [field]: value };
    setProductForm({ ...productForm, variants });
  };

  const removeVariant = (index) => {
    const variants = (productForm.variants || []).filter((_, i) => i !== index);
    setProductForm({ ...productForm, variants });
  };

  const addSpecification = () => {
    const specs = productForm.specifications || [];
    specs.push({ spec_key: '', spec_value: '' });
    setProductForm({ ...productForm, specifications: specs });
  };

  const updateSpecification = (index, field, value) => {
    const specs = [...(productForm.specifications || [])];
    specs[index] = { ...specs[index], [field]: value };
    setProductForm({ ...productForm, specifications: specs });
  };

  const removeSpecification = (index) => {
    const specs = (productForm.specifications || []).filter((_, i) => i !== index);
    setProductForm({ ...productForm, specifications: specs });
  };

  const addImage = () => {
    const images = productForm.images || [];
    images.push({ image_url: '', alt_text: '', is_primary: images.length === 0 });
    setProductForm({ ...productForm, images });
  };

  const updateImage = (index, field, value) => {
    const images = [...(productForm.images || [])];
    images[index] = { ...images[index], [field]: value };
    setProductForm({ ...productForm, images });
  };

  const removeImage = (index) => {
    const images = (productForm.images || []).filter((_, i) => i !== index);
    // Ensure at least one primary image
    if (images.length > 0 && !images.some(img => img.is_primary)) {
      images[0].is_primary = true;
    }
    setProductForm({ ...productForm, images });
  };

  const moveImage = (fromIndex, toIndex) => {
    const images = [...(productForm.images || [])];
    const [movedImage] = images.splice(fromIndex, 1);
    images.splice(toIndex, 0, movedImage);
    setProductForm({ ...productForm, images });
  };

  // Helper component for collapsible sections
  const CollapsibleSection = ({ title, section, children, icon }) => (
    <div style={{ marginBottom: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => toggleSection(section)}
        style={{
          width: '100%',
          padding: '16px',
          background: expandedSections[section] ? '#f0f8ff' : '#f9f9f9',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          {title}
        </span>
        <span style={{ transform: expandedSections[section] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
          ▼
        </span>
      </button>
      {expandedSections[section] && (
        <div style={{ padding: '16px', borderTop: '1px solid #e0e0e0', background: '#fff' }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <form className="admin-form" onSubmit={onSubmit} aria-label={isEditMode ? "Edit product" : "Add product"}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0' }}>{isEditMode ? 'Edit Product' : 'Add Product'}</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Organize your product information in sections below</p>
        </div>
        {isEditMode && onCancelEdit && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelEdit}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* BASIC INFORMATION SECTION */}
      <CollapsibleSection title="Basic Information" section="basic" icon="📝">
        <div className="form-grid">
        <div className="form-group">
          <label htmlFor="product-name">Name *</label>
          <input
            id="product-name"
            type="text"
            required
            value={productForm.title}
            onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
            placeholder="Product name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-price">Price (₹) *</label>
          <input
            id="product-price"
            type="number"
            min="0"
            required
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-sku">SKU</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="product-sku"
              type="text"
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              placeholder="SKU"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={generateSKU}
              title="Auto-generate SKU from product name"
            >
              Auto-Gen
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="product-inventory">Inventory</label>
          <input
            id="product-inventory"
            type="number"
            min="0"
            value={productForm.inventory}
            onChange={(e) => setProductForm({ ...productForm, inventory: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="form-group form-col-span">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            placeholder="Product description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-image">Primary Image URL</label>
          <input
            id="product-image"
            type="url"
            value={productForm.imageUrl}
            onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-upload">
            Upload Images (1:1 aspect ratio)
            {isUploadingImage && <span className="uploading-indicator"> (Uploading...)</span>}
          </label>
          <input
            id="product-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploadingImage}
          />
          {productForm.imageUrl && (
            <p className="upload-success">✓ Image uploaded: {productForm.imageUrl.split('/').pop()}</p>
          )}
        </div>

        {imagePreview && (
          <div className="image-preview-container">
            <p className="preview-label">Image Preview:</p>
            <img 
              src={imagePreview} 
              alt="Preview"
              className="image-preview"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="product-category">Category *</label>
          <div className="category-input-group">
            <select
              id="product-category"
              value={productForm.categories}
              onChange={(e) => setProductForm({ ...productForm, categories: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id || cat} value={cat.name || cat}>
                  {cat.name || cat}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowNewCategory(!showNewCategory)}
            >
              + New
            </button>
          </div>
        </div>

        {showNewCategory && (
          <div className="form-group form-col-span">
            <label htmlFor="new-category">New Category Name</label>
            <div className="new-category-input">
              <input
                id="new-category"
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddCategory}
                disabled={isAddingCategory}
              >
                {isAddingCategory ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategory('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="product-tags">Tags</label>
          <input
            id="product-tags"
            type="text"
            value={productForm.tags}
            onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-seo-title">SEO Title</label>
          <input
            id="product-seo-title"
            type="text"
            value={productForm.seoTitle}
            onChange={(e) => setProductForm({ ...productForm, seoTitle: e.target.value })}
            placeholder="SEO title"
          />
        </div>

        <div className="form-group form-col-span">
          <label htmlFor="product-seo-desc">SEO Description</label>
          <textarea
            id="product-seo-desc"
            value={productForm.seoDescription}
            onChange={(e) => setProductForm({ ...productForm, seoDescription: e.target.value })}
            placeholder="SEO description"
            rows="3"
          />
        </div>
      </div>
      </CollapsibleSection>

      {/* PRODUCT IMAGES SECTION */}
      <CollapsibleSection title="Product Images" section="images" icon="🖼️">
        <div style={{ marginBottom: '16px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addImage} style={{ marginBottom: '12px' }}>
            <Plus size={16} style={{ marginRight: '4px' }} /> Add Image
          </button>
        </div>
        {(productForm.variants || []).length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {productForm.variants.map((variant, idx) => (
              <div key={idx} style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '12px', alignItems: 'end' }}>
                  <input
                    type="text"
                    placeholder="Variant name (e.g., Red, Large)"
                    value={variant.variant_name}
                    onChange={(e) => updateVariant(idx, 'variant_name', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={variant.stock_quantity}
                    onChange={(e) => updateVariant(idx, 'stock_quantity', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="SKU"
                    value={variant.sku}
                    onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeVariant(idx)}>
                    <X size={16} />
                  </button>
                </div>

                {/* Variant Image Upload */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'start' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Variant Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVariantImageChange(e, idx)}
                      disabled={uploadingVariantIndex === idx}
                      style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
                    />
                    {uploadingVariantIndex === idx && <p style={{ fontSize: '12px', color: '#0083B0', marginTop: '4px' }}>Uploading...</p>}
                  </div>
                  {variant.image_url && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={variant.image_url}
                        alt={`${variant.variant_name} preview`}
                        style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => updateVariant(idx, 'image_url', '')}
                        title="Remove variant image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontSize: '14px' }}>No variants added yet. Click "Add Variant" to create one.</p>
        )}
      </CollapsibleSection>

      {/* PRODUCT SPECIFICATIONS SECTION */}
      <CollapsibleSection title="Product Specifications" section="specifications" icon="📋">
        <div style={{ marginBottom: '16px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addSpecification} style={{ marginBottom: '12px' }}>
            <Plus size={16} style={{ marginRight: '4px' }} /> Add Specification
          </button>
        </div>
        {(productForm.specifications || []).length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {productForm.specifications.map((spec, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '8px', alignItems: 'end', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <input
                  type="text"
                  placeholder="Key (e.g., Material)"
                  value={spec.spec_key}
                  onChange={(e) => updateSpecification(idx, 'spec_key', e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  placeholder="Value (e.g., PLA Plastic)"
                  value={spec.spec_value}
                  onChange={(e) => updateSpecification(idx, 'spec_value', e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSpecification(idx)}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontSize: '14px' }}>No specifications added yet. Click "Add Specification" to create one.</p>
        )}
      </CollapsibleSection>

      {/* SEO SETTINGS SECTION */}
      <CollapsibleSection title="SEO Settings" section="seo" icon="🔍">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="product-seo-title">SEO Title</label>
            <input
              id="product-seo-title"
              type="text"
              value={productForm.seoTitle}
              onChange={(e) => setProductForm({ ...productForm, seoTitle: e.target.value })}
              placeholder="SEO title for search engines"
            />
          </div>

          <div className="form-group form-col-span">
            <label htmlFor="product-seo-desc">SEO Description</label>
            <textarea
              id="product-seo-desc"
              value={productForm.seoDescription}
              onChange={(e) => setProductForm({ ...productForm, seoDescription: e.target.value })}
              placeholder="SEO description for search engines"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-tags">Tags</label>
            <input
              id="product-tags"
              type="text"
              value={productForm.tags}
              onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>
      </CollapsibleSection>

      <button type="submit" className="btn btn-primary" style={{ marginTop: '32px', width: '100%', padding: '12px' }}>
        {isEditMode ? 'Save Changes' : 'Add Product'}
      </button>
    </form>
  );
}

