import React from "react";
import { SelectedNode } from "../types";

export function Tree({ selected, onSelect }: { selected: SelectedNode; onSelect: (n: SelectedNode) => void }) {
  const Item = ({ id, label }: { id: SelectedNode; label: string }) => (
    <div className={"treeItem " + (selected === id ? "active" : "")} onClick={() => onSelect(id)} role="button">
      {label}
    </div>
  );

  return (
    <div className="tree">
      <div className="small" style={{ padding: "6px 10px" }}>Project Tree</div>

      <Item id="rocket.body" label="Rocket / Body" />
      <Item id="rocket.nose" label="Rocket / Nose" />
      <Item id="rocket.fins" label="Rocket / Fins" />
      <Item id="rocket.mass" label="Rocket / Mass & CG" />
      <Item id="rocket.aero" label="Rocket / Aero (Cd/CP)" />

      <hr />

      <Item id="motor.grain" label="Motor / Grain" />
      <Item id="motor.nozzle" label="Motor / Nozzle" />
      <Item id="motor.thrust" label="Motor / Thrust Curve" />

      <hr />

      <Item id="sim.env" label="Sim / Environment" />
      <Item id="sim.launch" label="Sim / Launch" />
      <Item id="sim.solver" label="Sim / Solver" />
    </div>
  );
}
