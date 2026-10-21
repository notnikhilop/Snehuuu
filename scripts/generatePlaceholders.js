import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images');

const titles = [
  "My Beautiful Wife ♡",
  "Your Radiant Smile",
  "Us Together",
  "Everyday Sunshine",
  "Quiet Sweet Moments",
  "Favorite Laughs",
  "My Whole World",
  "A Moment in Time",
  "Pure Happiness",
  "Forever Favorite",
  "Holding Your Hand",
  "Snehuu, My Everything"
];

const colors = [
  ['#FCE7F0', '#D982A5'],
  ['#F2EEFA', '#B794F4'],
  ['#FFF5F5', '#FEB2B2'],
  ['#FFF9F5', '#F6AD55'],
  ['#FCE7F0', '#ED64A6'],
  ['#FAF5FF', '#9F7AEA'],
  ['#FCE7F0', '#E53E3E'],
  ['#F3E8FF', '#A855F7'],
  ['#FFF1F2', '#FB7185'],
  ['#FEF3C7', '#F59E0B'],
  ['#FCE7F0', '#D982A5'],
  ['#FDF2F8', '#EC4899']
];

titles.forEach((title, i) => {
  const [c1, c2] = colors[i];
  const num = String(i + 1).padStart(2, '0');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    <defs>
      <linearGradient id="g${i}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.35" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#75445C" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#g${i})" />
    <circle cx="400" cy="400" r="220" fill="#FFF9F5" opacity="0.65" filter="url(#shadow)" />
    <!-- Heart outline -->
    <path d="M400,520 C320,440 240,360 240,280 C240,200 320,160 400,240 C480,160 560,200 560,280 C560,360 480,440 400,520 Z" fill="#D982A5" opacity="0.85" />
    <text x="400" y="680" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold" fill="#75445C" text-anchor="middle">${title}</text>
    <text x="400" y="730" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#75445C" opacity="0.8" text-anchor="middle">Slot ${num} • photo-${num}.webp / .jpg</text>
    <rect x="280" y="770" width="240" height="40" rx="20" fill="#75445C" opacity="0.1" />
    <text x="400" y="796" font-family="sans-serif" font-size="14" font-weight="500" fill="#75445C" text-anchor="middle">Drop your photo here</text>
  </svg>`;

  fs.writeFileSync(path.join(outDir, `photo-${num}.svg`), svg);
  fs.writeFileSync(path.join(outDir, `photo-${num}.webp`), svg);
});

console.log('Generated 12 placeholder image slots');
