'use client';

import { useState, useEffect, useCallback } from 'react';
import { notify } from './Toast';
import { X, Plus, GripVertical } from 'lucide-react';

// Collapsible section component - defined outside to prevent recreation on each render
function CollapsibleSection({ title, section, children, icon, expandedSections, toggleSection }) {
  return (
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
}

export default function ProductFormSection({
  productForm,
  setProductForm,
  onSubmit,
  categories = [],
  onCategoriesUpdate,
  isEditMode = false,
  onCancelEdit = null
}) {
  const DRAFT_STORAGE_KEY = 'zaxis_product_form_draft';

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);
  const [hasVariants, setHasVariants] = useState((productForm.variants || []).length > 0);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    images: false,
    variants: false,
    specifications: false,
    categories: false
  });
  const [hasDraft, setHasDraft] = useState(false);

  // Keep the "has variants" toggle in sync when editing an existing product
  useEffect(() => {
    setHasVariants((productForm.variants || []).length > 0);
  }, [productForm.variants]);

  // Load any saved draft from localStorage on first mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      setHasDraft(true);
      // Only auto-load when creating a new product
      if (!isEditMode) {
        const parsed = JSON.parse(raw);
        setProductForm((prev) => ({ ...prev, ...parsed }));
        notify('Loaded saved draft for this product form', 'info');
      }
    } catch (error) {
      console.error('Failed to load product draft', error);
    }
  }, [setProductForm]);

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Memoized handler to prevent scroll-to-top bug
  const handleFormChange = useCallback((field, value) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  }, [setProductForm]);

  // Upload a single product image file to Supabase Storage and return its public URL
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
        return null;
      }

      notify('Image uploaded successfully!', 'success');
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      notify('Failed to upload image: ' + error.message, 'error');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle one or more newly selected/dropped product image files
  const handleProductImagesAdded = async (files) => {
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        notify('Only PNG, JPG, JPEG, or WEBP images are allowed', 'error');
        continue;
      }
      if (file.size > maxSizeBytes) {
        notify('Each image must be smaller than 5MB', 'error');
        continue;
      }

      const url = await uploadImageToStorage(file);
      if (!url) continue;

      setProductForm((prev) => {
        const existing = prev.images || [];
        const nextImages = [
          ...existing,
          {
            image_url: url,
            alt_text: prev.title || 'Product image',
            is_primary: existing.length === 0,
          },
        ];
        const primaryImage = nextImages.find((img) => img.is_primary) || nextImages[0];
        return {
          ...prev,
          images: nextImages,
          imageUrl: primaryImage ? primaryImage.image_url : prev.imageUrl || url,
        };
      });
    }
  };

  const handleImageDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingImages(false);
    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length === 0) return;
    await handleProductImagesAdded(files);
  };

  const handleImageDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDraggingImages) setIsDraggingImages(true);
  };

  const handleImageDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingImages(false);
  };

  const handleImageInputChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    await handleProductImagesAdded(files);
    // Allow selecting the same file again if needed
    event.target.value = '';
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
    let sku = `${baseSKU}-${Date.now().toString().slice(-4)}`;

    // Truncate to 100 characters if needed (database constraint)
    if (sku.length > 100) {
      const truncated = sku.substring(0, 100);
      notify(`SKU was too long (${sku.length} chars). Truncated to 100 characters: ${truncated}`, 'warning');
      sku = truncated;
    } else {
      notify(`SKU generated: ${sku}`, 'success');
    }

    setProductForm((prev) => ({ ...prev, sku }));
  };

  const generateVariantSKU = (index) => {
    const variants = productForm.variants || [];
    const variant = variants[index];
    if (!productForm.title.trim() || !variant?.variant_name?.trim()) {
      notify('Product name and variant name are required to generate a variant SKU', 'error');
      return;
    }
    const baseSKU = `${productForm.title} ${variant.variant_name}`
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    let sku = `${baseSKU}-${Date.now().toString().slice(-4)}`;

    // Truncate to 100 characters if needed (database constraint)
    if (sku.length > 100) {
      const truncated = sku.substring(0, 100);
      notify(`SKU was too long (${sku.length} chars). Truncated to 100 characters: ${truncated}`, 'warning');
      sku = truncated;
    } else {
      notify(`Variant SKU generated: ${sku}`, 'success');
    }

    updateVariant(index, 'sku', sku);
  };

  const saveDraft = () => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(productForm));
      setHasDraft(true);
      notify('Draft saved locally. It will be restored next time you open this form.', 'success');
    } catch (error) {
      console.error('Failed to save product draft', error);
      notify('Could not save draft. Please try again.', 'error');
    }
  };

  const clearDraft = () => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      notify('Draft cleared', 'success');
    } catch (error) {
      console.error('Failed to clear product draft', error);
    }
  };


	  const handleToggleHasVariants = () => {
	    setHasVariants((prev) => {
	      const next = !prev;
	      setProductForm((current) => {
	        if (!next) {
	          return { ...current, variants: [] };
	        }
	        const existing = current.variants || [];
	        if (existing.length === 0) {
	          return {
	            ...current,
	            variants: [
	              { variant_name: '', price: '', stock_quantity: '', sku: '', color: '', image_url: '' },
	            ],
	          };
	        }
	        return current;
	      });
	      return next;
	    });
	  };


  const addVariant = () => {
    setHasVariants(true);
    setProductForm((prev) => {
      const variants = [...(prev.variants || [])];
      variants.push({ variant_name: '', price: '', stock_quantity: '', sku: '', color: '', image_url: '' });
      return { ...prev, variants };
    });
  };

  const updateVariant = (index, field, value) => {
    setProductForm((prev) => {
      const variants = [...(prev.variants || [])];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const removeVariant = (index) => {
    setProductForm((prev) => {
      const variants = (prev.variants || []).filter((_, i) => i !== index);
      return { ...prev, variants };
    });
  };

  const addSpecification = () => {
    const specs = [...(productForm.specifications || [])];
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
    setProductForm((prev) => {
      const images = prev.images || [];
      const nextImages = [...images, { image_url: '', alt_text: '', is_primary: images.length === 0 }];
      const primaryImage = nextImages.find((img) => img.is_primary) || nextImages[0];
      return {
        ...prev,
        images: nextImages,
        imageUrl: primaryImage ? primaryImage.image_url : prev.imageUrl,
      };
    });
  };

  const updateImage = (index, field, value) => {
    setProductForm((prev) => {
      const images = [...(prev.images || [])];
      images[index] = { ...images[index], [field]: value };
      if (field === 'is_primary' && value) {
        // Ensure only one primary image
        images.forEach((img, idx) => {
          if (idx !== index) img.is_primary = false;
        });
      }
      const primaryImage = images.find((img) => img.is_primary) || images[0];
      return {
        ...prev,
        images,
        imageUrl: primaryImage ? primaryImage.image_url : prev.imageUrl,
      };
    });
  };

  const removeImage = (index) => {
    setProductForm((prev) => {
      const images = (prev.images || []).filter((_, i) => i !== index);
      if (images.length > 0 && !images.some((img) => img.is_primary)) {
        images[0].is_primary = true;
      }
      const primaryImage = images.find((img) => img.is_primary) || images[0];
      return {
        ...prev,
        images,
        imageUrl: primaryImage ? primaryImage.image_url : '',
      };
    });
  };

  const moveImage = (fromIndex, toIndex) => {
    setProductForm((prev) => {
      const images = [...(prev.images || [])];
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= images.length || toIndex >= images.length) {
        return prev;
      }
      const [movedImage] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, movedImage);
      const primaryImage = images.find((img) => img.is_primary) || images[0];
      return {
        ...prev,
        images,
        imageUrl: primaryImage ? primaryImage.image_url : prev.imageUrl,
      };
    });
  };



  const primaryImage = (productForm.images || []).find((img) => img.is_primary) || (productForm.images || [])[0] || null;
  const previewImageSrc = primaryImage?.image_url || productForm.imageUrl || '/placeholder.svg';
  const previewImageAlt = primaryImage?.alt_text || productForm.title || 'Product image preview';

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

      {/* LIVE PREVIEW */}
      <div
        style={{
          marginBottom: '24px',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
          Live product preview
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#6b7280' }}>
          This is a simplified preview of how your product card might look on the website.
        </p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '260px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 15px rgba(0,0,0,0.05)',
              background: '#ffffff',
              border: '1px solid #e5e7eb'
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                background: '#f3f4f6',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <img
                src={previewImageSrc}
                alt={previewImageAlt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '12px 14px' }}>
              <h4
                style={{
                  margin: '0 0 4px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {productForm.title || 'Product name'}
              </h4>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                {productForm.price ? `₹${productForm.price}` : '₹0'}
              </p>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', maxWidth: '280px' }}>
            <p style={{ margin: 0 }}>
              Update the fields below to see this preview change in real time. Final appearance on the storefront may vary slightly.
            </p>
          </div>
        </div>
      </div>


      {/* BASIC INFORMATION SECTION */}
      <CollapsibleSection title="Basic Information" section="basic" icon="📝" expandedSections={expandedSections} toggleSection={toggleSection}>
        <div className="form-grid">
          <div className="form-group form-col-span">
            <label htmlFor="product-name">
              Name <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              id="product-name"
              type="text"
              required
              value={productForm.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="Short, descriptive product name customers will see"
            />
            <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
              {(productForm.title || '').length} / 120 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="product-price">
              Price (₹) <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              required
              value={productForm.price}
              onChange={(e) => handleFormChange('price', e.target.value)}
              placeholder="Example: 499"
            />
            <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
              Final selling price in rupees shown on the product card and checkout
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="product-inventory">Inventory</label>
            <input
              id="product-inventory"
              type="number"
              min="0"
              value={productForm.inventory}
              onChange={(e) => handleFormChange('inventory', e.target.value)}
              placeholder="Available stock (optional)"
            />
            <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
              Used to show stock status and manage availability
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="product-sku">SKU (optional)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="product-sku"
                type="text"
                maxLength="100"
                value={productForm.sku}
                onChange={(e) => handleFormChange('sku', e.target.value.substring(0, 100))}
                placeholder="Internal code for this product"
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
            <small style={{ color: productForm.sku?.length > 90 ? '#e53e3e' : '#999', marginTop: '4px', display: 'block' }}>
              {(productForm.sku || '').length} / 100 characters
            </small>
          </div>

          <div className="form-group form-col-span">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              value={productForm.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Explain what makes this product special, what it includes, and any important details."
              rows="4"
            />
            <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
              {(productForm.description || '').length} / 600 characters
            </small>
          </div>
        </div>
      </CollapsibleSection>

      {/* PRODUCT IMAGES SECTION */}
      <CollapsibleSection title="Images" section="images" icon="🖼" expandedSections={expandedSections} toggleSection={toggleSection}>
        <div className="form-group form-col-span">
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
            Upload one or more product images. The first image will be used as the main image on the website.
          </p>
        </div>

        <div
          onDragOver={handleImageDragOver}
          onDragLeave={handleImageDragLeave}
          onDrop={handleImageDrop}
          onClick={() => document.getElementById('product-images-input')?.click()}
          style={{
            border: isDraggingImages ? '2px solid #0083B0' : '2px dashed #cbd5e1',
            background: isDraggingImages ? '#f0f9ff' : '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          <p style={{ margin: '0 0 4px', fontWeight: 500 }}>Drag &amp; drop product images here</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            or click to browse. PNG, JPG, JPEG, WEBP up to 5MB each.
          </p>
          {isUploadingImage && (
            <p style={{ marginTop: 8, fontSize: 12, color: '#0083B0' }}>Uploading images…</p>
          )}
        </div>

        <input
          id="product-images-input"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          style={{ display: 'none' }}
          onChange={handleImageInputChange}
        />

        {(productForm.images || []).length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {productForm.images.map((img, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ width: '72px', height: '72px', borderRadius: '6px', overflow: 'hidden', background: '#e2e8f0' }}>
                  {img.image_url ? (
                    <img
                      src={img.image_url}
                      alt={img.alt_text || `Product image ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#64748b' }}>
                      No image
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Alt text (for accessibility &amp; SEO)</label>
                  <input
                    type="text"
                    value={img.alt_text || ''}
                    onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                    placeholder="Short description of this image"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />

                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        name="primary-image"
                        checked={!!img.is_primary}
                        onChange={() => updateImage(index, 'is_primary', true)}
                      />
                      Primary image
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => moveImage(index, index - 1)}
                        disabled={index === 0}
                      >
                        ↑ Move up
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => moveImage(index, index + 1)}
                        disabled={index === (productForm.images || []).length - 1}
                      >
                        ↓ Move down
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeImage(index)}
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontSize: '14px' }}>No images added yet. Drag and drop files above to upload.</p>
        )}
      </CollapsibleSection>

      {/* CATEGORIES &amp; TAGS SECTION */}
      <CollapsibleSection title="Categories & Tags" section="categories" icon="🏷" expandedSections={expandedSections} toggleSection={toggleSection}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="product-category">
              Category <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <div className="category-input-group">
              <select
                id="product-category"
                value={productForm.categories}
                onChange={(e) => handleFormChange('categories', e.target.value)}
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
              onChange={(e) => handleFormChange('tags', e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
            <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
              Comma-separated keywords used to group and filter products
            </small>
          </div>
        </div>
      </CollapsibleSection>

      {/* PRODUCT VARIANTS SECTION */}
      <CollapsibleSection title="Product Variants" section="variants" icon="🎨" expandedSections={expandedSections} toggleSection={toggleSection}>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px', color: '#4b5563', fontSize: '14px' }}>
            Use variants when this product comes in different sizes, colours, materials, etc.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#111827' }}>
            <input
              type="checkbox"
              checked={hasVariants}
              onChange={handleToggleHasVariants}
            />
            This product has variants (size, color, material, etc.)
          </label>
        </div>

        {hasVariants ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addVariant}
              >
                <Plus size={16} style={{ marginRight: '4px' }} /> Add Variant
              </button>
            </div>

            {(productForm.variants || []).length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {productForm.variants.map((variant, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <label style={{ fontSize: '12px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                          Variant name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Large, Red, 2-pack"
                          value={variant.variant_name}
                          onChange={(e) => updateVariant(idx, 'variant_name', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                          Color (optional)
                        </label>
                        <select
                          value={variant.color || ''}
                          onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        >
                          <option value="">Select colour</option>
                          <option value="Red">Red</option>
                          <option value="Blue">Blue</option>
                          <option value="Green">Green</option>
                          <option value="Black">Black</option>
                          <option value="White">White</option>
                          <option value="Yellow">Yellow</option>
                          <option value="Purple">Purple</option>
                          <option value="Orange">Orange</option>
                          <option value="Pink">Pink</option>
                          <option value="Gray">Gray</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                          Stock quantity
                        </label>
                        <input
                          type="number"
                          placeholder="Stock"
                          value={variant.stock_quantity}
                          onChange={(e) => updateVariant(idx, 'stock_quantity', e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr auto',
                        gap: '12px',
                        alignItems: 'start',
                      }}
                    >
                      <div>
                        <label style={{ fontSize: '12px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                          SKU (optional)
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            maxLength="100"
                            placeholder="Variant-specific SKU"
                            value={variant.sku}
                            onChange={(e) => updateVariant(idx, 'sku', e.target.value.substring(0, 100))}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                          />
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => generateVariantSKU(idx)}
                            title="Auto-generate SKU from product + variant name"
                          >
                            Auto-Gen
                          </button>
                        </div>
                        <small style={{ fontSize: '11px', color: (variant.sku || '').length > 90 ? '#e53e3e' : '#999', marginTop: '4px', display: 'block' }}>
                          {(variant.sku || '').length} / 100 characters
                        </small>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                          Variant image (optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleVariantImageChange(e, idx)}
                          disabled={uploadingVariantIndex === idx}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        />
                        {uploadingVariantIndex === idx && (
                          <p style={{ fontSize: '12px', color: '#0083B0', marginTop: '4px' }}>Uploading...</p>
                        )}
                      </div>

                      {variant.image_url && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={variant.image_url}
                            alt={`${variant.variant_name || 'Variant'} preview`}
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

                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeVariant(idx)}
                      >
                        Remove variant
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#999', fontSize: '14px' }}>
                No variants added yet. Click &quot;Add Variant&quot; to create one.
              </p>
            )}
          </>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Variants are turned off. This product will use the main price and inventory fields above.
          </p>
        )}
      </CollapsibleSection>

      {/* PRODUCT SPECIFICATIONS SECTION */}
      <CollapsibleSection title="Product Specifications" section="specifications" icon="📋" expandedSections={expandedSections} toggleSection={toggleSection}>
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


      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {!isEditMode && (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={saveDraft}
                style={{ padding: '10px 16px' }}
              >
                Save Draft
              </button>
              {hasDraft && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={clearDraft}
                  style={{ padding: '8px 12px' }}
                >
                  Discard Draft
                </button>
              )}
            </>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1, padding: '12px' }}
          >
            {isEditMode ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
        {hasDraft && !isEditMode && (
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            Draft is saved locally in this browser. It will auto-load next time you open this form.
          </p>
        )}
      </div>
    </form>
  );
}

