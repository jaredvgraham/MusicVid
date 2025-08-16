/* Fetch required TTFs into frontend/public/fonts */
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { pipeline } = require("stream/promises");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_FONTS_DIR = path.join(ROOT, "public", "fonts");

const FONTS = [
  {
    name: "Cinzel-Variable.ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/cinzel/Cinzel%5Bwght%5D.ttf",
  },
  {
    name: "Oswald-Variable.ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/oswald/Oswald%5Bwght%5D.ttf",
  },
  {
    name: "PlayfairDisplay-Variable.ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf",
  },
  {
    name: "BebasNeue-Regular.ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/bebasneue/BebasNeue-Regular.ttf",
  },
  {
    name: "Audiowide-Regular.ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/audiowide/Audiowide-Regular.ttf",
  },
  {
    name: "Monoton-Regular.ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/monoton/Monoton-Regular.ttf",
  },
  {
    name: "Inter-Regular.ttf",
    url: "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.ttf",
  },
  {
    name: "Inter-Bold.ttf",
    url: "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.ttf",
  },
];

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}
async function exists(p) {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
}
async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok || !res.body)
    throw new Error(`Fetch failed ${url} (${res.status})`);
  await pipeline(res.body, fs.createWriteStream(dest));
}

(async () => {
  await ensureDir(PUBLIC_FONTS_DIR);
  let dl = 0;
  for (const f of FONTS) {
    const out = path.join(PUBLIC_FONTS_DIR, f.name);
    if (await exists(out)) continue;
    try {
      console.log(`Downloading ${f.name}...`);
      await download(f.url, out);
      dl++;
    } catch (e) {
      console.warn(`Skip ${f.name}: ${e.message}`);
    }
  }
  const files = await fsp.readdir(PUBLIC_FONTS_DIR);
  console.log(`Fonts in ${PUBLIC_FONTS_DIR}:`, files.join(", "));
  if (!dl) console.log("No downloads needed.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
