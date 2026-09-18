import { describe, it, expect } from 'vitest';
import { generateLicenseKey } from '../src/lib/licenseKey';

describe('generateLicenseKey', () => {
  it('returns a key matching the LKX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX format', () => {
    const key = generateLicenseKey();
    expect(key).toMatch(/^LKX-[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{8}$/);
  });

  it('returns a different key on each call', () => {
    const a = generateLicenseKey();
    const b = generateLicenseKey();
    expect(a).not.toBe(b);
  });
});
