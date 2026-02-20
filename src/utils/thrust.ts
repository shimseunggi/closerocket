import { ThrustPoint } from "../types";

export function parseThrustCSV(text: string): ThrustPoint[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const pts: ThrustPoint[] = [];
  for (const line of lines) {
    const parts = line.split(/,|\t|;/).map((p) => p.trim());
    if (parts.length < 2) continue;
    const t = Number(parts[0]);
    const F = Number(parts[1]);
    if (Number.isFinite(t) && Number.isFinite(F)) pts.push({ t_s: t, thrust_N: F });
  }

  pts.sort((a, b) => a.t_s - b.t_s);

  const out: ThrustPoint[] = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.t_s - p.t_s) < 1e-9) out[out.length - 1] = p;
    else out.push(p);
  }
  return out;
}

export function thrustAt(points: ThrustPoint[], t: number): number {
  if (points.length === 0) return 0;
  if (t <= points[0].t_s) return points[0].thrust_N;
  if (t >= points[points.length - 1].t_s) return points[points.length - 1].thrust_N;

  let lo = 0;
  let hi = points.length - 1;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (points[mid].t_s <= t) lo = mid;
    else hi = mid;
  }
  const a = points[lo];
  const b = points[hi];
  const u = (t - a.t_s) / (b.t_s - a.t_s);
  return a.thrust_N + u * (b.thrust_N - a.thrust_N);
}
