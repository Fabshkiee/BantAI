import * as FileSystem from "expo-file-system/legacy";

const ONBOARDING_STATE_FILE = `${FileSystem.documentDirectory}bantai_onboarding_state.json`;

type OnboardingState = {
  completed: boolean;
};

async function readOnboardingState(): Promise<OnboardingState | null> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(ONBOARDING_STATE_FILE);
    if (!fileInfo.exists) {
      return null;
    }

    const raw = await FileSystem.readAsStringAsync(ONBOARDING_STATE_FILE);
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;

    return {
      completed: parsed.completed === true,
    };
  } catch {
    return null;
  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const state = await readOnboardingState();
  return state?.completed === true;
}

export async function markOnboardingCompleted(): Promise<void> {
  const payload: OnboardingState = { completed: true };
  await FileSystem.writeAsStringAsync(
    ONBOARDING_STATE_FILE,
    JSON.stringify(payload),
  );
}
