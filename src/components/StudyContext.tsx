const insights = {
  1: "Multi-task fine-tuning improves both VLA baselines over zero-shot evaluation. Most of the improvement comes from broad AM-domain adaptation; task-specific fine-tuning adds smaller gains. π₀.₅ performs best overall, but precise contact and dynamic tasks remain bottlenecks.",
  2: "The EE target interface provides a more task-relevant abstraction: the policy only needs to reason about the desired manipulation objective in Cartesian space, while the low-level controller handles redundancy resolution, base–arm coordination, and constraint management. EE target control with whole-body MPC outperforms the other evaluated configurations, further suggesting that jointly optimizing robotic-arm and floating-base motions for low-level control is beneficial.",
  3: "Underactuated platforms such as UA-Hexa and UA-Quad require roll and pitch motion to generate lateral translation, resulting in larger tilt angles. In contrast, FA-Hexa can translate without tilting its base. Omni-Hexa shows larger tilt angles because it supports tilted hover, which the IK solver exploits for tracking and constraint satisfaction near the task surface. Its much lower saturation further indicates a larger achievable wrench space.",
} as const;

const contexts = {
  1: "FA-Hexa · EE targets · IK–PID. Training/fine-tuning uses 80 scripted demonstrations per task; zero-shot uses pretrained checkpoints. Evaluation: 30 rollouts per task. Success averages all 12 tasks; subtask completion averages the nine tasks with intermediate criteria.",
  2: "DP on FA-Hexa · 30 evaluation rollouts per configuration. Success uses all rollouts; tilt and saturation summarize successful rollouts. A dash indicates no successful rollout.",
  3: "Same scripted high-level policy, EE target objectives, and IK–PID tracking controller across all four platforms. Values summarize successful Push Slider evaluations.",
} as const;

export function StudyContext({ experiment }: { experiment: 1 | 2 | 3 }) {
  return <><p className="study-insight">{insights[experiment]}</p><p className="evaluation-context">{contexts[experiment]}</p></>;
}
