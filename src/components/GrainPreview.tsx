import React, { useEffect, useRef } from "react";
import { Project } from "../types";

export function GrainPreview({ project }: { project: Project }) {
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

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, W - 20, H - 20);

    ctx.fillStyle = "#111";
    ctx.font = "12px system-ui";
    ctx.fillText(`Grain cross-section (${project.motor.grain.preset})`, 18, 28);

    const cx = W / 2;
    const cy = H / 2 + 10;
    const scale = Math.min(W, H) * 0.35;

    const preset = project.motor.grain.preset;

    if (preset === "BATES") {
      const od = project.motor.grain.bates_outerDiameter_m;
      const cd = project.motor.grain.bates_coreDiameter_m;
      const rO = scale;
      const rC = scale * (cd / (od || 1));

      ctx.fillStyle = "#f3f3f3";
      ctx.beginPath();
      ctx.arc(cx, cy, rO, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, cy, rC, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = "#111";
      ctx.beginPath();
      ctx.arc(cx, cy, rC, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (preset === "SlotRect") {
      const ow = project.motor.grain.slot_outerW_m;
      const oh = project.motor.grain.slot_outerH_m;
      const cw = project.motor.grain.slot_coreW_m;
      const ch = project.motor.grain.slot_coreH_m;

      const outerW = scale * 1.1;
      const outerH = scale * 1.1 * (oh / (ow || 1));
      const coreW = outerW * (cw / (ow || 1));
      const coreH = outerH * (ch / (oh || 1));

      ctx.fillStyle = "#f3f3f3";
      ctx.fillRect(cx - outerW / 2, cy - outerH / 2, outerW, outerH);
      ctx.strokeRect(cx - outerW / 2, cy - outerH / 2, outerW, outerH);

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(cx - coreW / 2, cy - coreH / 2, coreW, coreH);
      ctx.restore();

      ctx.strokeStyle = "#111";
      ctx.strokeRect(cx - coreW / 2, cy - coreH / 2, coreW, coreH);
    }

    if (preset === "Star") {
      const od = project.motor.grain.star_outerDiameter_m;
      const rCore = project.motor.grain.star_coreRadius_m;
      const k = project.motor.grain.star_pointCount;
      const depth = project.motor.grain.star_pointDepth_m;

      const rO = scale;
      const rInner = Math.max(0.1, (rCore / (od / 2 || 1)) * rO);
      const rSpike = Math.min(rO * 0.9, rInner + (depth / (od / 2 || 1)) * rO);

      ctx.fillStyle = "#f3f3f3";
      ctx.beginPath();
      ctx.arc(cx, cy, rO, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.stroke();

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      for (let i = 0; i < k * 2; i++) {
        const ang = (i * Math.PI) / k - Math.PI / 2;
        const rr = i % 2 === 0 ? rSpike : rInner;
        const x = cx + rr * Math.cos(ang);
        const y = cy + rr * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = "#111";
      ctx.beginPath();
      for (let i = 0; i < k * 2; i++) {
        const ang = (i * Math.PI) / k - Math.PI / 2;
        const rr = i % 2 === 0 ? rSpike : rInner;
        const x = cx + rr * Math.cos(ang);
        const y = cy + rr * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.fillStyle = "#666";
    ctx.font = "11px system-ui";
    ctx.fillText("Preview only (initial).", 18, H - 18);
  }, [project]);

  return <canvas ref={ref} />;
}
