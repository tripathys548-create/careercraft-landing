import type { ResumeData } from '../../src/lib/resume/types';

const contact = {
  location: 'Bhubaneswar, Odisha',
  phone: '+91 98765 43210',
  email: 'priya.nayak@example.com',
  linkedin: 'linkedin.com/in/priya-nayak',
};

export const midLevel: ResumeData = {
  name: 'Priya Nayak',
  headline: 'Backend Engineer | Node.js | AWS | PostgreSQL',
  contact,
  summary:
    'Backend engineer with 4+ years of experience building payment and order-management APIs in Node.js and TypeScript. Works across PostgreSQL, Redis and AWS to keep services fast and reliable. Reduced checkout API latency by 38% and cut infrastructure cost by 22% at Acme Technologies.',
  experience: [
    {
      title: 'Software Engineer',
      company: 'Acme Technologies',
      location: 'Bengaluru, Karnataka',
      start: 'Jan 2022',
      end: 'Present',
      bullets: [
        'Reduced checkout API p95 latency by 38% by introducing Redis caching and query batching in the order service',
        'Designed and shipped a webhook retry pipeline on AWS SQS that lifted payment-event delivery to 99.9%',
        'Migrated 14 services from EC2 to containerised ECS deployments, cutting infrastructure cost by 22%',
        'Mentor two junior engineers through code reviews and weekly design walkthroughs',
      ],
    },
    {
      title: 'Associate Software Engineer',
      company: 'Globex Systems',
      location: 'Hyderabad, Telangana',
      start: 'Jul 2020',
      end: 'Dec 2021',
      bullets: [
        'Built REST APIs in Node.js and PostgreSQL powering the customer onboarding portal',
        'Wrote integration tests that raised service coverage from 41% to 78%',
        'Resolved production incidents as part of a rotating on-call schedule',
      ],
    },
  ],
  education: [
    { degree: 'B.Tech, Computer Science', school: 'KIIT University', start: '2016', end: '2020', detail: 'CGPA: 8.4 / 10' },
  ],
  skills: [
    { label: 'Languages', items: ['JavaScript', 'TypeScript', 'SQL', 'Python'] },
    { label: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'Microservices', 'System Design'] },
    { label: 'Data & Cloud', items: ['PostgreSQL', 'Redis', 'AWS (ECS, SQS, Lambda)', 'Docker', 'Terraform'] },
    { label: 'Tools', items: ['Git', 'GitHub Actions', 'Jest', 'Datadog'] },
  ],
};

