export type Task = {
  id: string;
  name: string;
  shortName: string;
  video: string;
  description: string;
};

export type TaskGroup = {
  id: string;
  index: string;
  title: string;
  count: number;
  description: string;
  accent: string;
  tasks: Task[];
};

export const taskGroups: TaskGroup[] = [
  {
    id: "instantaneous",
    index: "01",
    title: "Instantaneous interaction",
    count: 2,
    accent: "Brief, precise interactions",
    description: "Brief, precise contact.",
    tasks: [
      {
        id: "press-button",
        name: "Press Button",
        shortName: "Press Button",
        video: "/static/publication/tasks/press_button.mp4",
        description: "Button travel determines success; contact with the wall does not.",
      },
      {
        id: "peg-in-hole",
        name: "Peg in Hole",
        shortName: "Peg in Hole",
        video: "/static/publication/tasks/peg_in_hole.mp4",
        description: "Success requires penetration past the opening while remaining inside its lateral bounds.",
      },
    ],
  },
  {
    id: "transport",
    index: "02",
    title: "Object transport",
    count: 4,
    accent: "Visual grounding and payload dynamics",
    description:
      "Visual grounding, payload changes, and multi-stage completion.",
    tasks: [
      {
        id: "frame-assembly",
        name: "Frame Assembly",
        shortName: "Frame Assembly",
        video: "/static/publication/tasks/frame_assembly.mp4",
        description: "Completion requires alignment with every peg, not just lifting the frame.",
      },
      {
        id: "cabinet-pick-place",
        name: "Cabinet Pick and Place",
        shortName: "Cabinet Pick + Place",
        video: "/static/publication/tasks/cabinet_pick_and_place.mp4",
        description: "Three evaluated stages: opening the door, lifting the can, and stable placement.",
      },
      {
        id: "lemon-harvesting",
        name: "Lemon Harvesting",
        shortName: "Lemon Harvesting",
        video: "/static/publication/tasks/lemon_harvesting.mp4",
        description: "Grasping and detachment are scored separately from delivery and release.",
      },
      {
        id: "toss-ball",
        name: "Toss Ball",
        shortName: "Toss Ball",
        video: "/static/publication/tasks/toss_ball.mp4",
        description: "The base must remain behind the container by the prescribed distance at delivery.",
      },
    ],
  },
  {
    id: "contact",
    index: "03",
    title: "Articulated object and constrained contact",
    count: 6,
    accent: "Trajectory compliance under contact",
    description:
      "Sustained contact along constrained trajectories.",
    tasks: [
      {
        id: "rotate-valve",
        name: "Rotate Valve",
        shortName: "Rotate Valve",
        video: "/static/publication/tasks/rotate_valve.mp4",
        description: "Success is measured by shaft rotation, rather than gripper motion alone.",
      },
      {
        id: "push-slider",
        name: "Push Slider",
        shortName: "Push Slider",
        video: "/static/publication/tasks/push_slider.mp4",
        description: "The rail constrains the interaction to one translational degree of freedom.",
      },
      {
        id: "pull-lever",
        name: "Pull Lever",
        shortName: "Pull Lever",
        video: "/static/publication/tasks/pull_lever.mp4",
        description: "The joint angle must exceed a threshold relative to its initial position.",
      },
      {
        id: "open-door",
        name: "Open Door",
        shortName: "Open Door",
        video: "/static/publication/tasks/open_door.mp4",
        description: "Hinge damping varies the resistance encountered during opening.",
      },
      {
        id: "wipe-window",
        name: "Wipe Window",
        shortName: "Wipe Window",
        video: "/static/publication/tasks/wipe_window.mp4",
        description: "Stain removal requires both proximity and sufficient contact force.",
      },
      {
        id: "ndt",
        name: "Nondestructive Testing",
        shortName: "NDT",
        video: "/static/publication/tasks/ndt.mp4",
        description: "Contact must remain stable for a fixed inspection interval.",
      },
    ],
  },
];

export const allTasks = taskGroups.flatMap((group) => group.tasks);

