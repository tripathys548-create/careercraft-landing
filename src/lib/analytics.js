/**
 * CareerCraft Privacy-First & Consent-Respecting Analytics Dispatcher
 * Dispatches standard events with market dimension without PII.
 */

// Global market state
let currentMarket = 'us';

export function setAnalyticsMarket(market) {
  currentMarket = market || 'us';
}

export function getAnalyticsMarket() {
  return currentMarket;
}

/**
 * Dispatch an event to dataLayer / custom listeners / console in dev
 */
export function trackEvent(eventName, payload = {}) {
  // Check if running on UK/EU route without consent (if consent system active)
  if (typeof window !== 'undefined' && window.__CAREERCRAFT_CONSENT__ === false && (currentMarket === 'uk' || currentMarket === 'eu')) {
    // Suppress non-essential analytics
    return;
  }

  const cleanPayload = {
    event: eventName,
    market: currentMarket,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // Push to window dataLayer if available
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(cleanPayload);
    
    // Dispatch a custom DOM event for listening
    window.dispatchEvent(new CustomEvent('careercraft:analytics', { detail: cleanPayload }));
  }

  if (import.meta.env?.DEV) {
    console.debug('[Analytics Event]', eventName, cleanPayload);
  }
}

// Convenient helper functions
export const analytics = {
  landingView: (market = currentMarket) => trackEvent('landing_view', { market }),
  ctaClick: (ctaId, section) => trackEvent('cta_click', { cta_id: ctaId, section }),
  scoreFlowStart: (tool = 'free_score') => trackEvent('score_flow_start', { tool }),
  scoreFlowComplete: (score, tool = 'free_score') => trackEvent('score_flow_complete', { score, tool }),
  pricingView: () => trackEvent('pricing_view'),
  checkoutStart: (planId, currency, amount) => trackEvent('checkout_start', { plan_id: planId, currency, amount }),
  faqExpand: (question) => trackEvent('faq_expand', { question }),
};
