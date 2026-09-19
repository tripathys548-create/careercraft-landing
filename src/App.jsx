import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BeforeAfter from "./components/BeforeAfter";
import HowItWorks from "./components/HowItWorks";
import JobMatching from "./components/JobMatching";
import Features from "./components/Features";
import ResumePreviewSection from "./components/ResumePreviewSection";
import Trust from "./components/Trust";
import Comparison from "./components/Comparison";
import UKPrivacySection from "./components/UKPrivacySection";
import Pricing from "./components/Pricing";
import ProfileAnalyzer from "./components/ProfileAnalyzer";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import StickyCta from "./components/ui/StickyCta";
import ConsentBanner from "./components/ui/ConsentBanner";
import SupportModal from "./components/SupportModal";
import AdminModal from "./components/AdminModal";
import { getMarketConfig } from "./config/marketConfig";
import { analytics, setAnalyticsMarket } from "./lib/analytics";

export default function App() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  
  // Market configuration state (default India 'in', supports 'uk', 'us')
  const [marketId, setMarketId] = useState("in");
  const marketConfig = getMarketConfig(marketId);

  // Initialize and synchronize market from path
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    let initialMarket = "in";
    if (path.startsWith("/uk")) {
      initialMarket = "uk";
    } else if (path.startsWith("/us")) {
      initialMarket = "us";
    } else if (path.startsWith("/in")) {
      initialMarket = "in";
    }

    setMarketId(initialMarket);
    setAnalyticsMarket(initialMarket);
    analytics.landingView(initialMarket);
  }, []);

  // Update document title, meta tags, canonical, and hreflang dynamically
  useEffect(() => {
    if (!marketConfig?.seo) return;

    // Title
    document.title = marketConfig.seo.title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = marketConfig.seo.metaDescription;

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = marketConfig.seo.canonical;

    // Hreflang alternates
    if (marketConfig.seo.alternateHreflangs) {
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
      marketConfig.seo.alternateHreflangs.forEach((alt) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = alt.lang;
        link.href = alt.href;
        document.head.appendChild(link);
      });
    }
  }, [marketConfig]);

  const handleSwitchMarket = (newMarketId, targetPath) => {
    setMarketId(newMarketId);
    setAnalyticsMarket(newMarketId);
    if (window.history && window.history.pushState) {
      window.history.pushState({}, "", targetPath);
    }
    analytics.landingView(newMarketId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans selection:bg-accent/15 selection:text-accent">
      <Header
        onOpenSupport={() => setSupportOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        marketConfig={marketConfig}
        currentMarket={marketId}
        onSwitchMarket={handleSwitchMarket}
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

        {/* One Profile -> Matching ATS Resume / CV */}
        <ResumePreviewSection marketConfig={marketConfig} />

        {/* Verified Principles & Trust */}
        <Trust marketConfig={marketConfig} />

        {/* Category Comparison Table */}
        <Comparison marketConfig={marketConfig} />

        {/* UK/EU Data Processing & Privacy Facts Section */}
        {marketId === "uk" && <UKPrivacySection marketConfig={marketConfig} />}

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
        currentMarket={marketId}
        onSwitchMarket={handleSwitchMarket}
      />

      {/* Sticky Mobile CTA */}
      <StickyCta
        targetId="free-score-tool"
        text={marketId === "uk" ? "Get My Free CV Score" : "Get My Free Score"}
        onAction={() => {
          const el = document.getElementById("free-score-tool");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* UK / EU Cookie & Analytics Consent Banner */}
      <ConsentBanner marketId={marketId} />

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
