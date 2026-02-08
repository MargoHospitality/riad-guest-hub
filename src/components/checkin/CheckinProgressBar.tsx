interface CheckinProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const CheckinProgressBar = ({ currentStep, totalSteps = 5 }: CheckinProgressBarProps) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-2 rounded-full transition-all ${
            step === currentStep
              ? "bg-primary w-6"
              : step < currentStep
              ? "bg-primary w-2"
              : "bg-border w-2"
          }`}
        />
      ))}
    </div>
  );
};

export default CheckinProgressBar;
