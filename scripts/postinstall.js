// Post-install script to patch native module build configurations
// Adds CMake linker flags to ensure proper C++ standard library compilation

const fs = require("fs");
const path = require("path");

const patches = [
  {
    file: "node_modules/react-native-gesture-handler/android/build.gradle",
    search: '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"',
    replace:
      '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",\n                            "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                            "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm"',
    description: "react-native-gesture-handler CMake linker flags",
  },
  {
    file: "node_modules/vision-camera-resize-plugin/android/build.gradle",
    search: 'arguments "-DANDROID_STL=c++_shared"',
    replace:
      'arguments "-DANDROID_STL=c++_shared",\n                    "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                    "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm"',
    description: "vision-camera-resize-plugin CMake linker flags",
  },
  {
    file: "node_modules/react-native-worklets-core/android/build.gradle",
    search: 'arguments "-DANDROID_STL=c++_shared"',
    replace:
      'arguments "-DANDROID_STL=c++_shared",\n                    "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                    "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm"',
    description: "react-native-worklets-core CMake linker flags",
  },
  {
    file: "node_modules/expo-modules-core/android/build.gradle",
    search: 'arguments "-DANDROID_STL=c++_shared"',
    replace:
      'arguments "-DANDROID_STL=c++_shared",\n                    "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                    "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm"',
    description: "expo-modules-core CMake linker flags",
  },
  {
    file: "node_modules/react-native-worklets/android/build.gradle",
    search: 'arguments "-DANDROID_STL=c++_shared"',
    replace:
      'arguments "-DANDROID_STL=c++_shared",\n                    "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                    "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm"',
    description: "react-native-worklets CMake linker flags",
  },
  {
    file: "node_modules/react-native-screens/android/build.gradle",
    search: 'arguments "-DANDROID_STL=c++_shared"',
    replace:
      'arguments "-DANDROID_STL=c++_shared",\n                    "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                    "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm"',
    description: "react-native-screens CMake linker flags",
  },
  {
    file: "node_modules/react-native-fast-tflite/android/build.gradle",
    search: '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"',
    replace:
      '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",\n                "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm"',
    description: "react-native-fast-tflite CMake linker flags",
  },
  {
    file: "node_modules/react-native-reanimated/android/build.gradle",
    search: '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",',
    replace:
      '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",\n                        "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                        "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm",',
    description: "react-native-reanimated CMake linker flags",
  },
  {
    file: "node_modules/react-native-vision-camera/android/build.gradle",
    search: '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"',
    replace:
      '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",\n                "-DCMAKE_SHARED_LINKER_FLAGS=-lc++_shared -latomic -lm",\n                "-DCMAKE_EXE_LINKER_FLAGS=-lc++_shared -latomic -lm"',
    description: "react-native-vision-camera CMake linker flags",
  },
];

patches.forEach((patch) => {
  const filePath = path.join(__dirname, "..", patch.file);

  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf8");

      // Only apply patch if not already applied
      if (!content.includes("CMAKE_SHARED_LINKER_FLAGS")) {
        content = content.replace(patch.search, patch.replace);
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✓ Patched ${patch.description}`);
      } else {
        console.log(`✓ Already patched: ${patch.description}`);
      }
    }
  } catch (error) {
    console.error(`⚠ Failed to patch ${patch.file}: ${error.message}`);
  }
});


