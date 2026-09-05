import React, { useState, useRef, useCallback } from "react";

// ---------- Geometry / tracing helpers ----------

function rgbDist(a, b) {
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

// K-means quantization on sampled pixels, then full assignment.
function quantizeColors(imgData, w, h, k, alphaThreshold) {
  const data = imgData.data;
  const n = w * h;
  const isTransparent = new Uint8Array(n);
  const samples = [];
  const step = Math.max(1, Math.floor(n / 6000)); // cap sample count for speed

  for (let i = 0, p = 0; i < n; i++, p += 4) {
    const a = data[p + 3];
    if (a < alphaThreshold) {
      isTransparent[i] = 1;
      continue;
    }
    if (i % step === 0) {
      samples.push([data[p], data[p + 1], data[p + 2]]);
    }
  }

  if (samples.length === 0) {
    return { labels: new Int16Array(n).fill(-1), colors: [], isTransparent };
  }

  const kEff = Math.max(1, Math.min(k, samples.length));
  // init centroids: evenly spaced through samples (deterministic, avoids empty clusters better than random)
  let centroids = [];
  for (let c = 0; c < kEff; c++) {
    centroids.push(samples[Math.floor((c * samples.length) / kEff)].slice());
  }

  for (let iter = 0; iter < 8; iter++) {
    const sums = centroids.map(() => [0, 0, 0, 0]);
    for (const s of samples) {
      let best = 0, bestD = Infinity;
      for (let c = 0; c < centroids.length; c++) {
        const d = rgbDist(s, centroids[c]);
        if (d < bestD) { bestD = d; best = c; }
      }
      sums[best][0] += s[0]; sums[best][1] += s[1]; sums[best][2] += s[2]; sums[best][3]++;
    }
    centroids = centroids.map((old, c) =>
      sums[c][3] > 0
        ? [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]]
        : old
    );
  }

  // assign every non-transparent pixel to nearest centroid, and accumulate real average color
  const labels = new Int16Array(n).fill(-1);
  const colorSum = centroids.map(() => [0, 0, 0, 0]);
  for (let i = 0, p = 0; i < n; i++, p += 4) {
    if (isTransparent[i]) continue;
    const px = [data[p], data[p + 1], data[p + 2]];
    let best = 0, bestD = Infinity;
    for (let c = 0; c < centroids.length; c++) {
      const d = rgbDist(px, centroids[c]);
      if (d < bestD) { bestD = d; best = c; }
    }
    labels[i] = best;
    colorSum[best][0] += px[0]; colorSum[best][1] += px[1]; colorSum[best][2] += px[2]; colorSum[best][3]++;
  }

  const colors = colorSum.map((s, c) =>
    s[3] > 0
      ? [Math.round(s[0] / s[3]), Math.round(s[1] / s[3]), Math.round(s[2] / s[3])]
      : centroids[c].map(Math.round)
  );

  return { labels, colors, isTransparent };
}

