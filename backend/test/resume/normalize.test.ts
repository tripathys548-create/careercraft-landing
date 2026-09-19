import { describe, it, expect } from 'vitest';
import {
  buildRetryFeedback,
  contactFromText,
  isRenderable,
  nameFromLinkedinId,
  needsRetry,
  normalizeResume,
  sanitizeContact,
} from '../../src/lib/resume/normalize';
import type { SourceProfile } from '../../src/lib/resume/types';

const source: SourceProfile = {
  linkedinId: 'priya-nayak-12ab34',
  name: 'Priya Nayak',
  headline: 'Backend Engineer | Node.js | Postgres',
  about: 'I build payment APIs. Five services in production.',
  experience:
    'Software Engineer\nAcme Technologies · Full-time\nJan 2022 - Present · 3 yrs 9 mos\nBuilt APIs and cut checkout latency by 38%. Handled 1,20,000 requests a day.\nAssociate Software Engineer\nGlobex Systems\nJul 2020 - Dec 2021',
  education: 'KIIT University\nB.Tech, Computer Science · 2016 - 2020\nCGPA: 8.4',
  skills: 'Node.js, Postgres, AWS, JavaScript, REST API, CI/CD',
  raw: '',
  targetRole: '',
};
const ctx = { source, contact: {}, years: 4.3 };

const goodRole = {
  title: 'Software Engineer',
  company: 'Acme Technologies',
  start: 'Jan 2022',
  end: 'Present',
  bullets: ['Built payment APIs in Node.js that cut checkout latency by 38%'],
};
const base = (over: Record<string, unknown> = {}) => ({
  name: 'Priya Nayak',
  headline: 'Backend Engineer | Node.js',
  summary: 'Backend engineer with 4+ years of experience building payment APIs in Node.js.',
  experience: [goodRole],
  education: [{ degree: 'B.Tech, Computer Science', school: 'KIIT University', start: '2016', end: '2020' }],
  skills: [{ label: 'Core Skills', items: ['Node.js', 'PostgreSQL', 'AWS'] }],
  ...over,
});

const hard = (r: ReturnType<typeof normalizeResume>) => r.issues.filter((i) => i.severity === 'hard');
const soft = (r: ReturnType<typeof normalizeResume>) => r.issues.filter((i) => i.severity === 'soft');

