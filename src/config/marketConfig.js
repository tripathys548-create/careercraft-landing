/**
 * CareerCraft Market Configurations
 * Strict prop-driven copy, samples, currency, comparison, and SEO definitions for:
 * - India (/in)
 * - UK / EU (/uk)
 * - US / Global Default (/)
 */

export const MARKETS = {
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
    priceDisclaimer: 'Flat one-time payment via UPI / Cards / Netbanking. No recurring subscription.',
    
    seo: {
      title: 'CareerCraft — AI LinkedIn Optimization & ATS Resume Builder for India',
      metaDescription: 'Optimize your LinkedIn profile and generate an ATS-friendly resume tailored for tech, finance, and enterprise job roles in India.',
      canonical: 'https://careercraft.webelvate.com/in',
      ogImage: 'https://careercraft.webelvate.com/og-preview.png',
      alternateHreflangs: [
        { lang: 'en-IN', href: 'https://careercraft.webelvate.com/in' },
        { lang: 'en-GB', href: 'https://careercraft.webelvate.com/uk' },
        { lang: 'en-US', href: 'https://careercraft.webelvate.com/' },
        { lang: 'x-default', href: 'https://careercraft.webelvate.com/' },
      ],
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

    beforeAfter: {
      headline: 'See the Difference in Career Positioning',
      subhead: 'How CareerCraft transforms passive job descriptions into high-converting recruiter assets.',
      badge: 'Profile Transformation',
      disclaimer: 'Illustrative example. Not a customer result. Real output uses your verified career numbers.',
      metrics: {
        scoreBefore: 61,
        scoreAfter: 94,
        matchBefore: 58,
        matchAfter: 93,
      },
      before: {
        title: 'Software Developer at Enterprise Services',
        headline: 'Software Developer at Enterprise Services | Open to Opportunities',
        summary: 'Working on backend systems and building internal tools. Experienced in JavaScript, SQL and REST APIs. Seeking new tech opportunities.',
        bullet: 'Worked on bug fixes and added new features to existing client applications.',
      },
      after: {
        title: 'Full Stack Software Engineer | Cloud Architecture',
        headline: 'Full Stack Engineer | React.js • Node.js • Cloud Systems | Scalable Distributed Architecture',
        summary: 'Engineered high-throughput microservices and real-time dashboard applications serving 120k+ daily active users. Reduced API latency by 42% and automated CI/CD deployment pipelines.',
        bullet: 'Architected event-driven ingestion pipeline in Node.js & PostgreSQL, handling 2.4M transactions daily with 99.98% uptime.',
      },
    },

    howItWorks: {
      headline: 'From LinkedIn Profile to Interview-Ready in 4 Steps',
      subhead: 'A simple, direct workflow to align your professional story and export a clean resume.',
      steps: [
        {
          number: '01',
          title: 'Add Your Profile',
          desc: 'Paste your LinkedIn text or upload your existing resume PDF.',
        },
        {
          number: '02',
          title: 'Paste Target Job Description',
          desc: 'Provide the job posting you want to target to extract critical skills and keywords.',
        },
        {
          number: '03',
          title: 'Review Keyword & Profile Gaps',
          desc: 'See which skills match and exactly which high-frequency terms are missing.',
        },
        {
          number: '04',
          title: 'Generate Profile & ATS Resume',
          desc: 'Export copy-ready LinkedIn sections and download a clean ATS-friendly PDF resume.',
        },
      ],
    },

    jobMatching: {
      headline: 'Precision Keyword Matching for Target Roles',
      subhead: 'CareerCraft maps target job requirements directly onto your headline, About section, and resume.',
      roleTitle: 'Senior Full Stack Tech Lead',
      matchScore: 93,
      matched: ['React.js', 'Node.js', 'REST APIs', 'PostgreSQL', 'Docker', 'System Design'],
      missing: ['Kubernetes', 'CI/CD Pipelines'],
      cta: 'Optimize My Profile',
    },

    features: [
      {
        title: 'LinkedIn Profile Score',
        desc: 'Comprehensive breakdown evaluating headline discoverability, About narrative impact, and skill indexing.',
      },
      {
        title: 'Recruiter-Ready Headline',
        desc: 'SEO-focused headlines under 220 characters structured around the roles and skills recruiters search for.',
      },
      {
        title: 'Stronger About Section',
        desc: 'A punchy 3-part narrative with a clear hook, quantified achievements, and strategic call-to-action.',
      },
      {
        title: 'Achievement-Focused Experience',
        desc: 'Experience bullets rewritten to lead with strong action verbs and quantified business impact.',
      },
      {
        title: 'Job Description Matching',
        desc: 'Identifies critical skills and terminology from target job postings and maps them to your profile.',
      },
      {
        title: 'ATS-Friendly Resume',
        desc: 'Generates a clean, single-column PDF resume that parses accurately in Applicant Tracking Systems.',
      },
    ],

    comparison: {
      headline: 'How CareerCraft Compares',
      subhead: 'Why career practitioners choose CareerCraft over expensive agencies or generic AI chatbots.',
      traditionalLabel: 'Resume Writing Services',
    },

    resumeSection: {
      headline: 'One profile. One consistent career story.',
      subhead: 'Your LinkedIn and resume should reinforce the same narrative. CareerCraft synthesizes both into an ATS-compliant PDF.',
      cta: 'Build My Resume',
      callouts: [
        { title: 'ATS-Friendly Formatting', desc: 'Single-column structure, standard headings, and clean parseable fonts.' },
        { title: 'Job-Specific Keywords', desc: 'Strategically incorporates the high-frequency terms recruiters look for.' },
        { title: 'Achievement-Focused Bullets', desc: 'Replaces passive duty lists with action verbs and concrete metrics.' },
        { title: 'Aligned Positioning', desc: 'Ensures your resume and LinkedIn tell the exact same career story.' },
      ],
      preview: {
        name: 'SAMEER TRIPATHY',
        title: 'Senior Software Engineer | Distributed Systems & Cloud',
        summary: 'Full Stack Engineer with 4+ years experience architecting scalable web applications and microservices. Proven record in reducing backend latency and building cloud infrastructure.',
        experience: [
          'Architected real-time transactional data pipeline using Node.js, PostgreSQL, and Docker, reducing API response times by 38%.',
          'Spearheaded transition to modular micro-services architecture, supporting 100k+ active users across production workloads.',
        ],
        skills: ['React.js', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'System Design', 'TypeScript', 'AWS'],
        education: 'Bachelor of Technology in Computer Science',
      },
    },

    trust: {
      headline: 'Built on Verified Career Principles',
      subhead: 'No fake stats or exaggerated claims. Just honest, transparent profile engineering.',
      points: [
        { title: 'ATS-Friendly Formatting', desc: 'Clean single-column layout without unreadable tables, images, or multi-column parsing traps.' },
        { title: 'Job-Specific Optimization', desc: 'Aligns your existing experience to target job postings without inventing false qualifications.' },
        { title: 'Editable AI Output', desc: 'Every suggestion is copy-ready and fully editable so you retain total control over your narrative.' },
        { title: 'One-Time Flat Pricing', desc: 'Pay once for your optimization and resume generation. No surprise monthly subscriptions.' },
      ],
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
        a: 'Yes. You can test your headline and view an instant search & impact score for free on this page without registering.',
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
    price: '199',
    formattedPrice: '£2.99 (₹199)',
    priceDisclaimer: 'One-time payment. No subscription or recurring monthly fees.',
    
    seo: {
      title: 'CareerCraft — AI LinkedIn Optimisation & ATS CV Builder',
      metaDescription: 'Optimise your LinkedIn profile, match your experience to job descriptions, and create an ATS-friendly CV with CareerCraft.',
      canonical: 'https://careercraft.webelvate.com/uk',
      ogImage: 'https://careercraft.webelvate.com/og-preview.png',
      alternateHreflangs: [
        { lang: 'en-GB', href: 'https://careercraft.webelvate.com/uk' },
        { lang: 'en-IN', href: 'https://careercraft.webelvate.com/in' },
        { lang: 'en-US', href: 'https://careercraft.webelvate.com/' },
        { lang: 'x-default', href: 'https://careercraft.webelvate.com/' },
      ],
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
        matchedKeywords: ['Product Roadmapping', 'User Research', 'B2B SaaS', 'Agile Leadership', 'Stakeholder Governance'],
        missingKeywords: ['FCA Regulatory Standards', 'Product Analytics (Mixpanel)'],
      },
      pipelineSteps: ['ATS CV', 'LinkedIn Profile', 'Job Match Alignment'],
    },

    beforeAfter: {
      headline: 'See the Difference in Career Positioning',
      subhead: 'How CareerCraft transforms passive job descriptions into high-converting recruiter assets.',
      badge: 'Profile Transformation',
      disclaimer: 'Illustrative example. Not a customer result. Real output uses your verified career numbers.',
      metrics: {
        scoreBefore: 61,
        scoreAfter: 94,
        matchBefore: 58,
        matchAfter: 93,
      },
      before: {
        title: 'Product Manager at ABC Ltd',
        headline: 'Product Manager at ABC Ltd | Seeking New Opportunities',
        summary: 'Responsible for product roadmaps and sprint planning. Managed cross-functional development teams and delivered feature releases.',
        bullet: 'Worked with engineers and designers to launch application updates.',
      },
      after: {
        title: 'Senior Product Manager | B2B SaaS & FinTech',
        headline: 'Senior Product Manager | B2B FinTech • Enterprise SaaS | Product Strategy & Growth',
        summary: 'Led end-to-end product strategy for enterprise SaaS platforms, increasing user retention by 24% and generating £3.2M in annual recurring revenue across UK & European markets.',
        bullet: 'Prioritised high-impact product roadmap using agile frameworks, reducing release cycle times by 35% across 4 engineering squads.',
      },
    },

    howItWorks: {
      headline: 'From LinkedIn Profile to Interview-Ready in 4 Steps',
      subhead: 'A simple, direct workflow to align your professional narrative and export an ATS-compliant CV.',
      steps: [
        {
          number: '01',
          title: 'Add Your Profile',
          desc: 'Paste your LinkedIn text or upload your existing CV in PDF format.',
        },
        {
          number: '02',
          title: 'Paste Target Job Description',
          desc: 'Provide the job advert you want to target to extract critical keywords.',
        },
        {
          number: '03',
          title: 'Review Keyword & Profile Gaps',
          desc: 'See which skills match and exactly which high-frequency terms are missing.',
        },
        {
          number: '04',
          title: 'Generate Profile & ATS CV',
          desc: 'Export copy-ready LinkedIn sections and download a clean ATS-friendly PDF CV.',
        },
      ],
    },

    jobMatching: {
      headline: 'Precision Keyword Matching for Target Roles',
      subhead: 'CareerCraft maps target job requirements directly onto your headline, About section, and CV.',
      roleTitle: 'Senior Product Manager (B2B SaaS / FinTech)',
      matchScore: 92,
      matched: ['Product Strategy', 'B2B SaaS', 'Agile Leadership', 'User Research', 'Roadmapping'],
      missing: ['FCA Compliance', 'Mixpanel Analytics'],
      cta: 'Optimise My Profile',
    },

    features: [
      {
        title: 'LinkedIn Profile Score',
        desc: 'Comprehensive breakdown evaluating headline discoverability, About narrative impact, and skill indexing.',
      },
      {
        title: 'Recruiter-Ready Headline',
        desc: 'SEO-focused headlines under 220 characters structured around the roles and skills recruiters search for.',
      },
      {
        title: 'Stronger About Section',
        desc: 'A punchy 3-part narrative with a clear hook, quantified achievements, and strategic call-to-action.',
      },
      {
        title: 'Achievement-Focused Experience',
        desc: 'Experience bullets rewritten to lead with strong action verbs and quantified business impact.',
      },
      {
        title: 'Job Description Matching',
        desc: 'Identifies critical skills and terminology from target job adverts and maps them to your profile.',
      },
      {
        title: 'ATS-Friendly CV Builder',
        desc: 'Generates a clean, single-column PDF CV adhering to UK and European ATS standards without photos.',
      },
    ],

    comparison: {
      headline: 'How CareerCraft Compares',
      subhead: 'Why job seekers across the UK and Europe choose CareerCraft over expensive CV agencies or generic AI chatbots.',
      traditionalLabel: 'CV Writing Services',
    },

    resumeSection: {
      headline: 'One profile. One consistent career story.',
      subhead: 'Your LinkedIn and CV should reinforce the same narrative. CareerCraft synthesises both into an ATS-compliant PDF.',
      cta: 'Build My CV',
      callouts: [
        { title: 'ATS-Friendly CV Layout', desc: 'Single-column structure, standard headings, and clean parseable fonts without photo traps.' },
        { title: 'Job-Specific Keywords', desc: 'Strategically incorporates the high-frequency terms recruiters look for in job adverts.' },
        { title: 'Achievement-Focused Bullets', desc: 'Replaces passive duty lists with active verbs and concrete metrics.' },
        { title: 'Aligned Positioning', desc: 'Ensures your CV and LinkedIn profile tell the exact same career story.' },
      ],
      preview: {
        name: 'OLIVER BROOKE',
        title: 'Senior Product Manager | B2B SaaS & FinTech Platforms',
        summary: 'Product Leader with 6+ years experience directing enterprise SaaS solutions, payment integrations, and growth initiatives across the UK and Europe. Skilled in stakeholder management and data-driven product scaling.',
        experience: [
          'Spearheaded enterprise SaaS product overhaul, driving a 24% uplift in user retention and delivering £3.2M in net new ARR.',
          'Directed agile sprint planning across cross-functional engineering and design teams, reducing feature time-to-market by 35%.',
        ],
        skills: ['Product Strategy', 'B2B SaaS', 'Agile Leadership', 'User Research', 'Roadmapping', 'Stakeholder Management'],
        education: 'BSc (Hons) in Management & Computer Science — First Class',
      },
    },

    trust: {
      headline: 'Built on Verified Career & Privacy Principles',
      subhead: 'Factual data processing standards. No exaggerated claims or unbacked badges.',
      points: [
        { title: 'ATS-Friendly CV Layout', desc: 'Clean single-column layout without unreadable tables, images, or multi-column parsing traps.' },
        { title: 'Transparent Data Processing', desc: 'Profile data is processed solely to generate your rewrites and CV. Never sold or used to train public foundation models.' },
        { title: 'Editable AI Output', desc: 'Every suggestion is copy-ready and fully editable so you retain total control over your narrative.' },
        { title: 'One-Time Flat Pricing', desc: 'Pay once for your optimisation and CV generation. No surprise monthly subscriptions.' },
      ],
    },

    privacySection: {
      headline: 'Data Handling & Privacy Facts',
      subhead: 'Direct, plain-language transparency regarding how your career information is processed.',
      facts: [
        { label: 'Processing & Storage', value: 'API requests are processed via Cloudflare Workers edge nodes and stored in secure database infrastructure.' },
        { label: 'AI Inference', value: 'Generative rewrites are performed via Google Gemini API (US datacenter endpoints) without model training on your private career records.' },
        { label: 'Retention & Deletion', value: 'Generation logs are retained during your license key lifecycle. You can request complete deletion at any time via support email.' },
        { label: 'No Third-Party Tracking', value: 'We do not sell candidate information or embed cross-site behavioural trackers on this page.' },
      ],
    },

    pricing: {
      badge: 'ONE-TIME PAYMENT · NO SUBSCRIPTION',
      headline: 'Simple, transparent pricing for serious job seekers',
      subhead: 'Pay once, optimise your profile, and export your matching ATS CV.',
      planName: 'Full Career Suite',
      price: '199',
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
        a: 'Yes. You can test your LinkedIn headline and get an instant score for free on this page without registering.',
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
    price: '199',
    formattedPrice: '$2.99 (₹199)',
    priceDisclaimer: 'One-time payment. No subscription or recurring fees.',
    
    seo: {
      title: 'CareerCraft — AI LinkedIn Optimization & ATS Resume Builder',
      metaDescription: 'Optimize your LinkedIn profile, match your experience to job descriptions, and create an ATS-friendly resume with CareerCraft.',
      canonical: 'https://careercraft.webelvate.com/',
      ogImage: 'https://careercraft.webelvate.com/og-preview.png',
      alternateHreflangs: [
        { lang: 'en-US', href: 'https://careercraft.webelvate.com/' },
        { lang: 'en-IN', href: 'https://careercraft.webelvate.com/in' },
        { lang: 'en-GB', href: 'https://careercraft.webelvate.com/uk' },
        { lang: 'x-default', href: 'https://careercraft.webelvate.com/' },
      ],
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

    beforeAfter: {
      headline: 'See the Difference in Career Positioning',
      subhead: 'How CareerCraft transforms passive duty statements into high-converting recruiter assets.',
      badge: 'Profile Transformation',
      disclaimer: 'Illustrative example. Not a customer result. Real output uses your verified career numbers.',
      metrics: {
        scoreBefore: 61,
        scoreAfter: 94,
        matchBefore: 58,
        matchAfter: 93,
      },
      before: {
        title: 'Marketing Manager at ABC Corp',
        headline: 'Marketing Manager at ABC Corp | Seeking Opportunities',
        summary: 'Responsible for marketing campaigns and social media management across multiple brand channels. Managed company blog and helped sales team with leads.',
        bullet: 'Worked on email campaigns and social media posting.',
      },
      after: {
        title: 'Growth Marketing Manager | B2B SaaS',
        headline: 'Growth Marketing Manager | B2B SaaS | Demand Generation | SEO & Performance Marketing',
        summary: 'Led multi-channel demand-generation campaigns across paid, organic, and partner channels, increasing qualified pipeline by 34% and scaling ARR from $2M to $7M.',
        bullet: 'Engineered automated lead-nurture workflows in HubSpot, improving SQL conversion rates by 28% across 14,000+ inbound leads.',
      },
    },

    howItWorks: {
      headline: 'From LinkedIn Profile to Offer-Ready in 4 Steps',
      subhead: 'A streamlined, transparent workflow to align your professional narrative and export an ATS resume.',
      steps: [
        {
          number: '01',
          title: 'Add Your Profile',
          desc: 'Paste your LinkedIn text or upload your existing resume PDF.',
        },
        {
          number: '02',
          title: 'Paste Target Job Description',
          desc: 'Provide the job posting you want to target to extract critical keywords.',
        },
        {
          number: '03',
          title: 'Review Keyword & Profile Gaps',
          desc: 'See which skills match and exactly which high-frequency terms are missing.',
        },
        {
          number: '04',
          title: 'Generate Profile & ATS Resume',
          desc: 'Export copy-ready LinkedIn sections and download a clean ATS-friendly PDF resume.',
        },
      ],
    },

    jobMatching: {
      headline: 'Precision Keyword Matching for Target Roles',
      subhead: 'CareerCraft maps target job requirements directly onto your headline, About section, and resume.',
      roleTitle: 'Investment Banking Analyst / Associate',
      matchScore: 91,
      matched: ['Financial Analysis', 'Excel (Financial Modeling)', 'Investment Banking', 'DCF Valuation', 'M&A Research'],
      missing: ['LBO Modeling', 'Syndicated Lending'],
      cta: 'Optimize My Profile',
    },

    features: [
      {
        title: 'LinkedIn Profile Score',
        desc: 'Comprehensive breakdown evaluating headline discoverability, About narrative impact, and skill indexing.',
      },
      {
        title: 'Recruiter-Ready Headline',
        desc: 'SEO-focused headlines under 220 characters structured around the roles and skills recruiters search for.',
      },
      {
        title: 'Stronger About Section',
        desc: 'A punchy 3-part narrative with a clear hook, quantified achievements, and strategic call-to-action.',
      },
      {
        title: 'Achievement-Focused Experience',
        desc: 'Experience bullets rewritten to lead with strong action verbs and quantified business impact.',
      },
      {
        title: 'Job Description Matching',
        desc: 'Identifies critical skills and terminology from target job postings and maps them to your profile.',
      },
      {
        title: 'ATS-Friendly Resume',
        desc: 'Generates a clean, single-column PDF resume that parses accurately in Applicant Tracking Systems.',
      },
    ],

    comparison: {
      headline: 'How CareerCraft Compares',
      subhead: 'Why job seekers choose CareerCraft over traditional agencies or generic AI writing chatbots.',
      traditionalLabel: 'Resume Writing Services',
    },

    resumeSection: {
      headline: 'One profile. One consistent career story.',
      subhead: 'Your LinkedIn and resume should reinforce the same narrative. CareerCraft synthesizes both into an ATS-compliant PDF.',
      cta: 'Build My Resume',
      callouts: [
        { title: 'ATS-Friendly Formatting', desc: 'Single-column structure, standard headings, and clean parseable fonts.' },
        { title: 'Job-Specific Keywords', desc: 'Strategically incorporates the high-frequency terms recruiters look for.' },
        { title: 'Achievement-Focused Bullets', desc: 'Replaces passive duty lists with action verbs and concrete metrics.' },
        { title: 'Aligned Positioning', desc: 'Ensures your resume and LinkedIn tell the exact same career story.' },
      ],
      preview: {
        name: 'ALEXANDER HAYES',
        title: 'Investment Banking Analyst | Valuation & M&A Advisory',
        summary: 'Analyst with 3+ years experience in financial modeling, valuation analysis, and pitch book preparation for mid-market M&A transactions. Skilled in DCF, LBO, and comparable company analysis.',
        experience: [
          'Engineered detailed 3-statement financial models and DCF valuations for 8+ live M&A advisory mandates totaling $450M in transaction value.',
          'Conducted in-depth industry benchmarking and precedent transaction analyses to support senior bankers in executive client presentations.',
        ],
        skills: ['Financial Modeling', 'DCF Valuation', 'M&A Advisory', 'Excel (VBA)', 'Pitch Books', 'Due Diligence'],
        education: 'B.S. in Finance & Economics — Honors Graduate',
      },
    },

    trust: {
      headline: 'Built on Verified Career Principles',
      subhead: 'No fake stats or exaggerated claims. Just honest, transparent profile engineering.',
      points: [
        { title: 'ATS-Friendly Formatting', desc: 'Clean single-column layout without unreadable tables, images, or multi-column parsing traps.' },
        { title: 'Job-Specific Optimization', desc: 'Aligns your existing experience to target job postings without inventing false qualifications.' },
        { title: 'Editable AI Output', desc: 'Every suggestion is copy-ready and fully editable so you retain total control over your narrative.' },
        { title: 'One-Time Flat Pricing', desc: 'Pay once for your optimization and resume generation. No surprise monthly subscriptions.' },
      ],
    },

    pricing: {
      badge: 'ONE-TIME ACCESS · NO SUBSCRIPTION',
      headline: 'Simple, transparent pricing for serious job seekers',
      subhead: 'Pay once, optimize your profile, and export your matching ATS resume.',
      planName: 'Full Career Suite',
      price: '199',
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
        a: 'CareerCraft analyzes your headline, About section, experience bullets, and skills against modern recruiter search criteria and job descriptions to provide high-converting copy.',
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
        q: 'Is CareerCraft a monthly subscription?',
        a: 'No. CareerCraft charges a single, one-time payment. There are no recurring charges, no monthly renewal fees, and no surprise debits.',
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
};

export function getMarketConfig(marketId = 'in') {
  return MARKETS[marketId] || MARKETS.in;
}
