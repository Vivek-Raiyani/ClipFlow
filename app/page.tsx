import Hero from "./components/Hero";
import Features from "./components/Features";

export default function Page() {
  return (
    <main>
      <Hero />
      <Features />
      
      {/* Feature Sections can be added here */}
      <section className="container" style={{ padding: '8rem 2rem' }}>
        <div style={{ textAlign: 'center', opacity: 0.5 }}>
          <p>Trusted by the world&apos;s most secure content teams</p>
        </div>
      </section>
    </main>
  );
}