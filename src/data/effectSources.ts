export type EffectPanelId =
  | "wind"
  | "ground-effect"
  | "near-wall-effect"
  | "actuator-constraints";

export type EffectSourceStatus = "planned" | "captured" | "verified";

export type EffectPanel = {
  id: EffectPanelId;
  index: string;
  label: string;
  summary: string;
  interaction: "paired-comparison" | "variant-selector";
};

export type EffectMetric = {
  label: string;
  value: string;
};

export type EffectSource = {
  id: string;
  panelId: EffectPanelId;
  category: "wind" | "ground-effect" | "near-wall-effect" | "actuator-response" | "rotor-saturation";
  state: string;
  label: string;
  mechanisms: string[];
  scenario: string;
  evidence: string;
  mediaPath: string | null;
  status: EffectSourceStatus;
  metrics?: EffectMetric[];
};

export const effectPanels: EffectPanel[] = [
  {
    "id": "wind",
    "index": "01",
    "label": "Wind",
    "summary": "External force applied to the multirotor base.",
    "interaction": "variant-selector"
  },
  {
    "id": "ground-effect",
    "index": "02",
    "label": "Ground effect",
    "summary": "Thrust augmentation varies with ground proximity.",
    "interaction": "variant-selector"
  },
  {
    "id": "near-wall-effect",
    "index": "03",
    "label": "Near-wall effect",
    "summary": "Rotor forces vary with wall standoff.",
    "interaction": "variant-selector"
  },
  {
    "id": "actuator-constraints",
    "index": "04",
    "label": "Actuator response",
    "summary": "Motor delay alters transient tracking.",
    "interaction": "variant-selector"
  }
];
export const effectSources: EffectSource[] = [
  {
    "id": "wind-00",
    "panelId": "wind",
    "category": "wind",
    "state": "00",
    "label": "0 N",
    "mechanisms": [
      "Wind"
    ],
    "scenario": "Applied horizontal force",
    "evidence": "The yellow ball marks the commanded end-effector position; the red marker shows its measured position. The inset shows the top view. No wind force is applied.",
    "mediaPath": "/static/publication/effects/wind/00__pip.mp4",
    "status": "verified"
  },
  {
    "id": "wind-05",
    "panelId": "wind",
    "category": "wind",
    "state": "05",
    "label": "5 N",
    "mechanisms": [
      "Wind"
    ],
    "scenario": "Applied horizontal force",
    "evidence": "The yellow ball marks the commanded end-effector position; the red marker shows its measured position. Arrows indicate the applied wind direction, starting at 2 s. The inset shows the top view.",
    "mediaPath": "/static/publication/effects/wind/05__pip.mp4",
    "status": "verified"
  },
  {
    "id": "wind-10",
    "panelId": "wind",
    "category": "wind",
    "state": "10",
    "label": "10 N",
    "mechanisms": [
      "Wind"
    ],
    "scenario": "Applied horizontal force",
    "evidence": "The yellow ball marks the commanded end-effector position; the red marker shows its measured position. Arrows indicate the applied wind direction, starting at 2 s. The inset shows the top view.",
    "mediaPath": "/static/publication/effects/wind/10__pip.mp4",
    "status": "verified"
  },
  {
    "id": "wind-15",
    "panelId": "wind",
    "category": "wind",
    "state": "15",
    "label": "15 N",
    "mechanisms": [
      "Wind"
    ],
    "scenario": "Applied horizontal force",
    "evidence": "The yellow ball marks the commanded end-effector position; the red marker shows its measured position. Arrows indicate wind direction, starting at 2 s; the inset is the top view. At 15 N, rotor saturation causes altitude loss.",
    "mediaPath": "/static/publication/effects/wind/15__pip.mp4",
    "status": "verified"
  },
  {
    "id": "ground-effect-100",
    "panelId": "ground-effect",
    "category": "ground-effect",
    "state": "100",
    "label": "1.00 m",
    "mechanisms": [
      "Ground effect"
    ],
    "scenario": "Commanded base height",
    "evidence": "Yellow rays and dots mark rotor-to-ground distance measurements, not forces. The red dashed line is commanded base height; white is measured height, with their gap in millimetres.",
    "mediaPath": "/static/publication/effects/ground-effect/100__annotated.mp4",
    "status": "verified"
  },
  {
    "id": "ground-effect-046",
    "panelId": "ground-effect",
    "category": "ground-effect",
    "state": "046",
    "label": "0.46 m",
    "mechanisms": [
      "Ground effect"
    ],
    "scenario": "Commanded base height",
    "evidence": "Yellow rays and dots mark rotor-to-ground distance measurements, not forces. The red dashed line is commanded base height; white is measured height, with their gap in millimetres.",
    "mediaPath": "/static/publication/effects/ground-effect/046__annotated.mp4",
    "status": "verified"
  },
  {
    "id": "ground-effect-031",
    "panelId": "ground-effect",
    "category": "ground-effect",
    "state": "031",
    "label": "0.31 m",
    "mechanisms": [
      "Ground effect"
    ],
    "scenario": "Commanded base height",
    "evidence": "Yellow rays and dots mark rotor-to-ground distance measurements, not forces. The red dashed line is commanded base height; white is measured height, with their gap in millimetres.",
    "mediaPath": "/static/publication/effects/ground-effect/031__annotated.mp4",
    "status": "verified"
  },
  {
    "id": "ground-effect-023",
    "panelId": "ground-effect",
    "category": "ground-effect",
    "state": "023",
    "label": "0.23 m",
    "mechanisms": [
      "Ground effect"
    ],
    "scenario": "Commanded base height",
    "evidence": "Yellow rays and dots mark rotor-to-ground distance measurements, not forces. The red dashed line is commanded base height; white is measured height, with their gap in millimetres.",
    "mediaPath": "/static/publication/effects/ground-effect/023__annotated.mp4",
    "status": "verified"
  },
  {
    "id": "near-wall-effect-110",
    "panelId": "near-wall-effect",
    "category": "near-wall-effect",
    "state": "110",
    "label": "1.10 m",
    "mechanisms": [
      "Near-wall effect"
    ],
    "scenario": "Base-centre distance to wall",
    "evidence": "The red dashed line marks the commanded base position; white marks the measured position. The labelled gap is displacement toward the wall in millimetres. Distance settings are measured from the base centre to the wall.",
    "mediaPath": "/static/publication/effects/near-wall/110__annotated.mp4",
    "status": "verified"
  },
  {
    "id": "near-wall-effect-095",
    "panelId": "near-wall-effect",
    "category": "near-wall-effect",
    "state": "095",
    "label": "0.95 m",
    "mechanisms": [
      "Near-wall effect"
    ],
    "scenario": "Base-centre distance to wall",
    "evidence": "The red dashed line marks the commanded base position; white marks the measured position. The labelled gap is displacement toward the wall in millimetres. Distance settings are measured from the base centre to the wall.",
    "mediaPath": "/static/publication/effects/near-wall/095__annotated.mp4",
    "status": "verified"
  },
  {
    "id": "near-wall-effect-080",
    "panelId": "near-wall-effect",
    "category": "near-wall-effect",
    "state": "080",
    "label": "0.80 m",
    "mechanisms": [
      "Near-wall effect"
    ],
    "scenario": "Base-centre distance to wall",
    "evidence": "The red dashed line marks the commanded base position; white marks the measured position. The labelled gap is displacement toward the wall in millimetres. Distance settings are measured from the base centre to the wall.",
    "mediaPath": "/static/publication/effects/near-wall/080__annotated.mp4",
    "status": "verified"
  },
  {
    "id": "near-wall-effect-070",
    "panelId": "near-wall-effect",
    "category": "near-wall-effect",
    "state": "070",
    "label": "0.70 m",
    "mechanisms": [
      "Near-wall effect"
    ],
    "scenario": "Base-centre distance to wall",
    "evidence": "The red dashed line marks the commanded base position; white marks the measured position. The labelled gap is displacement toward the wall in millimetres. Distance settings are measured from the base centre to the wall.",
    "mediaPath": "/static/publication/effects/near-wall/070__annotated.mp4",
    "status": "verified"
  },
  {
    "id": "actuator-constraints-v3-side-by-side",
    "panelId": "actuator-constraints",
    "category": "actuator-response",
    "state": "v3-side-by-side",
    "label": "Model comparison",
    "mechanisms": [
      "Actuator response"
    ],
    "scenario": "Actuator model comparison",
    "evidence": "The left view uses the identified 47.5 ms motor lag. The right plot compares altitude tracking with instantaneous and delayed actuation under the same reference.",
    "mediaPath": "/static/publication/effects/actuator/v3-side-by-side.mp4",
    "status": "verified"
  }
];

