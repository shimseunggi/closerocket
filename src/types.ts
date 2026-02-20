export type GrainPreset = "BATES" | "SlotRect" | "Star";
export type AeroMode = "manual" | "estimated" | "table";
export type MotorMode = "thrustCurve" | "hybridModel_locked";

export type SelectedNode =
  | "rocket.body"
  | "rocket.nose"
  | "rocket.fins"
  | "rocket.mass"
  | "rocket.aero"
  | "motor.grain"
  | "motor.nozzle"
  | "motor.thrust"
  | "sim.env"
  | "sim.launch"
  | "sim.solver";

export type ThrustPoint = { t_s: number; thrust_N: number };

export type Project = {
  meta: { name: string; version: string };

  rocket: {
    body: { diameter_m: number; length_m: number; dryMass_kg: number };
    nose: { type: "conical" | "ogive" | "vonKarman" | "elliptical"; length_m: number; mass_kg: number };
    fins: {
      count: number;
      shape: "trapezoid" | "clippedDelta";
      rootChord_m: number;
      tipChord_m: number;
      span_m: number;
      sweep_m: number;
      thickness_m: number;
      mass_kg: number;
      positionFromNose_m: number;
    };
    massModel: {
      cgDry_m_fromNose: number;
      payloadMass_kg: number;
      payloadCg_m_fromNose: number;
    };
    aero: {
      mode: AeroMode;
      manualCd: number;
      manualCp_m_fromNose: number;
      cdA_override_m2: number; // optional shortcut
    };
  };

  motor: {
    mode: MotorMode;
    case: { innerDiameter_m: number; length_m: number; mass_kg: number };
    grain: {
      preset: GrainPreset;
      density_kg_m3: number;
      segmentCount: number;
      segmentHeight_m: number;
      inhibitedOuter: boolean;
      inhibitedTop: boolean;
      inhibitedBottom: boolean;

      // BATES
      bates_outerDiameter_m: number;
      bates_coreDiameter_m: number;

      // SlotRect
      slot_outerW_m: number;
      slot_outerH_m: number;
      slot_coreW_m: number;
      slot_coreH_m: number;
      slot_fillet_m: number;

      // Star (preview)
      star_outerDiameter_m: number;
      star_coreRadius_m: number;
      star_pointCount: number;
      star_pointDepth_m: number;
      star_fillet_m: number;
    };
    nozzle: {
      type: "simple" | "conical" | "bell";
      throatDiameter_m: number;
      exitDiameter_m: number;
      mass_kg: number;
      efficiency: number;
    };
    thrustCurve: {
      source: "uploadedCSV" | "manualPoints";
      points: ThrustPoint[];
    };
  };

  simulation: {
    environment: { launchAltitude_m: number; windSpeed_m_s: number };
    launch: { launchAngle_deg: number; railLength_m: number };
    solver: { dt_s: number; maxTime_s: number };
  };
};
