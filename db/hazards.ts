export type DisasterType = "earthquake" | "typhoon" | "fire";

export const HAZARD_LABELS = {
  OVERLOADED_SOCKET: "overloaded_socket",
  DAMAGED_WIRE: "damaged_wire",
  FLOOR_APPLIANCE: "floor_appliance",
  MAJOR_CRACK: "major_crack",
  MINOR_CRACK: "minor_crack",
  COLLAPSED_STRUCTURE: "collapsed_structure",
  BROKEN_GLASS: "broken_glass",
  ELECTRONIC_HAZARD: "electronic_hazard",
  ELEVATED_BREAKABLES: "elevated_breakables",
  EXPOSED_BREAKER: "exposed_breaker",
  EXPOSED_CEILING_LIGHTS: "exposed_ceiling_lights",
  HEAVY_WOODEN_FURNITURE: "heavy_wooden_furniture",
  OPEN_FLAME_HAZARD: "open_flame_hazard",
} as const;

export type HazardLabel = (typeof HAZARD_LABELS)[keyof typeof HAZARD_LABELS];

export type HazardTypeSeed = {
  name: HazardLabel;
  category: string;
  default_severity: "low" | "medium" | "high" | "critical";
  description: string;
  recommendation: string;
  disasterTypes: DisasterType[];
};

export const SEVERITY_SCORES = {
  low: 25,
  medium: 50,
  high: 75,
  critical: 100,
} as const;

export const CATEGORY_WEIGHTS: Record<string, number> = {
  fire: 0.3,
  structural: 0.25,
  electrical: 0.25,
  trip: 0.2,
};

export const HAZARD_DISPLAY_NAMES: Record<HazardLabel, string> = {
  [HAZARD_LABELS.OVERLOADED_SOCKET]: "Overloaded Socket",
  [HAZARD_LABELS.DAMAGED_WIRE]: "Damaged Wire",
  [HAZARD_LABELS.FLOOR_APPLIANCE]: "Floor Appliance",
  [HAZARD_LABELS.MAJOR_CRACK]: "Major Crack",
  [HAZARD_LABELS.MINOR_CRACK]: "Minor Crack",
  [HAZARD_LABELS.COLLAPSED_STRUCTURE]: "Collapsed Structure",
  [HAZARD_LABELS.BROKEN_GLASS]: "Broken Glass",
  [HAZARD_LABELS.ELECTRONIC_HAZARD]: "Electronic Hazard",
  [HAZARD_LABELS.ELEVATED_BREAKABLES]: "Elevated Breakables",
  [HAZARD_LABELS.EXPOSED_BREAKER]: "Exposed Breaker",
  [HAZARD_LABELS.EXPOSED_CEILING_LIGHTS]: "Exposed Ceiling Lights",
  [HAZARD_LABELS.HEAVY_WOODEN_FURNITURE]: "Heavy Wooden Furniture",
  [HAZARD_LABELS.OPEN_FLAME_HAZARD]: "Open Flame Hazard",
};

export const HAZARD_TYPES: HazardTypeSeed[] = [
  {
    name: HAZARD_LABELS.OVERLOADED_SOCKET,
    category: "electrical",
    default_severity: "high",
    description:
      "Too many devices plugged into a single socket or extension strip.",
    recommendation:
      "Distribute devices across outlets and avoid overloading a single socket.",
    disasterTypes: ["fire"],
  },
  {
    name: HAZARD_LABELS.DAMAGED_WIRE,
    category: "electrical",
    default_severity: "critical",
    description: "Bare, frayed, or visibly damaged wiring is present.",
    recommendation:
      "Replace or isolate damaged wiring immediately and consult an electrician.",
    disasterTypes: ["fire", "earthquake"],
  },
  {
    name: HAZARD_LABELS.FLOOR_APPLIANCE,
    category: "trip",
    default_severity: "medium",
    description:
      "An appliance or its cable is placed where people may trip over it.",
    recommendation: "Move the appliance and route cables away from walkways.",
    disasterTypes: ["earthquake"],
  },
  {
    name: HAZARD_LABELS.MAJOR_CRACK,
    category: "structural",
    default_severity: "critical",
    description:
      "A large crack is visible in a wall, ceiling, or foundation surface.",
    recommendation:
      "Restrict access and have the structure assessed by a qualified professional.",
    disasterTypes: ["earthquake"],
  },
  {
    name: HAZARD_LABELS.MINOR_CRACK,
    category: "structural",
    default_severity: "medium",
    description:
      "A smaller crack is visible and may require monitoring or repair.",
    recommendation: "Monitor the crack and repair it before it worsens.",
    disasterTypes: ["earthquake"],
  },
  {
    name: HAZARD_LABELS.COLLAPSED_STRUCTURE,
    category: "structural",
    default_severity: "critical",
    description: "A structural element appears collapsed, broken, or unstable.",
    recommendation:
      "Keep clear of the area and contact emergency or structural support services.",
    disasterTypes: ["earthquake"],
  },
  {
    name: HAZARD_LABELS.BROKEN_GLASS,
    category: "trip",
    default_severity: "medium",
    description:
      "Broken glass or sharp fragments are visible on the floor or surfaces.",
    recommendation:
      "Clean up the broken glass carefully and dispose of it safely.",
    disasterTypes: ["earthquake", "typhoon"],
  },
  {
    name: HAZARD_LABELS.ELECTRONIC_HAZARD,
    category: "electrical",
    default_severity: "high",
    description:
      "An electronic device, charger, or power source looks unsafe or misused.",
    recommendation:
      "Disconnect the device and inspect it before using it again.",
    disasterTypes: ["fire"],
  },
  {
    name: HAZARD_LABELS.ELEVATED_BREAKABLES,
    category: "structural",
    default_severity: "medium",
    description:
      "Breakable objects are stored in a high position where they may fall.",
    recommendation: "Move breakables to a secure, lower location.",
    disasterTypes: ["earthquake"],
  },
  {
    name: HAZARD_LABELS.EXPOSED_BREAKER,
    category: "electrical",
    default_severity: "critical",
    description:
      "A breaker panel or electrical distribution component is exposed.",
    recommendation:
      "Restrict access and have the electrical panel covered or repaired immediately.",
    disasterTypes: ["fire", "earthquake"],
  },
  {
    name: HAZARD_LABELS.EXPOSED_CEILING_LIGHTS,
    category: "electrical",
    default_severity: "high",
    description: "Ceiling lights or fixtures are exposed, loose, or damaged.",
    recommendation:
      "Repair or cover the fixture before using the area normally.",
    disasterTypes: ["earthquake"],
  },
  {
    name: HAZARD_LABELS.HEAVY_WOODEN_FURNITURE,
    category: "structural",
    default_severity: "high",
    description: "Tall or heavy wooden furniture could tip over or fall.",
    recommendation: "Anchor the furniture securely to prevent tipping.",
    disasterTypes: ["earthquake"],
  },
  {
    name: HAZARD_LABELS.OPEN_FLAME_HAZARD,
    category: "fire",
    default_severity: "critical",
    description:
      "An open flame or ignition source is present near combustibles.",
    recommendation:
      "Extinguish the flame and keep combustible materials away from heat sources.",
    disasterTypes: ["fire"],
  },
];
