import { FONT_DATA, type FontKey } from './fonts.generated';

export type { FontKey };
export type FontFamily = 'sans' | 'serif';

const cache = new Map<FontKey, Uint8Array>();

/** Decodes an embedded font once per isolate and reuses it across requests. */
export function fontBytes(key: FontKey): Uint8Array {
  let bytes = cache.get(key);
  if (!bytes) {
    const bin = atob(FONT_DATA[key]);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    cache.set(key, bytes);
  }
  return bytes;
}

export const FAMILY_FACES: Record<FontFamily, { regular: FontKey; semibold: FontKey; italic: FontKey }> = {
  sans: { regular: 'sansRegular', semibold: 'sansSemibold', italic: 'sansItalic' },
  serif: { regular: 'serifRegular', semibold: 'serifSemibold', italic: 'serifItalic' },
};
