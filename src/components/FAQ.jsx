import Section from "./ui/Section";
import Container from "./ui/Container";
import FaqItem from "./ui/FaqItem";
import { analytics } from "../lib/analytics";

export default function FAQ({ marketConfig }) {
  const { faq } = marketConfig;

  return (
    <Section id="faq" background="surface" className="scroll-mt-16">
      <Container size="narrow">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-muted">
            Direct, factual answers about CareerCraft and our optimization workflow.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faq.map((item, idx) => (
            <FaqItem
              key={idx}
              question={item.q}
              answer={item.a}
              onToggle={(isOpen) => {
                if (isOpen) {
                  analytics.faqExpand(item.q);
                }
              }}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
