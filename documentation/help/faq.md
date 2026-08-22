# Frequently Asked Questions

## What should I run first?

Use `PressButton-Am-EE-Delta-PID-Direct-v0` with one environment. It exercises task registration, scene creation, reset, observations, actions, and stepping without Pyroki or acados.

## Why are the product and package names different?

AM-Bench is the project and benchmark name. `am_isaac` and `am_isaac_il` are the repository's Python package names and therefore appear in imports and filesystem paths.

## Which operating systems are supported?

The maintained path is native Linux with an NVIDIA GPU, Isaac Sim 5.1, Isaac Lab, and Python 3.11. WSL, macOS, and CPU-only simulation are outside the maintained runtime boundary. Remote or containerized setups must provide compatible NVIDIA graphics and Vulkan access.

## Why use the EE oracle?

The EE-only profile isolates task geometry, scripted behavior, observation/action wiring, and learned-policy behavior from mobile-manipulator IK and base control. It is a diagnostic baseline, not a physical aerial robot.

## What is the recommended policy interface?

Use an EE-target interface unless the experiment specifically studies direct base-plus-joint commands. The paper's representative ablation found better task success and lower limit use for the EE-target path, especially with whole-body MPC, but that result is an experimental finding rather than a guarantee for every task.

## Are aerodynamic effects always enabled?

No. Environment configs expose saturation, aerodynamic effects, wind, action noise, and observation noise independently. The learned-policy evaluator's `--disturbance` option enables saturation, aerodynamic effects, and wind together for that run.

## Where should datasets and checkpoints live?

Use storage outside version control. Recorder defaults are convenient for local development, but `datasets/`, checkpoints, videos, and evaluation outputs are generated artifacts and are not part of the public source release.

## Can I replay a canonical dataset exactly in simulation?

Not through a maintained public entry point. Exact replay also requires reset and scene state beyond the policy dataset. The supported gate is static dataset validation plus inspection of recorded videos.

## Why does OpenPI use a separate server?

The maintained OpenPI stack has its own pinned dependencies and serves policy inference over a network connection. Isaac Sim remains in the AM-Bench environment while the OpenPI process loads and serves the checkpoint.

## How should I compare results?

Match the full evaluation configuration: task ID, checkpoint and action semantics, observations, policy rate, seed policy, rollout count, episode length, disturbance flags, and controller profile. Use both task outcomes and tracking/limit diagnostics.

