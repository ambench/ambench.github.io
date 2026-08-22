# Train and Evaluate

Policy families differ in training runtime and input format, but they share dataset semantics and evaluation behavior.

## Choose the action interface first

Record and evaluate with compatible task semantics:

- an EE-absolute source dataset supports the maintained EE-relative model paths;
- a BaseJoint-absolute source dataset supports BaseJoint-relative model paths;
- EE-delta recordings are not accepted by the maintained relative DP and OpenPI conversion paths.

Do not infer semantics from action dimension alone. Read `meta/info.json` and the policy checkpoint metadata.

## Choose a policy guide

| Family | Canonical-data boundary | Runtime characteristic |
| --- | --- | --- |
| [ACT](../policies/act.md) | direct logical LeRobot view | single-process training; in-process evaluation |
| [Diffusion Policy](../policies/diffusion-policy.md) | validated UMI zarr conversion | Hydra training; in-process evaluation |
| [PI0 / PI0.5](../policies/openpi.md) | pinned OpenPI export plus norm stats | separate OpenPI server and Isaac client |

## Common evaluation interface

The learned-policy entrypoints are:

```bash
python -m am_isaac_il.policies.act.eval --help
python -m am_isaac_il.policies.dp.eval --help
python -m am_isaac_il.policies.pi.eval --help
```

All require `--task` and expose the same core options: `--num-rollouts`, `--num-envs`, `--episode-length-s`, `--seed`, `--disturbance`, `--save-video`, `--video-camera-names`, `--progress-every`, `--output-dir`, `--headless`, and `--device`.

ACT and DP load a local `--checkpoint`. PI connects to `--host` and `--port`, requires a language `--prompt`, and records a caller-supplied `--policy-id`. DP currently supports exactly one evaluation environment.

## Common artifacts

By default, evaluation writes to:

```text
outputs/eval/<act|dp|pi>/<task>/<timestamp>/
```

Each completed run contains:

```text
results.txt
eval_summary.json
tracking/
  tracking.jsonl
  analysis.json
videos/                 # when --save-video is enabled
```

Pass `--output-dir` for an exact location. See [Evaluation Outputs](../reference/evaluation.md) before comparing runs.
