# What is AM-Bench?

AM-Bench is an Isaac Lab simulation suite for learning and control research in multirotor-based aerial manipulation. It provides common tasks and interfaces while preserving the system properties that make aerial manipulation different from a fixed tabletop arm: floating-base motion, base–manipulator coupling, limited wrench authority, actuator saturation, and proximity-induced aerodynamic effects.

## Why a system-level benchmark?

In aerial manipulation, identical high-level actions can produce different outcomes on different platforms. An underactuated multirotor may need to tilt to translate; that attitude change moves the arm and consumes thrust margin. A fully actuated platform can decouple translation and rotation but still encounters allocation limits. Near a wall or the ground, rotor-level effects further alter the available wrench.

AM-Bench therefore treats task success as the outcome of five connected choices:

| Axis | What changes |
| --- | --- |
| Task | geometry, success criteria, contact mode, payload, and randomization |
| Robot | actuation class, arm geometry, workspace, cameras, and rotor limits |
| Policy | observations, temporal model, task conditioning, and action representation |
| Control | inverse kinematics, tracking controller, whole-body optimization, and allocation |
| Physics | drag, wind, ground effect, near-wall effect, actuator response, and saturation |

The [Benchmark Design](../benchmark/index.md) page shows how these modules connect.

## What is included?

The current benchmark revision contains 12 tasks, four multirotor-based aerial manipulators, an EE-only oracle, scripted demonstration policies, and learned-policy integrations for ACT, Diffusion Policy, PI0, and PI0.5. Evaluation produces a common text report, structured JSON summary, tracking log, and optional videos.

The repository is split into two packages:

- `source/am_isaac` contains simulation, tasks, robots, controllers, recording, and scripted policies.
- `source/am_isaac_il` contains imitation-learning data bridges, training entrypoints, and learned-policy evaluators.

## How to read these docs

Use [Installation](installation.md) and [First Simulation](first-run.md) as the supported onboarding path. After the first environment runs, [Choose a Workflow](next-steps.md) routes to data collection, policy evaluation, benchmark reference, or extension guides.

The paper explains the research framing and experimental evidence. The documentation describes the maintained software interface. When a paper detail and the live repository differ, commands and registered configuration in the repository are authoritative for execution.
