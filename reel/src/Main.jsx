// JAMALI — Instagram Reel. One idea: a blush swatch swipes across to reveal every scene,
// then closes into the round pink logo disc.
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T, SWIPE_IN, SWIPE_OUT, DURATION } from "./timing.js";
import { useFonts, clamp, easeOut, easeIn, after, shake, Shockwave, Burst, Grain, wave } from "./fx.jsx";

export const C = {
  blush: "#f49ac9", blushDeep: "#e86aa9", petal: "#fde3ef", shell: "#fff4f8", cream: "#fffaf6",
  berry: "#c2185b", ink: "#2b0f1f", plum: "#4a1a35", mute: "#8a6b7b",
};

// Real catalogue data (src/data/catalog.json on the site).
const PRODUCTS = [
  { brand: "RARE BEAUTY", name: ["Soft Pinch", "Liquid Blush"], price: 13.99, was: 32.0, img: "rare.jpg", fit: "cover", pos: "50% 62%", bg: C.petal },
  { brand: "RHODE", name: ["Pocket", "Blush"], price: 12.99, was: 25.0, img: "rhode.jpg", fit: "cover", pos: "50% 50%", bg: C.shell },
  { brand: "HUDA BEAUTY", name: ["Faux Filler", "Jelly Oil Lipstick"], price: 16.99, was: 35.99, img: "huda.jpg", fit: "contain", pos: "50% 50%", bg: C.blush },
  { brand: "SOL DE JANEIRO", name: ["Brazilian Crush", "Cheirosa ’62 Mist"], price: 23.5, was: 30.0, img: "sol.jpg", fit: "contain", pos: "50% 50%", bg: "#ffe9dc" },
];
const pct = (p, w) => Math.round((1 - p / w) * 100);
const money = (n) => `$${n.toFixed(2)}`;

const SERIF = "Display";
const SANS = "Sans";
const AR = "Arabic";

export const Main = ({ music = true }) => {
  useFonts([
    [SERIF, "InstrumentSerif-Regular.ttf", { style: "normal" }],
    [SERIF, "InstrumentSerif-Italic.ttf", { style: "italic" }],
    [SANS, "Manrope-300.ttf", { weight: "300" }],
    [SANS, "Manrope-600.ttf", { weight: "600" }],
    [AR, "Tajawal-300.ttf", { weight: "300" }],
  ]);
  const f = useCurrentFrame();
  const [sx, sy] = shake(f, T.hit, 18, 4.5);

  return (
    <AbsoluteFill style={{ background: C.petal, overflow: "hidden" }}>
      <Audio src={staticFile(music ? "sound.wav" : "sfx.wav")} />
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {f < T.products[0] + SWIPE_OUT && <Intro />}
        {PRODUCTS.map((p, i) => {
          const start = T.products[i];
          const end = i < 3 ? T.products[i + 1] : T.promise;
          return (
            <Sequence key={p.img} from={start} durationInFrames={end - start + SWIPE_OUT} layout="none">
              {f < end + SWIPE_OUT && <Product p={p} index={i} />}
            </Sequence>
          );
        })}
        {f >= T.promise && f < T.cover + SWIPE_IN + 2 && <Promises />}
        {f >= T.cover && <Finale />}
        <Swipes />
      </AbsoluteFill>
      <WhiteFlash f={f} start={T.hit} />
      <Grain f={f} opacity={0.05} />
    </AbsoluteFill>
  );
};

/* ---------- through-line: the blush swipe ---------- */

function swipePath(W, H) {
  // three wide passes, like a swatch dragged across skin
  const p = [
    [-0.35 * W, 0.12 * H], [1.35 * W, 0.2 * H],
    [-0.35 * W, 0.5 * H], [1.35 * W, 0.56 * H],
    [-0.35 * W, 0.86 * H], [1.35 * W, 0.94 * H],
  ];
  return "M " + p.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join(" L ");
}

function SwipeStroke({ head, tail, W, H }) {
  if (head <= 0 || tail >= 1) return null;
  const d = swipePath(W, H);
  const layers = [
    { color: C.blushDeep, w: 0.44 * H, lag: 0 },
    { color: C.blush, w: 0.34 * H, lag: 0.06 },
    { color: C.petal, w: 0.035 * H, lag: 0.1, o: 0.85 },
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {layers.map((l, i) => {
        const h = Math.max(0, head - l.lag), t = Math.max(0, tail - l.lag);
        if (h <= t) return null;
        return (
          <path key={i} d={d} pathLength={1} fill="none" stroke={l.color} strokeWidth={l.w} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={`${h - t} 2`} strokeDashoffset={-t} opacity={l.o ?? 1} />
        );
      })}
    </svg>
  );
}

