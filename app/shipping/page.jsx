export const metadata = {
  title: 'Shipping Policy — Zaxis Studio',
  description: 'Learn about our shipping methods, delivery times, and tracking information for your Zaxis Studio orders.',
};

export default function ShippingPage() {
  return (
    <div className="container policy-page">
      <h1 className="page-title">Shipping Policy</h1>
      
      <div className="policy-content">
        <section className="policy-section">
          <h2>1. Order Processing</h2>
          <p>
            All orders are processed within 2-3 business days. Please note that orders placed on weekends or holidays will be 
            processed on the next business day. Once your order is processed, you will receive a confirmation email with tracking information.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Shipping Methods</h2>
          <p>
            We offer the following shipping options:
          </p>
          <ul className="policy-list">
            <li><strong>Standard Shipping:</strong> Delivery within 5-7 business days</li>
            <li><strong>Express Shipping:</strong> Delivery within 2-3 business days</li>
            <li><strong>Overnight Shipping:</strong> Delivery within 1 business day</li>
          </ul>
          <p>
            Shipping methods and availability may vary based on your location. The selected shipping method will be confirmed 
            during checkout.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. Shipping Costs</h2>
          <p>
            Shipping costs are calculated based on the weight of your order, destination address, and selected shipping method. 
            The exact shipping cost will be displayed during checkout before you complete your purchase. We offer free shipping 
            on orders over a certain amount (details available at checkout).
          </p>
        </section>

        <section className="policy-section">
          <h2>4. Delivery Timeframes</h2>
          <p>
            Delivery timeframes are estimates and are not guaranteed. Factors such as weather, holidays, and carrier delays may 
            affect delivery times. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Tracking Information</h2>
          <p>
            Once your order is shipped, you will receive an email with a tracking number and a link to track your package. 
            You can use this tracking number to monitor your shipment's progress. Please allow 24 hours for tracking information 
            to be updated in the carrier's system.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Shipping Address</h2>
          <p>
            Please ensure that your shipping address is accurate and complete. We are not responsible for packages delivered to 
            incorrect addresses due to customer error. If you need to change your shipping address, please contact us immediately 
            at <a href="mailto:support@artheonecom.com">support@artheonecom.com</a>.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. International Shipping</h2>
          <p>
            We currently ship to select international locations. International orders may be subject to customs duties and taxes, 
            which are the responsibility of the customer. Delivery times for international orders may be longer than domestic orders.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Lost or Damaged Packages</h2>
          <p>
            If your package is lost or arrives damaged, please contact us immediately with photos of the damage and your tracking number. 
            We will work with the shipping carrier to investigate and resolve the issue. In most cases, we will either send a replacement 
            or issue a refund.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Returns and Exchanges</h2>
          <p>
            If you wish to return or exchange a product, please contact us at <a href="mailto:support@artheonecom.com">support@artheonecom.com</a> 
            within 30 days of receiving your order. We will provide you with return shipping instructions. Return shipping costs are 
            the responsibility of the customer unless the return is due to our error or a defective product.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Refunds</h2>
          <p>
            Once we receive and inspect your returned item, we will process your refund within 5-7 business days. Refunds will be 
            issued to your original payment method. Please note that refunds do not include original shipping costs unless the return 
            is due to our error.
          </p>
        </section>

        <section className="policy-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about our Shipping Policy, please contact us at{' '}
            <a href="mailto:support@artheonecom.com">support@artheonecom.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

