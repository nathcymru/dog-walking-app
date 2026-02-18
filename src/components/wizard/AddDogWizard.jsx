import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonToast,
  IonFooter,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import WizardProgress from './WizardProgress';
import WizardNavigation from './WizardNavigation';
import Step1DogProfile from './Step1DogProfile';
import Step2WalkSetup from './Step2WalkSetup';
import Step3HealthVetInsurance from './Step3HealthVetInsurance';
import Step4Review from './Step4Review';

const AddDogWizard = ({ 
  isOpen, 
  onClose, 
  onSave,
  isAdmin,
  user,
  clients = []
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', color: 'danger' });

  const draftKey = `addDogDraft_${isAdmin ? 'admin' : user?.id || 'unknown'}`;

  function getInitialFormData() {
    return {
      // Step 1: Dog Profile
      client_id: isAdmin ? '' : user?.id || '',
      profile_photo_url: '',
      name: '',
      breed: '',
      date_of_birth: '',
      age: '',
      sex: '',
      microchipped: '',
      microchip_number: '',
      
      // Step 2: Walk Setup
      handling_requirement: '',
      walk_type_preference: '',
      eligible_for_group_walk: false,
      eligible_for_private_walk: true,
      recall_reliability: '',
      reactivity_flags: [],
      reactivity_other_details: '',
      handling_notes: '',
      
      // Step 3: Health, Vet & Insurance
      medical_conditions: '',
      medications: '',
      allergies: '',
      vet_practice_name: '',
      vet_phone: '',
      insurance_status: '',
      insurance_provider: '',
      insurance_policy_number: '',
    };
  }

  // Load draft from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setFormData(draft.formData || getInitialFormData());
          setCurrentStep(draft.currentStep || 1);
          setCompletedSteps(draft.completedSteps || []);
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [isOpen, draftKey]);

  // Save draft to localStorage on any change
  useEffect(() => {
    if (isOpen) {
      const draft = {
        formData,
        currentStep,
        completedSteps,
        timestamp: Date.now(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
  }, [formData, currentStep, completedSteps, isOpen, draftKey]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Admin must select owner
      if (isAdmin && !formData.client_id) {
        newErrors.client_id = 'Owner selection is required';
      }
      
      // Dog name required
      if (!formData.name || formData.name.trim().length < 2 || formData.name.trim().length > 40) {
        newErrors.name = 'Dog name is required (2-40 characters)';
      }
      
      // Breed required
      if (!formData.breed || formData.breed.trim().length < 2 || formData.breed.trim().length > 60) {
        newErrors.breed = 'Breed is required (2-60 characters)';
      }
      
      // DOB or Age required
      if (!formData.date_of_birth && !formData.age) {
        newErrors.date_of_birth = 'Date of birth or age is required';
      }
      
      // Validate DOB not in future
      if (formData.date_of_birth) {
        const dob = new Date(formData.date_of_birth);
        const today = new Date();
        if (dob > today) {
          newErrors.date_of_birth = 'Date of birth cannot be in the future';
        }
      }
      
      // Validate age range
      if (formData.age) {
        const age = parseInt(formData.age);
        if (isNaN(age) || age < 0 || age > 30) {
          newErrors.age = 'Age must be between 0 and 30';
        }
      }
      
      // Sex required
      if (!formData.sex) {
        newErrors.sex = 'Sex is required';
      }
      
      // Microchipped required
      if (!formData.microchipped) {
        newErrors.microchipped = 'Microchip status is required';
      }
      
      // Microchip number required if Yes
      if (formData.microchipped === 'Yes') {
        if (!formData.microchip_number || formData.microchip_number.length !== 15) {
          newErrors.microchip_number = 'Microchip number must be exactly 15 digits';
        }
      }
    }

    if (step === 2) {
      // Handling requirement required
      if (!formData.handling_requirement) {
        newErrors.handling_requirement = 'Handling requirement is required';
      }
      
      // Walk type preference required
      if (!formData.walk_type_preference) {
        newErrors.walk_type_preference = 'Walk type preference is required';
      }
      
      // Recall reliability required
      if (!formData.recall_reliability) {
        newErrors.recall_reliability = 'Recall reliability is required';
      }
      
      // If reactivity includes Other, details required
      if (formData.reactivity_flags?.includes('Other') && !formData.reactivity_other_details) {
        newErrors.reactivity_other_details = 'Please provide details about other reactivity';
      }
    }

    if (step === 3) {
      // Insurance status required
      if (!formData.insurance_status) {
        newErrors.insurance_status = 'Insurance status is required';
      }
      
      // If insurance is Yes, provider required
      if (formData.insurance_status === 'Yes' && !formData.insurance_provider) {
        newErrors.insurance_provider = 'Insurance provider is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setToast({ 
        show: true, 
        message: 'Please fix validation errors before proceeding', 
        color: 'danger' 
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEdit = (step) => {
    setCurrentStep(step);
  };

  const handleSave = async () => {
    // Final validation for all steps
    const allValid = [1, 2, 3].every(step => validateStep(step));
    
    if (!allValid) {
      setToast({ 
        show: true, 
        message: 'Please complete all required fields', 
        color: 'danger' 
      });
      return;
    }

    try {
      // Prepare data for API
      const dataToSave = {
        ...formData,
        // Normalize vet phone (strip spaces)
        vet_phone: formData.vet_phone ? formData.vet_phone.replace(/\s/g, '') : '',
        // Convert reactivity_flags to JSON string
        reactivity_flags: JSON.stringify(formData.reactivity_flags || []),
        // Ensure booleans for eligibility
        eligible_for_group_walk: formData.eligible_for_group_walk ? 1 : 0,
        eligible_for_private_walk: formData.eligible_for_private_walk ? 1 : 0,
      };

      await onSave(dataToSave);
      
      // Clear draft from localStorage
      localStorage.removeItem(draftKey);
      
      // Reset form
      setFormData(getInitialFormData());
      setCurrentStep(1);
      setCompletedSteps([]);
      setErrors({});
    } catch (error) {
      setToast({ 
        show: true, 
        message: error.message || 'Failed to save dog', 
        color: 'danger' 
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  const canProceed = () => {
    // For steps 1-3, just check if there are no errors currently shown
    // Validation happens on Next click
    return true;
  };

  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={handleClose}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Dog</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={4}
          completedSteps={completedSteps}
        />

        <div className="wizard-content">
          {currentStep === 1 && (
            <Step1DogProfile
              formData={formData}
              onChange={handleChange}
              errors={errors}
              isAdmin={isAdmin}
              clients={clients}
            />
          )}
          
          {currentStep === 2 && (
            <Step2WalkSetup
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          )}
          
          {currentStep === 3 && (
            <Step3HealthVetInsurance
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          )}
          
          {currentStep === 4 && (
            <Step4Review
              formData={formData}
              onEdit={handleEdit}
              isAdmin={isAdmin}
              clients={clients}
            />
          )}
        </div>
      </IonContent>

      {currentStep < 4 ? (
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              {currentStep > 1 && (
                <IonButton onClick={handleBack}>Back</IonButton>
              )}
            </IonButtons>
            <IonButtons slot="end">
              <IonButton strong onClick={handleNext}>
                {currentStep === 3 ? 'Review' : 'Next'}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      ) : (
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => setCurrentStep(3)}>Back</IonButton>
              <IonButton strong onClick={handleSave}>Save Dog</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      )}

      <IonToast
        isOpen={toast.show}
        message={toast.message}
        duration={3000}
        color={toast.color}
        onDidDismiss={() => setToast({ ...toast, show: false })}
      />
    </IonModal>
  );
};

export default AddDogWizard;