function Swipes() {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const cuts = [...T.products, T.promise];
  for (const t of cuts) {
    if (f >= t - SWIPE_IN && f < t + SWIPE_OUT) {
      const head = interpolate(f, [t - SWIPE_IN, t], [0, 1.12], { ...clamp, easing: easeIn });
      const tail = f < t ? 0 : interpolate(f, [t, t + SWIPE_OUT], [0, 1.12], { ...clamp, easing: easeOut });
      return <SwipeStroke head={head} tail={tail} W={W} H={H} />;
    }
  }
  // final swipe: covers and stays; Finale takes over once the frame is covered
  if (f >= T.cover - SWIPE_IN && f < T.cover + 2) {
    const head = interpolate(f, [T.cover - SWIPE_IN, T.cover], [0, 1.12], { ...clamp, easing: easeIn });
    return <SwipeStroke head={head} tail={0} W={W} H={H} />;
  }
  return null;
}

/* ---------- shared bits ---------- */

const Sparkle = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z" fill={color} />
  </svg>
);

function Glow({ x, y, r, color, o = 1 }) {
  return <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, ${color} 0%, transparent ${r}px)`, opacity: o }} />;
}

function Eyebrow({ children, f, at, color = C.berry, top }) {
  const { width: W } = useVideoConfig();
  const o = after(f, at, [0, 10], [0, 1], { easing: easeOut });
  const ls = interpolate(f, [at, at + 18], [0.6, 0.32], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", top, left: 0, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: `${ls}em`, color, opacity: o, paddingLeft: `${ls}em` }}>
      {children}
    </div>
  );
}

// a word rising out of a mask
function Rise({ f, at, children, style, dist = 1.1, damping = 14 }) {
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping, stiffness: 170 } });
  return (
    <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em", verticalAlign: "bottom" }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - s) * dist * 100}%) rotate(${(1 - s) * 5}deg)`, ...style }}>{children}</span>
    </span>
  );
}

/* ---------- 0 · cold open ---------- */

