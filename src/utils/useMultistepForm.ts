import { type ReactElement, useState } from "react";

export function useMultistepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) {
        console.log(i);
        return i;
      }
      console.log(i + 1);
      return i + 1;
    });
  }

  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) {
        console.log(i);
        return i;
      }
      console.log(i - 1);
      return i - 1;
    });
  }

  return {
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    steps,
    next,
    back,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}
