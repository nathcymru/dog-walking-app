import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack, arrowForward } from 'ionicons/icons';

const WizardNavigation = ({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext, 
  canProceed = true,
  isLastStep = false 
}) => {
  return (
    <div className="wizard-navigation">
      <IonButton 
        fill="outline"
        disabled={currentStep === 1}
        onClick={onBack}
        type="button"
        style={{ pointerEvents: 'auto' }}
        className="wizard-nav-button"
      >
        <IonIcon slot="start" icon={arrowBack} />
        Back
      </IonButton>
      
      <IonButton 
        fill="solid"
        disabled={!canProceed}
        onClick={onNext}
        type="button"
        style={{ pointerEvents: 'auto' }}
        className="wizard-nav-button wizard-nav-next"
      >
        {isLastStep ? 'Review' : 'Next'}
        {!isLastStep && <IonIcon slot="end" icon={arrowForward} />}
      </IonButton>
    </div>
  );
};

export default WizardNavigation;
