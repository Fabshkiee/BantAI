# BantAI

BantAI is an offline-focused Android mobile application designed for disaster risk reduction. Its goal is to allow users to scan areas of a house or building using their smartphone cameras to determine a risk assessment based on detected hazards.

By leveraging a mobile camera, it identifies common hazards such as floor obstructions, exposed wires, or blocked exits. The application evaluates the likelihood of specific disasters—such as fire, earthquakes, or floods—affecting the scanned area, delivering immediate visual feedback and a calculated risk score. All of this functionality works fully offline.

## How It Works

1. **Capture:** The user takes an image of an area inside a building using the app. There are no onboarding or login requirements.
2. **Analyze:** A lightweight, offline script processes the image to identify strictly defined hazards.
3. **Result:** The user is provided with a binary risk output (e.g., "High Risk") and a quantified risk score derived from a standardized Risk Assessment Matrix based on probability and severity.

Visual feedback is provided via high-contrast bounding boxes outlining the identified risks, making it easy to understand what needs attention.

## Tech Stack

This project is built using:

- [React Native](https://reactnative.dev)
- [Expo](https://expo.dev)

## Getting Started

### Prerequisites

- Node.js and npm installed.

### Installation

1. Install project dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

You will see options in the terminal to open the app on an Android emulator or on your physical device using the Expo Go app.

## Project Structure

- **/app**: Contains file-based routing components and screens.
- **/components**: Reusable UI components.
- **/assets**: Application assets like fonts and images.

## Development

You can begin modifying the application by editing files within the **app** directory. The project utilizes Expo Router for file-based routing.
