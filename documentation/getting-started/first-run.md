# First Simulation

This tutorial checks one environment from registration through scene creation and stepping. It uses the EE-only oracle so a first run does not depend on Pyroki or acados.

## 1. Activate the environment

From the AM-Bench repository root:

```bash
source ../IsaacLab/env_isaaclab/bin/activate
nvidia-smi
```

Confirm that the selected GPU has enough free memory and that no unexpected Isaac Sim process is already running.

## 2. List registered environments

```bash
python scripts/environments/list_envs.py
```

Locate `PressButton-Am-EE-Delta-PID-Direct-v0` in the output. Environment IDs encode the task, robot profile, action mode, and controller; see [Environment IDs](../reference/environments.md).

## 3. Run a bounded headless check

`zero_agent.py` is a continuous runner, so bound it during validation:

```bash
timeout --signal=INT 30s python scripts/environments/zero_agent.py \
  --task PressButton-Am-EE-Delta-PID-Direct-v0 \
  --num_envs 1 \
  --headless \
  --device cuda:0
```

A useful pass reaches all three milestones:

1. Isaac Sim starts without a driver or renderer failure;
2. the task scene resets and prints its observation and action spaces;
3. the environment steps repeatedly until `timeout` sends the interrupt.

The zero-action agent is not expected to solve the task.

## 4. Optional video check

Record the end-effector camera while stepping:

```bash
timeout --signal=INT 30s python scripts/environments/zero_agent.py \
  --task PressButton-Am-EE-Delta-PID-Direct-v0 \
  --num_envs 1 \
  --video \
  --camera_names ee_camera \
  --headless \
  --device cuda:0
```

The script prints `VIDEO_PATH` when it shuts down cleanly. Video output verifies the camera and encoding path, not task success.

## 5. Choose the next workflow

Once this check passes, move to [Choose a Workflow](next-steps.md). Use the EE-only environment for task and policy debugging, then introduce a physical platform when you are ready to study IK, base control, allocation, and saturation.
