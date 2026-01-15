"use client";
import { Palette, Zap, Shield } from 'lucide-react';

const capabilities = [
  {
    icon: Palette,
    iconColor: 'teal',
    title: 'Custom Design',
    description: 'Bring your ideas to life with personalized 3D printed creations tailored to your exact specifications.',
  },
  {
    icon: Zap,
    iconColor: 'violet',
    title: 'Fast Printing',
    description: 'Quick turnaround times with professional-grade 3D printing technology for rapid prototyping and production.',
  },
  {
    icon: Shield,
    iconColor: 'lime',
    title: 'Quality Assured',
    description: 'Premium materials and precise printing ensure durable, high-quality results every time.',
  },
];

export default function CapabilitiesShowcase() {
  return (
    <section className="capabilities-section" aria-labelledby="capabilities-heading">
      <div className="container">
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 id="capabilities-heading">Why Choose Zaxis Studio</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Professional 3D printing with a personal touch
          </p>
        </div>
        <div className="capabilities-grid">
          {capabilities.map((cap) => (
            <article key={cap.title} className="capability-card">
              <div className={`capability-icon ${cap.iconColor}`} aria-hidden="true">
                <cap.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="capability-title">{cap.title}</h3>
              <p className="capability-desc">{cap.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

