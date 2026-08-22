# Extend AM-Bench

AM-Bench extensions should preserve the boundary between task logic, robot morphology, control, and learned-policy adapters. Start from the nearest maintained implementation and change one layer at a time.

| Goal | Guide | Primary package |
| --- | --- | --- |
| Add scene logic and success criteria | [Add a Task](task.md) | `am_isaac.tasks` |
| Add an articulation and morphology | [Add a Robot](robot.md) | `am_isaac.robots` |
| Add reusable control math | [Add a Controller](controller.md) | `am_isaac.controllers` |
| Add a training/evaluation integration | [Add a Policy](policy.md) | `am_isaac_il.policies` |

## Design boundary

Tasks own objects, reset randomization, observations, rewards, and success. Robot specifications own articulation semantics, joints, links, cameras, and rotor geometry. Control pipelines translate public actions into `RobotCommand`; controllers compute reusable targets or wrenches. Learned-policy packages adapt canonical datasets and predictions without changing task internals.

Use `RobotProfileCfg` to compose a robot with a control pipeline. Add registered config classes for supported task/profile combinations instead of branching on robot names inside `BaseEnv`.

## Validation ladder

For every extension:

1. import the new module and confirm registration;
2. run one bounded headless environment;
3. exercise the new behavior with the smallest relevant scripted or policy check;
4. run formatting and focused tests;
5. document runtime dependencies and anything not verified.

Isaac-dependent checks require the activated Isaac Lab environment. GPU runs should begin with `nvidia-smi`, use one small environment, and avoid overlapping heavy simulator jobs.

