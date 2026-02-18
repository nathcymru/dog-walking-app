import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonAlert,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import { arrowBack, arrowForward, save, close as closeIcon } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function WalkerForm() {
  const { walkerId } = useParams();
  const history = useHistory();
  const isEdit = !!walkerId;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    preferred_name: '',
    email: '',
    phone_mobile: '',
    phone_alternative: '',
    photo_url: '',
    address_line_1: '',
    town_city: '',
    postcode: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    employment_status: '',
    start_date: '',
    account_status: 'active',
    notes_internal: '',
  });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Walkers', path: '/admin/walkers' },
    { label: isEdit ? 'Edit Walker' : 'New Walker', path: `/admin/walkers/${walkerId || 'new'}` }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchWalker();
    }
  }, [walkerId]);

  const fetchWalker = async () => {
    try {
      const response = await fetch(`/api/admin/walkers/${walkerId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          preferred_name: data.preferred_name || '',
          email: data.email || '',
          phone_mobile: data.phone_mobile || '',
          phone_alternative: data.phone_alternative || '',
          photo_url: data.photo_url || '',
          address_line_1: data.address_line_1 || '',
          town_city: data.town_city || '',
          postcode: data.postcode || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
          employment_status: data.employment_status || '',
          start_date: data.start_date || '',
          account_status: data.account_status || 'active',
          notes_internal: data.notes_internal || '',
        });
      } else {
        showToast('Failed to load walker', 'danger');
      }
    } catch (error) {
      showToast('Failed to load walker', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
  };

  // Validate current step
  const validateStep = (step) => {
    if (step === 1) {
      // Step 1: Identity & Contact
      if (!formData.first_name || formData.first_name.trim().length < 2) {
        showToast('First name is required (min 2 characters)', 'danger');
        return false;
      }
      if (!formData.last_name || formData.last_name.trim().length < 2) {
        showToast('Last name is required (min 2 characters)', 'danger');
        return false;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailPattern.test(formData.email)) {
        showToast('Valid email is required', 'danger');
        return false;
      }
      const phoneDigits = formData.phone_mobile.replace(/\D/g, '');
      if (!formData.phone_mobile || phoneDigits.length < 10) {
        showToast('Valid phone number is required (min 10 digits)', 'danger');
        return false;
      }
    } else if (step === 2) {
      // Step 2: Address & Emergency Contact - all optional, no validation needed
    } else if (step === 3) {
      // Step 3: Employment Details
      if (!formData.employment_status) {
        showToast('Employment status is required', 'danger');
        return false;
      }
      if (!formData.start_date) {
        showToast('Start date is required', 'danger');
        return false;
      }
    }
    return true;
  };

  // Validate all steps before final submit
  const validateAllSteps = () => {
    for (let step = 1; step <= 3; step++) {
      if (!validateStep(step)) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveAndExit = async () => {
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/walkers/${walkerId}` : '/api/admin/walkers';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('Progress saved', 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.goBack();
        }, 1000);
      } else {
        const error = await response.json();
        showToast(error.error || 'Error saving progress', 'danger');
      }
    } catch (error) {
      showToast('Error saving progress', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCloseConfirmation(true);
    } else {
      history.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!validateAllSteps()) {
      showToast('Please complete all required fields', 'danger');
      return;
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/walkers/${walkerId}` : '/api/admin/walkers';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('Walker saved successfully', 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/walkers');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Error saving walker', 'danger');
      }
    } catch (error) {
      showToast('Error saving walker', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title={isEdit ? 'Edit Walker' : 'New Walker'} />
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
      <AppHeader title={isEdit ? 'Edit Walker' : 'New Walker'} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              {/* Step Indicator */}
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <IonText color="medium">
                  <h2>Step {currentStep} of 3</h2>
                </IonText>
                <p style={{ color: 'var(--ion-color-medium)' }}>
                  {currentStep === 1 && 'Identity & Contact'}
                  {currentStep === 2 && 'Address & Emergency Contact'}
                  {currentStep === 3 && 'Employment Details'}
                </p>
              </div>

              {/* Step 1: Identity & Contact */}
              {currentStep === 1 && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">First Name *</IonLabel>
                    <IonInput
                      value={formData.first_name}
                      onIonInput={e => handleChange('first_name', e.detail.value)}
                      placeholder="Enter first name"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Last Name *</IonLabel>
                    <IonInput
                      value={formData.last_name}
                      onIonInput={e => handleChange('last_name', e.detail.value)}
                      placeholder="Enter last name"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Preferred Name</IonLabel>
                    <IonInput
                      value={formData.preferred_name}
                      onIonInput={e => handleChange('preferred_name', e.detail.value)}
                      placeholder="Enter preferred name (optional)"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Email *</IonLabel>
                    <IonInput
                      type="email"
                      value={formData.email}
                      onIonInput={e => handleChange('email', e.detail.value)}
                      placeholder="Enter email address"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Mobile Phone *</IonLabel>
                    <IonInput
                      type="tel"
                      value={formData.phone_mobile}
                      onIonInput={e => handleChange('phone_mobile', e.detail.value)}
                      placeholder="Enter mobile phone number"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Alternative Phone</IonLabel>
                    <IonInput
                      type="tel"
                      value={formData.phone_alternative}
                      onIonInput={e => handleChange('phone_alternative', e.detail.value)}
                      placeholder="Enter alternative phone (optional)"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Photo URL</IonLabel>
                    <IonInput
                      value={formData.photo_url}
                      onIonInput={e => handleChange('photo_url', e.detail.value)}
                      placeholder="Enter photo URL (optional)"
                    />
                  </IonItem>
                </>
              )}

              {/* Step 2: Address & Emergency Contact */}
              {currentStep === 2 && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Address Line 1</IonLabel>
                    <IonInput
                      value={formData.address_line_1}
                      onIonInput={e => handleChange('address_line_1', e.detail.value)}
                      placeholder="Enter address"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Town/City</IonLabel>
                    <IonInput
                      value={formData.town_city}
                      onIonInput={e => handleChange('town_city', e.detail.value)}
                      placeholder="Enter town or city"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Postcode</IonLabel>
                    <IonInput
                      value={formData.postcode}
                      onIonInput={e => handleChange('postcode', e.detail.value)}
                      placeholder="Enter postcode (UK format)"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Emergency Contact Name</IonLabel>
                    <IonInput
                      value={formData.emergency_contact_name}
                      onIonInput={e => handleChange('emergency_contact_name', e.detail.value)}
                      placeholder="Enter emergency contact name"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Emergency Contact Phone</IonLabel>
                    <IonInput
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onIonInput={e => handleChange('emergency_contact_phone', e.detail.value)}
                      placeholder="Enter emergency contact phone"
                    />
                  </IonItem>
                </>
              )}

              {/* Step 3: Employment Details */}
              {currentStep === 3 && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Employment Status *</IonLabel>
                    <IonSelect
                      value={formData.employment_status}
                      onIonChange={e => handleChange('employment_status', e.detail.value)}
                      placeholder="Select employment status"
                    >
                      <IonSelectOption value="employee">Employee</IonSelectOption>
                      <IonSelectOption value="worker">Worker</IonSelectOption>
                      <IonSelectOption value="contractor">Contractor</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Start Date *</IonLabel>
                    <IonInput
                      type="date"
                      value={formData.start_date}
                      onIonInput={e => handleChange('start_date', e.detail.value)}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Account Status</IonLabel>
                    <IonSelect
                      value={formData.account_status}
                      onIonChange={e => handleChange('account_status', e.detail.value)}
                    >
                      <IonSelectOption value="active">Active</IonSelectOption>
                      <IonSelectOption value="suspended">Suspended</IonSelectOption>
                      <IonSelectOption value="left">Left</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Internal Notes</IonLabel>
                    <IonTextarea
                      value={formData.notes_internal}
                      onIonInput={e => handleChange('notes_internal', e.detail.value)}
                      placeholder="Enter any internal notes (not visible to walker)"
                      rows={4}
                    />
                  </IonItem>
                </>
              )}

              {/* Primary Navigation Buttons */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                {currentStep > 1 && (
                  <IonButton onClick={handleBack} fill="outline">
                    <IonIcon icon={arrowBack} slot="start" />
                    Back
                  </IonButton>
                )}
                
                {currentStep < 3 ? (
                  <IonButton onClick={handleNext} style={{ marginLeft: 'auto' }}>
                    Next
                    <IonIcon icon={arrowForward} slot="end" />
                  </IonButton>
                ) : (
                  <IonButton onClick={handleSubmit} disabled={saving} color="primary" style={{ marginLeft: 'auto' }}>
                    <IonIcon icon={save} slot="start" />
                    {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                  </IonButton>
                )}
              </div>

              {/* Secondary Action Buttons */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center', borderTop: '1px solid var(--ion-color-light)', paddingTop: '16px' }}>
                <IonButton onClick={handleSaveAndExit} fill="outline" color="medium" disabled={saving}>
                  Save & Exit
                </IonButton>
                <IonButton onClick={handleClose} fill="outline" color="medium">
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
          isOpen={showCloseConfirmation}
          onDidDismiss={() => setShowCloseConfirmation(false)}
          header="Discard changes?"
          message="You have unsaved changes. Are you sure you want to close?"
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            { text: 'Discard', handler: () => history.goBack() }
          ]}
        />
      </IonContent>
    </IonPage>
  );
}
