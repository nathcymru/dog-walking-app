import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonAlert,
} from '@ionic/react';
import { arrowBack, arrowForward, save, close as closeIcon } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import WizardProgress from '../../components/wizard/WizardProgress';
import Step1DogProfile from '../../components/wizard/Step1DogProfile';
import Step2WalkSetup from '../../components/wizard/Step2WalkSetup';
import Step3HealthVetInsurance from '../../components/wizard/Step3HealthVetInsurance';
import Step4Review from '../../components/wizard/Step4Review';

export default function PetForm() {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { user } = useAuth();
  const isEdit = !!id;
  const isAdmin = location.pathname.startsWith('/admin');

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});

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

  const breadcrumbItems = [
    { label: isAdmin ? 'Admin' : 'Client', path: isAdmin ? '/admin' : '/client' },
    { label: 'Pets', path: isAdmin ? '/admin/pets' : '/client/pets' },
    { label: isEdit ? 'Edit Pet' : 'New Pet', path: location.pathname }
  ];

  useEffect(() => {
    if (isAdmin) {
      fetchClients();
    }
    if (isEdit) {
      fetchPet();
    }
  }, [id, isAdmin]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setClients(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
    }
  };

  const fetchPet = async () => {
    try {
      const apiPath = isAdmin ? `/api/admin/pets/${id}` : `/api/client/pets/${id}`;
      const response = await fetch(apiPath, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          client_id: data.client_id || '',
          profile_photo_url: data.profile_photo_url || '',
          name: data.name || '',
          breed: data.breed || '',
          date_of_birth: data.date_of_birth || '',
          age: data.age || '',
          sex: data.sex || '',
          microchipped: data.microchipped || '',
          microchip_number: data.microchip_number || '',
          handling_requirement: data.handling_requirement || '',
          walk_type_preference: data.walk_type_preference || '',
          eligible_for_group_walk: data.eligible_for_group_walk || false,
          eligible_for_private_walk: data.eligible_for_private_walk !== undefined ? data.eligible_for_private_walk : true,
          recall_reliability: data.recall_reliability || '',
          reactivity_flags: data.reactivity_flags ? JSON.parse(data.reactivity_flags) : [],
          reactivity_other_details: data.reactivity_other_details || '',
          handling_notes: data.handling_notes || '',
          medical_conditions: data.medical_conditions || '',
          medications: data.medications || '',
          allergies: data.allergies || '',
          vet_practice_name: data.vet_practice_name || '',
          vet_phone: data.vet_phone || '',
          insurance_status: data.insurance_status || '',
          insurance_provider: data.insurance_provider || '',
          insurance_policy_number: data.insurance_policy_number || '',
        });
      } else {
        showToast('Failed to load pet', 'danger');
      }
    } catch (error) {
      showToast('Failed to load pet', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
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
      showToast('Please fix validation errors before proceeding', 'danger');
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

  const handleSaveAndExit = async () => {
    // Minimal validation - only require basic fields
    if (isAdmin && !formData.client_id) {
      showToast('Please select a client/owner', 'danger');
      return;
    }
    if (!formData.name || !formData.breed) {
      showToast('Pet name and breed are required', 'danger');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        vet_phone: formData.vet_phone ? formData.vet_phone.replace(/\s/g, '') : '',
        reactivity_flags: JSON.stringify(formData.reactivity_flags || []),
        eligible_for_group_walk: formData.eligible_for_group_walk ? 1 : 0,
        eligible_for_private_walk: formData.eligible_for_private_walk ? 1 : 0,
        status: 'DRAFT', // Mark as draft
      };

      const apiPath = isAdmin ? '/api/admin/pets' : '/api/client/pets';
      const url = isEdit ? `${apiPath}/${id}` : apiPath;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        showToast('Pet saved as draft', 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push(isAdmin ? '/admin/pets' : '/client/pets');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save pet', 'danger');
      }
    } catch (error) {
      showToast('Failed to save pet', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Final validation for all steps
    const allValid = [1, 2, 3].every(step => validateStep(step));
    
    if (!allValid) {
      showToast('Please complete all required fields', 'danger');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        vet_phone: formData.vet_phone ? formData.vet_phone.replace(/\s/g, '') : '',
        reactivity_flags: JSON.stringify(formData.reactivity_flags || []),
        eligible_for_group_walk: formData.eligible_for_group_walk ? 1 : 0,
        eligible_for_private_walk: formData.eligible_for_private_walk ? 1 : 0,
        status: 'ACTIVE', // Mark as active
      };

      const apiPath = isAdmin ? '/api/admin/pets' : '/api/client/pets';
      const url = isEdit ? `${apiPath}/${id}` : apiPath;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        showToast(`Pet ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push(isAdmin ? '/admin/pets' : '/client/pets');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save pet', 'danger');
      }
    } catch (error) {
      showToast('Failed to save pet', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCancelAlert(true);
    } else {
      history.push(isAdmin ? '/admin/pets' : '/client/pets');
    }
  };

  const confirmClose = () => {
    setShowCancelAlert(false);
    history.push(isAdmin ? '/admin/pets' : '/client/pets');
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title={isEdit ? 'Edit Pet' : 'New Pet'} />
        <IonContent>
          <Breadcrumbs items={breadcrumbItems} />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title={isEdit ? 'Edit Pet' : 'New Pet'} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              <WizardProgress 
                currentStep={currentStep} 
                totalSteps={4}
                completedSteps={completedSteps}
              />

              <div style={{ marginTop: '24px' }}>
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

              {/* Primary Navigation */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                {currentStep > 1 && (
                  <IonButton onClick={handleBack} fill="outline">
                    <IonIcon icon={arrowBack} slot="start" />
                    Back
                  </IonButton>
                )}
                
                {currentStep < 4 ? (
                  <IonButton onClick={handleNext} style={{ marginLeft: 'auto' }}>
                    Next
                    <IonIcon icon={arrowForward} slot="end" />
                  </IonButton>
                ) : (
                  <IonButton onClick={handleSubmit} disabled={saving} style={{ marginLeft: 'auto' }}>
                    <IonIcon icon={save} slot="start" />
                    {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                  </IonButton>
                )}
              </div>

              {/* Secondary Controls */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--ion-color-light)', display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                <IonButton onClick={handleSaveAndExit} fill="outline" disabled={saving}>
                  <IonIcon icon={save} slot="start" />
                  Save & Exit
                </IonButton>
                <IonButton onClick={handleClose} fill="clear" color="medium">
                  <IonIcon icon={closeIcon} slot="start" />
                  Close
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={2000}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />

        <IonAlert
          isOpen={showCancelAlert}
          header="Discard changes?"
          message="You have unsaved changes. Are you sure you want to close this form?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setShowCancelAlert(false)
            },
            {
              text: 'Discard',
              role: 'destructive',
              handler: confirmClose
            }
          ]}
          onDidDismiss={() => setShowCancelAlert(false)}
        />
      </IonContent>
    </IonPage>
  );
}
