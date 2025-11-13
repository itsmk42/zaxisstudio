import CustomKeychainBuilder from '../../components/CustomKeychainBuilder';

export const metadata = {
  title: 'Custom Keychain Builder — Zaxis Studio',
  description: 'Design your own custom keychain with personalized text, number plates, or pet tags. 3D printed and delivered to your door.',
  openGraph: {
    title: 'Custom Keychain Builder',
    description: 'Design your own custom keychain with personalized text, number plates, or pet tags.',
    url: 'https://zaxisstudio.com/custom-keychain',
  }
};

export default function CustomKeychainPage() {
  return (
    <section className="custom-keychain-page">
      <CustomKeychainBuilder />
    </section>
  );
}

