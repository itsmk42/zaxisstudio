'use client';

import { useState } from 'react';
import { notify } from './Toast';

export default function CarouselFormSection({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image_url: '',
    button_link: '',
    display_order: 0,
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate aspect ratio (1:1)
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          if (Math.abs(aspectRatio - 1) > 0.05) {
            notify('Image should be square (1:1 aspect ratio)', 'error');
            return;
          }
          setImagePreview(event.target.result);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.image_url) {
      notify('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add carousel slide');
      }

      notify('Carousel slide added successfully!', 'success');
      setFormData({
        title: '',
        price: '',
        image_url: '',
        button_link: '',
        display_order: 0,
      });
      setImagePreview('');
      onSuccess?.();
    } catch (err) {
      notify(err.message || 'An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label htmlFor="title">Slide Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Custom Keychains"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price Text *</label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g., ₹199"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="image_url">Image URL *</label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="button_link">Shop Now Link</label>
        <input
          type="url"
          id="button_link"
          name="button_link"
          value={formData.button_link}
          onChange={handleChange}
          placeholder="https://example.com/products"
        />
      </div>

      <div className="form-group">
        <label htmlFor="display_order">Display Order</label>
        <input
          type="number"
          id="display_order"
          name="display_order"
          value={formData.display_order}
          onChange={handleChange}
          min="0"
        />
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

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Carousel Slide'}
      </button>
    </form>
  );
}

