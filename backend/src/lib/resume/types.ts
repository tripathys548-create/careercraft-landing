export type TemplateName =
  | 'modern'
  | 'classic'
  | 'compact'
  | 'executive'
  | 'finance'
  | 'tech'
  | 'minimal'
  | 'nordic';
export type PageSize = 'a4' | 'letter';

export const TEMPLATE_NAMES: readonly TemplateName[] = [
  'modern',
  'classic',
  'compact',
  'executive',
  'finance',
  'tech',
  'minimal',
  'nordic',
];

export interface ResumeContact {
  email?: string;
  phone?: string;
  location?: string;
  /** Display form without protocol, e.g. "linkedin.com/in/priya-nayak" */
  linkedin?: string;
  website?: string;
}

export interface ResumeRole {
  title: string;
  company: string;
  location?: string;
  /** "Jan 2022" | "2022" */
  start?: string;
  /** "Mar 2024" | "2024" | "Present" */
  end?: string;
  bullets: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  start?: string;
  end?: string;
  /** Grades / honours / coursework — only ever copied from the profile. */
  detail?: string;
}

export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeData {
  name: string;
  headline: string;
  contact: ResumeContact;
  summary: string;
  experience: ResumeRole[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  template?: TemplateName;
  pageSize?: PageSize;
}

/**
 * Everything we know about the customer, as raw noisy text. Used by both entry points:
 *  - the Chrome extension (scraped LinkedIn sections), and
 *  - the web Profile Analyzer (pasted resume / LinkedIn export in `raw`, plus a target role).
 */
export interface SourceProfile {
  linkedinId: string;
  name: string;
  headline: string;
  about: string;
  experience: string;
  education: string;
  skills: string;
  /** Free-form pasted text: an existing resume and/or a LinkedIn export. */
  raw: string;
  /** Optional role the customer is aiming for — steers emphasis, never adds facts. */
  targetRole: string;
}

export interface Issue {
  severity: 'hard' | 'soft';
  path: string;
  message: string;
}
