# Robot Platforms

AM-Bench includes four multirotor-based aerial manipulators spanning the principal actuation classes, plus an EE-only oracle used to isolate task and policy behavior from aerial dynamics.

| Public name | Environment tag | Base actuation | Arm | Intended comparison |
| --- | --- | --- | --- | --- |
| EE-only | `EE` | free end-effector oracle | gripper proxy | task logic and policy upper-bound debugging |
| UA-Quad | `QuadScorpion` | conventional quadrotor, 4 rotors | 4 DoF | compact underactuated platform |
| UA-Hexa | `HexaScorpionUAC` | conventional hexarotor, 6 rotors | 4 DoF | larger underactuated platform |
| FA-Hexa | `HexaScorpion` | fixed-tilt hexarotor, 6 rotors | 4 DoF | fully actuated 6-DoF wrench control |
| Omni-Hexa | `OmniScorpion` | variable-tilt multirotor, 12 actuators | 3 DoF | overactuated, arbitrary-attitude capability |

## EE-only oracle

The EE-only profile accepts the same end-effector action used by physical robot variants but directly controls a floating end-effector articulation. It is the recommended starting point for validating task geometry, observations, rewards, success criteria, scripted behavior, and learned-policy integration.

It is not a physical aerial-manipulator result and should be labeled as an oracle baseline.

## Underactuated platforms

UA-Quad and UA-Hexa cannot independently command all translational and rotational degrees of freedom. Translation generally requires attitude change, which moves the manipulator and consumes thrust margin. Their IK profiles constrain base orientation accordingly, and their base controllers produce total thrust plus body torque.

## Fully and overactuated platforms

FA-Hexa produces a full body wrench with fixed tilted rotors. Omni-Hexa additionally changes rotor tilt and can hover at non-level attitudes. These platforms expose different feasible wrench sets and control-allocation behavior even when the policy issues the same end-effector target.

## Robot profiles are composed, not selected by conditionals

The maintained configuration surface is `RobotProfileCfg`. A profile packages:

- a `RobotSpecCfg` describing articulation and semantic handles;
- a `ControlPipelineCfg` describing action mode, controller, and optional IK;
- end-effector and optional base cameras.

Tasks select a profile in their configuration. They do not branch on robot names at runtime. See [Add a Robot](../extend/robot.md) for the extension path and [Controllers](../reference/controllers.md) for supported control combinations.
