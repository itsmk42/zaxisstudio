'use client';

import { useState, useCallback } from 'react';
import { notify } from './Toast';

export default function SeoSettingsSection({ products = [] }) {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [seoData, setSeoData] = useState({
    seo_title: '',
    seo_description: '',
    tags: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Load SEO data for selected product
  const loadProductSeo = useCallback(async (productId) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      setSeoData({
        seo_title: product.seo_title || '',
        seo_description: product.seo_description || '',
        tags: product.tags || ''
      });
    }
  }, [products]);

  // Auto-generate SEO settings based on product data
  const autoGenerateSeo = useCallback(() => {
    if (!selectedProduct) {
      notify('Please select a product first', 'error');
      return;
    }

    const title = selectedProduct.title || '';
    const description = selectedProduct.description || '';
    const price = selectedProduct.price || '';

    // Generate SEO title (50-60 chars recommended)
    const generatedTitle = `${title} | Buy Online at Zaxis Studio`.substring(0, 60);

    // Generate SEO description (150-160 chars recommended)
    const generatedDesc = `${title} - ₹${price}. ${description.substring(0, 100)}...`.substring(0, 160);

    // Generate tags from title and category
    const category = selectedProduct.category || '';
    const generatedTags = [
      title.toLowerCase(),
      category.toLowerCase(),
      '3d printed',
      'buy online'
    ].filter(Boolean).join(', ');

    setSeoData({
      seo_title: generatedTitle,
      seo_description: generatedDesc,
      tags: generatedTags
    });

    notify('SEO settings auto-generated! Review and customize as needed.', 'success');
  }, [selectedProduct]);

  // Save SEO settings
  const saveSeoSettings = useCallback(async () => {
    if (!selectedProductId) {
      notify('Please select a product first', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _method: 'PUT',
          id: selectedProductId,
          seo_title: seoData.seo_title,
          seo_description: seoData.seo_description,
          tags: seoData.tags
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save SEO settings');
      }

      notify('SEO settings saved successfully!', 'success');
    } catch (error) {
      notify(error.message || 'Failed to save SEO settings', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [selectedProductId, seoData]);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px' }}>Select Product</h3>
        <select
          value={selectedProductId || ''}
          onChange={(e) => loadProductSeo(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">-- Select a product --</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.title} (₹{product.price})
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <div style={{ marginBottom: '16px', padding: '12px', background: '#e8f5e9', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#2e7d32' }}>
              <strong>Product:</strong> {selectedProduct.title}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#558b2f' }}>
              Price: ₹{selectedProduct.price} | Category: {selectedProduct.category || 'Uncategorized'}
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <button
              type="button"
              onClick={autoGenerateSeo}
              style={{
                padding: '8px 16px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ✨ Auto-Generate SEO
            </button>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              Click to auto-generate SEO settings based on product information. You can customize them afterward.
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              SEO Title (50-60 characters recommended)
            </label>
            <input
              type="text"
              value={seoData.seo_title}
              onChange={(e) => setSeoData({ ...seoData, seo_title: e.target.value })}
              placeholder="SEO title for search engines"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <small style={{ color: '#999', display: 'block', marginTop: '4px' }}>
              Characters: {seoData.seo_title.length}/60
            </small>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              SEO Description (150-160 characters recommended)
            </label>
            <textarea
              value={seoData.seo_description}
              onChange={(e) => setSeoData({ ...seoData, seo_description: e.target.value })}
              placeholder="SEO description for search engines"
              rows="3"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
            <small style={{ color: '#999', display: 'block', marginTop: '4px' }}>
              Characters: {seoData.seo_description.length}/160
            </small>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={seoData.tags}
              onChange={(e) => setSeoData({ ...seoData, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="button"
            onClick={saveSeoSettings}
            disabled={isSaving}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: isSaving ? 0.6 : 1
            }}
          >
            {isSaving ? 'Saving...' : '💾 Save SEO Settings'}
          </button>
        </div>
      )}
    </div>
  );
}

