# Installation

This guide installs AM-Bench into an existing Isaac Lab Python environment. When it is complete, the `ambench` and `ambench_learn` packages are installed in `env_isaaclab`; runtime verification is the next, separate step.

## Requirements

- native Linux; Ubuntu 22.04 and 24.04 are the maintained host targets;
- an NVIDIA GPU and driver compatible with the selected Isaac Sim release;
- Isaac Sim 5.1 with an Isaac Lab checkout;
- Python 3.11 in the Isaac Lab environment;
- `uv` for editable package installation;
- Git, CMake, and a C/C++ build toolchain for the bundled controller dependencies.

WSL, macOS, and CPU-only simulation are outside the maintained runtime boundary. Remote and containerized setups can work, but the host must provide compatible NVIDIA graphics, Vulkan access, filesystem mounts, and any required port forwarding.

## 1. Install Isaac Sim and Isaac Lab

Follow the [Isaac Lab binary installation guide](https://isaac-sim.github.io/IsaacLab/main/source/setup/installation/binaries_installation.html). Create the Python environment expected by that checkout.

For Isaac Sim 5.1, activate the environment and confirm that it uses Python 3.11:

```bash
source <path-to-IsaacLab>/env_isaaclab/bin/activate
python --version
```

Do not use Isaac Sim's Kit Python launcher for normal AM-Bench commands. Activating `env_isaaclab` also configures the Isaac runtime environment required by repository scripts.

## 2. Clone AM-Bench beside Isaac Lab

Clone the current source repository beside the Isaac Lab checkout:

```bash
cd <workspace-root>
git clone https://github.com/ambench/ambench.git
cd ambench
```

The commands in these docs assume this layout:

```text
<workspace-root>/
  IsaacLab/
  ambench/
```

If the directories are elsewhere, replace `../IsaacLab` with the path to your Isaac Lab checkout.

## 3. Install AM-Bench and its controller dependencies

From the AM-Bench repository root:

```bash
source ../IsaacLab/env_isaaclab/bin/activate
./scripts/setup/install.sh
```

The installer initializes the Pyroki and acados submodules, installs the maintained
CPU JAX stack and Pyroki, builds the acados libraries and installs its Python
interface, then installs `ambench` and `ambench_learn` from their `source/` paths.
The acados build remains machine-local under `ext/acados/build/`.

## 4. Configure the dependency environment

Add these lines to `~/.bashrc`, replacing `/absolute/path/to/ambench` with the
absolute path to this checkout:

```bash
export JAX_PLATFORMS=cpu
export ACADOS_SOURCE_DIR="/absolute/path/to/ambench/ext/acados"
export LD_LIBRARY_PATH="$ACADOS_SOURCE_DIR/lib:$ACADOS_SOURCE_DIR/build:$LD_LIBRARY_PATH"
```

Load the changes in the current terminal:

```bash
source ~/.bashrc
```

These settings run Pyroki's JAX computations on CPU while Isaac Sim uses the
NVIDIA GPU, and make the acados libraries available to its Python interface.

The simulation package provides environments, robots, controllers, recording, and scripted policies. The learning package provides learned-policy and dataset utilities.

AM-Bench is the product name; `ambench` and `ambench_learn` are the Python package names used by imports and editable installation paths.

Continue with [Verify Installation](first-run.md). That check starts Isaac Sim, confirms environment registration, creates one scene, and steps it for a bounded interval.

## Optional: LeRobot and policy extras

The canonical dataset boundary uses LeRobot 0.4.4. Install it without allowing its dependency resolver to replace Isaac Lab's validated Torch and NumPy stack:

```bash
uv pip install --no-deps "lerobot==0.4.4"
```

Install a learned-policy extra only when needed:

```bash
uv pip install -e "source/ambench_learn[act]"
uv pip install -e "source/ambench_learn[dp]"
```

OpenPI uses its own pinned environment for training and serving; see [OpenPI](../policies/openpi.md).