export const embodiments = [
  {
    id: "ua-quad",
    name: "UA-Quad",
    category: "Underactuated",
    spec: "Quadrotor · 4 base actuators · 4-DoF arm",
    description: "Lateral force requires base tilt, coupling translation with gripper orientation.",
    video: "/static/publication/embodiments/ua-quad__pip.mp4",
  },
  {
    id: "ua-hexa",
    name: "UA-Hexa",
    category: "Underactuated",
    spec: "Hexarotor · 6 base actuators · 4-DoF arm",
    description: "Greater arm reach than UA-Quad; lateral force still requires base tilt.",
    video: "/static/publication/embodiments/ua-hexa__pip.mp4",
  },
  {
    id: "fa-hexa",
    name: "FA-Hexa",
    category: "Fully actuated",
    spec: "Fixed-tilt hexarotor · 6 base actuators · 4-DoF arm",
    description: "Fixed rotor tilt permits independent force and torque control within thrust limits.",
    video: "/static/publication/embodiments/fa-hexa__pip.mp4",
  },
  {
    id: "omni-hexa",
    name: "Omni-Hexa",
    category: "Overactuated",
    spec: "Variable-tilt multirotor · 12 base actuators · 3-DoF arm",
    description: "Variable rotor tilt supports arbitrary-orientation hover and redundant wrench allocation.",
    video: "/static/publication/embodiments/omni-hexa__pip.mp4",
  },
] as const;

export type Exp1Policy = {
  id: string;
  label: string;
  family: string;
  adaptation: string;
  macroSuccess: number;
  macroSubtask: number;
  success: Record<string, number>;
  subtask: Record<string, number | null>;
};

const taskIds = [
  "press-button",
  "peg-in-hole",
  "frame-assembly",
  "cabinet-pick-place",
  "lemon-harvesting",
  "toss-ball",
  "rotate-valve",
  "push-slider",
  "pull-lever",
  "open-door",
  "wipe-window",
  "ndt",
];

const successRecord = (values: number[]) =>
  Object.fromEntries(taskIds.map((id, index) => [id, values[index]]));

const subtaskIds = [
  "frame-assembly",
  "cabinet-pick-place",
  "lemon-harvesting",
  "toss-ball",
  "rotate-valve",
  "push-slider",
  "pull-lever",
  "open-door",
  "wipe-window",
];

const subtaskRecord = (values: number[]) => {
  const entries: Array<[string, number | null]> = taskIds.map((id) => [id, null]);
  values.forEach((value, index) => {
    entries[taskIds.indexOf(subtaskIds[index])] = [subtaskIds[index], value];
  });
  return Object.fromEntries(entries) as Record<string, number | null>;
};

