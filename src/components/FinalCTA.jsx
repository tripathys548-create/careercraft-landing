import Container from "./ui/Container";
import Button from "./ui/Button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { analytics } from "../lib/analytics";

export default function FinalCTA({ marketConfig }) {
  const { finalCta } = marketConfig;

  return (
    <section id="final-cta" className="py-16 sm:py-24 bg-ink text-white relative overflow-hidden">
      <Container size="small">
        <div className="text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {finalCta.headline}
          </h2>

          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto">
            {finalCta.subhead}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              href="#free-score-tool"
              onClick={() => analytics.ctaClick("final_cta_free_score", "final_cta")}
              className="w-full sm:w-auto gap-2 text-sm sm:text-base bg-accent hover:bg-accent-hover text-white shadow-md"
            >
              <span>{finalCta.cta}</span>
              <ArrowRight size={16} />
            </Button>
          </div>

          <p className="pt-2 text-xs text-white/60 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-success" />
            <span>One-time upgrade available • Profile data is processed securely and never sold</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
