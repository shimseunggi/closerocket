import React, { useMemo, useState } from "react";
import { defaultProject } from "./defaultProject";
import { Project, SelectedNode } from "./types";
import { Tree } from "./components/Tree";
import { Inspector } from "./components/Inspector";
import { GrainPreview } from "./components/GrainPreview";
import { PlotCanvas } from "./components/PlotCanvas";
import { parseThrustCSV } from "./utils/thrust";
import { validateProject } from "./utils/validate";
import { simulate1D } from "./utils/sim1d";

export default function App() {
  const [project, setProject] = useState<Project>(defaultProject);
  const [selected, setSelected] = useState<SelectedNode>("motor.grain");
  const [jsonText, setJsonText] = useState<string>(() => JSON.stringify(defaultProject, null, 2));

  const issues = useMemo(() => validateProject(project), [project]);
  const hasError = issues.some((i) => i.level === "error");

  const sim = useMemo(() => {
    try {
      return simulate1D(project);
    } catch {
      return { series: [], apogee_m: 0, apogee_t: 0 };
    }
  }, [project]);

  const thrustXY = useMemo(() => {
    const pts = project.motor.thrustCurve.points ?? [];
    return pts.map((p) => ({ x: p.t_s, y: p.thrust_N }));
  }, [project.motor.thrustCurve.points]);

  const altXY = useMemo(() => sim.series.map((p) => ({ x: p.t, y: p.h })), [sim.series]);
  const velXY = useMemo(() => sim.series.map((p) => ({ x: p.t, y: p.v })), [sim.series]);

  const exportJSON = () => {
    const text = JSON.stringify(project, null, 2);
    setJsonText(text);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.meta.name || "project"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = () => {
    try {
      const p = JSON.parse(jsonText) as Project;
      setProject(p);
    } catch {
      alert("JSON parse failed. Check formatting.");
    }
  };

  const applyUploadedCSV = () => {
    const anyP = project as any;
    const text = anyP.__uploadedCSV as string | undefined;
    if (!text) {
      alert("No uploaded CSV cached. Upload in Motor/Thrust Curve first.");
      return;
    }
    const pts = parseThrustCSV(text);
    if (pts.length < 2) {
      alert("Parsed points < 2. CSV should be: time_s, thrust_N");
      return;
    }
    setProject((prev) => {
      const c = structuredClone(prev);
      c.motor.thrustCurve.source = "uploadedCSV";
      c.motor.thrustCurve.points = pts;
      return c;
    });
  };

  return (
    <>
      <header>
        <div className="row" style={{ gap: 10 }}>
          <h1>CloseRocket — Solid Rocket UI (initial) + Thrust-Curve Flight (MVP)</h1>
          <span className={"badge " + (hasError ? "bad" : "ok")}>{hasError ? "Issues" : "OK"}</span>
          <span className="badge">v{project.meta.version}</span>
        </div>
        <div className="row">
          <button onClick={applyUploadedCSV}>Apply CSV → points</button>
          <button onClick={() => setJsonText(JSON.stringify(project, null, 2))}>Refresh JSON</button>
          <button className="primary" onClick={exportJSON}>Export .json</button>
        </div>
      </header>

      <div className="layout">
        <aside className="panel">
          <Tree selected={selected} onSelect={setSelected} />
        </aside>

        <main className="panel" style={{ borderRight: "none" }}>
          <div className="section">
            <div className="card">
              <div className="canvasWrap">
                <GrainPreview project={project} />
                <PlotCanvas title="Thrust Curve" series={thrustXY} yLabel="N" />
              </div>

              <div style={{ marginTop: 12 }} className="canvasWrap">
                <PlotCanvas title="Altitude vs Time (1D MVP)" series={altXY} yLabel="m" />
                <PlotCanvas title="Velocity vs Time (1D MVP)" series={velXY} yLabel="m/s" />
              </div>

              <div style={{ marginTop: 12 }} className="kpi">
                <div className="item">
                  <div className="small">Apogee (MVP)</div>
                  <div className="v">{sim.apogee_m.toFixed(1)} m</div>
                  <div className="small">@ {sim.apogee_t.toFixed(2)} s</div>
                </div>
                <div className="item">
                  <div className="small">Validation</div>
                  <div className="v">{issues.length}</div>
                  <div className="small">issues</div>
                </div>
              </div>

              {issues.length > 0 && (
                <div style={{ marginTop: 12 }} className="card">
                  <div className="small" style={{ marginBottom: 6 }}>Issues</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {issues.slice(0, 12).map((i, idx) => (
                      <li key={idx} className="small" style={{ color: i.level === "error" ? "var(--danger)" : "var(--muted)" }}>
                        [{i.level}] {i.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginTop: 12 }} className="card">
                <div className="small" style={{ marginBottom: 6 }}>Project JSON (import/export)</div>
                <textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
                <div className="row" style={{ marginTop: 8 }}>
                  <button onClick={importJSON}>Import from JSON</button>
                  <span className="small">Import는 현재 에디터 값을 JSON으로 교체합니다.</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="panel right">
          <Inspector project={project} setProject={setProject} selected={selected} />
        </aside>
      </div>
    </>
  );
}
