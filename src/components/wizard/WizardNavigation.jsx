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
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderTop: '1px solid var(--ion-color-light)' }}>
      <IonButton 
        fill="outline"
        disabled={currentStep === 1}
        onClick={onBack}
        type="button"
        style={{ pointerEvents: 'auto' }}
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
      >
        {isLastStep ? 'Review' : 'Next'}
        {!isLastStep && <IonIcon slot="end" icon={arrowForward} />}
      </IonButton>
    </div>
  );
};

export default WizardNavigation;