function Intro() {
  const f = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const push = interpolate(f, [0, 60], [1, 1.05], clamp);
  // the swatch is painted behind the word first: the through-line is on screen from frame 0
  const paint = interpolate(f, [-5, 10], [0, 1], { ...clamp, easing: easeOut });
  const y = 0.52 * H;
  const sp = spring({ frame: f - T.sparkle, fps, config: { damping: 8, stiffness: 160 } });
  return (
    <AbsoluteFill style={{ background: C.petal }}>
      <Glow x={W * 0.5} y={y} r={W * 0.75} color="rgba(244,154,201,.55)" />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${W / 2}px ${y}px` }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <path d={`M ${0.08 * W} ${y + 30} C ${0.35 * W} ${y - 40}, ${0.65 * W} ${y + 70}, ${0.92 * W} ${y - 10}`} fill="none" stroke={C.blush} strokeWidth={0.13 * H}
            strokeLinecap="round" pathLength={1} strokeDasharray={`${paint} 2`} />
          <path d={`M ${0.12 * W} ${y + 10} C ${0.35 * W} ${y - 55}, ${0.65 * W} ${y + 50}, ${0.88 * W} ${y - 30}`} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={10}
            strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0, paint - 0.15)} 2`} />
        </svg>
        <Eyebrow f={f} at={T.eyebrow} top={0.27 * H}>AUTHENTIC BEAUTY · LEBANON</Eyebrow>
        <div style={{ position: "absolute", left: 0, width: W, top: y - 0.17 * H, textAlign: "center", fontFamily: SERIF, color: C.ink, lineHeight: 0.85 }}>
          <div style={{ fontSize: 330, letterSpacing: "-0.02em" }}>
            <Rise f={f} at={T.pretty} damping={13}>Pretty</Rise>
          </div>
          <div style={{ fontSize: 170, fontStyle: "italic", color: C.berry, marginTop: 10 }}>
            <Rise f={f} at={T.starts}>starts</Rise>{" "}
            <Rise f={f} at={T.here}>here</Rise>
          </div>
        </div>
        <Sparkle size={110} color={C.berry} style={{ position: "absolute", left: W * 0.8, top: y + 0.07 * H, transform: `scale(${sp}) rotate(${(1 - sp) * 90}deg)` }} />
        <Sparkle size={60} color={C.blushDeep} style={{ position: "absolute", left: W * 0.12, top: y - 0.2 * H, transform: `scale(${spring({ frame: f - T.sparkle - 6, fps, config: { damping: 8 } })})` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ---------- 1-4 · products ---------- */

function Product({ p, index }) {
  const f = useCurrentFrame(); // local to the chapter
  const { width: W, height: H, fps } = useVideoConfig();
  const onDark = false;
  const cardW = 0.6 * W, cardH = 0.43 * H, cardX = (W - cardW) / 2, cardY = 0.215 * H;
  const enter = spring({ frame: f + 2, fps, config: { damping: 13, stiffness: 150 } });
  const scale = interpolate(enter, [0, 1], [1.22, 1]);
  const tilt = (index % 2 ? 1 : -1) * interpolate(enter, [0, 1], [9, 2.5]);
  const bob = wave(f, 60, 1) * 8;
  const blur = interpolate(f, [-2, 6], [10, 0], clamp);

  const priceS = spring({ frame: f - T.pricePop, fps, config: { damping: 9, stiffness: 220 } });
  const wasO = after(f, T.wasPrice, [0, 8], [0, 1], { easing: easeOut });
  const strike = after(f, T.strike, [0, 8], [0, 1], { easing: easeOut });
  const pillS = spring({ frame: f - T.pill, fps, config: { damping: 8, stiffness: 240 } });
  const push = interpolate(f, [0, 70], [1, 1.035], clamp);
  const ink = onDark ? C.cream : C.ink;

  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <Glow x={W / 2} y={cardY + cardH * 0.55} r={W * 0.7} color={index === 2 ? "rgba(255,255,255,.45)" : "rgba(244,154,201,.5)"} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${W / 2}px ${H * 0.45}px` }}>
        <Eyebrow f={f} at={3} top={0.155 * H} color={index === 2 ? C.ink : C.berry}>{p.brand}</Eyebrow>

        {/* arch card — the same shape as the site's hero floaters */}
        <div style={{
          position: "absolute", left: cardX, top: cardY, width: cardW, height: cardH,
          transform: `translateY(${bob}px) rotate(${tilt}deg) scale(${scale})`, filter: `blur(${blur}px)`,
          borderRadius: `${cardW / 2}px ${cardW / 2}px 56px 56px`, background: "#fff", padding: 18,
          boxShadow: "0 60px 120px -40px rgba(194,24,91,.45)",
        }}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: `${cardW / 2}px ${cardW / 2}px 42px 42px`, background: "#fff" }}>
            <Img src={staticFile(p.img)} style={{ width: "100%", height: "100%", objectFit: p.fit, objectPosition: p.pos, transform: p.fit === "contain" ? "scale(0.86)" : "scale(1.04)" }} />
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, width: W, top: 0.668 * H, textAlign: "center", fontFamily: SERIF, fontSize: 88, lineHeight: 0.98, color: ink }}>
          {p.name.map((line, i) => (
            <div key={i} style={{ fontStyle: i === 1 ? "italic" : "normal" }}>
              <Rise f={f} at={7 + i * 5}>{line}</Rise>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", left: 0, width: W, top: 0.775 * H, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, fontFamily: SANS, fontWeight: 600 }}>
          <span style={{ fontSize: 96, color: ink, transform: `scale(${priceS})`, display: "inline-block", letterSpacing: "-0.02em" }}>{money(p.price)}</span>
          <span style={{ position: "relative", fontSize: 50, color: index === 2 ? C.plum : C.mute, opacity: wasO, fontWeight: 300 }}>
            {money(p.was)}
            <span style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 5, borderRadius: 3, background: C.berry, transform: `scaleX(${strike})`, transformOrigin: "left" }} />
          </span>
          <span style={{ fontSize: 34, color: "#fff", background: C.berry, borderRadius: 999, padding: "10px 20px", transform: `scale(${pillS}) rotate(${(1 - pillS) * -12}deg)`, display: "inline-block" }}>
            −{pct(p.price, p.was)}%
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ---------- 5 · promises (dark chapter, the contrast before the finale) ---------- */

function Promises() {
  const f = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const [l1, l2, l3] = T.lines;
  const slam = spring({ frame: f - l1, fps, config: { damping: 11, stiffness: 210 } });
  const s1 = interpolate(slam, [0, 1], [1.5, 1]);
  const b1 = f < l1 ? 0 : interpolate(f - l1, [0, 5], [12, 0], clamp);
  const words3 = ["Free", "delivery", "over", "$50"];
  const drift = interpolate(f, [T.promise, T.cover + 10], [0, -30], clamp);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Glow x={W / 2} y={H * 0.5} r={W * 0.8} color="rgba(232,106,169,.28)" />
      <div style={{ position: "absolute", left: 0, width: W, top: 0.33 * H + drift, textAlign: "center", fontFamily: SERIF, color: C.cream, lineHeight: 1 }}>
        <div style={{ fontSize: 160, transform: `scale(${f >= l1 ? s1 : 0})`, filter: `blur(${b1}px)` }}>
          100% <span style={{ fontStyle: "italic", color: C.blush }}>authentic</span>
        </div>
        <div style={{ marginTop: 90, fontSize: 116 }}>
          <Rise f={f} at={l2}>Delivered across</Rise>
          <br />
          <Rise f={f} at={l2 + 4} style={{ fontStyle: "italic", color: C.blush }}>Lebanon</Rise>
        </div>
        <div style={{ marginTop: 18, fontFamily: SANS, fontWeight: 300, fontSize: 40, letterSpacing: "0.04em", color: "rgba(255,250,246,.75)", opacity: after(f, l2 + 8, [0, 10], [0, 1]) }}>
          in 3–4 business days
        </div>
        <div style={{ marginTop: 90, fontFamily: SANS, fontWeight: 600, fontSize: 70, display: "flex", justifyContent: "center", gap: 18 }}>
          {words3.map((w, i) => {
            const s = spring({ frame: f - l3 - i * 3, fps, config: { damping: 10, stiffness: 200 } });
            return (
              <span key={w} style={{ display: "inline-block", transform: `translateY(${(1 - s) * 60}px)`, opacity: f >= l3 + i * 3 ? Math.min(1, s * 1.4) : 0, color: w === "$50" ? C.blush : C.cream }}>
                {w}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- 6 · finale: the swatch becomes the logo disc ---------- */

function Finale() {
  const f = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const cx = W / 2, cy = 0.405 * H, R = 0.3 * W;
  const full = Math.hypot(W, H);

  // anticipation: the blush field sucks in to slightly smaller than final, waits in silence, then slams
  const shrink = interpolate(f, [T.shrinkStart, T.gap], [full, R * 0.9], { ...clamp, easing: Easing.bezier(0.6, 0, 0.4, 1) });
  const hitS = spring({ frame: f - T.hit, fps, config: { damping: 10, stiffness: 200 } });
  const r = f < T.hit ? shrink : interpolate(hitS, [0, 1], [R * 0.9, R]);
  const dim = f >= T.gap && f < T.hit ? 0.06 : 0;

  const word = spring({ frame: f - T.hit, fps, config: { damping: 11, stiffness: 210 } });
  const wordScale = interpolate(word, [0, 1], [1.5, 1]);
  const wordBlur = f < T.hit ? 0 : interpolate(f - T.hit, [0, 5], [14, 0], clamp);
  const tracking = interpolate(f, [T.hit, T.hit + 30], [0.8, 0.42], { ...clamp, easing: easeOut });
  const ar = spring({ frame: f - T.arabic, fps, config: { damping: 12, stiffness: 160 } });
  const push = interpolate(f, [T.hit, DURATION], [1, 1.035], clamp);
  const sheen = after(f, T.sheen, [0, 26], [0, 1], { easing: easeOut });

  const tag = after(f, T.tagline, [0, 14], [0, 1], { easing: easeOut });
  const url = spring({ frame: f - T.url, fps, config: { damping: 12, stiffness: 190 } });
  const code = spring({ frame: f - T.code, fps, config: { damping: 12, stiffness: 190 } });
  const glow = f < T.hit ? 0.35 : interpolate(f - T.hit, [0, 6, 40], [0.35, 1, 0.65], clamp);

  return (
    <AbsoluteFill style={{ background: C.cream }}>
      {f >= T.hit && <Glow x={cx} y={cy} r={W * 0.85} color={`rgba(244,154,201,${0.55 * glow})`} />}
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${cx}px ${cy}px` }}>
        {/* burst + ring sit behind the disc, so they read as flying off its edge */}
        <Shockwave f={f} cx={cx} cy={cy} start={T.hit} max={H * 0.7} width={14} rgb="232,106,169" dur={34} />
        <Burst f={f} cx={cx} cy={cy} start={T.hit} count={110} speed={95} seed="jm" colors={[C.blushDeep, C.berry, C.blush]} scale={1.6} />
        {/* the blush field */}
        <AbsoluteFill style={{ background: C.blush, clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
          {f < T.hit && (
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              <path d={`M ${-0.2 * W} ${0.62 * H} C ${0.3 * W} ${0.52 * H}, ${0.7 * W} ${0.5 * H}, ${1.2 * W} ${0.36 * H}`} fill="none" stroke={C.petal} strokeOpacity={0.8}
                strokeWidth={0.035 * H} strokeLinecap="round" transform={`translate(0 ${interpolate(f, [T.cover, T.gap], [0, -0.12 * H], clamp)})`} />
              <path d={`M ${-0.2 * W} ${0.3 * H} C ${0.3 * W} ${0.22 * H}, ${0.7 * W} ${0.2 * H}, ${1.2 * W} ${0.08 * H}`} fill="none" stroke="#fff" strokeOpacity={0.35}
                strokeWidth={0.02 * H} strokeLinecap="round" transform={`translate(0 ${interpolate(f, [T.cover, T.gap], [0, 0.1 * H], clamp)})`} />
            </svg>
          )}
        </AbsoluteFill>
        {f >= T.hit && (
          <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
            <div style={{ position: "absolute", left: cx - R * 1.5 + sheen * R * 3.2, top: cy - R * 1.2, width: R * 0.35, height: R * 2.4, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)", transform: "rotate(18deg)", opacity: sheen > 0 && sheen < 1 ? 1 : 0 }} />
          </AbsoluteFill>
        )}

        {f >= T.hit && (
          <div style={{ position: "absolute", left: 0, width: W, top: cy - 120, textAlign: "center", color: "#fff", transform: `scale(${wordScale})`, transformOrigin: `${cx}px 60px`, filter: `blur(${wordBlur}px)` }}>
            <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 104, letterSpacing: `${tracking}em`, paddingLeft: `${tracking}em`, lineHeight: 1 }}>JAMALI</div>
          </div>
        )}
        <div lang="ar" style={{ position: "absolute", left: 0, width: W, top: cy + 10, textAlign: "center", fontFamily: AR, fontWeight: 300, fontSize: 96, color: "#fff", opacity: f >= T.arabic ? Math.min(1, ar * 1.5) : 0, transform: `translateY(${(1 - ar) * 40}px)`, direction: "rtl" }}>
          جمالي
        </div>

        {f >= T.hit && [[-0.4, -0.36, 70, 0], [0.34, -0.33, 46, 8], [0.36, 0.27, 76, 4], [-0.36, 0.32, 40, 12]].map(([dx, dy, s, d], i) => {
          const k = spring({ frame: f - T.hit - 6 - d, fps, config: { damping: 9 } });
          return <Sparkle key={i} size={s} color={i % 2 ? C.blushDeep : C.berry} style={{ position: "absolute", left: cx + dx * W * 1.05 - s / 2, top: cy + dy * W * 1.05 - s / 2, transform: `scale(${k * (1 + 0.08 * wave(f, 40, 1, i))}) rotate(${(1 - k) * 120 + wave(f, 80, 1, i) * 10}deg)` }} />;
        })}

        <div style={{ position: "absolute", left: 0, width: W, top: 0.625 * H, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 104, color: C.ink, opacity: tag, transform: `translateY(${(1 - tag) * 30}px)` }}>
          Pretty starts <span style={{ color: C.berry }}>here</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: W, top: 0.705 * H, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: C.cream, background: C.ink, borderRadius: 999, padding: "24px 52px", transform: `scale(${f >= T.url ? url : 0})` }}>
            Shop jamalilb.com
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, width: W, top: 0.775 * H, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.berry, border: `3px dashed ${C.berry}`, borderRadius: 999, padding: "14px 30px", background: "rgba(253,227,239,.7)", transform: `translateY(${(1 - code) * 40}px)`, opacity: f >= T.code ? Math.min(1, code * 1.5) : 0 }}>
            WELCOME10 · 10% off your first order
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#2b0f1f", opacity: dim }} />
    </AbsoluteFill>
  );
}

function WhiteFlash({ f, start }) {
  const o = f < start ? 0 : interpolate(f - start, [0, 1, 6], [0.75, 0.35, 0], clamp);
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
}
