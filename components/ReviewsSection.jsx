"use client";
import { Star } from 'lucide-react';

export default function ReviewsSection({ productId = '', productTitle = '' }) {
  // Sample reviews data - in a real app, this would come from the database
  const reviews = [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: '2024-10-15',
      title: 'Excellent quality!',
      content: 'The product exceeded my expectations. Great craftsmanship and fast shipping.',
      helpful: 234,
    },
    {
      id: 2,
      author: 'John D.',
      rating: 4,
      date: '2024-10-10',
      title: 'Very good, minor issue',
      content: 'Overall very satisfied. One small detail could be improved.',
      helpful: 156,
    },
    {
      id: 3,
      author: 'Emma L.',
      rating: 5,
      date: '2024-10-05',
      title: 'Perfect gift!',
      content: 'Bought this as a gift and the recipient loved it. Highly recommend!',
      helpful: 189,
    },
  ];

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = 1024;

  const renderStars = (rating) => {
    return (
      <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'star-filled' : 'star-empty'}
            fill={i < rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="rating-display">
            {renderStars(Math.round(averageRating))}
            <span className="rating-number">{averageRating}</span>
            <span className="review-count">({totalReviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Sort options */}
      <div className="reviews-controls">
        <select className="sort-select" aria-label="Sort reviews by">
          <option value="helpful">Most Helpful</option>
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews list */}
      <div className="reviews-list">
        {reviews.map((review) => (
          <article key={review.id} className="review-item">
            <div className="review-header">
              <div className="review-author-info">
                <h3 className="review-title">{review.title}</h3>
                <p className="review-author">{review.author}</p>
              </div>
              <time className="review-date" dateTime={review.date}>
                {new Date(review.date).toLocaleDateString()}
              </time>
            </div>
            <div className="review-rating">
              {renderStars(review.rating)}
            </div>
            <p className="review-content">{review.content}</p>
            <div className="review-footer">
              <button className="helpful-btn" aria-label={`Mark as helpful (${review.helpful} found helpful)`}>
                👍 Helpful ({review.helpful})
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* See all reviews button */}
      <div className="reviews-footer">
        <button className="btn primary" aria-label="View all reviews">
          See All Reviews
        </button>
      </div>
    </section>
  );
}

