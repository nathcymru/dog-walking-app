import React from 'react';

const WizardProgress = ({ currentStep, totalSteps = 4, completedSteps = [] }) => {
  return (
    <div>
      <div>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = stepNumber === currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div 
                style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCompleted ? 'var(--ion-color-success)' : isCurrent ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
                  color: isCompleted || isCurrent ? 'white' : 'var(--ion-color-dark)',
                  lineHeight: '40px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div 
                  style={{
                    display: 'inline-block',
                    width: '80px',
                    height: '2px',
                    background: isCompleted ? 'var(--ion-color-success)' : 'var(--ion-color-light)',
                    verticalAlign: 'middle',
                    margin: '0 10px'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: 'var(--ion-color-medium)' }}>
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default WizardProgress;