describe('normalizeResume — facts', () => {
  it('accepts a faithful answer with no issues', () => {
    const r = normalizeResume(base(), ctx);
    expect(r.issues).toEqual([]);
    expect(r.data.experience[0].bullets).toEqual(['Built payment APIs in Node.js that cut checkout latency by 38%']);
    expect(isRenderable(r.data)).toBe(true);
  });

  it('removes a role whose company is not in the profile', () => {
    const r = normalizeResume(base({ experience: [goodRole, { title: 'Engineer', company: 'Google', bullets: ['Built things'] }] }), ctx);
    expect(r.data.experience.map((x) => x.company)).toEqual(['Acme Technologies']);
    expect(hard(r).some((i) => /Google/.test(i.message))).toBe(true);
  });

  it('removes a role whose title is not in the profile', () => {
    const r = normalizeResume(base({ experience: [{ ...goodRole, title: 'Chief Technology Officer' }] }), ctx);
    expect(r.data.experience).toHaveLength(0);
  });

  it('blocks title inflation: rank words must be in the profile', () => {
    for (const title of ['Senior Software Engineer', 'Lead Software Engineer', 'Software Engineering Manager', 'Principal Software Engineer']) {
      const r = normalizeResume(base({ experience: [{ ...goodRole, title }] }), ctx);
      expect(r.data.experience, title).toHaveLength(0);
      expect(hard(r).some((i) => /job title/.test(i.message))).toBe(true);
    }
  });

  it('accepts a rank word when the profile really has it (including Sr. → Senior)', () => {
    const withSenior = { ...ctx, source: { ...source, experience: source.experience.replace('Software Engineer\nAcme', 'Sr. Software Engineer\nAcme') } };
    const r = normalizeResume(base({ experience: [{ ...goodRole, title: 'Senior Software Engineer' }] }), withSenior);
    expect(r.data.experience).toHaveLength(1);
    // dropping a rank word is never fabrication
    expect(normalizeResume(base({ experience: [{ ...goodRole, title: 'Engineer' }] }), ctx).data.experience).toHaveLength(1);
  });

  it('does not accept a renamed company ("Acme Corp" for "Acme Technologies")', () => {
    const r = normalizeResume(base({ experience: [{ ...goodRole, company: 'Acme Corp' }] }), ctx);
    expect(r.data.experience).toHaveLength(0);
  });

  it('removes bullets containing numbers that are not in the profile', () => {
    const r = normalizeResume(
      base({ experience: [{ ...goodRole, bullets: [...goodRole.bullets, 'Increased revenue by 250% across regions', 'Managed a team of 12 engineers'] }] }),
      ctx
    );
    expect(r.data.experience[0].bullets).toHaveLength(1);
    expect(hard(r).filter((i) => /not in the profile/.test(i.message))).toHaveLength(2);
  });

  it('accepts numbers written differently (Indian grouping, percent) and number words', () => {
    const r = normalizeResume(
      base({ experience: [{ ...goodRole, bullets: ['Served 120000 requests per day', 'Shipped 5 services to production'] }] }),
      ctx
    );
    expect(r.data.experience[0].bullets).toHaveLength(2);
    expect(hard(r)).toHaveLength(0);
  });

  it('allows a years-of-experience claim only in the summary and only up to the computed figure', () => {
    expect(hard(normalizeResume(base({ summary: 'Engineer with 4+ years of experience.' }), ctx))).toHaveLength(0);
    // "9" appears in the profile only as "9 mos" — that coincidence must not bless "9+ years"
    const over = normalizeResume(base({ summary: 'Engineer with 9+ years of experience. Builds APIs.' }), ctx);
    expect(hard(over)).toHaveLength(1);
    expect(over.data.summary).toBe('Builds APIs.');
    const inBullet = normalizeResume(base({ experience: [{ ...goodRole, bullets: ['Delivered 4 years of steady growth'] }] }), ctx);
    expect(inBullet.data.experience[0].bullets).toHaveLength(0);
  });

  it('never allows a years claim when no experience could be computed', () => {
    const r = normalizeResume(base({ summary: 'Engineer with 4+ years of experience.' }), { ...ctx, years: 0 });
    expect(hard(r)).toHaveLength(1);
  });

  it('drops dates whose year is not in the profile', () => {
    const r = normalizeResume(base({ experience: [{ ...goodRole, start: 'Mar 2015' }] }), ctx);
    expect(r.data.experience[0].start).toBeUndefined();
    expect(hard(r).some((i) => /2015/.test(i.message))).toBe(true);
  });

  it('normalises date formats', () => {
    const r = normalizeResume(base({ experience: [{ ...goodRole, start: 'January 2022', end: 'current' }] }), ctx);
    expect(r.data.experience[0]).toMatchObject({ start: 'Jan 2022', end: 'Present' });
  });

  it('removes an education entry whose school is not in the profile, and unsupported detail', () => {
    const r = normalizeResume(
      base({
        education: [
          { degree: 'MBA', school: 'Harvard Business School', start: '2020', end: '2022' },
          { degree: 'B.Tech, Computer Science', school: 'KIIT University', detail: 'CGPA 9.9, Gold Medalist' },
        ],
      }),
      ctx
    );
    expect(r.data.education).toHaveLength(1);
    expect(r.data.education[0].detail).toBeUndefined();
  });

  it('keeps supported education detail (CGPA present in the profile)', () => {
    const r = normalizeResume(base({ education: [{ degree: 'B.Tech, Computer Science', school: 'KIIT University', detail: 'CGPA: 8.4' }] }), ctx);
    expect(r.data.education[0].detail).toBe('CGPA: 8.4');
  });
});

describe('normalizeResume — skills', () => {
  const skills = (items: string[]) => normalizeResume(base({ skills: [{ label: 'Skills', items }] }), ctx).data.skills.flatMap((g) => g.items);

  it('accepts canonical spellings of skills present under another name (Postgres → PostgreSQL)', () => {
    expect(skills(['PostgreSQL', 'Node.js', 'REST APIs', 'CI/CD', 'AWS (Amazon Web Services)'])).toEqual(
      ['PostgreSQL', 'Node.js', 'REST APIs', 'CI/CD', 'AWS (Amazon Web Services)']
    );
  });

  it('rejects skills that are not in the profile and does not let "Java" ride on "JavaScript"', () => {
    expect(skills(['Java', 'Kubernetes', 'Rust', 'JavaScript'])).toEqual(['JavaScript']);
  });

  it('dedupes across spellings and caps the total', () => {
    expect(skills(['Node.js', 'node.js', 'NODE.JS'])).toEqual(['Node.js']);
  });

  it('wraps a flat string[] (schema drift) into one group instead of failing', () => {
    const r = normalizeResume(base({ skills: ['Node.js', 'AWS'] }), ctx);
    expect(r.data.skills).toEqual([{ label: 'Skills', items: ['Node.js', 'AWS'] }]);
  });
});

