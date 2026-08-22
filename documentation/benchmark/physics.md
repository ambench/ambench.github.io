# Physics and Disturbances

AM-Bench models the physical effects most relevant to multirotor interaction near structures without requiring computational fluid dynamics.

## Signal order

The controller produces a desired body wrench. The runtime then:

1. allocates the wrench to individual rotor-thrust commands;
2. applies physical rotor limits;
3. optionally applies reduced-order actuator response and rate limits;
4. applies ground-effect and near-wall rotor perturbations;
5. reconstructs the realized body wrench;
6. adds body-frame drag and world-frame wind.

This order matters. Saturation limits the command before proximity effects modify realized rotor forces.

## Rotor saturation

Each robot profile defines a rotor layout and feasible thrust range. When the allocator requests thrust outside those limits, the command is clamped. Evaluation tracking reports saturation use so task success can be interpreted together with control margin.

## Reduced-order actuator dynamics

The optional actuator model maps thrust command to normalized rotor speed, applies a first-order response and symmetric speed-rate limit, then maps the realized state back to thrust. It captures lag and slew constraints without simulating motor electrical dynamics.

## Aerodynamic effects

**Ground effect** increases effective rotor thrust as a rotor approaches a downward surface along its thrust axis. **Near-wall effect** models both altered vertical thrust and attractive lateral force near vertical surfaces. **Drag** depends on body motion, while **wind** is applied as a configurable world-frame force.

## Noise and randomization

Sensor and command noise are separate from task domain randomization. Task randomization changes scene parameters such as object pose, texture, friction, or wall pitch; noise perturbs observations or commands. Report both when presenting benchmark results.

The paper's hardware comparison found that enabling the ground-effect model reduced near-ground simulation-to-real end-effector height RMSE for the tested trajectory. See [Experimental Findings](results.md) for the measured snapshot.
