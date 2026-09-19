/**
 * CareerCraft Market Configurations (US Default, India, UK/EU)
 * Strict prop-driven copy, samples, currency, and SEO definitions.
 */

export const MARKETS = {
  us: {
    id: 'us',
    locale: 'en-US',
    hreflang: 'en-US',
    docTerm: 'resume',
    docTermPlural: 'resumes',
    docTermCap: 'Resume',
    spelling: 'US',
    currencySymbol: '$',
    currencyCode: 'USD',
    price: '2.99',
    formattedPrice: '$2.99',
    priceDisclaimer: 'One-time payment. No subscription or recurring fees.',
    
    seo: {
      title: 'CareerCraft — AI LinkedIn Optimization & ATS Resume Builder',
      metaDescription: 'Optimize your LinkedIn profile, match your experience to job descriptions, and create an ATS-friendly resume with CareerCraft.',
      canonical: 'https://careercraft.webelvate.com/',
      ogImage: 'https://careercraft.webelvate.com/og-preview.png',
    },

    hero: {
      eyebrow: 'AI-POWERED CAREER OPTIMIZATION',
      h1: 'Turn Your LinkedIn Into a Job-Ready Profile',
      subcopy: 'Optimize your LinkedIn, match it to the jobs you want, and generate an ATS-friendly resume — all from one profile.',
      ctaPrimary: 'Get My Free LinkedIn Score',
      ctaSecondary: 'See How It Works',
      trustLine: 'No subscription • Takes 2 minutes • One-time upgrade available',
    },

    mock: {
      profileName: 'Investment Banking Analyst',
      targetRole: 'Senior Investment Banking Analyst',
      initialScore: 61,
      optimizedScore: 92,
      checklist: [
        { label: 'Recruiter-Optimized Headline', status: 'checked' },
        { label: 'Quantified About Narrative', status: 'checked' },
        { label: 'Action-Driven Experience Bullets', status: 'checked' },
        { label: 'Strategic Skill Badges', status: 'checked' },
        { label: 'ATS-Friendly Formatting', status: 'checked' },
      ],
      jobMatch: {
        role: 'Senior Financial Analyst & Valuation Specialist',
        matchPercentage: 91,
        matchedKeywords: ['Financial Modeling', 'Valuation (DCF & LBO)', 'M&A Advisory', 'Excel (VBA)'],
        missingKeywords: ['Syndicated Lending', 'Capital Markets'],
      },
      pipelineSteps: ['ATS Resume', 'LinkedIn Profile', 'Job Match Alignment'],
    },

    pricing: {
      badge: 'ONE-TIME ACCESS · NO SUBSCRIPTION',
      headline: 'Simple, transparent pricing for serious job seekers',
      subhead: 'Pay once, optimize your profile, and export your matching ATS resume.',
      planName: 'Full Career Suite',
      price: '199', // Source of truth: ₹199 or $2.99 equivalent
      currency: 'INR',
      displayPrice: '₹199',
      period: 'one-time',
      features: [
        'Complete LinkedIn profile rewrite (Headline, About, Experience)',
        'Keyword match & alignment against target job descriptions',
        'Downloadable ATS-friendly PDF resume with standard formatting',
        'Strategic competency badges and recruiter search optimization',
        'Copy-ready text you can edit and paste into LinkedIn',
        'Instant delivery of your access key to your email',
      ],
      guarantee: 'One-time flat payment. No hidden recurring subscriptions.',
    },

    faq: [
      {
        q: 'Is CareerCraft free to try?',
        a: 'Yes. You can test your LinkedIn headline and get an instant score for free on this page without entering a credit card.',
      },
      {
        q: 'How does LinkedIn optimization work?',
        a: 'CareerCraft analyzes your headline, About section, experience bullets, and skills against modern recruiter search criteria and job descriptions. It provides rewritten, action-oriented text with quantified metrics for you to copy directly into LinkedIn.',
      },
      {
        q: 'Can I optimize my profile for a specific target job?',
        a: 'Yes. You can provide your target job title or description, and CareerCraft will align your headline, summary, and experience to emphasize the relevant skills and keywords for that role.',
      },
      {
        q: 'Does CareerCraft create ATS-friendly resumes?',
        a: 'Yes. CareerCraft generates single-column, cleanly structured PDF resumes that parse reliably in modern Applicant Tracking Systems without complex tables, photos, or unreadable graphics.',
      },
      {
        q: 'Can I edit the generated content?',
        a: 'Yes. CareerCraft outputs copy-ready text that you can review, personalize, and edit before applying it to your LinkedIn profile or downloading your resume.',
      },
      {
        q: 'Is CareerCraft a monthly subscription?',
        a: 'No. CareerCraft charges a single, one-time payment. There are no recurring charges, no monthly renewal fees, and no surprise debits.',
      },
      {
        q: 'What format can I download my resume in?',
        a: 'Your resume is generated as a standard, high-resolution, ATS-parseable PDF document.',
      },
      {
        q: 'Do I need another AI subscription (like ChatGPT Plus)?',
        a: 'No. Everything is powered directly through CareerCraft. You do not need an OpenAI or Claude subscription to use the service.',
      },
      {
        q: 'What happens to my profile data?',
        a: 'Your profile details are used solely to generate your rewrites and resume. We do not sell your data or use your personal career history to train public AI models.',
      },
    ],

    finalCta: {
      headline: 'Your next opportunity starts with a better profile.',
      subhead: 'Optimize your LinkedIn. Match your target job. Build your resume.',
      cta: 'Get My Free LinkedIn Score',
    },
  },

  in: {
    id: 'in',
    locale: 'en-IN',
    hreflang: 'en-IN',
    docTerm: 'resume',
    docTermPlural: 'resumes',
    docTermCap: 'Resume',
    spelling: 'US',
    currencySymbol: '₹',
    currencyCode: 'INR',
    price: '199',
    formattedPrice: '₹199',
    priceDisclaimer: 'Flat one-time payment via UPI / Cards / Netbanking. No monthly subscription.',
    
    seo: {
      title: 'CareerCraft — AI LinkedIn Optimization & ATS Resume Builder for India',
      metaDescription: 'Optimize your LinkedIn profile and generate an ATS-friendly resume tailored for tech, finance, and enterprise job roles in India.',
      canonical: 'https://careercraft.webelvate.com/in',
      ogImage: 'https://careercraft.webelvate.com/og-preview.png',
    },

    hero: {
      eyebrow: 'AI-POWERED CAREER OPTIMIZATION',
      h1: 'Turn Your LinkedIn Into a Job-Ready Profile',
      subcopy: 'Optimize your LinkedIn, match it to target Indian & global job postings, and generate an ATS-friendly resume from one profile.',
      ctaPrimary: 'Get My Free LinkedIn Score',
      ctaSecondary: 'See How It Works',
      trustLine: 'No subscription • Takes 2 minutes • ₹199 One-Time Access',
    },

    mock: {
      profileName: 'Software Engineer',
      targetRole: 'Full Stack Tech Lead',
      initialScore: 58,
      optimizedScore: 94,
      checklist: [
        { label: 'Recruiter-Optimized Headline', status: 'checked' },
        { label: 'Quantified About Narrative', status: 'checked' },
        { label: 'Action-Driven Experience Bullets', status: 'checked' },
        { label: 'Target Skill Badges', status: 'checked' },
        { label: 'ATS-Friendly Resume Format', status: 'checked' },
      ],
      jobMatch: {
        role: 'Full Stack Tech Lead (React / Node / Cloud)',
        matchPercentage: 93,
        matchedKeywords: ['React.js', 'Node.js', 'System Design', 'PostgreSQL', 'Docker'],
        missingKeywords: ['Kubernetes', 'Micro-frontends'],
      },
      pipelineSteps: ['ATS Resume', 'LinkedIn Profile', 'Job Match Alignment'],
    },

    pricing: {
      badge: 'ONE-TIME PAYMENT · NO SUBSCRIPTION',
      headline: 'Affordable, transparent pricing for Indian job seekers',
      subhead: 'Single flat payment via UPI or Cards. Lifetime access to your rewrite.',
      planName: 'Full Career Suite',
      price: '199',
      currency: 'INR',
      displayPrice: '₹199',
      period: 'one-time',
      features: [
        'Complete LinkedIn profile rewrite (Headline, About, Experience)',
        'Alignment with target job descriptions & tech requirements',
        'Downloadable ATS-friendly PDF resume',
        'High-converting action verbs & quantified impact bullets',
        'Instant payment via UPI (Google Pay, PhonePe, Paytm) & Cards',
        'Instant key delivery to your email ID',
      ],
      guarantee: '₹199 flat one-time payment. Zero recurring charges.',
    },

    faq: [
      {
        q: 'Is CareerCraft free to test?',
        a: 'Yes. You can test your headline and view an instant search & impact score for free on this page.',
      },
      {
        q: 'How does payment work in India?',
        a: 'We accept instant UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit cards, and Netbanking via Razorpay.',
      },
      {
        q: 'Is ₹199 a one-time charge or a subscription?',
        a: 'It is strictly a one-time flat charge of ₹199. There are no monthly recurring fees or hidden subscription renewals.',
      },
      {
        q: 'Does CareerCraft create ATS-friendly resumes?',
        a: 'Yes. CareerCraft generates single-column, cleanly formatted PDF resumes that pass cleanly through enterprise applicant tracking systems.',
      },
      {
        q: 'Can I tailor my profile for both Indian and remote international roles?',
        a: 'Yes. You can specify any target job role or paste job requirements to align your experience for domestic and global job opportunities.',
      },
    ],

    finalCta: {
      headline: 'Your next career move starts with a recruiter-ready profile.',
      subhead: 'Optimize your LinkedIn. Match your target job. Build your resume.',
      cta: 'Get My Free LinkedIn Score',
    },
  },

  uk: {
    id: 'uk',
    locale: 'en-GB',
    hreflang: 'en-GB',
    docTerm: 'CV',
    docTermPlural: 'CVs',
    docTermCap: 'CV',
    spelling: 'UK',
    currencySymbol: '£',
    currencyCode: 'GBP',
    price: '2.99',
    formattedPrice: '£2.99',
    priceDisclaimer: 'One-time payment. No subscription or recurring fees.',
    
    seo: {
      title: 'CareerCraft — AI LinkedIn Optimisation & ATS CV Builder',
      metaDescription: 'Optimise your LinkedIn profile, match your experience to job descriptions, and create an ATS-friendly CV with CareerCraft.',
      canonical: 'https://careercraft.webelvate.com/uk',
      ogImage: 'https://careercraft.webelvate.com/og-preview.png',
    },

    hero: {
      eyebrow: 'AI-POWERED CAREER OPTIMISATION',
      h1: 'Turn Your LinkedIn Into a Job-Ready Profile',
      subcopy: 'Optimise your LinkedIn, match it to the jobs you want, and generate an ATS-friendly CV — all from one profile.',
      ctaPrimary: 'Get My Free LinkedIn Score',
      ctaSecondary: 'See How It Works',
      trustLine: 'No subscription • Takes 2 minutes • One-time upgrade available',
    },

    mock: {
      profileName: 'Product Strategist',
      targetRole: 'Senior Product Manager',
      initialScore: 63,
      optimizedScore: 95,
      checklist: [
        { label: 'Recruiter-Optimised Headline', status: 'checked' },
        { label: 'Quantified About Narrative', status: 'checked' },
        { label: 'Action-Driven Experience Bullets', status: 'checked' },
        { label: 'Strategic Skill Badges', status: 'checked' },
        { label: 'ATS-Friendly CV Formatting', status: 'checked' },
      ],
      jobMatch: {
        role: 'Senior Product Manager (FinTech / B2B SaaS)',
        matchPercentage: 92,
        matchedKeywords: ['Product Roadmapping', 'User Research', 'B2B SaaS', 'Agile Leadership'],
        missingKeywords: ['Stakeholder Governance', 'FCA Regulatory Standards'],
      },
      pipelineSteps: ['ATS CV', 'LinkedIn Profile', 'Job Match Alignment'],
    },

    pricing: {
      badge: 'ONE-TIME PAYMENT · NO SUBSCRIPTION',
      headline: 'Simple, transparent pricing for serious job seekers',
      subhead: 'Pay once, optimise your profile, and export your matching ATS CV.',
      planName: 'Full Career Suite',
      price: '199', // Checkout source of truth
      currency: 'INR',
      displayPrice: '£2.99 / ₹199',
      period: 'one-time',
      features: [
        'Complete LinkedIn profile rewrite (Headline, About, Experience)',
        'Keyword match & alignment against target job descriptions',
        'Downloadable ATS-friendly PDF CV with clean UK formatting',
        'Achievement-focused bullets and quantified metrics',
        'Copy-ready text you can edit and paste into LinkedIn',
        'Instant delivery of access key to your email',
      ],
      guarantee: 'One-time flat payment. No recurring monthly subscription.',
    },

    faq: [
      {
        q: 'Is CareerCraft free to test?',
        a: 'Yes. You can test your LinkedIn headline and get an instant score for free on this page.',
      },
      {
        q: 'How does LinkedIn optimisation work?',
        a: 'CareerCraft analyses your headline, About section, experience bullets, and skills against modern recruiter search algorithms and job postings to create high-converting copy.',
      },
      {
        q: 'Does CareerCraft produce ATS-friendly CVs?',
        a: 'Yes. CareerCraft generates single-column, cleanly formatted PDF CVs adhering to UK and European standards without graphics or photos that confuse automated parsers.',
      },
      {
        q: 'What happens to my personal data?',
        a: 'Your profile details are processed securely to generate your rewrites and CV. We do not sell your personal data or train public foundation models on your career history.',
      },
    ],

    finalCta: {
      headline: 'Your next opportunity starts with a better profile.',
      subhead: 'Optimise your LinkedIn. Match your target job. Build your CV.',
      cta: 'Get My Free LinkedIn Score',
    },
  },
};

export function getMarketConfig(marketId = 'us') {
  return MARKETS[marketId] || MARKETS.us;
}