describe('normalizeResume — style + structure', () => {
  it('flags clichés, weak openers and first person as soft issues but keeps the text', () => {
    const r = normalizeResume(
      base({
        summary: 'Passionate engineer who is seeking new challenges.',
        experience: [{ ...goodRole, bullets: ['Responsible for building payment APIs', 'I built the checkout service in Node.js'] }],
      }),
      ctx
    );
    expect(soft(r).length).toBeGreaterThanOrEqual(3);
    expect(hard(r)).toHaveLength(0);
    expect(r.data.experience[0].bullets).toHaveLength(2);
    expect(needsRetry(r.issues)).toBe(true);
  });

  it('cleans bullets: strips emoji/markdown/leading symbols/trailing full stop and capitalises', () => {
    const r = normalizeResume(base({ experience: [{ ...goodRole, bullets: ['•  **built** payment APIs in Node.js 🚀.'] }] }), ctx);
    expect(r.data.experience[0].bullets[0]).toBe('Built payment APIs in Node.js');
  });

  it('caps bullets per role by recency', () => {
    const many = Array.from({ length: 9 }, (_, i) => `Built payment API number ${i === 0 ? 'one' : 'x' + i} in Node.js`);
    const r = normalizeResume(base({ experience: [{ ...goodRole, bullets: many }] }), ctx);
    expect(r.data.experience[0].bullets.length).toBeLessThanOrEqual(5);
  });

  it('survives garbage: wrong types, nulls, old flat-string schema', () => {
    for (const raw of [null, undefined, 42, 'text', [], { experience: 'x', education: 5, skills: null }, { experience: ['Software Engineer', 'Acme'] }]) {
      const r = normalizeResume(raw, ctx);
      expect(r.data.name).toBe('Priya Nayak');
      expect(Array.isArray(r.data.experience)).toBe(true);
    }
    expect(isRenderable(normalizeResume({ experience: ['flat', 'strings'] }, ctx).data)).toBe(false);
  });

  it('falls back to the original headline when the model invents words', () => {
    const r = normalizeResume(base({ headline: 'Visionary Blockchain Architect' }), ctx);
    expect(r.data.headline).toBe('Backend Engineer | Node.js | Postgres');
    expect(soft(r).some((i) => i.path === 'headline')).toBe(true);
  });

  it('picks the customer-provided name first, then a supported model name, then the LinkedIn slug', () => {
    expect(normalizeResume(base({ name: 'Someone Else' }), ctx).data.name).toBe('Priya Nayak');
    const noName = { ...ctx, source: { ...source, name: '' } };
    expect(normalizeResume(base({ name: 'Priya Nayak' }), noName).data.name).toBe('Priya Nayak'.length ? 'Priya Nayak' : '');
    expect(normalizeResume(base({ name: 'Totally Invented' }), noName).data.name).toBe('Priya Nayak');
  });

  it('builds specific retry feedback', () => {
    const r = normalizeResume(base({ experience: [{ ...goodRole, bullets: ['Grew sales by 250%'] }] }), ctx);
    const fb = buildRetryFeedback(r.issues);
    expect(fb).toMatch(/CORRECTION REQUIRED/);
    expect(fb).toMatch(/250/);
  });
});

describe('contact helpers', () => {
  it('validates and formats contact details', () => {
    const c = sanitizeContact({ email: 'a@b.co', phone: '+91 98765 43210', location: 'Bhubaneswar, Odisha', website: 'https://priya.dev/' }, 'priya-nayak');
    expect(c).toEqual({
      email: 'a@b.co',
      phone: '+91 98765 43210',
      location: 'Bhubaneswar, Odisha',
      website: 'priya.dev',
      linkedin: 'linkedin.com/in/priya-nayak',
    });
  });

  it('rejects malformed or hostile values', () => {
    const c = sanitizeContact({ email: 'not-an-email', phone: '12', location: '<script>', website: 'javascript:alert(1)' }, 'a b/c');
    expect(c).toEqual({});
  });

  it('extracts email and Indian/international phone numbers from text the customer wrote', () => {
    expect(contactFromText('Reach me: priya.nayak@example.com | 98765 43210')).toEqual({ email: 'priya.nayak@example.com', phone: '98765 43210' });
    expect(contactFromText('call +44 20 7946 0958 today').phone).toBe('+44 20 7946 0958');
    expect(contactFromText('Processed 1,20,000 requests in 2023')).toEqual({});
  });

  it('derives a display name from a LinkedIn slug', () => {
    expect(nameFromLinkedinId('priya-nayak-1a2b3c4d5e')).toBe('Priya Nayak');
    expect(nameFromLinkedinId('12345')).toBe('');
  });
});
