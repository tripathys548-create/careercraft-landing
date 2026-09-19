import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import ProfileAnalyzer from "./components/ProfileAnalyzer";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import StickyCta from "./components/ui/StickyCta";
import SupportModal from "./components/SupportModal";
import AdminModal from "./components/AdminModal";
import { MARKETS, getMarketConfig } from "./config/marketConfig";
import { analytics, setAnalyticsMarket } from "./lib/analytics";

export default function App() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  
  // Market configuration state (defaults to US, support /in or /uk)
  const [marketId, setMarketId] = useState("in"); // Default India / USD as configured
  const marketConfig = getMarketConfig(marketId);

  useEffect(() => {
    // Detect market from pathname if available
    const path = window.location.pathname;
    let detected = "in";
    if (path.startsWith("/uk")) detected = "uk";
    else if (path.startsWith("/in")) detected = "in";
    else if (path === "/" || path.startsWith("/us")) detected = "in"; // Set to launch market

    setMarketId(detected);
    setAnalyticsMarket(detected);
    analytics.landingView(detected);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans selection:bg-accent/15 selection:text-accent">
      <Header
        onOpenSupport={() => setSupportOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        marketConfig={marketConfig}
      />

      <main id="main-content" className="flex-1">
        <Hero marketConfig={marketConfig} />
        <Pricing marketConfig={marketConfig} />
        
        {/* Full Interactive Optimizer Suite */}
        <ProfileAnalyzer />

        <FAQ marketConfig={marketConfig} />
        <FinalCTA marketConfig={marketConfig} />
      </main>

      <Footer
        onOpenSupport={() => setSupportOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        marketConfig={marketConfig}
      />

      {/* Sticky Mobile CTA */}
      <StickyCta
        targetId="free-score-tool"
        text="Get My Free Score"
        onAction={() => {
          const el = document.getElementById("free-score-tool");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Support & Admin Modals */}
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
