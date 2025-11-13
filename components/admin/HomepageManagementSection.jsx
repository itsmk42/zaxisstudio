'use client';

import { useState } from 'react';
import { notify } from './Toast';

export default function HomepageManagementSection({
  homeConfig,
  setHomeConfig,
  products,
  onSave,
}) {
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    featured: true,
    carousel: false,
    abtest: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const CollapsibleSection = ({ id, title, icon, children }) => (
    <div className="collapsible-section">
      <button
        className="collapsible-header"
        onClick={() => toggleSection(id)}
        aria-expanded={expandedSections[id]}
      >
        <span className="section-icon">{icon}</span>
        <span className="section-title">{title}</span>
        <span className="section-toggle">
          {expandedSections[id] ? '▼' : '▶'}
        </span>
      </button>
      {expandedSections[id] && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="homepage-management">
      <div className="management-header">
        <h2>Homepage Configuration</h2>
        <p>Customize your homepage layout and content</p>
      </div>

      <div className="management-sections">
        {/* Hero/Banner Section */}
        <CollapsibleSection
          id="hero"
          title="Hero Banner Settings"
          icon="🎨"
        >
          <div className="section-content">
            <p className="section-description">
              Configure the main hero banner displayed at the top of your homepage
            </p>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={homeConfig.heroBannerEnabled !== false}
                  onChange={(e) =>
                    setHomeConfig({
                      ...homeConfig,
                      heroBannerEnabled: e.target.checked,
                    })
                  }
                />
                <span>Enable Hero Banner</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="hero-title">Hero Title</label>
              <input
                type="text"
                id="hero-title"
                value={homeConfig.heroTitle || ''}
                onChange={(e) =>
                  setHomeConfig({ ...homeConfig, heroTitle: e.target.value })
                }
                placeholder="e.g., Welcome to Zaxis Studio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hero-subtitle">Hero Subtitle</label>
              <textarea
                id="hero-subtitle"
                value={homeConfig.heroSubtitle || ''}
                onChange={(e) =>
                  setHomeConfig({ ...homeConfig, heroSubtitle: e.target.value })
                }
                placeholder="e.g., Discover amazing 3D printed products"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hero-cta">Call-to-Action Button Text</label>
              <input
                type="text"
                id="hero-cta"
                value={homeConfig.heroCTA || ''}
                onChange={(e) =>
                  setHomeConfig({ ...homeConfig, heroCTA: e.target.value })
                }
                placeholder="e.g., Shop Now"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Featured Products Section */}
        <CollapsibleSection
          id="featured"
          title="Featured Products"
          icon="⭐"
        >
          <div className="section-content">
            <p className="section-description">
              Choose how to display featured products on your homepage
            </p>

            <div className="form-group">
              <label htmlFor="featured-mode">Selection Mode</label>
              <select
                id="featured-mode"
                value={homeConfig.featuredMode || 'manual'}
                onChange={(e) =>
                  setHomeConfig({ ...homeConfig, featuredMode: e.target.value })
                }
              >
                <option value="manual">Manual Selection</option>
                <option value="algorithm">Algorithm-Based</option>
              </select>
              <small>
                {homeConfig.featuredMode === 'manual'
                  ? 'Manually select which products to feature'
                  : 'Automatically select products based on criteria'}
              </small>
            </div>

            {homeConfig.featuredMode === 'manual' ? (
              <div className="form-group">
                <label>Select Products to Feature</label>
                <div className="products-grid">
                  {products.map((p) => (
                    <label key={p.id} className="product-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          homeConfig.featuredManualIds?.includes(p.id) || false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setHomeConfig((cfg) => ({
                            ...cfg,
                            featuredManualIds: checked
                              ? Array.from(
                                  new Set([
                                    ...(cfg.featuredManualIds || []),
                                    p.id,
                                  ])
                                )
                              : (cfg.featuredManualIds || []).filter(
                                  (id) => id !== p.id
                                ),
                          }));
                        }}
                      />
                      <span>{p.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="algorithm-settings">
                <div className="form-group">
                  <label htmlFor="min-price">Minimum Price (₹)</label>
                  <input
                    type="number"
                    id="min-price"
                    value={homeConfig.algorithm?.minPrice || 0}
                    onChange={(e) =>
                      setHomeConfig({
                        ...homeConfig,
                        algorithm: {
                          ...homeConfig.algorithm,
                          minPrice: Number(e.target.value),
                        },
                      })
                    }
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="max-products">Maximum Products</label>
                  <input
                    type="number"
                    id="max-products"
                    value={homeConfig.algorithm?.limit || 6}
                    onChange={(e) =>
                      setHomeConfig({
                        ...homeConfig,
                        algorithm: {
                          ...homeConfig.algorithm,
                          limit: Number(e.target.value),
                        },
                      })
                    }
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="required-tags">Required Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="required-tags"
                    value={homeConfig.algorithm?.tagIncludes?.join(', ') || ''}
                    onChange={(e) =>
                      setHomeConfig({
                        ...homeConfig,
                        algorithm: {
                          ...homeConfig.algorithm,
                          tagIncludes: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    placeholder="e.g., bestseller, new, featured"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Schedule Visibility</label>
              <div className="date-range">
                <div>
                  <label htmlFor="schedule-start">Start Date</label>
                  <input
                    type="date"
                    id="schedule-start"
                    value={homeConfig.schedule?.start || ''}
                    onChange={(e) =>
                      setHomeConfig({
                        ...homeConfig,
                        schedule: {
                          ...homeConfig.schedule,
                          start: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="schedule-end">End Date</label>
                  <input
                    type="date"
                    id="schedule-end"
                    value={homeConfig.schedule?.end || ''}
                    onChange={(e) =>
                      setHomeConfig({
                        ...homeConfig,
                        schedule: {
                          ...homeConfig.schedule,
                          end: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* A/B Testing Section */}
        <CollapsibleSection
          id="abtest"
          title="A/B Testing"
          icon="🧪"
        >
          <div className="section-content">
            <p className="section-description">
              Test different homepage layouts to optimize conversion
            </p>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={homeConfig.abTest?.enabled || false}
                  onChange={(e) =>
                    setHomeConfig({
                      ...homeConfig,
                      abTest: {
                        ...homeConfig.abTest,
                        enabled: e.target.checked,
                      },
                    })
                  }
                />
                <span>Enable A/B Testing</span>
              </label>
              <small>
                Split traffic between two homepage variants to measure performance
              </small>
            </div>

            {homeConfig.abTest?.enabled && (
              <div className="ab-test-info">
                <p>
                  A/B testing is enabled. Visitors will be randomly assigned to
                  Variant A or Variant B.
                </p>
              </div>
            )}
          </div>
        </CollapsibleSection>
      </div>

      <div className="management-footer">
        <button
          className="btn btn-primary"
          onClick={onSave}
        >
          💾 Save Configuration
        </button>
        <p className="save-info">
          Changes are saved to your database and will be reflected on your homepage
        </p>
      </div>
    </div>
  );
}

