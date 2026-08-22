# Installation

This guide installs AM-Bench into an existing Isaac Lab Python environment. It does not install the NVIDIA driver, Isaac Sim, or Isaac Lab for you.

## Requirements

- native Linux; Ubuntu 22.04 and 24.04 are the maintained host targets;
- an NVIDIA GPU and driver compatible with the selected Isaac Sim release;
- Isaac Sim 5.1 with an Isaac Lab checkout;
- Python 3.11 in the Isaac Lab environment;
- `uv` for editable package installation.

WSL, macOS, and CPU-only simulation are outside the maintained runtime boundary. Remote and containerized setups can work, but graphics, Vulkan, filesystem, and port-forwarding details belong to the host deployment rather than AM-Bench.

## 1. Install Isaac Sim and Isaac Lab

Follow the [Isaac Lab binary installation guide](https://isaac-sim.github.io/IsaacLab/main/source/setup/installation/binaries_installation.html). Create the Python environment expected by that checkout.

For Isaac Sim 5.1, verify that the environment uses Python 3.11:

```bash
source <path-to-IsaacLab>/env_isaaclab/bin/activate
python --version
```

Do not use Isaac Sim's Kit Python launcher for normal AM-Bench commands. Activate the Isaac Lab environment, then use plain `python`.

## 2. Clone AM-Bench beside Isaac Lab

The public source release is planned at `https://github.com/ambench/am_bench`. The repository is not available yet, so the command below becomes usable when the release is announced.

```bash
cd <workspace-root>
git clone --recurse-submodules https://github.com/ambench/am_bench.git am_bench
cd am_bench
```

A typical layout is:

```text
<workspace-root>/
  IsaacLab/
  am_bench/
```

## 3. Install the local packages

From the AM-Bench repository root:

```bash
source ../IsaacLab/env_isaaclab/bin/activate
uv pip install -e source/am_isaac
uv pip install -e source/am_isaac_il
```

The simulation package is sufficient for environment and controller work. The IL package provides learned-policy and dataset utilities.

## 4. Verify registration

```bash
python scripts/environments/list_envs.py
```

This starts Isaac Sim headlessly and prints the registered `*-Am-*` environment IDs. Registration proves the packages import and their task modules are visible; it does not yet prove that a specific task steps successfully.

## Optional: LeRobot and policy extras

The canonical dataset boundary uses LeRobot 0.4.4. Install it without allowing its dependency resolver to replace Isaac Lab's validated Torch and NumPy stack:

```bash
uv pip install --no-deps "lerobot==0.4.4"
```

Install one policy extra only when needed:

```bash
uv pip install -e "source/am_isaac_il[act]"
uv pip install -e "source/am_isaac_il[dp]"
```

OpenPI uses its own pinned environment for training and serving; see [OpenPI](../policies/openpi.md).

## Optional: Pyroki inverse kinematics

Physical manipulator variants that accept end-effector targets use the Pyroki integration:

```bash
git submodule update --init --recursive ext/pyroki
uv pip install -e ext/pyroki
export JAX_PLATFORMS=cpu
uv pip install "numpy==1.26.0" "jax==0.4.28" "jaxlib==0.4.28"
```

The maintained configuration runs JAX on CPU while Isaac Sim uses the NVIDIA GPU. GPU-backed JAX is not part of the validated setup.

## Optional: acados whole-body MPC

MPC variants require the `ext/acados` submodule and its Python interface:

```bash
git submodule update --init --recursive ext/acados
cd ext/acados
mkdir -p build
cd build
cmake -DACADOS_WITH_QPOASES=ON ..
make install -j4
cd ../../..
uv pip install -e ext/acados/interfaces/acados_template
export ACADOS_SOURCE_DIR="$(pwd)/ext/acados"
export LD_LIBRARY_PATH="$ACADOS_SOURCE_DIR/lib:$ACADOS_SOURCE_DIR/build:$LD_LIBRARY_PATH"
```

Continue with [First Simulation](first-run.md).
