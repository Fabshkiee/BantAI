# BantAI Project Setup Guide

Welcome to the BantAI project! This guide will help you get the project running locally.

## Prerequisites

Before you start, make sure you have the following installed:

### 1. **Node.js and npm**

- Download from [nodejs.org](https://nodejs.org)
- Choose the **LTS (Long Term Support)** version
- Verify installation by running:
  ```bash
  node --version
  npm --version
  ```

## Getting Started

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd BantAI
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all the required packages listed in `package.json`. This may take a few minutes.

### Step 3: Run the Project (You need Expo Go App)

#### **For Web**

```bash
npx expo start --web
```

This will start the development server and open the app in your browser.

#### **For iOS**

```bash
npx expo start --ios
```

Requires Xcode installed on macOS.

#### **For Android**

```bash
npx expo start --android
```

Requires Android Studio and an Android emulator or device.

#### **Start Menu (Interactive)**

```bash
npx expo start
```

This opens an interactive menu where you can choose between web, iOS, or Android.

## Project Structure

```
BantAI/
├── app/                    # Main app code (Expo Router)
│   ├── _layout.tsx         # Root layout
│   ├── (tabs)/             # Tab-based navigation
│   │   ├── index.tsx       # Home screen
│   │   ├── explore.tsx     # Explore screen
│   │   └── _layout.tsx     # Tabs layout
│   └── +not-found.tsx      # 404 page
├── components/             # Reusable React components
├── assets/                 # Images, fonts, icons
├── globals.css             # Global styles (Tailwind)
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # Code linting rules
```

## Common Commands

| Command                 | What it does                                                   |
| ----------------------- | -------------------------------------------------------------- |
| `npm run web`           | Start the web development server                               |
| `npm start`             | Open interactive menu to choose platform                       |
| `npm run lint`          | Check code for style issues                                    |
| `npm run reset-project` | Reset project to default state                                 |
| `npm install`           | Install dependencies (only needed when `package.json` changes) |

## Tech Stack

- **Framework**: React 19 + React Native
- **Router**: Expo Router (file-based routing)
- **Styling**: Tailwind CSS + NativeWind
- **Language**: TypeScript
- **Build Tool**: Expo

## Useful Tips

1. **File-based Routing**: Routes are automatically created based on your file structure in the `app/` folder.
2. **Hot Reload**: Changes you make are automatically reflected in the browser/app (hot reload).
3. **Global Styles**: All CSS styles defined in `globals.css` are available throughout the app.
4. **Components**: Create reusable components in the `components/` folder.

## Troubleshooting

### Dependencies not installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use

If port 8081 is already in use, npm will ask you to use another port. Just press `Y` to continue.

### Node version issues

Make sure you're using Node.js LTS. Check your version:

```bash
node --version
```

If you have an older version, update it from [nodejs.org](https://nodejs.org).

Relevant documentation:

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
