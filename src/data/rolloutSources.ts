export type RolloutSource = { id: string; experiment: number; taskId: string; policyId: string; controllerId: string; embodimentId: string; success: boolean; kind: string; note: string; mediaPath: string };

export const rolloutSources: RolloutSource[] = [
  {
    "id": "exp1-lemon-harvesting-act",
    "experiment": 1,
    "taskId": "lemon-harvesting",
    "policyId": "act",
    "controllerId": "ee-ik-pid",
    "embodimentId": "fa-hexa",
    "success": false,
    "kind": "Direct policy rollout",
    "note": "Direct ACT execution does not complete Lemon Harvesting.",
    "mediaPath": "/static/publication/exp1/lemon-harvesting/act.mp4"
  },
  {
    "id": "exp1-lemon-harvesting-dp",
    "experiment": 1,
    "taskId": "lemon-harvesting",
    "policyId": "dp",
    "controllerId": "ee-ik-pid",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Policy-generated trajectory replay",
    "note": "Successful DP-generated EE trajectory replayed through HexaScorpion Abs-PID.",
    "mediaPath": "/static/publication/exp1/lemon-harvesting/dp.mp4"
  },
  {
    "id": "exp1-lemon-harvesting-pi05",
    "experiment": 1,
    "taskId": "lemon-harvesting",
    "policyId": "pi05",
    "controllerId": "ee-ik-pid",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Policy-generated trajectory replay",
    "note": "Successful pi0.5-generated EE trajectory replayed through HexaScorpion Abs-PID; the final command is held to complete release.",
    "mediaPath": "/static/publication/exp1/lemon-harvesting/pi05.mp4"
  },
  {
    "id": "exp2-press-button-dp-ee-ik-pid",
    "experiment": 2,
    "taskId": "press-button",
    "policyId": "dp",
    "controllerId": "ee-ik-pid",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Direct policy rollout",
    "note": "Selected direct DP rollout.",
    "mediaPath": "/static/publication/exp2/press-button/dp/ee-ik-pid.mp4"
  },
  {
    "id": "exp2-press-button-dp-base-pid",
    "experiment": 2,
    "taskId": "press-button",
    "policyId": "dp",
    "controllerId": "base-pid",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Direct policy rollout",
    "note": "Selected direct DP rollout.",
    "mediaPath": "/static/publication/exp2/press-button/dp/base-pid.mp4"
  },
  {
    "id": "exp2-press-button-dp-ee-ik-l1",
    "experiment": 2,
    "taskId": "press-button",
    "policyId": "dp",
    "controllerId": "ee-ik-l1",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Direct policy rollout",
    "note": "Selected direct DP rollout.",
    "mediaPath": "/static/publication/exp2/press-button/dp/ee-ik-l1.mp4"
  },
  {
    "id": "exp2-press-button-dp-base-l1",
    "experiment": 2,
    "taskId": "press-button",
    "policyId": "dp",
    "controllerId": "base-l1",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Direct policy rollout",
    "note": "Selected direct DP rollout.",
    "mediaPath": "/static/publication/exp2/press-button/dp/base-l1.mp4"
  },
  {
    "id": "exp2-press-button-dp-ee-mpc",
    "experiment": 2,
    "taskId": "press-button",
    "policyId": "dp",
    "controllerId": "ee-mpc",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Direct policy rollout",
    "note": "Selected direct DP rollout.",
    "mediaPath": "/static/publication/exp2/press-button/dp/ee-mpc.mp4"
  },
  {
    "id": "exp2-push-slider-dp-ee-ik-pid",
    "experiment": 2,
    "taskId": "push-slider",
    "policyId": "dp",
    "controllerId": "ee-ik-pid",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Direct policy rollout",
    "note": "Selected direct DP rollout.",
    "mediaPath": "/static/publication/exp2/push-slider/dp/ee-ik-pid.mp4"
  },
  {
    "id": "exp2-push-slider-dp-ee-ik-l1",
    "experiment": 2,
    "taskId": "push-slider",
    "policyId": "dp",
    "controllerId": "ee-ik-l1",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Direct policy rollout",
    "note": "Selected direct DP rollout.",
    "mediaPath": "/static/publication/exp2/push-slider/dp/ee-ik-l1.mp4"
  },
  {
    "id": "exp2-push-slider-dp-ee-mpc",
    "experiment": 2,
    "taskId": "push-slider",
    "policyId": "dp",
    "controllerId": "ee-mpc",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Controller proxy",
    "note": "Successful PID-generated EE command trace replayed through MPC with a 5 cm terminal push extension. This demonstrates controller execution, not policy-driven MPC success.",
    "mediaPath": "/static/publication/exp2/push-slider/dp/ee-mpc.mp4"
  },
  {
    "id": "exp2-push-slider-dp-base-pid",
    "experiment": 2,
    "taskId": "push-slider",
    "policyId": "dp",
    "controllerId": "base-pid",
    "embodimentId": "fa-hexa",
    "success": false,
    "kind": "Direct policy rollout",
    "note": "Selected direct DP rollout.",
    "mediaPath": "/static/publication/exp2/push-slider/dp/base-pid.mp4"
  },
  {
    "id": "exp2-push-slider-dp-base-l1",
    "experiment": 2,
    "taskId": "push-slider",
    "policyId": "dp",
    "controllerId": "base-l1",
    "embodimentId": "fa-hexa",
    "success": false,
    "kind": "Direct policy rollout",
    "note": "Selected failed rollout; the paper reports 16.7% success, so this does not imply every rollout fails.",
    "mediaPath": "/static/publication/exp2/push-slider/dp/base-l1.mp4"
  },
  {
    "id": "exp3-push-slider-ua-quad",
    "experiment": 3,
    "taskId": "push-slider",
    "policyId": "scripted",
    "controllerId": "ee-ik-pid",
    "embodimentId": "ua-quad",
    "success": true,
    "kind": "Scripted command",
    "note": "Synchronized Push Slider command; scene-only view.",
    "mediaPath": "/static/publication/exp3/ua-quad.mp4"
  },
  {
    "id": "exp3-push-slider-ua-hexa",
    "experiment": 3,
    "taskId": "push-slider",
    "policyId": "scripted",
    "controllerId": "ee-ik-pid",
    "embodimentId": "ua-hexa",
    "success": true,
    "kind": "Scripted command",
    "note": "Synchronized Push Slider command; scene-only view.",
    "mediaPath": "/static/publication/exp3/ua-hexa.mp4"
  },
  {
    "id": "exp3-push-slider-fa-hexa",
    "experiment": 3,
    "taskId": "push-slider",
    "policyId": "scripted",
    "controllerId": "ee-ik-pid",
    "embodimentId": "fa-hexa",
    "success": true,
    "kind": "Scripted command",
    "note": "Synchronized Push Slider command; scene-only view.",
    "mediaPath": "/static/publication/exp3/fa-hexa.mp4"
  },
  {
    "id": "exp3-push-slider-omni-hexa",
    "experiment": 3,
    "taskId": "push-slider",
    "policyId": "scripted",
    "controllerId": "ee-ik-pid",
    "embodimentId": "omni-hexa",
    "success": true,
    "kind": "Scripted command",
    "note": "Synchronized Push Slider command; scene-only view.",
    "mediaPath": "/static/publication/exp3/omni-hexa.mp4"
  }
];

export const experiment1RolloutSources = rolloutSources.filter(source => source.experiment === 1);
export const experiment2RolloutSources = rolloutSources.filter(source => source.experiment === 2);
