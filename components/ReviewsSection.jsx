"use client";
import { Star } from 'lucide-react';

export default function ReviewsSection({ productId = '', productTitle = '' }) {
  // Sample reviews data with Indian names - in a real app, this would come from the database
  // Each product gets a unique set of reviews based on productId
  const getReviewsForProduct = () => {
    // Define review sets for different products
    const reviewSets = {
      default: [
        {
          id: 1,
          author: 'Priya Sharma',
          rating: 5,
          date: '2024-10-15',
          title: 'Excellent quality and craftsmanship!',
          content: 'The 3D printing quality is outstanding. Perfect details and smooth finish. Highly recommend for custom gifts!',
          helpful: 234,
        },
        {
          id: 2,
          author: 'Rajesh Kumar',
          rating: 5,
          date: '2024-10-10',
          title: 'Best custom printing service',
          content: 'Very impressed with the attention to detail. The product arrived well-packaged and exactly as expected.',
          helpful: 156,
        },
        {
          id: 3,
          author: 'Ananya Patel',
          rating: 4,
          date: '2024-10-05',
          title: 'Great product, fast delivery',
          content: 'Ordered a custom keychain and it turned out amazing. Delivery was faster than expected. Will order again!',
          helpful: 189,
        },
        {
          id: 4,
          author: 'Vikram Singh',
          rating: 5,
          date: '2024-09-28',
          title: 'Perfect for corporate gifts',
          content: 'Ordered 50 units for our company. The quality is consistent and professional. Great customer service too!',
          helpful: 142,
        },
        {
          id: 5,
          author: 'Sneha Reddy',
          rating: 4,
          date: '2024-09-20',
          title: 'Impressed with the finish',
          content: 'The color accuracy and material quality exceeded my expectations. Definitely worth the price.',
          helpful: 98,
        },
      ],
      keychain: [
        {
          id: 1,
          author: 'Arjun Verma',
          rating: 5,
          date: '2024-10-18',
          title: 'Perfect keychain design!',
          content: 'The custom keychain looks exactly like the preview. Great quality plastic and the design is crisp. Perfect gift!',
          helpful: 267,
        },
        {
          id: 2,
          author: 'Divya Nair',
          rating: 5,
          date: '2024-10-12',
          title: 'Durable and beautiful',
          content: 'Been using it for a month now and it still looks brand new. The colors are vibrant and the material is sturdy.',
          helpful: 178,
        },
        {
          id: 3,
          author: 'Rohan Gupta',
          rating: 4,
          date: '2024-10-08',
          title: 'Great value for money',
          content: 'Ordered 5 keychains for friends. Everyone loved them. The quality is excellent for the price point.',
          helpful: 145,
        },
        {
          id: 4,
          author: 'Meera Iyer',
          rating: 5,
          date: '2024-09-30',
          title: 'Exceeded expectations',
          content: 'The detail on the keychain is incredible. It\'s like holding a tiny work of art. Highly recommend!',
          helpful: 203,
        },
      ],
      lithophane: [
        {
          id: 1,
          author: 'Sanjay Krishnan',
          rating: 5,
          date: '2024-10-16',
          title: 'Stunning lithophane!',
          content: 'The photo lithophane turned out absolutely beautiful. The light effect is magical. Perfect for home decor!',
          helpful: 312,
        },
        {
          id: 2,
          author: 'Kavya Desai',
          rating: 5,
          date: '2024-10-11',
          title: 'Amazing gift idea',
          content: 'Ordered a lithophane of my family photo. The detail is incredible and the lighting effect is perfect. Loved it!',
          helpful: 289,
        },
        {
          id: 3,
          author: 'Nikhil Joshi',
          rating: 4,
          date: '2024-10-06',
          title: 'Great quality, unique gift',
          content: 'The lithophane quality is excellent. It\'s a unique and thoughtful gift. Highly satisfied with the purchase.',
          helpful: 167,
        },
        {
          id: 4,
          author: 'Pooja Malhotra',
          rating: 5,
          date: '2024-09-25',
          title: 'Perfect for special occasions',
          content: 'Ordered for my anniversary. The photo detail is perfect and the lighting creates a beautiful ambiance.',
          helpful: 245,
        },
        {
          id: 5,
          author: 'Aditya Bansal',
          rating: 5,
          date: '2024-09-18',
          title: 'Exceptional craftsmanship',
          content: 'The precision and quality of the lithophane is outstanding. It\'s a premium product worth every rupee.',
          helpful: 198,
        },
      ],
      nameplate: [
        {
          id: 1,
          author: 'Neha Chopra',
          rating: 5,
          date: '2024-10-14',
          title: 'Professional and elegant',
          content: 'The desk nameplate looks very professional. Perfect for my office. The engraving is crisp and clear.',
          helpful: 201,
        },
        {
          id: 2,
          author: 'Amit Saxena',
          rating: 5,
          date: '2024-10-09',
          title: 'Excellent for corporate use',
          content: 'Ordered 10 nameplates for our office. The quality is consistent and professional. Great service!',
          helpful: 156,
        },
        {
          id: 3,
          author: 'Riya Kapoor',
          rating: 4,
          date: '2024-10-04',
          title: 'Great quality nameplate',
          content: 'The nameplate is well-made and looks elegant on my desk. The text is perfectly aligned and clear.',
          helpful: 134,
        },
        {
          id: 4,
          author: 'Harsh Patel',
          rating: 5,
          date: '2024-09-27',
          title: 'Perfect desk accessory',
          content: 'Adds a professional touch to my workspace. The material quality is excellent and it looks premium.',
          helpful: 189,
        },
      ],
    };

    // Determine which review set to use based on product title
    let reviewSet = reviewSets.default;
    if (productTitle.toLowerCase().includes('keychain')) {
      reviewSet = reviewSets.keychain;
    } else if (productTitle.toLowerCase().includes('lithophane')) {
      reviewSet = reviewSets.lithophane;
    } else if (productTitle.toLowerCase().includes('nameplate')) {
      reviewSet = reviewSets.nameplate;
    }

    return reviewSet;
  };

  const reviews = getReviewsForProduct();

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

