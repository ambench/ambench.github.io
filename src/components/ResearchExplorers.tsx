import { useState } from "react";

// Static, authored MathML only. Native layout preserves operators, limits, and scripts.
const equations = {
  ee: `<msub><mi>𝐚</mi><mtext>ee</mtext></msub><mo>=</mo><msup><mrow><mo>[</mo><msub><mi>𝐩</mi><mtext>ee</mtext></msub><mo>,</mo><msub><mi>𝐪</mi><mtext>ee</mtext></msub><mo>,</mo><msub><mi>g</mi><mtext>grip</mtext></msub><mo>]</mo></mrow><mi mathvariant="normal">⊤</mi></msup><mo>∈</mo><msup><mi>ℝ</mi><mn>8</mn></msup>`,
  base: `<msub><mi>𝐚</mi><mtext>bθ</mtext></msub><mo>=</mo><msup><mrow><mo>[</mo><msub><mi>𝐩</mi><mi>b</mi></msub><mo>,</mo><msub><mi>𝐪</mi><mi>b</mi></msub><mo>,</mo><msub><mi>g</mi><mtext>grip</mtext></msub><mo>,</mo><msub><mi>𝜽</mi><mi>a</mi></msub><mo>]</mo></mrow><mi mathvariant="normal">⊤</mi></msup><mo>∈</mo><msup><mi>ℝ</mi><mrow><mn>8</mn><mo>+</mo><msub><mi>n</mi><mi>a</mi></msub></mrow></msup>`,
  ik: `<mtable columnalign="left" rowspacing=".8em"><mtr><mtd><mo>(</mo><msubsup><mi>𝜽</mi><mtext>a,d</mtext><mo>⋆</mo></msubsup><mo>,</mo><msubsup><mi>𝒯</mi><mi>d</mi><mo>⋆</mo></msubsup><mo>)</mo><mo>=</mo><munder><mo>arg min</mo><mrow><msub><mi>𝜽</mi><mtext>a,d</mtext></msub><mo>,</mo><msub><mi>𝒯</mi><mi>d</mi></msub></mrow></munder><msub><mi>ℓ</mi><mtext>ik</mtext></msub></mtd></mtr><mtr><mtd><mtext>subject to </mtext><mo>(</mo><msub><mi>𝒯</mi><mi>d</mi></msub><mo>,</mo><msub><mi>𝜽</mi><mtext>a,d</mtext></msub><mo>)</mo><mo>∈</mo><msub><mi>𝒳</mi><mtext>IK</mtext></msub></mtd></mtr></mtable>`,
  pid: `<mtable columnalign="left" rowspacing=".6em"><mtr><mtd><msup><mi>𝐅</mi><mi>w</mi></msup><mo>=</mo><msub><mi>m</mi><mtext>sys</mtext></msub><mo>(</mo><msub><mi>𝐚</mi><mi>d</mi></msub><mo>+</mo><msub><mi>𝐊</mi><mi>p</mi></msub><msub><mi>𝐞</mi><mi>p</mi></msub><mo>+</mo><msub><mi>𝐊</mi><mi>v</mi></msub><msub><mi>𝐞</mi><mi>v</mi></msub></mtd></mtr><mtr><mtd><mspace width="2em"/><mo>+</mo><msub><mi>𝐊</mi><mi>i</mi></msub><mo>∫</mo><msub><mi>𝐞</mi><mi>p</mi></msub><mspace width=".15em"/><mi mathvariant="normal">d</mi><mi>t</mi><mo>+</mo><msup><mi>𝐠</mi><mi>w</mi></msup><mo>)</mo></mtd></mtr></mtable>`,
  l1: `<mtable columnalign="left" rowspacing=".8em"><mtr><mtd><msubsup><mi>𝐅</mi><msub><mi>L</mi><mn>1</mn></msub><mi>b</mi></msubsup><mo>=</mo><mo>−</mo><msub><mover accent="true"><mi>𝝈</mi><mo>¯</mo></mover><mi>F</mi></msub></mtd></mtr><mtr><mtd><msubsup><mi>𝝉</mi><msub><mi>L</mi><mn>1</mn></msub><mi>b</mi></msubsup><mo>=</mo><mo>−</mo><msub><mover accent="true"><mi>𝝈</mi><mo>¯</mo></mover><mi>τ</mi></msub></mtd></mtr></mtable>`,
  mpc: `<mtable columnalign="left" rowspacing=".8em"><mtr><mtd><msubsup><mi>𝐮</mi><mrow><mn>0</mn><mo>:</mo><mi>H</mi><mo>−</mo><mn>1</mn></mrow><mo>⋆</mo></msubsup><mo>=</mo><munder><mo>arg min</mo><msub><mi>𝐮</mi><mrow><mn>0</mn><mo>:</mo><mi>H</mi><mo>−</mo><mn>1</mn></mrow></msub></munder><mo>[</mo><msub><mi>ℓ</mi><mi>e</mi></msub><mo>(</mo><msub><mi>𝐱</mi><mi>H</mi></msub><mo>)</mo></mtd></mtr><mtr><mtd><mspace width="2em"/><mo>+</mo><munderover><mo>∑</mo><mrow><mi>t</mi><mo>=</mo><mn>0</mn></mrow><mrow><mi>H</mi><mo>−</mo><mn>1</mn></mrow></munderover><msub><mi>ℓ</mi><mi>r</mi></msub><mo>(</mo><msub><mi>𝐱</mi><mi>t</mi></msub><mo>,</mo><msub><mi>𝐮</mi><mi>t</mi></msub><mo>,</mo><msub><mi>𝐮</mi><mrow><mi>t</mi><mo>−</mo><mn>1</mn></mrow></msub><mo>)</mo><mo>]</mo></mtd></mtr><mtr><mtd><msub><mi>𝐱</mi><mrow><mi>t</mi><mo>+</mo><mn>1</mn></mrow></msub><mo>=</mo><msub><mi>𝐟</mi><mtext>dyn</mtext></msub><mo>(</mo><msub><mi>𝐱</mi><mi>t</mi></msub><mo>,</mo><msub><mi>𝐮</mi><mi>t</mi></msub><mo>)</mo></mtd></mtr><mtr><mtd><msub><mi>𝐱</mi><mn>0</mn></msub><mo>=</mo><mover><mi>𝐱</mi><mo>^</mo></mover><mo>,</mo><mspace width=".5em"/><msub><mi>𝐱</mi><mi>t</mi></msub><mo>∈</mo><mi>𝒳</mi><mo>,</mo><mspace width=".5em"/><msub><mi>𝐮</mi><mtext>lb</mtext></msub><mo>≤</mo><msub><mi>𝐮</mi><mi>t</mi></msub><mo>≤</mo><msub><mi>𝐮</mi><mtext>ub</mtext></msub></mtd></mtr></mtable>`,
};
function Equation({ id, label }: { id: keyof typeof equations; label: string }) {
  return <div className="research-equation" tabIndex={0} role="group" aria-label={label} dangerouslySetInnerHTML={{ __html: `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="${label}">${equations[id]}</math>` }} />;
}

