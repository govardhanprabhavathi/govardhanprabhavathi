import fs from 'fs';
import path from 'path';

const sections = [
  'story-mast',
  'story-life',
  'story-timeline',
  'story-rhythm',
  'story-bubbles',
  'story-radar'
];

async function update() {
  const assetsDir = path.resolve('assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  for (const s of sections) {
    for (const mode of ['dark', 'light']) {
      try {
        const url = `https://www.gitskins.com/api/section/${s}?username=govardhanprabhavathi&mode=${mode}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        let svg = await res.text();

        // Remove Pro preview banner overlay
        const proIdx = svg.indexOf('<g aria-label="Pro preview:');
        if (proIdx !== -1) {
          svg = svg.substring(0, proIdx) + '</svg>';
        }

        // Remove gitskins.com watermark text element
        svg = svg.replace(/<text[^>]*>gitskins\.com<\/text>/g, '');

        if (!svg.trim().endsWith('</svg>')) {
          svg += '</svg>';
        }

        const fileName = `${s}-${mode}.svg`;
        fs.writeFileSync(path.join(assetsDir, fileName), svg, 'utf-8');
        console.log(`Updated ${fileName}`);
      } catch (err) {
        console.error(`Error updating ${s}-${mode}:`, err);
      }
    }
  }
}

update();
