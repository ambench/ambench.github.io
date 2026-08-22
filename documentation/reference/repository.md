# Repository Map

AM-Bench separates simulation, imitation learning, command-line workflows, internal engineering notes, and third-party integrations.

```text
am_isaac/
  source/am_isaac/          simulation extension
  source/am_isaac_il/       learned-policy and data adapters
  scripts/environments/     registration, smoke tests, teleoperation
  scripts/data/             recording, validation, format conversion
  docs/                     public documentation
  ext/                      optional external dependencies
```

## Simulation package

| Path | Responsibility |
| --- | --- |
| `tasks/` | Scene setup, observations, rewards, success, and reset logic |
| `tasks/base/` | Shared `BaseEnv`, configuration, registrations, and robot profiles |
| `scenes/` | Reusable task-agnostic scene components |
| `robots/` | Morphology, assets, rotor layouts, and `RobotIO` semantics |
| `controllers/` | Action pipelines, IK integration, wrench controllers, and allocation |
| `disturbance/` | Aerodynamic and disturbance models |
| `policies/scripted/` | Task-aware scripted policies |
| `recording/` | Canonical LeRobot and video writers |
| `evaluation/` | Controller tracking and limit-use diagnostics |

## Imitation-learning package

| Path | Responsibility |
| --- | --- |
| `data/` | Logical resampling and action-semantic validation |
| `pipeline/` | Dataset and action transformations shared by learned policies |
| `eval/` | Common evaluator CLI, batching, outputs, and tracking lifecycle |
| `policies/act/` | ACT datasets, processor, model, training, and evaluation |
| `policies/dp/` | Diffusion Policy integration and UMI dependency |
| `policies/pi/` | OpenPI client-side evaluation adapter |

The `ext/pyroki` and `ext/acados` trees are external integrations. Changes to them should be isolated from ordinary task or documentation work.

Development-only datasets, checkpoints, videos, experiment wrappers, and generated build outputs are not part of the public package boundary.
