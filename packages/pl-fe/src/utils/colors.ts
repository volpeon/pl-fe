/*
MIT License

Copyright (c) 2022 Javis V. Pérez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Adapted from:
// https://github.com/javisperez/tailwindcolorshades/blob/master/src/composables/colors.ts

import type { Hsl, Rgb, TailwindColorObject } from 'pl-fe/types/colors';

const hexToRgb = (hex: string): Rgb | null => {
  const sanitizedHex = hex.replace(/##/g, '#');
  const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    sanitizedHex,
  );

  if (!colorParts) {
    return null;
  }

  const [, r, g, b] = colorParts;

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16),
  } as Rgb;
};

const rgbToHsl = (rgb: Rgb): Hsl => {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h;
  if (d === 0) h = 0;
  else if (max === r) h = (g - b) / d % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;

  const l = (min + max) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  return { h: h * 60, s, l };
};

const hslToRgb = (hsl: Hsl): Rgb => {
  const k = (n: number) => (n + hsl.h / 30) % 12;
  const a = hsl.s * Math.min(hsl.l, 1 - hsl.l);
  const f = (n: number) =>
    hsl.l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
};


const rgbToHex = (rgb: Rgb): string => {
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

const scale = (hex: string, saturation: number, lightness: number): string => {
  const rgbColor = hexToRgb(`#${hex}`);

  if (!rgbColor) {
    return '';
  }

  const color = rgbToHsl(rgbColor);
  color.s *= saturation;
  color.l = lightness;
  return rgbToHex(hslToRgb(color));
};

const colors = (baseColor: string, dark?: boolean): TailwindColorObject => {
  const response: TailwindColorObject = {
    500: `#${baseColor}`.replace(/##/g, '#'),
  };

  let saturationMap: Record<number, number>, lightnessMap: Record<number, number>;

  if (!dark) {
    saturationMap = {
      50:  0.4,
      100: 0.5,
      200: 0.6,
      300: 0.8,
      400: 0.9,
      500: 1,
      600: 1,
      700: 1,
      800: 1,
      900: 1,
    };
    lightnessMap = {
      50: 0.975,
      100: 0.95,
      200: 0.875,
      300: 0.65,
      400: 0.6,
      500: 0.5,
      600: 0.45,
      700: 0.35,
      800: 0.15,
      900: 0.095,
    };
  } else {
    saturationMap = {
      50:  1,
      100: 1,
      200: 1,
      300: 1,
      400: 1,
      500: 1,
      600: 0.4,
      700: 0.3,
      800: 0.15,
      900: 0.1,
    };
    lightnessMap = {
      50: 0.975,
      100: 0.95,
      200: 0.875,
      300: 0.65,
      400: 0.6,
      500: 0.5,
      600: 0.45,
      700: 0.35,
      800: 0.15,
      900: 0.095,
    };
    console.log("dark", saturationMap)
  }

  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(level => {
    response[level] = scale(baseColor, saturationMap[level], lightnessMap[level]);
  });

  return response;
};

export {
  hexToRgb,
  colors as default,
};
