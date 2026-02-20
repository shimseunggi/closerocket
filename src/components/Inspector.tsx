import React from "react";
import { Project, SelectedNode } from "../types";

function Num({
  label,
  value,
  onChange,
  step = 0.001,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="col">
      <label>{label}</label>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function Inspector({
  project,
  setProject,
  selected,
}: {
  project: Project;
  setProject: (p: Project) => void;
  selected: SelectedNode;
}) {
  const p = project;

  const update = (fn: (draft: Project) => void) => {
    const copy: Project = structuredClone(p);
    fn(copy);
    setProject(copy);
  };

  const PanelTitle = ({ t }: { t: string }) => <h3 style={{ margin: "0 0 10px 0" }}>{t}</h3>;

  if (selected === "rocket.body") {
    return (
      <div className="section">
        <PanelTitle t="Rocket / Body" />
        <div className="row">
          <Num label="Diameter (m)" value={p.rocket.body.diameter_m} onChange={(v) => update((d) => (d.rocket.body.diameter_m = v))} />
          <Num label="Length (m)" value={p.rocket.body.length_m} onChange={(v) => update((d) => (d.rocket.body.length_m = v))} />
          <Num label="Dry mass (kg)" step={0.01} value={p.rocket.body.dryMass_kg} onChange={(v) => update((d) => (d.rocket.body.dryMass_kg = v))} />
        </div>
      </div>
    );
  }

  if (selected === "rocket.nose") {
    return (
      <div className="section">
        <PanelTitle t="Rocket / Nose" />
        <div className="row">
          <div className="col">
            <label>Type</label>
            <select value={p.rocket.nose.type} onChange={(e) => update((d) => (d.rocket.nose.type = e.target.value as any))}>
              <option value="conical">conical</option>
              <option value="ogive">ogive</option>
              <option value="vonKarman">vonKarman</option>
              <option value="elliptical">elliptical</option>
            </select>
          </div>
          <Num label="Length (m)" value={p.rocket.nose.length_m} onChange={(v) => update((d) => (d.rocket.nose.length_m = v))} />
          <Num label="Mass (kg)" step={0.01} value={p.rocket.nose.mass_kg} onChange={(v) => update((d) => (d.rocket.nose.mass_kg = v))} />
        </div>
      </div>
    );
  }

  if (selected === "rocket.fins") {
    return (
      <div className="section">
        <PanelTitle t="Rocket / Fins" />
        <div className="row">
          <Num label="Count" step={1} value={p.rocket.fins.count} onChange={(v) => update((d) => (d.rocket.fins.count = Math.max(2, Math.round(v))))} />
          <div className="col">
            <label>Shape</label>
            <select value={p.rocket.fins.shape} onChange={(e) => update((d) => (d.rocket.fins.shape = e.target.value as any))}>
              <option value="trapezoid">trapezoid</option>
              <option value="clippedDelta">clippedDelta</option>
            </select>
          </div>
          <Num label="Root chord (m)" value={p.rocket.fins.rootChord_m} onChange={(v) => update((d) => (d.rocket.fins.rootChord_m = v))} />
          <Num label="Tip chord (m)" value={p.rocket.fins.tipChord_m} onChange={(v) => update((d) => (d.rocket.fins.tipChord_m = v))} />
          <Num label="Span (m)" value={p.rocket.fins.span_m} onChange={(v) => update((d) => (d.rocket.fins.span_m = v))} />
          <Num label="Sweep (m)" value={p.rocket.fins.sweep_m} onChange={(v) => update((d) => (d.rocket.fins.sweep_m = v))} />
          <Num label="Thickness (m)" value={p.rocket.fins.thickness_m} onChange={(v) => update((d) => (d.rocket.fins.thickness_m = v))} />
          <Num label="Mass (kg)" step={0.01} value={p.rocket.fins.mass_kg} onChange={(v) => update((d) => (d.rocket.fins.mass_kg = v))} />
          <Num label="Pos from nose (m)" value={p.rocket.fins.positionFromNose_m} onChange={(v) => update((d) => (d.rocket.fins.positionFromNose_m = v))} />
        </div>
      </div>
    );
  }

  if (selected === "rocket.mass") {
    return (
      <div className="section">
        <PanelTitle t="Rocket / Mass & CG" />
        <div className="row">
          <Num label="Dry CG from nose (m)" value={p.rocket.massModel.cgDry_m_fromNose} onChange={(v) => update((d) => (d.rocket.massModel.cgDry_m_fromNose = v))} />
          <Num label="Payload mass (kg)" step={0.01} value={p.rocket.massModel.payloadMass_kg} onChange={(v) => update((d) => (d.rocket.massModel.payloadMass_kg = v))} />
          <Num label="Payload CG (m)" value={p.rocket.massModel.payloadCg_m_fromNose} onChange={(v) => update((d) => (d.rocket.massModel.payloadCg_m_fromNose = v))} />
        </div>
      </div>
    );
  }

  if (selected === "rocket.aero") {
    return (
      <div className="section">
        <PanelTitle t="Rocket / Aero (initial)" />
        <div className="row">
          <div className="col">
            <label>Mode</label>
            <select value={p.rocket.aero.mode} onChange={(e) => update((d) => (d.rocket.aero.mode = e.target.value as any))}>
              <option value="manual">manual</option>
              <option value="estimated">estimated (soon)</option>
              <option value="table">table (soon)</option>
            </select>
          </div>
          <Num label="Manual Cd" step={0.01} value={p.rocket.aero.manualCd} onChange={(v) => update((d) => (d.rocket.aero.manualCd = v))} />
          <Num label="Manual CP (m from nose)" value={p.rocket.aero.manualCp_m_fromNose} onChange={(v) => update((d) => (d.rocket.aero.manualCp_m_fromNose = v))} />
          <Num label="CdA override (m², optional)" step={0.0001} value={p.rocket.aero.cdA_override_m2} onChange={(v) => update((d) => (d.rocket.aero.cdA_override_m2 = v))} />
        </div>
        <div className="small" style={{ marginTop: 10 }}>
          Tip: CdA override를 넣으면 (Cd × 단면적) 대신 CdA를 직접 사용합니다.
        </div>
      </div>
    );
  }

  if (selected === "motor.grain") {
    return (
      <div className="section">
        <PanelTitle t="Motor / Grain" />
        <div className="row">
          <div className="col">
            <label>Preset</label>
            <select value={p.motor.grain.preset} onChange={(e) => update((d) => (d.motor.grain.preset = e.target.value as any))}>
              <option value="BATES">BATES</option>
              <option value="SlotRect">SlotRect</option>
              <option value="Star">Star</option>
            </select>
          </div>

          <Num label="Density (kg/m³)" step={1} value={p.motor.grain.density_kg_m3} onChange={(v) => update((d) => (d.motor.grain.density_kg_m3 = v))} />
          <Num label="Segment count" step={1} value={p.motor.grain.segmentCount} onChange={(v) => update((d) => (d.motor.grain.segmentCount = Math.max(1, Math.round(v))))} />
          <Num label="Segment height (m)" value={p.motor.grain.segmentHeight_m} onChange={(v) => update((d) => (d.motor.grain.segmentHeight_m = v))} />
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <label className="badge">
            <input type="checkbox" checked={p.motor.grain.inhibitedOuter} onChange={(e) => update((d) => (d.motor.grain.inhibitedOuter = e.target.checked))} />
            Outer inhibited
          </label>
          <label className="badge">
            <input type="checkbox" checked={p.motor.grain.inhibitedTop} onChange={(e) => update((d) => (d.motor.grain.inhibitedTop = e.target.checked))} />
            Top inhibited
          </label>
          <label className="badge">
            <input type="checkbox" checked={p.motor.grain.inhibitedBottom} onChange={(e) => update((d) => (d.motor.grain.inhibitedBottom = e.target.checked))} />
            Bottom inhibited
          </label>
        </div>

        <hr />

        {p.motor.grain.preset === "BATES" && (
          <div className="row">
            <Num label="Outer diameter (m)" value={p.motor.grain.bates_outerDiameter_m} onChange={(v) => update((d) => (d.motor.grain.bates_outerDiameter_m = v))} />
            <Num label="Core diameter (m)" value={p.motor.grain.bates_coreDiameter_m} onChange={(v) => update((d) => (d.motor.grain.bates_coreDiameter_m = v))} />
          </div>
        )}

        {p.motor.grain.preset === "SlotRect" && (
          <div className="row">
            <Num label="Outer W (m)" value={p.motor.grain.slot_outerW_m} onChange={(v) => update((d) => (d.motor.grain.slot_outerW_m = v))} />
            <Num label="Outer H (m)" value={p.motor.grain.slot_outerH_m} onChange={(v) => update((d) => (d.motor.grain.slot_outerH_m = v))} />
            <Num label="Core W (m)" value={p.motor.grain.slot_coreW_m} onChange={(v) => update((d) => (d.motor.grain.slot_coreW_m = v))} />
            <Num label="Core H (m)" value={p.motor.grain.slot_coreH_m} onChange={(v) => update((d) => (d.motor.grain.slot_coreH_m = v))} />
            <Num label="Fillet (m, preview)" value={p.motor.grain.slot_fillet_m} onChange={(v) => update((d) => (d.motor.grain.slot_fillet_m = v))} />
          </div>
        )}

        {p.motor.grain.preset === "Star" && (
          <div className="row">
            <Num label="Outer diameter (m)" value={p.motor.grain.star_outerDiameter_m} onChange={(v) => update((d) => (d.motor.grain.star_outerDiameter_m = v))} />
            <Num label="Core radius (m)" value={p.motor.grain.star_coreRadius_m} onChange={(v) => update((d) => (d.motor.grain.star_coreRadius_m = v))} />
            <Num label="Point count" step={1} value={p.motor.grain.star_pointCount} onChange={(v) => update((d) => (d.motor.grain.star_pointCount = Math.max(3, Math.round(v))))} />
            <Num label="Point depth (m)" value={p.motor.grain.star_pointDepth_m} onChange={(v) => update((d) => (d.motor.grain.star_pointDepth_m = v))} />
            <Num label="Fillet (m, preview)" value={p.motor.grain.star_fillet_m} onChange={(v) => update((d) => (d.motor.grain.star_fillet_m = v))} />
          </div>
        )}
      </div>
    );
  }

  if (selected === "motor.nozzle") {
    return (
      <div className="section">
        <PanelTitle t="Motor / Nozzle" />
        <div className="row">
          <div className="col">
            <label>Type</label>
            <select value={p.motor.nozzle.type} onChange={(e) => update((d) => (d.motor.nozzle.type = e.target.value as any))}>
              <option value="simple">simple</option>
              <option value="conical">conical</option>
              <option value="bell">bell</option>
            </select>
          </div>
          <Num label="Throat diameter (m)" value={p.motor.nozzle.throatDiameter_m} onChange={(v) => update((d) => (d.motor.nozzle.throatDiameter_m = v))} />
          <Num label="Exit diameter (m)" value={p.motor.nozzle.exitDiameter_m} onChange={(v) => update((d) => (d.motor.nozzle.exitDiameter_m = v))} />
          <Num label="Nozzle mass (kg)" step={0.01} value={p.motor.nozzle.mass_kg} onChange={(v) => update((d) => (d.motor.nozzle.mass_kg = v))} />
          <Num label="Efficiency" step={0.01} value={p.motor.nozzle.efficiency} onChange={(v) => update((d) => (d.motor.nozzle.efficiency = v))} />
        </div>
        <div className="small" style={{ marginTop: 8 }}>
          초기버전: 노즐 형상은 검증/입력 및 저장 중심, 추력은 thrust curve를 사용합니다.
        </div>
      </div>
    );
  }

  if (selected === "motor.thrust") {
    return (
      <div className="section">
        <PanelTitle t="Motor / Thrust Curve" />
        <div className="small" style={{ marginBottom: 8 }}>
          CSV: <span style={{ fontFamily: "ui-monospace" }}>time_s, thrust_N</span> (헤더 가능)
        </div>
        <div className="row">
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => {
                const text = String(reader.result ?? "");
                update((d) => {
                  (d as any).__uploadedCSV = text;
                  d.motor.thrustCurve.source = "uploadedCSV";
                });
              };
              reader.readAsText(f);
            }}
          />
          <button
            onClick={() =>
              update((d) => {
                d.motor.thrustCurve.source = "manualPoints";
                d.motor.thrustCurve.points = [
                  { t_s: 0, thrust_N: 0 },
                  { t_s: 0.1, thrust_N: 100 },
                  { t_s: 0.3, thrust_N: 160 },
                  { t_s: 1.0, thrust_N: 120 },
                  { t_s: 1.6, thrust_N: 30 },
                  { t_s: 1.8, thrust_N: 0 },
                ];
              })
            }
          >
            Use sample curve
          </button>
        </div>
        <div className="small" style={{ marginTop: 10 }}>
          업로드 후 상단의 “Apply CSV → points” 버튼을 눌러 points로 변환하세요.
        </div>
      </div>
    );
  }

  if (selected === "sim.env") {
    return (
      <div className="section">
        <PanelTitle t="Sim / Environment" />
        <div className="row">
          <Num label="Launch altitude (m)" step={1} value={p.simulation.environment.launchAltitude_m} onChange={(v) => update((d) => (d.simulation.environment.launchAltitude_m = v))} />
          <Num label="Wind speed (m/s) (MVP)" step={0.1} value={p.simulation.environment.windSpeed_m_s} onChange={(v) => update((d) => (d.simulation.environment.windSpeed_m_s = v))} />
        </div>
      </div>
    );
  }

  if (selected === "sim.launch") {
    return (
      <div className="section">
        <PanelTitle t="Sim / Launch" />
        <div className="row">
          <Num label="Launch angle (deg)" step={1} value={p.simulation.launch.launchAngle_deg} onChange={(v) => update((d) => (d.simulation.launch.launchAngle_deg = v))} />
          <Num label="Rail length (m)" step={0.1} value={p.simulation.launch.railLength_m} onChange={(v) => update((d) => (d.simulation.launch.railLength_m = v))} />
        </div>
        <div className="small" style={{ marginTop: 8 }}>초기버전 1D는 각도/레일 영향은 단순화되어 있습니다.</div>
      </div>
    );
  }

  return (
    <div className="section">
      <PanelTitle t="Sim / Solver" />
      <div className="row">
        <Num label="dt (s)" step={0.001} value={p.simulation.solver.dt_s} onChange={(v) => update((d) => (d.simulation.solver.dt_s = v))} />
        <Num label="max time (s)" step={1} value={p.simulation.solver.maxTime_s} onChange={(v) => update((d) => (d.simulation.solver.maxTime_s = v))} />
      </div>
    </div>
  );
}