// Marching squares on a binary field (padded by 1px border of 0) -> list of closed contours (arrays of [x,y])
function traceMask(maskFn, w, h) {
  // padded field size (w+2) x (h+2), sample (x,y) in padded space maps to original (x-1,y-1)
  const PW = w + 2, PH = h + 2;
  const field = (x, y) => {
    const ox = x - 1, oy = y - 1;
    if (ox < 0 || oy < 0 || ox >= w || oy >= h) return 0;
    return maskFn(ox, oy) ? 1 : 0;
  };

  const segments = [];
  for (let y = 0; y < PH - 1; y++) {
    for (let x = 0; x < PW - 1; x++) {
      const a = field(x, y);     // top-left
      const b = field(x + 1, y); // top-right
      const c = field(x + 1, y + 1); // bottom-right
      const d = field(x, y + 1); // bottom-left
      const idx = a * 8 + b * 4 + c * 2 + d * 1;
      if (idx === 0 || idx === 15) continue;

      const T = [x + 0.5, y];
      const R = [x + 1, y + 0.5];
      const B = [x + 0.5, y + 1];
      const L = [x, y + 0.5];

      const push = (p1, p2) => segments.push([p1, p2]);

      switch (idx) {
        case 1: push(L, B); break;
        case 2: push(B, R); break;
        case 3: push(L, R); break;
        case 4: push(T, R); break;
        case 5: push(T, L); push(B, R); break; // saddle
        case 6: push(T, B); break;
        case 7: push(T, L); break;
        case 8: push(T, L); break;
        case 9: push(T, B); break;
        case 10: push(T, R); push(B, L); break; // saddle
        case 11: push(T, R); break;
        case 12: push(L, R); break;
        case 13: push(B, R); break;
        case 14: push(L, B); break;
        default: break;
      }
    }
  }

  // link segments into closed contours via endpoint matching
  const keyOf = (p) => p[0] + "_" + p[1];
  const adj = new Map();
  segments.forEach((seg, i) => {
    [0, 1].forEach((end) => {
      const k = keyOf(seg[end]);
      if (!adj.has(k)) adj.set(k, []);
      adj.get(k).push({ seg: i, end });
    });
  });

  const used = new Uint8Array(segments.length);
  const contours = [];

  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const start = segments[i][0];
    let currentPoint = segments[i][1];
    const contour = [start, currentPoint];

    let guard = 0;
    while (guard++ < segments.length + 5) {
      const k = keyOf(currentPoint);
      const candidates = adj.get(k) || [];
      let found = null;
      for (const cand of candidates) {
        if (!used[cand.seg]) { found = cand; break; }
      }
      if (!found) break;
      used[found.seg] = 1;
      const seg = segments[found.seg];
      const nextPoint = found.end === 0 ? seg[1] : seg[0];
      if (nextPoint[0] === currentPoint[0] && nextPoint[1] === currentPoint[1]) break;
      contour.push(nextPoint);
      currentPoint = nextPoint;
      if (currentPoint[0] === start[0] && currentPoint[1] === start[1]) break;
    }
    if (contour.length >= 4) contours.push(contour);
  }

  // shift back from padded space to original pixel space
  return contours.map((pts) => pts.map(([x, y]) => [x - 1, y - 1]));
}

function douglasPeucker(points, epsilon) {
  if (points.length < 3) return points;
  let dmax = 0, index = 0;
  const [x1, y1] = points[0];
  const [x2, y2] = points[points.length - 1];
  const lineLen = Math.hypot(x2 - x1, y2 - y1) || 1;
  for (let i = 1; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const d = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / lineLen;
    if (d > dmax) { dmax = d; index = i; }
  }
  if (dmax > epsilon) {
    const left = douglasPeucker(points.slice(0, index + 1), epsilon);
    const right = douglasPeucker(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}

// Build a smooth closed path string through points using quadratic curves via midpoints.
function smoothClosedPath(points, smooth) {
  if (points.length < 3) return "";
  if (!smooth || points.length < 4) {
    let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)} `;
    for (let i = 1; i < points.length; i++) d += `L ${points[i][0].toFixed(1)} ${points[i][1].toFixed(1)} `;
    return d + "Z";
  }
  const pts = points;
  const mid = (p1, p2) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  let d = `M ${mid(pts[pts.length - 1], pts[0])[0].toFixed(1)} ${mid(pts[pts.length - 1], pts[0])[1].toFixed(1)} `;
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % pts.length];
    const m = mid(cur, next);
    d += `Q ${cur[0].toFixed(1)} ${cur[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)} `;
  }
  return d + "Z";
}

function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

// ---------- Main pipeline ----------

async function buildTracedSVG(img, origW, origH, { numColors, workRes, tolerance, smooth, alphaThreshold }) {
  const scale = Math.min(1, workRes / Math.max(origW, origH));
  const w = Math.max(1, Math.round(origW * scale));
  const h = Math.max(1, Math.round(origH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);

  const { labels, colors, isTransparent } = quantizeColors(imgData, w, h, numColors, alphaThreshold);

  // area per cluster (paint largest first, details on top)
  const areas = new Array(colors.length).fill(0);
  for (let i = 0; i < labels.length; i++) if (labels[i] >= 0) areas[labels[i]]++;
  const order = colors.map((_, i) => i).sort((a, b) => areas[b] - areas[a]);

  const outScaleX = origW / w;
  const outScaleY = origH / h;

  let pathsMarkup = "";
  for (const clusterId of order) {
    if (areas[clusterId] === 0) continue;
    const maskFn = (x, y) => labels[y * w + x] === clusterId;
    const contours = traceMask(maskFn, w, h);
    if (contours.length === 0) continue;

    let dAttr = "";
    for (const contour of contours) {
      const simplified = douglasPeucker(contour, tolerance);
      const scaled = simplified.map(([x, y]) => [x * outScaleX, y * outScaleY]);
      dAttr += smoothClosedPath(scaled, smooth) + " ";
    }
    if (dAttr.trim()) {
      const hex = rgbToHex(colors[clusterId]);
      pathsMarkup += `<path d="${dAttr.trim()}" fill="${hex}" fill-rule="evenodd"/>\n`;
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${origW} ${origH}" width="${origW}" height="${origH}">\n` +
    pathsMarkup +
    `</svg>`;

  return svg;
}

function buildEmbeddedSVG(dataUrl, origW, origH) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${origW} ${origH}" width="${origW}" height="${origH}">\n` +
    `<image href="${dataUrl}" x="0" y="0" width="${origW}" height="${origH}" preserveAspectRatio="none"/>\n` +
    `</svg>`
  );
}

