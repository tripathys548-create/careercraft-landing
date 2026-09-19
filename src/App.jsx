import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BeforeAfter from "./components/BeforeAfter";
import HowItWorks from "./components/HowItWorks";
import JobMatching from "./components/JobMatching";
import Features from "./components/Features";
import ResumePreviewSection from "./components/ResumePreviewSection";
import Trust from "./components/Trust";
import Pricing from "./components/Pricing";
import ProfileAnalyzer from "./components/ProfileAnalyzer";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import StickyCta from "./components/ui/StickyCta";
import SupportModal from "./components/SupportModal";
import AdminModal from "./components/AdminModal";
import { getMarketConfig } from "./config/marketConfig";
import { analytics, setAnalyticsMarket } from "./lib/analytics";

export default function App() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  
  // Market configuration state
  const [marketId, setMarketId] = useState("in");
  const marketConfig = getMarketConfig(marketId);

  useEffect(() => {
    const path = window.location.pathname;
    let detected = "in";
    if (path.startsWith("/uk")) detected = "uk";
    else if (path.startsWith("/us")) detected = "us";
    else if (path.startsWith("/in")) detected = "in";

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
        {/* Hero with live headline discoverability evaluator */}
        <Hero marketConfig={marketConfig} />

        {/* Before / After Transformation */}
        <BeforeAfter marketConfig={marketConfig} />

        {/* 4-Step Process */}
        <HowItWorks marketConfig={marketConfig} />

        {/* Job Match & Keyword Coverage */}
        <JobMatching marketConfig={marketConfig} />

        {/* 6 Core Features */}
        <Features marketConfig={marketConfig} />

        {/* One Profile -> Matching ATS Resume */}
        <ResumePreviewSection marketConfig={marketConfig} />

        {/* Verified Principles & Trust */}
        <Trust marketConfig={marketConfig} />

        {/* Transparent One-Time Pricing */}
        <Pricing marketConfig={marketConfig} />
        
        {/* Full Suite Optimizer / Workspace */}
        <ProfileAnalyzer />

        {/* Verified FAQs */}
        <FAQ marketConfig={marketConfig} />

        {/* Closing Conversion CTA */}
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

      {/* Modals */}
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