const randomizationAxes = [
  { id: "appearance", label: "Appearance", task: "Press Button", image: "press_button" },
  { id: "geometry", label: "Geometry", task: "Rotate Valve", image: "rotate_valve" },
  { id: "placement", label: "Placement", task: "Lemon Harvesting", image: "lemon_harvesting" },
] as const;

export function RandomizationStudy() {
  const [panel, setPanel] = useState(0);
  const axis = randomizationAxes[panel];
  const changePanel = (direction: number) => setPanel(current => (current + direction + randomizationAxes.length) % randomizationAxes.length);
  return <section className="variation-gallery" aria-labelledby="randomization-title">
    <h3 id="randomization-title">Task-level variation</h3>
    <div id="variation-panel" className="variation-panel" role="group" aria-roledescription="slide" aria-label={`${axis.label}, ${panel + 1} of 3`}>
      <div className="variation-row">{[1, 2, 3, 4].map(value => <img key={`${axis.id}-${value}`} src={`/static/images/${axis.image}_variant_${value}.jpg`} width="500" height="500" alt={`${axis.task}: ${axis.label.toLowerCase()} variant ${value}`} loading="lazy" />)}</div>
    </div>
    <div className="variation-navigation">
      <button type="button" aria-label="Previous variation panel" aria-controls="variation-panel" onClick={() => changePanel(-1)}>←</button>
      <p aria-live="polite"><strong>{axis.label}</strong><span>{axis.task} · {panel + 1} / 3</span></p>
      <button type="button" aria-label="Next variation panel" aria-controls="variation-panel" onClick={() => changePanel(1)}>→</button>
    </div>
  </section>;
}

