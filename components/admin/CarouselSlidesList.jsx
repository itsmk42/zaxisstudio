'use client';

import { useState } from 'react';
import { notify } from './Toast';
import ConfirmDialog from './ConfirmDialog';

export default function CarouselSlidesList({ slides = [], onUpdate }) {
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, title: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/carousel?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete slide');
      }

      notify('Carousel slide deleted successfully!', 'success');
      setConfirmDelete({ open: false, id: null, title: '' });
      onUpdate?.();
    } catch (err) {
      notify(err.message || 'An error occurred', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (id, direction) => {
    try {
      const response = await fetch(`/api/admin/carousel?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder slide');
      }

      notify('Slide reordered successfully!', 'success');
      onUpdate?.();
    } catch (err) {
      notify(err.message || 'An error occurred', 'error');
    }
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="empty-state">
        <p>No carousel slides yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="carousel-slides-grid">
        {slides.map((slide, index) => (
          <div key={slide.id} className="carousel-slide-card">
            <div className="slide-image-container">
              <img 
                src={slide.image_url || '/placeholder.svg'} 
                alt={slide.title}
                className="slide-image"
              />
              <div className="slide-order-badge">{index + 1}</div>
            </div>
            
            <div className="slide-content">
              <h4 className="slide-title">{slide.title}</h4>
              <p className="slide-price">{slide.price}</p>
              {slide.button_link && (
                <p className="slide-link">
                  <a href={slide.button_link} target="_blank" rel="noopener noreferrer">
                    {slide.button_link}
                  </a>
                </p>
              )}
            </div>

            <div className="slide-actions">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleReorder(slide.id, 'up')}
                disabled={index === 0}
                title="Move up"
              >
                ↑
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleReorder(slide.id, 'down')}
                disabled={index === slides.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setConfirmDelete({ open: true, id: slide.id, title: slide.title })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Carousel Slide"
        message={`Are you sure you want to delete "${confirmDelete.title}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete({ open: false, id: null, title: '' })}
      />
    </>
  );
}

