import Header from "./components/Header";
import Hero from "./components/Hero";
import TransformDemo from "./components/TransformDemo";
import Features from "./components/Features";
import Process from "./components/Process";
import Templates from "./components/Templates";
import ConversionCTA from "./components/ConversionCTA";
import Pricing from "./components/Pricing";
import ProfileAnalyzer from "./components/ProfileAnalyzer";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <Hero />
        <TransformDemo />
        <Features />
        <Process />
        <Templates />
        <ConversionCTA />
        <Pricing />
        <ProfileAnalyzer />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
