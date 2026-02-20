import { Project } from "../types";

export type ValidationIssue = { level: "error" | "warn"; message: string };

export function validateProject(p: Project): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (p.rocket.body.diameter_m <= 0) issues.push({ level: "error", message: "Body diameter must be > 0." });
  if (p.rocket.body.length_m <= 0) issues.push({ level: "error", message: "Body length must be > 0." });
  if (p.simulation.solver.dt_s <= 0) issues.push({ level: "error", message: "dt must be > 0." });

  const id = p.motor.case.innerDiameter_m;
  const gl = p.motor.grain.segmentCount * p.motor.grain.segmentHeight_m;
  if (id <= 0) issues.push({ level: "error", message: "Motor case inner diameter must be > 0." });
  if (gl <= 0) issues.push({ level: "error", message: "Grain total length must be > 0." });
  if (gl > p.motor.case.length_m + 1e-9) issues.push({ level: "error", message: "Grain length exceeds motor case length." });

  if (p.motor.grain.preset === "BATES") {
    if (p.motor.grain.bates_outerDiameter_m > id + 1e-9) issues.push({ level: "error", message: "BATES outer diameter exceeds case ID." });
    if (p.motor.grain.bates_coreDiameter_m <= 0) issues.push({ level: "error", message: "BATES core diameter must be > 0." });
    if (p.motor.grain.bates_coreDiameter_m >= p.motor.grain.bates_outerDiameter_m) issues.push({ level: "error", message: "BATES core diameter must be < outer diameter." });
  }

  if (p.motor.grain.preset === "SlotRect") {
    const ow = p.motor.grain.slot_outerW_m;
    const oh = p.motor.grain.slot_outerH_m;
    const cw = p.motor.grain.slot_coreW_m;
    const ch = p.motor.grain.slot_coreH_m;
    if (cw <= 0 || ch <= 0) issues.push({ level: "error", message: "Slot core W/H must be > 0." });
    if (ow <= 0 || oh <= 0) issues.push({ level: "error", message: "Slot outer W/H must be > 0." });
    if (cw >= ow || ch >= oh) issues.push({ level: "error", message: "Slot core must be smaller than outer." });
  }

  if (p.motor.grain.preset === "Star") {
    if (p.motor.grain.star_pointCount < 3) issues.push({ level: "error", message: "Star point count must be >= 3." });
    if (p.motor.grain.star_outerDiameter_m > id + 1e-9) issues.push({ level: "error", message: "Star outer diameter exceeds case ID." });
  }

  const th = p.motor.nozzle.throatDiameter_m;
  const ex = p.motor.nozzle.exitDiameter_m;
  if (th <= 0) issues.push({ level: "error", message: "Nozzle throat diameter must be > 0." });
  if (ex <= 0) issues.push({ level: "error", message: "Nozzle exit diameter must be > 0." });
  if (ex < th) issues.push({ level: "warn", message: "Nozzle exit diameter < throat. Check units." });

  if (p.rocket.aero.mode === "manual") {
    if (p.rocket.aero.manualCd <= 0) issues.push({ level: "warn", message: "Manual Cd should usually be > 0." });
  }

  return issues;
}