export const exp1Policies: Exp1Policy[] = [
  {
    id: "act",
    label: "ACT",
    family: "Specialist",
    adaptation: "Single-task",
    macroSuccess: 26.94,
    macroSubtask: 34.17,
    success: successRecord([80, 40, 0, 10, 3.3, 0, 13.3, 23.3, 13.3, 100, 0, 40]),
    subtask: subtaskRecord([5, 20, 5, 50, 50, 45, 15, 100, 17.5]),
  },
  {
    id: "dp",
    label: "DP",
    family: "Specialist",
    adaptation: "Single-task",
    macroSuccess: 41.39,
    macroSubtask: 53.52,
    success: successRecord([73.3, 66.7, 0, 3.3, 26.7, 0, 26.7, 63.3, 83.3, 93.3, 3.3, 56.7]),
    subtask: subtaskRecord([20, 13.3, 43.3, 50, 70, 80, 83.3, 93.3, 28.3]),
  },
  {
    id: "pi0-zs",
    label: "π₀ · ZS",
    family: "VLA",
    adaptation: "Zero-shot",
    macroSuccess: 8.61,
    macroSubtask: 8.95,
    success: successRecord([33.3, 0, 0, 0, 0, 0, 0, 0, 20, 50, 0, 0]),
    subtask: subtaskRecord([0, 2.2, 0, 0, 6.7, 0, 20, 50, 1.7]),
  },
  {
    id: "pi0-mt",
    label: "π₀ · MT-FT",
    family: "VLA",
    adaptation: "Multi-task fine-tuned",
    macroSuccess: 36.67,
    macroSubtask: 54.63,
    success: successRecord([93.3, 60, 3.3, 0, 16.7, 0, 20, 20, 76.7, 93.3, 0, 56.7]),
    subtask: subtaskRecord([25, 26.7, 60, 50, 60, 60, 80, 96.7, 33.3]),
  },
  {
    id: "pi0-mt-st",
    label: "π₀ · MT→ST-FT",
    family: "VLA",
    adaptation: "Multi-task, then task-specific",
    macroSuccess: 45,
    macroSubtask: 59.04,
    success: successRecord([56.7, 66.7, 0, 0, 50, 16.7, 0, 100, 90, 90, 0, 70]),
    subtask: subtaskRecord([0, 32.2, 80, 53.3, 50, 100, 90, 96.7, 29.2]),
  },
  {
    id: "pi05-zs",
    label: "π₀.₅ · ZS",
    family: "VLA",
    adaptation: "Zero-shot",
    macroSuccess: 2.78,
    macroSubtask: 6.3,
    success: successRecord([0, 0, 0, 0, 0, 0, 0, 0, 0, 33.3, 0, 0]),
    subtask: subtaskRecord([0, 0, 0, 23.3, 0, 0, 0, 33.3, 0]),
  },
  {
    id: "pi05-mt",
    label: "π₀.₅ · MT-FT",
    family: "VLA",
    adaptation: "Multi-task fine-tuned",
    macroSuccess: 49.17,
    macroSubtask: 59.44,
    success: successRecord([100, 100, 0, 0, 66.7, 0, 0, 100, 66.7, 100, 0, 56.7]),
    subtask: subtaskRecord([46.7, 30, 73.3, 38.3, 50, 100, 66.7, 100, 30]),
  },
  {
    id: "pi05-mt-st",
    label: "π₀.₅ · MT→ST-FT",
    family: "VLA",
    adaptation: "Multi-task, then task-specific",
    macroSuccess: 52.22,
    macroSubtask: 67.31,
    success: successRecord([96.7, 90, 0, 0, 86.7, 10, 0, 90, 83.3, 100, 10, 60]),
    subtask: subtaskRecord([50, 30, 88.3, 58.3, 50, 96.7, 95, 100, 37.5]),
  },
];

export const controllerSetups = [
  { id: "ee-ik-pid", interface: "EE-target", controller: "IK–PID", note: "Decoupled IK + geometric PID" },
  { id: "base-pid", interface: "Base + joints", controller: "PID", note: "Configuration-centric targets" },
  { id: "ee-ik-l1", interface: "EE-target", controller: "IK–L₁", note: "Decoupled IK + adaptive tracking" },
  { id: "base-l1", interface: "Base + joints", controller: "L₁", note: "Configuration-centric targets" },
  { id: "ee-mpc", interface: "EE-target", controller: "MPC", note: "Whole-body constrained optimization" },
] as const;

export const exp3Embodiments = [
  { id: "ua-quad", label: "UA-Quad", eeError: 7.506, baseError: 4.668, tilt: 0.187, saturation: 48.01 },
  { id: "ua-hexa", label: "UA-Hexa", eeError: 7.051, baseError: 7.828, tilt: 0.143, saturation: 87.44 },
  { id: "fa-hexa", label: "FA-Hexa", eeError: 0.99, baseError: 0.275, tilt: 0.057, saturation: 39.52 },
  { id: "omni-hexa", label: "Omni-Hexa", eeError: 3.502, baseError: 3.223, tilt: 1.16, saturation: 9.98 },
] as const;

export const exp3VideoByEmbodiment: Record<string, string> = Object.fromEntries(
  embodiments.map((embodiment) => [embodiment.id, `/static/publication/exp3/${embodiment.id}.mp4`]),
);