function detectTransparency(imgData) {
  const data = imgData.data;
  for (let p = 3; p < data.length; p += 4) {
    if (data[p] < 255) return true;
  }
  return false;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// ---------- UI ----------

const DETAIL_PRESETS = {
  rendah: { workRes: 200, tolerance: 2.2, numColorsMax: 10 },
  sedang: { workRes: 320, tolerance: 1.2, numColorsMax: 16 },
  tinggi: { workRes: 460, tolerance: 0.6, numColorsMax: 24 },
};

export default function App() {
  const [file, setFile] = useState(null);
  const [origDataUrl, setOrigDataUrl] = useState(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [origBytes, setOrigBytes] = useState(0);
  const [hasAlpha, setHasAlpha] = useState(false);
  const [format, setFormat] = useState("");

  const [mode, setMode] = useState("trace"); // 'trace' | 'embed'
  const [numColors, setNumColors] = useState(14);
  const [detail, setDetail] = useState("sedang");
  const [smooth, setSmooth] = useState(true);

  const [svgResult, setSvgResult] = useState("");
  const [svgBytes, setSvgBytes] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copyLabel, setCopyLabel] = useState("Salin Kode");

  const fileInputRef = useRef(null);

  const handleFile = useCallback((f) => {
    setErrorMsg("");
    if (!f) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(f.type)) {
      setErrorMsg("Format tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.");
      return;
    }
    setFile(f);
    setSvgResult("");
    setFormat(f.type.split("/")[1].toUpperCase());
    setOrigBytes(f.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        setOrigDataUrl(dataUrl);
        setOrigW(img.naturalWidth);
        setOrigH(img.naturalHeight);

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try {
          const data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
          setHasAlpha(detectTransparency(data));
        } catch {
          setHasAlpha(false);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleConvert = async () => {
    if (!origDataUrl) return;
    setProcessing(true);
    setErrorMsg("");
    setSvgResult("");
    try {
      const img = new Image();
      img.src = origDataUrl;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      let svg;
      if (mode === "embed") {
        svg = buildEmbeddedSVG(origDataUrl, origW, origH);
      } else {
        const preset = DETAIL_PRESETS[detail];
        svg = await buildTracedSVG(img, origW, origH, {
          numColors: Math.min(numColors, preset.numColorsMax),
          workRes: preset.workRes,
          tolerance: preset.tolerance,
          smooth,
          alphaThreshold: 128,
        });
      }
      setSvgResult(svg);
      setSvgBytes(new Blob([svg]).size);
    } catch (err) {
      setErrorMsg("Gagal mengonversi gambar. Coba gambar lain atau turunkan tingkat detail.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!svgResult) return;
    const blob = new Blob([svgResult], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name?.replace(/\.[^.]+$/, "") || "gambar") + ".svg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgResult);
      setCopyLabel("Tersalin!");
      setTimeout(() => setCopyLabel("Salin Kode"), 1500);
    } catch {
      // Fallback menggunakan eksekusi manual untuk browser/iframe yang memblokir clipboard API
      try {
        const textArea = document.createElement("textarea");
        textArea.value = svgResult;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopyLabel("Tersalin!");
      } catch (err) {
        setCopyLabel("Gagal menyalin");
      }
      setTimeout(() => setCopyLabel("Salin Kode"), 1500);
    }
  };

  const svgDataUrlForPreview = svgResult
    ? "data:image/svg+xml;utf8," + encodeURIComponent(svgResult)
    : null;

  // Memendekkan teks Base64 HANYA untuk tampilan pratinjau agar browser tidak hang.
  let displayCode = svgResult;
  if (mode === "embed" && svgResult.length > 2000) {
    displayCode = svgResult.replace(
      /href="data:image\/[^;]+;base64,[^"]+"/, 
      'href="data:image/...[KODE_BASE64_SANGAT_PANJANG_DISEMBUNYIKAN_AGAR_TIDAK_LAG]..."'
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F1410",
      color: "#EAE7DD",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        <header style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.18em", color: "#8FA88C", textTransform: "uppercase", marginBottom: 8 }}>
            Konverter Raster &rarr; SVG
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, lineHeight: 1.15, fontFamily: "'Georgia', serif" }}>
            Gambar ke SVG
          </h1>
          <p style={{ color: "#9AA69A", marginTop: 10, maxWidth: 640, lineHeight: 1.6, fontSize: 14 }}>
            Unggah JPG, JPEG, PNG, atau WEBP. Pilih mode <strong>Jejak Vektor</strong> untuk hasil vektor asli (cocok
            untuk logo/ilustrasi), atau <strong>Piksel-Sempurna</strong> untuk kesetiaan 100% terhadap gambar asli
            (ukuran file akan lebih besar karena encoding base64). Transparansi terdeteksi otomatis dan dipertahankan.
          </p>
        </header>

        {/* Upload area */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "1.5px dashed #3C4A3A",
            borderRadius: 10,
            padding: 28,
            textAlign: "center",
            cursor: "pointer",
            background: "#141A15",
            marginBottom: 24,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={{ fontSize: 14, color: "#C9D2C5" }}>
            {file ? `File dipilih: ${file.name}` : "Klik atau seret gambar ke sini"}
          </div>
          <div style={{ fontSize: 12, color: "#647063", marginTop: 6 }}>JPG · JPEG · PNG · WEBP</div>
        </div>

        {errorMsg && (
          <div style={{ background: "#3A1E1E", border: "1px solid #6B3535", color: "#F0B8B8", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            {errorMsg}
          </div>
        )}

        {origDataUrl && (
          <>
            {/* Original preview + info */}
            <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 200px" }}>
                <img
                  src={origDataUrl}
                  alt="asli"
                  style={{
                    width: 200, height: 200, objectFit: "contain", borderRadius: 8,
                    background: hasAlpha
                      ? "repeating-conic-gradient(#2A302A 0% 25%, #1A1F1A 0% 50%) 50% / 16px 16px"
                      : "#1A1F1A",
                    border: "1px solid #2A332A",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 220, fontSize: 13, color: "#B7C0B3", lineHeight: 2 }}>
                <div>Format asli: <strong style={{ color: "#EAE7DD" }}>{format}</strong></div>
                <div>Dimensi: <strong style={{ color: "#EAE7DD" }}>{origW} × {origH} px</strong></div>
                <div>Ukuran file: <strong style={{ color: "#EAE7DD" }}>{formatBytes(origBytes)}</strong></div>
                <div>Transparansi: <strong style={{ color: hasAlpha ? "#8FD19E" : "#EAE7DD" }}>{hasAlpha ? "Terdeteksi" : "Tidak ada"}</strong></div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ background: "#141A15", border: "1px solid #232B22", borderRadius: 10, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                {[
                  { id: "trace", label: "Jejak Vektor" },
                  { id: "embed", label: "Piksel-Sempurna" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 7,
                      border: mode === m.id ? "1px solid #6FA36B" : "1px solid #2A332A",
                      background: mode === m.id ? "#1D2A1C" : "transparent",
                      color: mode === m.id ? "#B9E5B3" : "#9AA69A",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {mode === "trace" ? (
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 200 }}>
                    <label style={{ fontSize: 12, color: "#9AA69A", display: "block", marginBottom: 6 }}>
                      Jumlah warna: {numColors}
                    </label>
                    <input
                      type="range" min={2} max={24} value={numColors}
                      onChange={(e) => setNumColors(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div style={{ minWidth: 200 }}>
                    <label style={{ fontSize: 12, color: "#9AA69A", display: "block", marginBottom: 6 }}>
                      Tingkat detail
                    </label>
                    <select
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, background: "#0F1410", color: "#EAE7DD", border: "1px solid #2A332A" }}
                    >
                      <option value="rendah">Rendah (cepat, file kecil)</option>
                      <option value="sedang">Sedang</option>
                      <option value="tinggi">Tinggi (lambat, lebih presisi)</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" checked={smooth} onChange={(e) => setSmooth(e.target.checked)} id="smooth" />
                    <label htmlFor="smooth" style={{ fontSize: 13, color: "#B7C0B3" }}>Haluskan tepi kurva</label>
                  </div>
                  <div style={{ fontSize: 12, color: "#647063", maxWidth: 420, lineHeight: 1.6 }}>
                    Cocok untuk logo, ikon, ilustrasi flat-color. Untuk foto dengan gradasi halus, detail kecil akan
                    disederhanakan &mdash; ini keterbatasan tracing vektor, bukan bug.
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "#647063", lineHeight: 1.6, maxWidth: 560 }}>
                  Gambar asli disisipkan utuh di dalam SVG (base64). Hasil identik 100% dengan aslinya, transparansi
                  ikut terbawa persis, tapi ukuran file akan lebih besar (kira-kira +33%) dibanding file asli karena
                  overhead encoding base64. Ini bukan vektor sungguhan, hanya dibungkus format SVG.
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={processing}
                style={{
                  marginTop: 18,
                  padding: "10px 22px",
                  borderRadius: 7,
                  border: "none",
                  background: processing ? "#3A4438" : "#5C8A57",
                  color: "#0F1410",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: processing ? "default" : "pointer",
                }}
              >
                {processing ? "Memproses..." : "Konversi ke SVG"}
              </button>
            </div>
          </>
        )}

        {/* Results */}
        {svgResult && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, marginTop: 8 }}>Pratinjau Hasil SVG</h2>
            <div style={{
              background: hasAlpha
                ? "repeating-conic-gradient(#2A302A 0% 25%, #1A1F1A 0% 50%) 50% / 18px 18px"
                : "#1A1F1A",
              border: "1px solid #2A332A",
              borderRadius: 10,
              padding: 20,
              display: "flex",
              justifyContent: "center",
              marginBottom: 14,
            }}>
              <img src={svgDataUrlForPreview} alt="hasil svg" style={{ maxWidth: "100%", maxHeight: 380 }} />
            </div>

            <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#B7C0B3", marginBottom: 18, flexWrap: "wrap" }}>
              <div>Ukuran asli: <strong style={{ color: "#EAE7DD" }}>{formatBytes(origBytes)}</strong></div>
              <div>Ukuran SVG: <strong style={{ color: svgBytes > origBytes ? "#E5B98F" : "#8FD19E" }}>{formatBytes(svgBytes)}</strong></div>
              <div>Selisih: <strong style={{ color: "#EAE7DD" }}>
                {svgBytes > origBytes ? "+" : ""}{(((svgBytes - origBytes) / origBytes) * 100).toFixed(0)}%
              </strong></div>
              <button onClick={handleDownload} style={{
                marginLeft: "auto", padding: "8px 16px", borderRadius: 7, border: "1px solid #6FA36B",
                background: "#1D2A1C", color: "#B9E5B3", fontSize: 13, cursor: "pointer",
              }}>
                Unduh SVG
              </button>
            </div>

            <button
              onClick={() => setShowCode((s) => !s)}
              style={{
                background: "none", border: "none", color: "#9AA69A", fontSize: 14, fontWeight: 600,
                cursor: "pointer", padding: 0, marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ transform: showCode ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.15s" }}>&rsaquo;</span>
              Pratinjau Kode / Source Code
            </button>

            {showCode && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={handleCopy}
                  style={{
                    position: "absolute", top: 10, right: 10, padding: "6px 12px", fontSize: 12,
                    borderRadius: 6, border: "1px solid #2A332A", background: "#1A1F1A", color: "#B7C0B3", cursor: "pointer",
                  }}
                >
                  {copyLabel}
                </button>
                <pre style={{
                  background: "#0B0F0B", border: "1px solid #232B22", borderRadius: 10, padding: 18,
                  fontSize: 12, lineHeight: 1.6, color: "#9FCE9A", overflowX: "auto", maxHeight: 420,
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  whiteSpace: "pre-wrap", wordBreak: "break-all"
                }}>
                  <code>{displayCode}</code>
                </pre>
                {mode === "embed" && (
                  <div style={{ fontSize: 11, color: "#8FA88C", marginTop: 8, fontStyle: "italic", lineHeight: 1.5 }}>
                    *Catatan: String base64 pada gambar disembunyikan dari pratinjau ini agar browser Anda tidak error. Namun jika Anda menekan tombol "Salin Kode" atau "Unduh SVG", kode aslinya yang utuh tetap akan terbawa.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
