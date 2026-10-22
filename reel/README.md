# JAMALI — Instagram Reel (Remotion)

16 s, 1080×1920, 30 fps. One idea: a blush swatch swipes across to reveal every scene, then closes into the round pink logo disc.

```bash
npm install
node sound/build-cues.mjs                                   # cues from src/timing.js
python3 <motion-graphics skill>/scripts/sound.py sound/cues.json public/sound.wav
python3 <motion-graphics skill>/scripts/sound.py sound/cues-sfx.json public/sfx.wav
node render.mjs                                             # out/Reel.mp4 + out/ReelNoMusic.mp4
node render.mjs Reel 479                                    # end frame / thumbnail
```

- Timing / beats: `src/timing.js` (picture and sound both read it).
- Products, prices, colours: `PRODUCTS` and `C` in `src/Main.jsx` (prices match `src/data/catalog.json` on the site at build time).
- Sound cues: `sound/build-cues.mjs`. UI samples (`add-to-cart.ogg`, `success.ogg`) are CC0 from uisfx (see `sound/LICENSE-AUDIO`).
- Product photos in `public/` come from jamalilb.com's own Shopify CDN.
