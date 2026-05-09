/**
 * Tiny URL-safe id generator. Avoids pulling the nanoid package for one
 * function. 21 chars of crypto-grade entropy when crypto.getRandomValues is
 * available; falls back to Math.random for SSR convenience.
 */

const ALPHABET =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export function nanoid(size = 21): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    let out = '';
    for (let i = 0; i < size; i++) out += ALPHABET[bytes[i] & 63];
    return out;
  }
  let out = '';
  for (let i = 0; i < size; i++) out += ALPHABET[Math.floor(Math.random() * 64)];
  return out;
}
