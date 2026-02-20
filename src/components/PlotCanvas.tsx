import React, { useEffect, useRef } from "react";

type XY = { x: number; y: number };

function drawAxes(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#eaeaea";
  for (let i = 1; i <= 5; i++) {
    const y = 18 + ((h - 50) * i) / 5;
    ctx.beginPath();
    ctx.moveTo(46, y);
    ctx.lineTo(w - 16, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#333";
  ctx.beginPath();
  ctx.moveTo(46, 18);
  ctx.lineTo(46, h - 32);
  ctx.lineTo(w - 16, h - 32);
  ctx.stroke();
}

export function PlotCanvas({ title, series, yLabel }: { title: string; series: XY[]; yLabel: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = rect.width;
    const H = rect.height;

    drawAxes(ctx, W, H);

    ctx.fillStyle = "#111";
    ctx.font = "12px system-ui";
    ctx.fillText(title, 12, 14);
    ctx.fillStyle = "#666";
    ctx.fillText(yLabel, 12, 32);

    if (series.length < 2) return;

    const xs = series.map((p) => p.x);
    const ys = series.map((p) => p.y);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);

    const plotX = (x: number) => 46 + ((x - xMin) / (xMax - xMin || 1)) * (W - 62);
    const plotY = (y: number) => (H - 32) - ((y - yMin) / (yMax - yMin || 1)) * (H - 50);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#111";
    ctx.beginPath();
    for (let i = 0; i < series.length; i++) {
      const p = series[i];
      const x = plotX(p.x);
      const y = plotY(p.y);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "#444";
    ctx.font = "11px system-ui";
    ctx.fillText(yMax.toFixed(1), 8, 52);
    ctx.fillText(yMin.toFixed(1), 8, H - 36);
  }, [title, series, yLabel]);

  return <canvas ref={ref} />;
}
