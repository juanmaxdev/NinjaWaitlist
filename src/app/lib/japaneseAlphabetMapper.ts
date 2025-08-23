export type JapaneseAlphabetType = 'katakana'

export const JAPANESE_KATAKANA_60: string[] = [
  'ア','イ','ウ','エ','オ',
  'カ','キ','ク','ケ','コ',
  'サ','シ','ス','セ','ソ',
  'タ','チ','ツ','テ','ト',
  'ナ','ニ','ヌ','ネ','ノ',
  'ハ','ヒ','フ','ヘ','ホ',
  'マ','ミ','ム','メ','モ',
  'ヤ','ユ','ヨ',
  'ラ','リ','ル','レ','ロ',
  'ワ','ヲ','ン',
  'ガ','ギ','グ','ゲ','ゴ',
  'ザ','ジ','ズ','ゼ','ゾ',
  'ャ','ュ','ョ','ッ'
]

export const JAPANESE_ALPHABET_MAP: Record<JapaneseAlphabetType, readonly string[]> = {
  katakana: JAPANESE_KATAKANA_60,
}

export function mapTimeUnit(unit: 'days' | 'hours' | 'minutes' | 'seconds', value: number): string {
  const alphabet = JAPANESE_ALPHABET_MAP.katakana

  switch (unit) {
    case 'days': {
      const isEven = Math.trunc(value) % 2 === 0
      return isEven ? 'ニ' : 'ホ'
    }
    case 'hours': {
      const isEven = Math.trunc(value) % 2 === 0
      return isEven ? 'ギ' : 'ン' 
    }
    case 'minutes': {
      const normalized = ((Math.trunc(value) % 60) + 60) % 60
      return alphabet[normalized]
    }
    case 'seconds': {
      const normalized = ((Math.trunc(value) % 60) + 60) % 60
      return alphabet[normalized]
    }
    default:
      return '?'
  }
}
