import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Waitlist from './components/Waitlist';
import Footer from './components/Footer';

export default function Page() {
  return (
    <>
      {/* Fixed ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      {/* Grain texture */}
      <div className="grain" />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <Features />
        <HowItWorks />
        <Waitlist />
      </main>

      <Footer />
    </>
  );
}