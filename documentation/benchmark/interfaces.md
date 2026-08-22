# Policy-Control Interfaces

AM-Bench exposes a common high-level policy boundary while allowing the lower control stack to change. The interface determines how much embodiment-specific coordination the policy must learn.

## Observation space

Policies can consume RGB observations from the end-effector camera and, where configured, a base camera or external scene camera. Proprioception can include end-effector pose, base pose, arm joints, and gripper width. The exact flattened state layout is recorded in dataset metadata.

## End-effector target

An EE action contains position, orientation, and gripper state. The environment supports delta and absolute EE action modes. For a physical manipulator, the target is resolved through one of two paths:

- **IK–tracking:** Pyroki computes a base pose and arm configuration, then PID or L1 adaptive control tracks the base target.
- **Whole-body MPC:** the controller jointly plans base wrench and arm motion under constraints.

This interface keeps the policy focused on task-space manipulation while lower layers handle redundancy and platform constraints.

## Base-plus-joint target

An absolute BaseJoint action specifies base position, base quaternion, arm joint positions, and gripper state. It bypasses IK and exposes more configuration-space decisions to the policy. BaseJoint variants are registered only where the task/config combination supports them.

## Dataset and model representations

Recorded demonstrations store canonical environment actions. Maintained learned-policy paths derive relative trajectories from absolute EE or BaseJoint source data:

| Boundary | EE | BaseJoint |
| --- | --- | --- |
| Environment action | absolute or delta EE pose | absolute base pose + joints |
| Canonical training source | `ee_absolute` | `base_joint_absolute` |
| ACT model representation | `ee_local_relative` | `base_joint_relative` |
| DP model representation | relative UMI pose | relative UMI base/joint |
| OpenPI model representation | config-driven local relative | config-driven base/joint relative |

Do not pair a checkpoint with an environment using different action semantics. See [Observations and Actions](../reference/interfaces.md) for dimensions and quaternion order.
