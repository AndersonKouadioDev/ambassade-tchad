import React from "react";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        {[...Array(totalSteps)].map((_, i) => (
          <React.Fragment key={i}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep > i + 1
                  ? "bg-green-500 text-white"
                  : currentStep === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep > i + 1 ? "bg-orange-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;
