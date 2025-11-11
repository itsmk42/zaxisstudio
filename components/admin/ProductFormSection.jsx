'use client';

import { useState, useEffect } from 'react';
import { notify } from './Toast';

export default function ProductFormSection({
  productForm,
  setProductForm,
  onSubmit,
  categories = [],
  onCategoriesUpdate
}) {
  const [imagePreview, setImagePreview] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  return (
    <form className="admin-form" onSubmit={onSubmit} aria-label="Add product">
      <h3>Add Product</h3>
      
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
          <input
            id="product-sku"
            type="text"
            value={productForm.sku}
            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
            placeholder="SKU"
          />
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

      <button type="submit" className="btn btn-primary">
        Add Product
      </button>
    </form>
  );
}

