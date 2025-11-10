'use client';

import { useState } from 'react';

export default function CarouselForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image_url: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add carousel slide');
      }

      setSuccess('Carousel slide added successfully!');
      setFormData({
        title: '',
        price: '',
        image_url: '',
      });

      // Reload page to show new slide
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form carousel-form">
      <h2>Add New Carousel Slide</h2>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

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
        {formData.image_url && (
          <div className="image-preview">
            <img 
              src={formData.image_url} 
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

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

