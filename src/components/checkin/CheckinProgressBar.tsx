import { useNavigate, useSearchParams } from "react-router-dom";

interface CheckinProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const stepRoutes: Record<number, string> = {
  1: "/checkin/gate",
  2: "/checkin/guest-details",
  3: "/checkin/step3",
  4: "/checkin/step4",
  5: "/checkin/step5",
};

const CheckinProgressBar = ({ currentStep, totalSteps = 5 }: CheckinProgressBarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleStepClick = (step: number) => {
    if (step === currentStep) return;
    const route = stepRoutes[step];
    if (route) {
      navigate(`${route}${token ? `?token=${token}` : ""}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <button
          key={step}
          type="button"
          onClick={() => handleStepClick(step)}
          className={`rounded-full transition-all hover:opacity-70 ${
            step === currentStep
              ? "bg-primary w-6 h-2"
              : step < currentStep
              ? "bg-primary w-2 h-2"
              : "bg-border w-2 h-2"
          }`}
          aria-label={`Step ${step}`}
        />
      ))}
    </div>
  );
};

export default CheckinProgressBar;
