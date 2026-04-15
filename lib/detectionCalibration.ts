export const CLASS_CONFIDENCE_PROFILE: Record<string, number> = {
  collapsed_structure: 0.62,
  major_crack: 0.52,
  minor_crack: 0.42,
  exposed_breaker: 0.6,
  open_flame_hazard: 0.6,
  electronic_hazard: 0.6,
  floor_appliance: 0.54,
  damaged_wire: 0.54,
  overloaded_socket: 0.35,
};

export const CLASS_MIN_AREA_PROFILE: Record<string, number> = {
  collapsed_structure: 0.012,
  major_crack: 0.0012,
  minor_crack: 0.0008,
  open_flame_hazard: 0.002,
  exposed_breaker: 0.002,
  overloaded_socket: 0.001,
};

export const CLASS_STRONG_CONFIDENCE_PROFILE: Record<string, number> = {
  collapsed_structure: 0.75,
  major_crack: 0.64,
  minor_crack: 0.58,
  exposed_breaker: 0.75,
  open_flame_hazard: 0.75,
  electronic_hazard: 0.9,
  floor_appliance: 0.7,
  damaged_wire: 0.7,
};