export const effectDescriptions: Partial<Record<EffectPanelId, { explanation: string; caption: string }>> = {
  wind: {
    explanation: "Wind acts as an external force on the multirotor base. Rejecting it requires additional rotor thrust; once the rotors saturate, the controller cannot maintain the commanded pose.",
    caption: "The yellow ball marks the desired end-effector position; red marks its measured position. The inset is a top view. Arrows indicate wind direction when force is applied.",
  },
  "ground-effect": {
    explanation: "Ground proximity increases rotor thrust for the same actuator command. The augmentation grows as rotor-to-ground distance decreases.",
    caption: "Yellow rays and dots show rotor-to-ground measurements. Red and white dashed lines mark commanded and measured base height; the gap is labelled in millimetres.",
  },
  "near-wall-effect": {
    explanation: "Nearby walls alter rotor forces, producing an attraction toward the wall that strengthens as clearance decreases.",
    caption: "Red and white dashed lines mark commanded and measured base position. The labelled gap measures displacement toward the wall. Settings give the base-centre distance to the wall.",
  },
};

export const effectInterpretations: Record<string, string> = {
  "wind-00": "Without wind, the end effector stays close to its target.",
  "wind-05": "The controller maintains flight with a small horizontal tracking offset after the force is applied.",
  "wind-10": "The stronger force increases the tracking offset, but the vehicle remains airborne without rotor saturation.",
  "wind-15": "Rotor saturation limits disturbance rejection, producing a large tracking error and altitude loss.",
  "ground-effect-100": "At this height, thrust augmentation is weak and the base stays close to the commanded height.",
  "ground-effect-046": "Additional lift produces a small upward offset from the commanded height.",
  "ground-effect-031": "Stronger thrust augmentation increases the upward offset.",
  "ground-effect-023": "The closest tested hold produces the largest upward offset, while the vehicle remains stable.",
  "near-wall-effect-110": "At this distance, wall attraction produces only a small displacement toward the wall.",
  "near-wall-effect-095": "Wall attraction increases slightly as the base moves closer to the surface.",
  "near-wall-effect-080": "Reduced clearance produces a larger displacement toward the wall, while the controller maintains the hold.",
  "near-wall-effect-070": "The closest tested hold has the largest wallward displacement; the vehicle remains stable.",
};
