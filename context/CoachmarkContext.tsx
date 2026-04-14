import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
} from "react";

type HomeStep = 0 | 1 | 2;
type ScanStep = 0 | 1 | 2 | 3 | 4 | 5;
type Rect = { x: number; y: number; width: number; height: number };

type CoachmarkContextValue = {
  homeStep: HomeStep;
  scanStep: ScanStep;
  showScanFinale: boolean;
  homeScanButtonRect: Rect | null;
  startHomeTour: () => void;
  nextHomeStep: () => void;
  dismissHomeTour: () => void;
  setHomeScanButtonRect: (rect: Rect | null) => void;
  startScanTour: () => void;
  advanceScanStep: () => void;
  dismissScanTour: () => void;
  hideScanFinale: () => void;
};

const CoachmarkContext = createContext<CoachmarkContextValue | null>(null);

export function CoachmarkProvider({ children }: PropsWithChildren) {
  const [homeStep, setHomeStep] = useState<HomeStep>(0);
  const [scanStep, setScanStep] = useState<ScanStep>(0);
  const [homeCompleted, setHomeCompleted] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [showScanFinale, setShowScanFinale] = useState(false);
  const [homeScanButtonRect, setHomeScanButtonRect] = useState<Rect | null>(
    null,
  );

  const startHomeTour = () => {
    if (!homeCompleted && homeStep === 0) {
      setHomeStep(1);
    }
  };

  const nextHomeStep = () => {
    if (homeStep === 1) {
      setHomeStep(2);
      return;
    }
    if (homeStep === 2) {
      setHomeStep(0);
      setHomeCompleted(true);
    }
  };

  const dismissHomeTour = () => {
    setHomeStep(0);
    setHomeCompleted(true);
  };

  const startScanTour = () => {
    if (!scanCompleted && scanStep === 0) {
      setScanStep(1);
    }
  };

  const advanceScanStep = () => {
    if (scanStep === 0) {
      return;
    }
    if (scanStep < 5) {
      setScanStep((scanStep + 1) as ScanStep);
      return;
    }

    setScanStep(0);
    setScanCompleted(true);
    setShowScanFinale(true);
  };

  const dismissScanTour = () => {
    setScanStep(0);
    setScanCompleted(true);
  };

  const hideScanFinale = () => {
    setShowScanFinale(false);
  };

  const value = useMemo(
    () => ({
      homeStep,
      scanStep,
      showScanFinale,
      homeScanButtonRect,
      startHomeTour,
      nextHomeStep,
      dismissHomeTour,
      setHomeScanButtonRect,
      startScanTour,
      advanceScanStep,
      dismissScanTour,
      hideScanFinale,
    }),
    [homeStep, scanStep, showScanFinale, homeScanButtonRect],
  );

  return (
    <CoachmarkContext.Provider value={value}>
      {children}
    </CoachmarkContext.Provider>
  );
}

export function useCoachmarks() {
  const context = useContext(CoachmarkContext);
  if (!context) {
    throw new Error("useCoachmarks must be used inside CoachmarkProvider.");
  }
  return context;
}
