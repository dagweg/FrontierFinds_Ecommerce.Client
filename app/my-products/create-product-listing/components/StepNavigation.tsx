"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Step } from "./types";

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function StepNavigation({
  steps,
  currentStep,
  onStepChange,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting,
}: StepNavigationProps) {
  const totalSteps = steps.length;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isComplete = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <motion.button
                key={step.id}
                onClick={() => onStepChange(stepNumber)}
                className={cn(
                  "relative w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all",
                  isComplete
                    ? "bg-blue-500 border-blue-500 text-white"
                    : isCurrent
                    ? "bg-white dark:bg-gray-800 border-blue-500 text-blue-500"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isComplete ? <CheckCircle className="w-5 h-5" /> : stepNumber}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Step Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {steps[currentStep - 1]?.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {steps[currentStep - 1]?.description}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? "Publishing..." : "Publish Product"}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
