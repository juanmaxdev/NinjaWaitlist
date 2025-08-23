import { describe, it, expect } from 'vitest';
import {
  JAPANESE_KATAKANA_60,
  JAPANESE_ALPHABET_MAP,
  mapTimeUnit,
} from '../../../app/lib/japaneseAlphabetMapper';

describe('JAPANESE constants', () => {
  it('JAPANESE_KATAKANA_60 has 60 items and contains expected entries', () => {
    expect(Array.isArray(JAPANESE_KATAKANA_60)).toBe(true);
    expect(JAPANESE_KATAKANA_60).toHaveLength(60);
    expect(JAPANESE_KATAKANA_60[0]).toBe('ア');
    expect(JAPANESE_KATAKANA_60[4]).toBe('オ');
    expect(JAPANESE_KATAKANA_60[52]).toBe('ジ');
    expect(JAPANESE_KATAKANA_60[56]).toBe('ャ');
  });

  it('JAPANESE_ALPHABET_MAP.katakana references the same array', () => {
    expect(JAPANESE_ALPHABET_MAP.katakana).toBe(JAPANESE_KATAKANA_60);
  });

});

describe('mapTimeUnit behavior', () => {
  it('days returns "ニ" for even values and "ホ" for odd values (truncating decimals)', () => {
    expect(mapTimeUnit('days', 2)).toBe('ニ');
    expect(mapTimeUnit('days', 3)).toBe('ホ');
    expect(mapTimeUnit('days', 2.9)).toBe('ニ');
    expect(mapTimeUnit('days', -1)).toBe('ホ');
  });

  it('hours returns "ギ" for even values and "ン" for odd values (truncating decimals)', () => {
    expect(mapTimeUnit('hours', 2)).toBe('ギ');
    expect(mapTimeUnit('hours', 1)).toBe('ン');
    expect(mapTimeUnit('hours', 1.99)).toBe('ン');
    expect(mapTimeUnit('hours', -2)).toBe('ギ');
  });

  it('minutes normalizes correctly and uses the alphabet (0..59) with truncation', () => {
    expect(mapTimeUnit('minutes', 52)).toBe('ジ');
    expect(mapTimeUnit('minutes', 60)).toBe('ア');
    expect(mapTimeUnit('minutes', -8)).toBe('ジ');
    expect(mapTimeUnit('minutes', 52.9)).toBe('ジ');
  });

  it('seconds behaves the same as minutes (normalization and truncation)', () => {
    expect(mapTimeUnit('seconds', 56)).toBe('ャ');
    expect(mapTimeUnit('seconds', 116)).toBe('ャ');
    expect(mapTimeUnit('seconds', 120)).toBe('ア');
    const normalizedIndex = ((Math.trunc(-4) % 60) + 60) % 60;
    expect(mapTimeUnit('seconds', -4)).toBe(JAPANESE_KATAKANA_60[normalizedIndex]);
  });

  it('returns "?" for an unexpected unit at runtime (bypassing TypeScript)', () => {
    expect((mapTimeUnit as any)('months', 1)).toBe('?');
  });
});