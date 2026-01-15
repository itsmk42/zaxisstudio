"use client";
import Image from 'next/image';
import { Key, Image as ImageIcon, Sparkles } from 'lucide-react';

const iconMap = {
  keychain: Key,
  photo: ImageIcon,
  custom: Sparkles,
};

export default function FeaturedItemCard({
  title,
  description,
  image,
  buttonText = "Learn More",
  buttonHref = "#",
  iconType = "custom"
}) {
  const IconComponent = iconMap[iconType] || Sparkles;

  return (
    <article className="featured-card">
      <a href={buttonHref} className="featured-card-media">
        <Image
          src={image}
          alt={title}
          width={600}
          height={340}
          style={{ objectFit: 'cover' }}
        />
        <div className="featured-card-icon" aria-hidden="true">
          <IconComponent size={24} />
        </div>
      </a>
      <div className="featured-card-body">
        <h3 className="featured-card-title">{title}</h3>
        <p className="featured-card-desc">{description}</p>
        <div className="featured-card-action">
          <a
            className="btn"
            href={buttonHref}
            aria-label={`${buttonText} - ${title}`}
          >
            {buttonText}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