export function PolicyControlStudy() {
  const [interfaceId, setInterfaceId] = useState<"ee" | "base">("ee");
  const [controller, setController] = useState<"pid" | "l1" | "mpc">("pid");
  return <div className="policy-control-study">
    <div className="policy-inputs">
      <article><h3>Observe</h3><p>Configurable RGB views from the base and end effector combine with proprioception: base and end-effector state, arm joints, and gripper state.</p></article>
      <article><h3>Choose a target</h3><p>Imitation-learning and vision-language-action policies use a shared action interface. Task conditioning specifies the objective; the action specifies the next desired robot configuration or end-effector pose.</p></article>
      <article><h3>Realize the motion</h3><p>The low-level pipeline coordinates the floating base and arm. It produces a base wrench and joint references, which the robot executes within its actuation limits.</p></article>
    </div>
    <h3 className="interface-step">What does the policy command?</h3>
    <div className="research-switches interface-choice" aria-label="Policy action interface">
      <button type="button" aria-pressed={interfaceId === "ee"} onClick={() => setInterfaceId("ee")}>End-effector targets</button>
      <button type="button" aria-pressed={interfaceId === "base"} onClick={() => { setInterfaceId("base"); if (controller === "mpc") setController("pid"); }}>Base + joint targets</button>
    </div>
    <div className="interface-definition">
      <p>{interfaceId === "ee" ? "The action specifies a target end-effector pose and gripper command. This task-agnostic, low-dimensional interface is defined in end-effector space, supports intuitive teleoperation, and simplifies visuomotor policy learning." : "This interface allows the policy to command the drone base pose and manipulator joint angles simultaneously, providing flexibility for whole-body coordination tasks. The target base pose comprises position and quaternion orientation, together with target manipulator joint angles."}</p>
      <Equation id={interfaceId} label={interfaceId === "ee" ? "End-effector action, Appendix A.3" : "Base and joint action in paper ordering, Appendix A.3"} />

    </div>
    <h3 className="interface-step">How is the target executed?</h3>
    <div className="research-switches" aria-label="Controller">{(["pid", "l1", ...(interfaceId === "ee" ? ["mpc"] : [])] as Array<"pid" | "l1" | "mpc">).map(id => <button type="button" key={id} aria-pressed={controller === id} onClick={() => setController(id)}>{id === "pid" ? "Geometric PID" : id === "l1" ? "L₁ adaptive" : "Whole-body MPC"}</button>)}</div>
    <div className="control-formulations" aria-live="polite">
      {interfaceId === "ee" && controller !== "mpc" && <article><h3>Inverse kinematics</h3><p>At each control step, the IK jointly optimizes the aerial base pose and the manipulator joint angles so that the end-effector tracks a desired pose while maintaining smooth whole-body motion and satisfying kinematic safety constraints.</p><Equation id="ik" label="Constrained inverse kinematics, paper Equation 2" /></article>}
      <article><h3>{controller === "pid" ? "Base tracking" : controller === "l1" ? "Adaptive compensation" : "Whole-body optimization"}</h3>
        <p>{controller === "pid" ? "Geometric PID tracks the desired base trajectory and computes a body wrench; the arm tracks its joint references with an independent position controller. For underactuated robots, lateral acceleration requires tilt. The force law below is for fully actuated platforms." : controller === "l1" ? "L₁ adaptive control augments nominal geometric tracking with estimated force and torque disturbances. This helps compensate for model mismatch and external forces while preserving the same state and command interfaces." : "Whole-body MPC jointly optimizes the base wrench and manipulator joint references over a finite prediction horizon. Coordinating both parts in one constrained optimization accounts for their coupled motion and available actuation."}</p>
        <Equation id={controller} label={controller === "pid" ? "Translational PID force, paper Equation 6" : controller === "l1" ? "Adaptive compensation, Appendix A.4.3" : "MPC objective and constraints, paper Equation 12"} />

      </article>
    </div>
  </div>;
}
