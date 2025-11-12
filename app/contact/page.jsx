export const metadata = {
  title: 'Contact Us — Zaxis Studio',
  description: 'Get in touch with Zaxis Studio. We are here to help with any questions or concerns about our products and services.',
};

export default function ContactPage() {
  return (
    <div className="container policy-page">
      <h1 className="page-title">Contact Us</h1>
      
      <div className="policy-content">
        <section className="policy-section contact-section">
          <h2>Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions about our products, need assistance with an order, 
            or have feedback to share, please don't hesitate to reach out.
          </p>
        </section>

        <section className="policy-section contact-info">
          <h2>Contact Information</h2>
          
          <div className="contact-item">
            <h3>Email</h3>
            <p>
              <a href="mailto:support@artheonecom.com">support@artheonecom.com</a>
            </p>
            <p className="contact-note">
              We typically respond to emails within 24 business hours.
            </p>
          </div>

          <div className="contact-item">
            <h3>Business Hours</h3>
            <p>
              Monday - Friday: 9:00 AM - 6:00 PM (IST)<br />
              Saturday - Sunday: Closed
            </p>
            <p className="contact-note">
              We may have extended hours during peak seasons.
            </p>
          </div>

          <div className="contact-item">
            <h3>Response Time</h3>
            <p>
              We aim to respond to all inquiries within 24 business hours. During peak seasons or holidays, 
              response times may be slightly longer.
            </p>
          </div>
        </section>

        <section className="policy-section">
          <h2>What We Can Help With</h2>
          <ul className="policy-list">
            <li>Product inquiries and specifications</li>
            <li>Order status and tracking</li>
            <li>Shipping and delivery questions</li>
            <li>Returns and refunds</li>
            <li>Custom order requests</li>
            <li>Technical support</li>
            <li>General feedback and suggestions</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>How long does shipping take?</h3>
            <p>
              Standard shipping typically takes 5-7 business days. Express and overnight options are also available. 
              See our <a href="/shipping">Shipping Policy</a> for more details.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I modify or cancel my order?</h3>
            <p>
              If your order hasn't been processed yet, we may be able to modify or cancel it. Please contact us immediately 
              at <a href="mailto:support@artheonecom.com">support@artheonecom.com</a> with your order number.
            </p>
          </div>

          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>
              We accept returns within 30 days of purchase. Items must be unused and in original condition. 
              Please refer to our <a href="/shipping">Shipping Policy</a> for complete return details.
            </p>
          </div>

          <div className="faq-item">
            <h3>Do you offer custom orders?</h3>
            <p>
              Yes! We specialize in custom 3D printed products. Please contact us to discuss your custom project requirements.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are your products eco-friendly?</h3>
            <p>
              We use high-quality 3D printing materials. For specific information about material composition and sustainability, 
              please contact us.
            </p>
          </div>
        </section>

        <section className="policy-section">
          <h2>Other Resources</h2>
          <ul className="policy-list">
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/shipping">Shipping Policy</a></li>
            <li><a href="/products">Browse Our Products</a></li>
          </ul>
        </section>

        <section className="policy-section contact-cta">
          <h2>Ready to Get Started?</h2>
          <p>
            Have a question or ready to place an order? Reach out to us at{' '}
            <a href="mailto:support@artheonecom.com">support@artheonecom.com</a> and we'll be happy to assist you!
          </p>
          <a href="mailto:support@artheonecom.com" className="btn btn-primary">
            Send us an Email
          </a>
        </section>
      </div>
    </div>
  );
}

