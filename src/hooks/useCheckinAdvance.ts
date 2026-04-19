import { useTranslation } from "react-i18next";

import { useCompleteCheckin } from "@/hooks/useCheckinResponse";
import { type CheckinStep, useCheckinNavigation } from "@/hooks/useCheckinNavigation";

type AdvanceableCheckinStep = Exclude<CheckinStep, "success">;

export function useCheckinAdvance() {
  const { t } = useTranslation();
  const { token, getNextStep, goToNextStep } = useCheckinNavigation();
  const completeCheckin = useCompleteCheckin();

  const advanceFromStep = async (currentStep: AdvanceableCheckinStep) => {
    const nextStep = getNextStep(currentStep);

    if (nextStep === "success") {
      if (!token) {
        throw new Error("Missing check-in token");
      }

      const result = await completeCheckin.mutateAsync({ token });

      if (!result.synced) {
        throw new Error(t("checkin.other.failedToComplete"));
      }
    }

    goToNextStep(currentStep);
  };

  return {
    advanceFromStep,
    isAdvancing: completeCheckin.isPending,
  };
}
