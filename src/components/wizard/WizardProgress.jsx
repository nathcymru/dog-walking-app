import React from 'react';
import './WizardProgress.css';

const WizardProgress = ({ currentStep, totalSteps = 4, completedSteps = [] }) => {
  return (
    <div className="wizard-progress">
      <div className="wizard-progress-bar">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = stepNumber === currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div 
                className={`wizard-progress-dot ${
                  isCompleted ? 'completed' : isCurrent ? 'current' : 'incomplete'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div 
                  className={`wizard-progress-line ${
                    isCompleted ? 'completed' : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="wizard-progress-label">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default WizardProgress;
