import { Project } from "./types";

export const defaultProject: Project = {
  meta: { name: "closerocket", version: "0.1.0" },

  rocket: {
    body: { diameter_m: 0.098, length_m: 1.2, dryMass_kg: 1.1 },
    nose: { type: "vonKarman", length_m: 0.28, mass_kg: 0.12 },
    fins: {
      count: 3,
      shape: "trapezoid",
      rootChord_m: 0.18,
      tipChord_m: 0.09,
      span_m: 0.09,
      sweep_m: 0.05,
      thickness_m: 0.004,
      mass_kg: 0.09,
      positionFromNose_m: 0.95,
    },
    massModel: {
      cgDry_m_fromNose: 0.62,
      payloadMass_kg: 0,
      payloadCg_m_fromNose: 0.5,
    },
    aero: {
      mode: "manual",
      manualCd: 0.55,
      manualCp_m_fromNose: 0.78,
      cdA_override_m2: 0.0,
    },
  },

  motor: {
    mode: "thrustCurve",
    case: { innerDiameter_m: 0.054, length_m: 0.28, mass_kg: 0.45 },
    grain: {
      preset: "BATES",
      density_kg_m3: 1700,
      segmentCount: 2,
      segmentHeight_m: 0.11,
      inhibitedOuter: true,
      inhibitedTop: false,
      inhibitedBottom: false,

      bates_outerDiameter_m: 0.054,
      bates_coreDiameter_m: 0.018,

      slot_outerW_m: 0.05,
      slot_outerH_m: 0.05,
      slot_coreW_m: 0.018,
      slot_coreH_m: 0.018,
      slot_fillet_m: 0.002,

      star_outerDiameter_m: 0.054,
      star_coreRadius_m: 0.01,
      star_pointCount: 5,
      star_pointDepth_m: 0.006,
      star_fillet_m: 0.0015,
    },
    nozzle: {
      type: "simple",
      throatDiameter_m: 0.012,
      exitDiameter_m: 0.022,
      mass_kg: 0.08,
      efficiency: 0.95,
    },
    thrustCurve: {
      source: "manualPoints",
      points: [
        { t_s: 0.0, thrust_N: 0.0 },
        { t_s: 0.05, thrust_N: 120.0 },
        { t_s: 0.15, thrust_N: 180.0 },
        { t_s: 0.6, thrust_N: 140.0 },
        { t_s: 1.2, thrust_N: 80.0 },
        { t_s: 1.8, thrust_N: 20.0 },
        { t_s: 2.0, thrust_N: 0.0 },
      ],
    },
  },

  simulation: {
    environment: { launchAltitude_m: 0, windSpeed_m_s: 0 },
    launch: { launchAngle_deg: 90, railLength_m: 1.2 },
    solver: { dt_s: 0.01, maxTime_s: 25 },
  },
};
