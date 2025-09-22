import { createRequire } from 'node:module';

import type { EmojiData } from './data';
import type { UnicodeMap } from './mapping';

const require = createRequire(import.meta.url);
const data = require('pl-emoji-mart-data/sets/17/twitter.json');

/*
 * Google Noto strips their hex codes from unicode codepoints to make it look "pretty"
 * - fe0f is removed
 */

const tweaks = {
  '#⃣': ['0023-20e3', 'hash'],
  '*⃣': ['002a-20e3', 'keycap_star'],
  '0⃣': ['0030-20e3', 'zero'],
  '1⃣': ['0031-20e3', 'one'],
  '2⃣': ['0032-20e3', 'two'],
  '3⃣': ['0033-20e3', 'three'],
  '4⃣': ['0034-20e3', 'four'],
  '5⃣': ['0035-20e3', 'five'],
  '6⃣': ['0036-20e3', 'six'],
  '7⃣': ['0037-20e3', 'seven'],
  '8⃣': ['0038-20e3', 'eight'],
  '9⃣': ['0039-20e3', 'nine'],
  '❤‍🔥': ['2764-fe0f-200d-1f525', 'heart_on_fire'],
  '❤‍🩹': ['2764-fe0f-200d-1fa79', 'mending_heart'],
  '👁‍🗨️': ['1f441-fe0f-200d-1f5e8-fe0f', 'eye-in-speech-bubble'],
  '👁️‍🗨': ['1f441-fe0f-200d-1f5e8-fe0f', 'eye-in-speech-bubble'],
  '👁‍🗨': ['1f441-fe0f-200d-1f5e8-fe0f', 'eye-in-speech-bubble'],
  '🕵‍♂️': ['1f575-fe0f-200d-2642-fe0f', 'male-detective'],
  '🕵️‍♂': ['1f575-fe0f-200d-2642-fe0f', 'male-detective'],
  '🕵‍♂': ['1f575-fe0f-200d-2642-fe0f', 'male-detective'],
  '🕵‍♀️': ['1f575-fe0f-200d-2640-fe0f', 'female-detective'],
  '🕵️‍♀': ['1f575-fe0f-200d-2640-fe0f', 'female-detective'],
  '🕵‍♀': ['1f575-fe0f-200d-2640-fe0f', 'female-detective'],
  '🏌‍♂️': ['1f3cc-fe0f-200d-2642-fe0f', 'man-golfing'],
  '🏌️‍♂': ['1f3cc-fe0f-200d-2642-fe0f', 'man-golfing'],
  '🏌‍♂': ['1f3cc-fe0f-200d-2642-fe0f', 'man-golfing'],
  '🏌‍♀️': ['1f3cc-fe0f-200d-2640-fe0f', 'woman-golfing'],
  '🏌️‍♀': ['1f3cc-fe0f-200d-2640-fe0f', 'woman-golfing'],
  '🏌‍♀': ['1f3cc-fe0f-200d-2640-fe0f', 'woman-golfing'],
  '⛹‍♂️': ['26f9-fe0f-200d-2642-fe0f', 'man-bouncing-ball'],
  '⛹️‍♂': ['26f9-fe0f-200d-2642-fe0f', 'man-bouncing-ball'],
  '⛹‍♂': ['26f9-fe0f-200d-2642-fe0f', 'man-bouncing-ball'],
  '⛹‍♀️': ['26f9-fe0f-200d-2640-fe0f', 'woman-bouncing-ball'],
  '⛹️‍♀': ['26f9-fe0f-200d-2640-fe0f', 'woman-bouncing-ball'],
  '⛹‍♀': ['26f9-fe0f-200d-2640-fe0f', 'woman-bouncing-ball'],
  '🏋‍♂️': ['1f3cb-fe0f-200d-2642-fe0f', 'man-lifting-weights'],
  '🏋️‍♂': ['1f3cb-fe0f-200d-2642-fe0f', 'man-lifting-weights'],
  '🏋‍♂': ['1f3cb-fe0f-200d-2642-fe0f', 'man-lifting-weights'],
  '🏋‍♀️': ['1f3cb-fe0f-200d-2640-fe0f', 'woman-lifting-weights'],
  '🏋️‍♀': ['1f3cb-fe0f-200d-2640-fe0f', 'woman-lifting-weights'],
  '🏋‍♀': ['1f3cb-fe0f-200d-2640-fe0f', 'woman-lifting-weights'],
  '🏳‍🌈': ['1f3f3-fe0f-200d-1f308', 'rainbow_flag'],
  '🏳‍⚧️': ['1f3f3-fe0f-200d-26a7-fe0f', 'transgender_flag'],
  '🏳️‍⚧': ['1f3f3-fe0f-200d-26a7-fe0f', 'transgender_flag'],
  '🏳‍⚧': ['1f3f3-fe0f-200d-26a7-fe0f', 'transgender_flag'],
};

const stripcodes = (unified: string, native: string) => {
  return unified.replaceAll('-fe0f', '');
};

const generateMappings = (emojiMap: EmojiData['emojis']): UnicodeMap => {
  const result: UnicodeMap = {};
  const emojis = Object.values(emojiMap ?? {});

  for (const value of emojis) {
    for (const item of value.skins) {
      if (!item) {
        continue;
      }
      const { unified, native } = item;
      const stripped = stripcodes(unified, native);

      result[native] = { unified: stripped, shortcode: value.id };
    }
  }

  for (const [native, [unified, shortcode]] of Object.entries(tweaks)) {
    const stripped = stripcodes(unified, native);

    result[native] = { unified: stripped, shortcode };
  }

  return result;
};

const unicodeMapping = generateMappings(data.emojis);

export default () => ({
  data: unicodeMapping,
});
