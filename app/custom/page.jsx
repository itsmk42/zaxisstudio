import CustomKeychainForm from '../../components/CustomKeychainForm';
import LithophaneForm from '../../components/LithophaneForm';

export const metadata = {
  title: 'Custom Orders — Zaxis Studio',
  description: 'Request custom 3D printed keychains or lithophane photo boxes.'
};

export default function CustomPage() {
  return (
    <section>
      <h1 className="page-title">Custom Orders</h1>
      <div className="grid two">
        <CustomKeychainForm />
        <LithophaneForm />
      </div>
    </section>
  );
}
