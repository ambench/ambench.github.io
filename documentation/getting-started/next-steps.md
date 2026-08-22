# Choose a Workflow

The first simulation proves that the runtime can create and step an AM-Bench task. Choose the next page by the outcome you want.

| Goal | Continue with |
| --- | --- |
| Understand benchmark scope | [Benchmark Design](../benchmark/index.md) |
| Choose a task | [Task Suite](../benchmark/tasks.md) |
| Compare robot embodiments | [Robot Platforms](../benchmark/robots.md) |
| Collect scripted or teleoperated data | [Collect Demonstrations](../workflows/collect-demos.md) |
| Validate an existing dataset | [Validate Datasets](../workflows/validate-data.md) |
| Train ACT, DP, PI0, or PI0.5 | [Policy Guides](../policies/index.md) |
| Interpret evaluation artifacts | [Evaluation Outputs](../reference/evaluation.md) |
| Add a task, robot, controller, or policy | [Extend AM-Bench](../extend/index.md) |

## Recommended progression

For a new task or platform, use the smallest diagnostic ladder:

1. run the EE-only PID variant;
2. verify the scripted policy and success criteria;
3. collect and validate a small dataset;
4. train or load one policy baseline;
5. evaluate through the standardized artifact path;
6. change one platform, controller, interface, or physical effect at a time.

This progression keeps task-logic failures separate from policy, controller, and actuation failures.
