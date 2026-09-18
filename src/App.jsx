import { useState } from "react";
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
import SupportModal from "./components/SupportModal";
import AdminModal from "./components/AdminModal";

export default function App() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <Header
        onOpenSupport={() => setSupportOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />
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
      <Footer
        onOpenSupport={() => setSupportOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      <SupportModal
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}
