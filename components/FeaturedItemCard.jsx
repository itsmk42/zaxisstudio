"use client";
import Image from 'next/image';

export default function FeaturedItemCard({ title, description, image, buttonText = "Learn More", buttonHref = "#" }) {
  return (
    <div className="card">
      <a href={buttonHref} className="card-media">
        <Image src={image} alt={title} width={400} height={300} />
      </a>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
        <div className="card-actions">
          <a
            className="btn buy-now"
            href={buttonHref}
            aria-label={`${buttonText} - ${title}`}
          >
            ⚡ {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}

