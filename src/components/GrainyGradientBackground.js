import { useEffect, useMemo, useRef } from 'react';

// Ported from https://github.com/yaseenhalabi/MTCHacks2025
// (src/components/GrainyGradientBackground.tsx), stripped of TypeScript
// and re-themed to the site's navy/gold palette.

// Lightweight 3D Simplex Noise (Stefan Gustavson, adapted to JS)
class SimplexNoise3D {
  constructor(seed = 1337) {
    this.grad3 = new Int8Array([
      1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1,
      0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1
    ]);

    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed >>> 0;
    const lcg = () => (s = (s * 1664525 + 1013904223) >>> 0);
    for (let i = 255; i > 0; i--) {
      const r = lcg() % (i + 1);
      const tmp = p[i];
      p[i] = p[r];
      p[r] = tmp;
    }
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  noise3(xin, yin, zin) {
    const F3 = 1 / 3;
    const G3 = 1 / 6;
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;

    let i1 = 0, j1 = 0, k1 = 0;
    let i2 = 0, j2 = 0, k2 = 0;

    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;

    const gi0 = (this.perm[ii + this.perm[jj + this.perm[kk]]] % 12) * 3;
    const gi1 = (this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12) * 3;
    const gi2 = (this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12) * 3;
    const gi3 = (this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12) * 3;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) {
      t0 *= t0;
      n0 = t0 * t0 * (this.grad3[gi0] * x0 + this.grad3[gi0 + 1] * y0 + this.grad3[gi0 + 2] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) {
      t1 *= t1;
      n1 = t1 * t1 * (this.grad3[gi1] * x1 + this.grad3[gi1 + 1] * y1 + this.grad3[gi1 + 2] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) {
      t2 *= t2;
      n2 = t2 * t2 * (this.grad3[gi2] * x2 + this.grad3[gi2 + 1] * y2 + this.grad3[gi2 + 2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) {
      t3 *= t3;
      n3 = t3 * t3 * (this.grad3[gi3] * x3 + this.grad3[gi3 + 1] * y3 + this.grad3[gi3 + 2] * z3);
    }
    return 32 * (n0 + n1 + n2 + n3);
  }
}

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function hexToRgb(hex) {
  let h = hex.trim();
  if (h.startsWith('#')) h = h.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixColors(a, b, t) {
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t))
  };
}

function makePalette(colors) {
  const rgbs = colors.map(hexToRgb);
  return (t) => {
    const n = rgbs.length;
    if (n === 1) return rgbs[0];
    const scaled = clamp01(t) * (n - 1);
    const i = Math.floor(scaled);
    const f = scaled - i;
    const c0 = rgbs[i];
    const c1 = rgbs[Math.min(i + 1, n - 1)];
    return mixColors(c0, c1, f);
  };
}

const DEFAULT_COLORS = ['#04070D', '#0A192F', '#1E3A8A', '#A9B7D1'];

export function GrainyGradientBackground({
  colors = DEFAULT_COLORS,
  amplitude = 60,
  scale = 820,
  speed = 0.18,
  grain = 0.9,
  grainScale = 1.0,
  resolution = 8,
  fpsCap,
  opacity = 0.8,
  blur = 120,
  className
}) {
  const canvasRef = useRef(null);

  const paletteLUT = useMemo(() => {
    const lut = new Uint8Array(256 * 3);
    const pal = makePalette(colors);
    for (let i = 0; i < 256; i++) {
      const { r, g, b } = pal(i / 255);
      const j = i * 3;
      lut[j] = r;
      lut[j + 1] = g;
      lut[j + 2] = b;
    }
    return lut;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.join(',')]);
  const noise = useMemo(() => new SimplexNoise3D(12345), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let mounted = true;
    let last = performance.now();
    let acc = 0;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    let bufferCanvas = null;
    let bufferCtx = null;
    let bufferImage = null;
    let renderW = 0;
    let renderH = 0;
    let stepPx = 1;
    let marginDevicePx = 0;
    let grainCanvas = null;
    let grainCtx = null;

    // The blur filter samples "nothing" past the buffer's own edges, fading
    // it toward transparent near any edge (visible as a pale band under a
    // transparent navbar). Render an overscanned buffer and draw it shifted
    // so only its already-blurred interior lands inside the visible canvas.
    function resize() {
      const parent = canvas.parentElement || document.body;
      const width = parent.clientWidth;
      const height = parent.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.imageSmoothingEnabled = true;

      stepPx = Math.max(1, Math.floor(resolution * dpr));
      marginDevicePx = Math.ceil(blur * dpr);
      renderW = Math.max(1, Math.ceil((canvas.width + marginDevicePx * 2) / stepPx));
      renderH = Math.max(1, Math.ceil((canvas.height + marginDevicePx * 2) / stepPx));
      bufferCanvas = document.createElement('canvas');
      bufferCanvas.width = renderW;
      bufferCanvas.height = renderH;
      bufferCtx = bufferCanvas.getContext('2d', { willReadFrequently: true });
      if (bufferCtx) bufferImage = bufferCtx.createImageData(renderW, renderH);
    }

    function renderFrame(time) {
      if (!mounted) return;
      const now = time;
      const dt = (now - last) / 1000;
      last = now;

      if (fpsCap && fpsCap > 0) {
        acc += dt;
        const minDt = 1 / fpsCap;
        if (acc < minDt) {
          raf = requestAnimationFrame(renderFrame);
          return;
        }
        acc = 0;
      }

      const w = canvas.width;
      const h = canvas.height;
      const t = now * 0.001 * speed;
      const invScale = 1 / (scale * dpr);
      const warpAmp = amplitude;

      if (!bufferCtx || !bufferImage) {
        raf = requestAnimationFrame(renderFrame);
        return;
      }

      const data = bufferImage.data;
      let ptr = 0;
      for (let y = 0; y < renderH; y++) {
        const yPix = y * stepPx - marginDevicePx;
        const ny = yPix * invScale;
        for (let x = 0; x < renderW; x++) {
          const xPix = x * stepPx - marginDevicePx;
          const nx = xPix * invScale;

          const wx = noise.noise3(nx * 0.6 + 5.2, ny * 0.6 + 1.3, t) * warpAmp;
          const wy = noise.noise3(nx * 0.6 - 3.1, ny * 0.6 + 7.7, t * 0.9) * warpAmp;

          const v = noise.noise3((xPix + wx) * invScale, (yPix + wy) * invScale, t * 1.2);
          const gn = grain * noise.noise3(nx * grainScale * 3 + 12.3, ny * grainScale * 3 - 4.56, t * 1.7);

          const s = clamp01(0.5 + 0.5 * (v * 0.9 + gn));
          const lutIndex = (s * 255) | 0;
          const base = lutIndex * 3;
          data[ptr++] = paletteLUT[base];
          data[ptr++] = paletteLUT[base + 1];
          data[ptr++] = paletteLUT[base + 2];
          data[ptr++] = 255;
        }
      }

      if (!bufferCanvas) {
        raf = requestAnimationFrame(renderFrame);
        return;
      }
      bufferCtx.putImageData(bufferImage, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const prevFilter = ctx.filter;
      ctx.filter = blur > 0 ? `blur(${blur}px)` : 'none';
      ctx.drawImage(
        bufferCanvas,
        0, 0, renderW, renderH,
        -marginDevicePx, -marginDevicePx, renderW * stepPx, renderH * stepPx
      );
      ctx.filter = prevFilter || 'none';

      if (grain > 0) {
        const grainScalePx = Math.max(1, Math.floor((grainScale || 1) * 2));
        const gw = Math.ceil(w / grainScalePx);
        const gh = Math.ceil(h / grainScalePx);

        if (!grainCanvas || !grainCtx || grainCanvas.width !== gw || grainCanvas.height !== gh) {
          grainCanvas = document.createElement('canvas');
          grainCanvas.width = gw;
          grainCanvas.height = gh;
          grainCtx = grainCanvas.getContext('2d', { willReadFrequently: true });
        }

        if (grainCtx && grainCanvas) {
          const gImg = grainCtx.createImageData(gw, gh);
          const gData = gImg.data;
          let p = 0;
          const tNoise = time * 0.0008;
          for (let yy = 0; yy < gh; yy++) {
            for (let xx = 0; xx < gw; xx++) {
              const vx = xx * 0.9;
              const vy = yy * 0.9;
              const n = noise.noise3(vx, vy, tNoise);
              const v = Math.floor(128 + 127 * n);
              const a = Math.floor(255 * Math.min(1, Math.max(0, grain)) * 0.35);
              gData[p++] = v;
              gData[p++] = v;
              gData[p++] = v;
              gData[p++] = a;
            }
          }
          grainCtx.putImageData(gImg, 0, 0);
          ctx.imageSmoothingEnabled = true;
          ctx.globalCompositeOperation = 'overlay';
          ctx.drawImage(grainCanvas, 0, 0, gw, gh, 0, 0, w, h);
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      raf = requestAnimationFrame(renderFrame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || document.body);
    raf = requestAnimationFrame(renderFrame);

    return () => {
      mounted = false;
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [amplitude, scale, speed, grain, grainScale, resolution, fpsCap, paletteLUT, noise, blur]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block', opacity, pointerEvents: 'none' }}
    />
  );
}

export default GrainyGradientBackground;