export const senior: ResumeData = {
  name: 'Rohit Kumar Mohapatra',
  headline: 'Engineering Manager | Distributed Systems | Platform Engineering | Team Building',
  contact: { ...contact, email: 'rohit.mohapatra@example.com', linkedin: 'linkedin.com/in/rohit-mohapatra' },
  summary:
    'Engineering leader with 12+ years of experience building distributed platforms for fintech and e-commerce. Leads teams of up to 18 engineers across payments, search and developer tooling. Delivered a platform rewrite that cut deployment time from 3 hours to 12 minutes.',
  experience: [
    {
      title: 'Engineering Manager, Platform',
      company: 'Northwind Commerce',
      location: 'Bengaluru, Karnataka',
      start: 'Mar 2021',
      end: 'Present',
      bullets: [
        'Lead 18 engineers across four squads owning the checkout, search, pricing and developer-tooling platforms',
        'Delivered a CI/CD platform rewrite that cut deployment time from 3 hours to 12 minutes for 60 services',
        'Introduced service-level objectives and error budgets, reducing Sev-1 incidents by 47% year over year',
        'Partnered with product and finance to plan a ₹6 crore annual infrastructure budget',
        'Hired and onboarded 11 engineers, building a structured interview loop adopted company-wide',
      ],
    },
    {
      title: 'Senior Software Engineer',
      company: 'Contoso Payments',
      location: 'Pune, Maharashtra',
      start: 'Jun 2017',
      end: 'Feb 2021',
      bullets: [
        'Architected the ledger service processing 2 million transactions per day on Kafka and PostgreSQL',
        'Led the migration of a Java monolith into 9 services with zero customer-facing downtime',
        'Designed idempotent retry semantics that removed duplicate-charge incidents entirely',
        'Coached four engineers to promotion through structured feedback and stretch assignments',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Initech Software',
      location: 'Chennai, Tamil Nadu',
      start: 'Aug 2014',
      end: 'May 2017',
      bullets: [
        'Built search-indexing pipelines in Java and Elasticsearch serving 5 million product listings',
        'Reduced index rebuild time from 9 hours to 55 minutes through incremental updates',
        'Owned release engineering for a team of 12 developers',
      ],
    },
    {
      title: 'Associate Engineer',
      company: 'Hooli Technologies',
      location: 'Bhubaneswar, Odisha',
      start: 'Jul 2012',
      end: 'Jul 2014',
      bullets: [
        'Developed internal reporting tools in Java and Oracle for the logistics division',
        'Automated nightly data reconciliation, saving 15 hours of manual work per week',
      ],
    },
  ],
  education: [
    { degree: 'M.Tech, Software Engineering', school: 'NIT Rourkela', start: '2010', end: '2012' },
    { degree: 'B.Tech, Computer Science', school: 'Odisha University of Technology and Research', start: '2006', end: '2010' },
  ],
  skills: [
    { label: 'Leadership', items: ['Team Building', 'Roadmapping', 'Hiring', 'Budgeting', 'Stakeholder Management'] },
    { label: 'Architecture', items: ['Distributed Systems', 'Event-Driven Architecture', 'Microservices', 'System Design'] },
    { label: 'Technology', items: ['Java', 'Kafka', 'PostgreSQL', 'Kubernetes', 'AWS', 'Elasticsearch', 'CI/CD'] },
  ],
};

export const fresher: ResumeData = {
  name: 'Ananya Sahoo',
  headline: 'Computer Science Graduate | Python | Data Analysis | SQL',
  contact: { location: 'Sambalpur, Odisha', email: 'ananya.sahoo@example.com', linkedin: 'linkedin.com/in/ananya-sahoo' },
  summary:
    'Computer science graduate with hands-on experience in Python, SQL and data visualisation gained through a data analytics internship and academic projects. Comfortable cleaning messy datasets and turning them into dashboards that non-technical teams can act on.',
  experience: [],
  education: [
    {
      degree: 'B.Tech, Computer Science and Engineering',
      school: 'Veer Surendra Sai University of Technology',
      start: '2021',
      end: '2025',
      detail: 'CGPA: 8.7 / 10 · Coursework: Database Systems, Machine Learning, Statistics',
    },
    { degree: 'Higher Secondary (Science)', school: 'Kendriya Vidyalaya Sambalpur', start: '2019', end: '2021' },
  ],
  skills: [
    { label: 'Languages', items: ['Python', 'SQL', 'R'] },
    { label: 'Analytics', items: ['Pandas', 'NumPy', 'Matplotlib', 'Power BI', 'Excel'] },
  ],
};

export const marketing: ResumeData = {
  name: 'Meera Joshi',
  headline: 'Digital Marketing Manager | SEO | Paid Media | Content Strategy',
  contact: { location: 'New Delhi', phone: '+91 91234 56789', email: 'meera.joshi@example.com', linkedin: 'linkedin.com/in/meera-joshi' },
  summary:
    'Digital marketer with 6+ years of experience growing organic and paid acquisition for D2C and SaaS brands. Combines SEO, performance media and lifecycle email to lift qualified traffic and revenue. Grew organic sessions by 210% in 14 months at Brightside.',
  experience: [
    {
      title: 'Digital Marketing Manager',
      company: 'Brightside Commerce',
      location: 'New Delhi',
      start: 'Feb 2022',
      end: 'Present',
      bullets: [
        'Grew organic sessions by 210% in 14 months through a topic-cluster content plan and technical SEO fixes',
        'Manage a ₹18 lakh monthly paid-media budget across Google and Meta, holding blended ROAS above 4x',
        'Built lifecycle email flows in Klaviyo that now drive 27% of online revenue',
      ],
    },
    {
      title: 'SEO Specialist',
      company: 'Pixel & Pine Agency',
      location: 'Gurugram, Haryana',
      start: 'Jun 2019',
      end: 'Jan 2022',
      bullets: [
        'Delivered SEO programmes for 12 clients, including two page-one rankings for high-intent commercial terms',
        'Produced monthly analytics reports in Looker Studio used in executive client reviews',
      ],
    },
  ],
  education: [{ degree: 'BBA, Marketing', school: 'Delhi University', start: '2016', end: '2019' }],
  skills: [
    { label: 'Marketing', items: ['SEO', 'Google Ads', 'Meta Ads', 'Email Marketing', 'Content Strategy'] },
    { label: 'Analytics & Tools', items: ['Google Analytics 4', 'Looker Studio', 'Klaviyo', 'SEMrush', 'Ahrefs'] },
  ],
};

/** Hostile input: emoji, unsupported scripts, very long strings, unbreakable URL-like words, no contact info. */
export const edgeCase: ResumeData = {
  name: 'Sri Venkata Lakshmi Narasimha Rao Bommidevaravenkatasubbarao 🚀',
  headline: 'Full-Stack Developer 💻 | React → Node.js | Building the future ✨ | ଓଡ଼ିଆ',
  contact: { linkedin: 'linkedin.com/in/sri-venkata-lakshmi-narasimha-rao-bommidevaravenkatasubbarao-4a1b2c3d' },
  summary:
    'Developer who ships end-to-end features with React and Node.js — from schema design to deployment. Saved ₹5 lakh/year by replacing a paid tool with an in-house service ("Reports 2.0").',
  experience: [
    {
      title: 'Senior Full-Stack Developer and Technical Lead for the Customer Experience Platform Modernisation Programme',
      company: 'International Business Machines Corporation India Private Limited',
      location: 'Bhubaneswar, Odisha',
      start: 'Jan 2020',
      end: 'Present',
      bullets: [
        'Rebuilt https://internal.example.com/reports/quarterly/summary/dashboard/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa into a React 18 dashboard 🎯',
        'Cut page-load time from 6s to 1.4s ≥ target by code-splitting and image optimisation → happier users',
      ],
    },
  ],
  education: [{ degree: 'B.Tech', school: 'Institute of Technical Education and Research (ITER), SOA University', start: '2014', end: '2018' }],
  skills: [{ label: 'Core Skills', items: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'GraphQL'] }],
};

export const ALL_SAMPLES: Record<string, ResumeData> = { midLevel, senior, fresher, marketing, edgeCase };
