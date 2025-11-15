import CustomLithophaneBuilder from '../../components/CustomLithophaneBuilder';

export const metadata = {
  title: 'Custom Lithophane Builder — Zaxis Studio',
  description: 'Design your own custom lithophane with your favorite photo. Create a beautiful backlit lithophane with realistic previews.',
  openGraph: {
    title: 'Custom Lithophane Builder',
    description: 'Design your own custom lithophane with your favorite photo. Available as keychain or with LED backlight stand.',
    url: 'https://zaxisstudio.com/custom-lithophane',
  }
};

export default function CustomLithophanePage() {
  return (
    <section className="custom-lithophane-page">
      <CustomLithophaneBuilder />
    </section>
  );
}

