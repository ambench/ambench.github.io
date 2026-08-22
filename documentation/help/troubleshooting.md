# Troubleshooting

Start with the earliest failing layer. A task or policy change cannot repair an Isaac Sim startup, driver, package, or dataset-format failure.

## `ModuleNotFoundError: am_isaac`

Activate the Isaac Lab environment and reinstall the local packages from the repository root:

```bash
source ../IsaacLab/env_isaaclab/bin/activate
uv pip install -e source/am_isaac
uv pip install -e source/am_isaac_il
python scripts/environments/list_envs.py
```

Do not invoke `../IsaacLab/env_isaaclab/bin/python` without activation; the activation script also configures the Isaac runtime environment.

## Isaac Sim or `pxr` import fails

Use repository entry points that launch `AppLauncher` before importing Isaac Lab, `pxr`, or Omniverse runtime modules. For an ad hoc script, activate the environment and initialize `AppLauncher` first. Do not use the Kit Python launcher for ordinary AM-Bench validation.

If a bare Isaac Lab example also fails, diagnose the driver, Vulkan, Isaac Sim, and Isaac Lab installation before changing AM-Bench code.

## Renderer startup or out-of-memory failure

Check the physical GPUs and active processes:

```bash
nvidia-smi
```

Run one heavy Isaac process at a time on a single-GPU machine. Start with `--num_envs 1 --headless`, omit unnecessary cameras, and select the device explicitly with `--device cuda:0`. A GUI session and camera sensors can add substantial graphics memory pressure.

## Pyroki or JAX selects the wrong backend

The maintained integration uses JAX on CPU while Isaac Sim uses the NVIDIA GPU. Set the backend before starting Python:

```bash
export JAX_PLATFORMS=cpu
```

Then confirm the pinned NumPy, JAX, and JAXlib versions from [Installation](../getting-started/installation.md). A successful EE-oracle task does not validate the physical manipulator IK path.

## acados solver cannot load

Confirm that acados was built, the Python interface is installed, and the runtime paths are set in the same shell:

```bash
export ACADOS_SOURCE_DIR="$(pwd)/ext/acados"
export LD_LIBRARY_PATH="$ACADOS_SOURCE_DIR/lib:$ACADOS_SOURCE_DIR/build:$LD_LIBRARY_PATH"
```

Generated solver code is machine-local output. Rebuild it on the target machine rather than copying build directories into the repository.

## A requested camera is unavailable

The EE oracle exposes `ee_camera`. Physical profiles can additionally expose `base_camera`; `scene_camera` is added only by recording or evaluation paths that configure it. The evaluator rejects unavailable names and prints the sensor registry. Remove the missing name or select a profile that provides it.

## Dataset validation reports missing episode metadata

The recorder was likely interrupted before finalization or the wrong directory was supplied. Pass either the session root or its `lerobot/` child. A valid dataset contains `meta/info.json` and finalized Parquet files under `meta/episodes/`.

## A checkpoint loads but actions are wrong

Compare the task ID, environment action mode, source `action_semantics`, model action representation, policy rate, state-key order, camera keys, and quaternion convention. Matching tensor dimensions do not establish compatibility.

## The process does not exit after `timeout`

`zero_agent.py` is continuous. Use `timeout --signal=INT`, allow Isaac Sim to shut down, and check for remaining child processes before starting another run. A forced kill can leave incomplete videos or datasets.

