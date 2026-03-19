const cyrillicToLatinMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

/**
 * Converts Cyrillic text to a URL-friendly Latin transliteration.
 *
 * Replaces all Cyrillic characters with Latin equivalents, normalizes the string,
 * replaces any non-alphanumeric characters with underscores, and lowercases the result.
 *
 * ---
 *
 * Преобразует кириллический текст в латинскую транслитерацию, подходящую для URL.
 *
 * Заменяет символы кириллицы на латиницу, нормализует строку, заменяет все
 * не-алфавитные символы на подчёркивания и приводит к нижнему регистру.
 *
 * @param {string} text - Input text in Cyrillic
 * @returns {string} Transliterated and normalized string
 *
 * @example
 * transliterate('Суши и роллы') // → 'sushi_i_rolly'
 */
export const transliterate = (text: string): string => {
  return text
    .split('')
    .map((char): string => {
      const lowerChar = char.toLowerCase();
      return cyrillicToLatinMap[lowerChar] !== undefined ? cyrillicToLatinMap[lowerChar] : char;
    })
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
};
