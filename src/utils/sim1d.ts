import { Project } from "../types";
import { thrustAt } from "./thrust";

type SimPoint = { t: number; h: number; v: number; a: number };

function rhoSeaLevel(): number {
  return 1.225;
}

export function simulate1D(p: Project): { series: SimPoint[]; apogee_m: number; apogee_t: number } {
  const g = 9.80665;
  const dt = p.simulation.solver.dt_s;
  const tMax = p.simulation.solver.maxTime_s;

  const dry =
    p.rocket.body.dryMass_kg +
    p.rocket.nose.mass_kg +
    p.rocket.fins.mass_kg +
    p.motor.case.mass_kg +
    p.motor.nozzle.mass_kg +
    p.rocket.massModel.payloadMass_kg;

  const propMass = estimatePropMass(p);

  const area = Math.PI * Math.pow(p.rocket.body.diameter_m / 2, 2);
  const cdA =
    p.rocket.aero.cdA_override_m2 > 0
      ? p.rocket.aero.cdA_override_m2
      : p.rocket.aero.manualCd * area;

  let t = 0;
  let h = p.simulation.environment.launchAltitude_m;
  let v = 0;

  const rho = rhoSeaLevel();
  const series: SimPoint[] = [];

  let apogee_m = h;
  let apogee_t = 0;

  const points = p.motor.thrustCurve.points;
  const bt = points.length ? points[points.length - 1].t_s : 0;

  while (t <= tMax) {
    const T = thrustAt(points, t);

    const fracLeft = bt > 0 ? Math.max(0, 1 - t / bt) : 0;
    const m = dry + propMass * fracLeft;

    const drag = 0.5 * rho * v * v * cdA;
    const dragSign = v > 0 ? 1 : v < 0 ? -1 : 0;

    const a = (T - m * g - dragSign * drag) / m;

    v = v + a * dt;
    h = h + v * dt;

    if (h > apogee_m) {
      apogee_m = h;
      apogee_t = t;
    }

    series.push({ t, h, v, a });

    if (t > bt && h <= p.simulation.environment.launchAltitude_m && t > 1) break;
    t += dt;
  }

  return { series, apogee_m, apogee_t };
}

function estimatePropMass(p: Project): number {
  const dens = p.motor.grain.density_kg_m3;
  const segCount = p.motor.grain.segmentCount;
  const segH = p.motor.grain.segmentHeight_m;
  if (dens <= 0) return 0;

  if (p.motor.grain.preset === "BATES") {
    const od = p.motor.grain.bates_outerDiameter_m;
    const cd = p.motor.grain.bates_coreDiameter_m;
    const area = Math.PI * (Math.pow(od / 2, 2) - Math.pow(cd / 2, 2));
    const vol = area * (segCount * segH);
    return Math.max(0, vol * dens);
  }

  if (p.motor.grain.preset === "SlotRect") {
    const ow = p.motor.grain.slot_outerW_m;
    const oh = p.motor.grain.slot_outerH_m;
    const cw = p.motor.grain.slot_coreW_m;
    const ch = p.motor.grain.slot_coreH_m;
    const area = Math.max(0, ow * oh - cw * ch);
    const vol = area * (segCount * segH);
    return Math.max(0, vol * dens);
  }

  const od = p.motor.grain.star_outerDiameter_m;
  const rCore = p.motor.grain.star_coreRadius_m;
  const area = Math.PI * (Math.pow(od / 2, 2) - Math.pow(rCore, 2));
  const vol = area * (segCount * segH);
  return Math.max(0, vol * dens);
}
