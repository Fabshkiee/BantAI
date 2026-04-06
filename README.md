# BantAI v1.0.0

Technical release documentation for judges and reviewers.

## 1. System Overview

BantAI is an offline Android application for indoor hazard detection and risk evaluation. The app runs object detection on-device, computes room-level risk using severity and spatial relationships, and stores all scan artifacts locally in SQLite.

Core goals:

- Zero-network inference and reporting
- Deterministic hazard-to-risk mapping
- Session-based persistence with reassessment support

## 2. Technical Stack

- React Native 0.81
- Expo SDK 54 with Expo Router
- TensorFlow Lite runtime via react-native-fast-tflite
- SQLite via expo-sqlite
- NativeWind for styling

## 3. Detection Pipeline

The inference pipeline is implemented in hooks/useTFLite.ts.

### 3.1 Model and Input

- TFLite model: model/bantai_model.tflite
- Input size: 640 x 640
- Decoder: jpeg-js
- Supports quantized and float model data paths

### 3.2 SAHI Strategy

- Passes per image: 10 total
- 1 global pass
- 9 sliced passes using a 3x3 grid
- Slice dimensions: 40 percent width x 40 percent height
- Overlap: roughly 25 percent

### 3.3 Post-processing and Hardening

- Confidence thresholds for global and slice passes
- Class-level confidence floors and area floors
- Bounding-box sanity checks: side, area, aspect ratio
- Structural-class exceptions for thin crack boxes
- NMS and semantic duplicate suppression
- Mutually exclusive class arbitration for crack classes
- Class-specific max detections cap

### 3.4 Supported Hazard Classes

13 classes are currently mapped end-to-end:

- overloaded_socket
- damaged_wire
- floor_appliance
- major_crack
- minor_crack
- collapsed_structure
- broken_glass
- electronic_hazard
- elevated_breakables
- exposed_breaker
- exposed_ceiling_lights
- heavy_wooden_furniture
- open_flame_hazard

## 4. Risk Engine

Risk logic is implemented in lib/riskEngine.ts.

### 4.1 Severity Base Values

- critical = 15
- high = 10
- medium = 5
- low = 2

### 4.2 Density Weighting

For each hazard type:

- weighted score = base severity x (1 + (count - 1) x 0.15)

### 4.3 Spatial Multipliers

Additional weighted risk is applied when hazards are close together.

Rules include:

- Fire near heavy wooden furniture: x2.0 interaction boost
- Fire near electrical hazards: x1.8 interaction boost
- Structural clustering: x1.4 interaction boost
- Broken glass contained within elevated breakables shelf: risk reduced

Flood-zone amplification:

- Electrical or floor appliance hazards near bottom 15 percent of frame get additional risk points.

### 4.4 Safety Score Projection

- safety score = clamp(100 - totalRiskScore x 1.3, 0, 100)
- Critical lock conditions are applied for high-density severe findings.

Risk bands:

- Critical: score <= 15 or critical lock
- High: score < 45
- Medium: score < 75
- Low: score < 95
- Safe: score >= 95

## 5. Disaster Context and Guidance

Hazard narrative content is sourced from hazardDictionary.tsx and merged with seed metadata in db/hazards.ts.

UI filter modes:

- earthquake
- typhoon
- fire
- all

Behavior:

- Hazard cards display reason and fix text specific to selected filter.
- all mode uses highest-risk disaster context for generalized reason and fixes.
- Sorting context indicator is shown in report view to explain active narrative mode.

## 6. Local Data Model

SQLite schema is initialized in db/db.ts.

Primary tables:

- scan_sessions
  - photo_path, room_score, risk_variant, status, scanned_at, completed_at
- hazard_types
  - name, category, default_severity, description, recommendation
- detected_hazards
  - session_id, hazard_type_id, severity, label, description, recommendation, is_assessed, bbox

Indexes:

- session and assessed lookups for fast report and history hydration

Data consistency note:

- hazard_types seed rows are upserted on init so severity and metadata updates are propagated across app updates.

## 7. Session Flow

1. Create scan session with status pending.
2. Run inference and generate detections.
3. Insert detections with normalized class mapping and resolved severity.
4. Compute risk and finalize session status.
5. On mark or unmark resolve, recompute room score from remaining active hazards.

## 8. Release Engineering

Target release profile:

- Android arm64-v8a
- R8 and ProGuard enabled
- TFLite resource handling configured for release stability

Build command:

    	cd android
    	./gradlew clean
    	./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a

Output APK:

- android/app/build/outputs/apk/release/app-release.apk

Install command:

    	adb install -r android/app/build/outputs/apk/release/app-release.apk

## 9. Limitations and Scope

- BantAI is a decision-support tool, not a substitute for licensed professional inspection.
- Current detection scope is interior room hazards defined by the 13-class model.
- Performance and confidence depend on image quality, framing, and occlusion.

## 10. Repository Layout

- app: route-based screens and navigation
- components: reusable UI modules
- hooks: inference pipeline and model integration
- lib: spatial math and risk engine
- db: persistence, schema, seed definitions
- model: bundled TFLite model

## Team

Coode Research Department
