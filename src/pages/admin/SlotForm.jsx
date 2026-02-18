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
  IonRadioGroup,
  IonRadio,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { arrowBack, arrowForward, save, close as closeIcon } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function SlotForm() {
  const { slotId } = useParams();
  const history = useHistory();
  const isEdit = !!slotId;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [walkers, setWalkers] = useState([]);

  const [formData, setFormData] = useState({
    start_at: '',
    end_at: '',
    duration: '60', // default 1 hour in minutes
    walk_type: 'GROUP',
    capacity_dogs: 4,
    walker_id: '',
    location_label: '',
    notes: '',
  });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Slots', path: '/admin/slots' },
    { label: isEdit ? 'Edit Slot' : 'New Slot', path: `/admin/slots/${slotId || 'new'}` }
  ];

  useEffect(() => {
    fetchWalkers();
    if (isEdit) {
      fetchSlot();
    }
  }, [slotId]);

  const fetchWalkers = async () => {
    try {
      const response = await fetch('/api/admin/walkers?status=active', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setWalkers(data);
      }
    } catch (error) {
      console.error('Error fetching walkers:', error);
    }
  };

  const fetchSlot = async () => {
    try {
      const response = await fetch(`/api/admin/slots/${slotId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          start_at: data.start_at ? data.start_at.substring(0, 16) : '',
          end_at: data.end_at ? data.end_at.substring(0, 16) : '',
          duration: '60',
          walk_type: data.walk_type || 'GROUP',
          capacity_dogs: data.capacity_dogs || 4,
          walker_id: data.walker_id || '',
          location_label: data.location_label || '',
          notes: data.notes || '',
        });
      } else {
        showToast('Failed to load slot', 'danger');
      }
    } catch (error) {
      showToast('Failed to load slot', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    // Auto-calculate end_at when start_at or duration changes
    if (field === 'start_at' || field === 'duration') {
      const startAt = field === 'start_at' ? value : formData.start_at;
      const duration = field === 'duration' ? value : formData.duration;
      
      if (startAt && duration) {
        const startDate = new Date(startAt);
        const endDate = new Date(startDate.getTime() + parseInt(duration) * 60000);
        const endAtStr = endDate.toISOString().substring(0, 16);
        setFormData(prev => ({ ...prev, end_at: endAtStr }));
      }
    }
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.start_at) {
        showToast('Start date/time is required', 'danger');
        return false;
      }
      if (!formData.end_at) {
        showToast('End date/time is required', 'danger');
        return false;
      }
      if (new Date(formData.end_at) <= new Date(formData.start_at)) {
        showToast('End time must be after start time', 'danger');
        return false;
      }
      if (!formData.walk_type) {
        showToast('Walk type is required', 'danger');
        return false;
      }
      if (!formData.capacity_dogs || formData.capacity_dogs < 1 || formData.capacity_dogs > 10) {
        showToast('Capacity must be between 1 and 10 dogs', 'danger');
        return false;
      }
    } else if (step === 2) {
      if (!formData.walker_id) {
        showToast('Walker selection is required', 'danger');
        return false;
      }
    }
    return true;
  };

  const validateAllSteps = () => {
    for (let step = 1; step <= 2; step++) {
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
      const url = isEdit ? `/api/admin/slots/${slotId}` : '/api/admin/slots';
      const method = isEdit ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        start_at: new Date(formData.start_at).toISOString(),
        end_at: new Date(formData.end_at).toISOString(),
      };
      delete submitData.duration; // Remove duration field from submission

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData)
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
      const url = isEdit ? `/api/admin/slots/${slotId}` : '/api/admin/slots';
      const method = isEdit ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        start_at: new Date(formData.start_at).toISOString(),
        end_at: new Date(formData.end_at).toISOString(),
      };
      delete submitData.duration; // Remove duration field from submission

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        showToast('Slot saved successfully', 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/slots');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Error saving slot', 'danger');
      }
    } catch (error) {
      showToast('Error saving slot', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title={isEdit ? 'Edit Slot' : 'New Slot'} />
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
      <AppHeader title={isEdit ? 'Edit Slot' : 'New Slot'} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              {/* Step Indicator */}
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <IonText color="medium">
                  <h2>Step {currentStep} of 2</h2>
                </IonText>
                <p style={{ color: 'var(--ion-color-medium)' }}>
                  {currentStep === 1 && 'Date & Time'}
                  {currentStep === 2 && 'Details & Assign Walker'}
                </p>
              </div>

              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Start Date & Time *</IonLabel>
                    <IonInput
                      type="datetime-local"
                      value={formData.start_at}
                      onIonInput={e => handleChange('start_at', e.detail.value)}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Duration</IonLabel>
                    <IonSelect
                      value={formData.duration}
                      onIonChange={e => handleChange('duration', e.detail.value)}
                    >
                      <IonSelectOption value="30">30 minutes</IonSelectOption>
                      <IonSelectOption value="60">1 hour</IonSelectOption>
                      <IonSelectOption value="90">1.5 hours</IonSelectOption>
                      <IonSelectOption value="120">2 hours</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">End Date & Time *</IonLabel>
                    <IonInput
                      type="datetime-local"
                      value={formData.end_at}
                      onIonInput={e => handleChange('end_at', e.detail.value)}
                    />
                  </IonItem>

                  <IonItem lines="none" style={{ marginTop: '16px' }}>
                    <IonLabel><strong>Walk Type *</strong></IonLabel>
                  </IonItem>
                  <IonSegment
                    value={formData.walk_type}
                    onIonChange={e => handleChange('walk_type', e.detail.value)}
                  >
                    <IonSegmentButton value="GROUP">
                      <IonLabel>Group</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="PRIVATE">
                      <IonLabel>Private</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>

                  <IonItem>
                    <IonLabel position="stacked">Capacity (Dogs) *</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.capacity_dogs}
                      onIonInput={e => handleChange('capacity_dogs', parseInt(e.detail.value))}
                      min="1"
                      max="10"
                    />
                  </IonItem>
                </>
              )}

              {/* Step 2: Details & Assign Walker */}
              {currentStep === 2 && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Walker *</IonLabel>
                    <IonSelect
                      value={formData.walker_id}
                      onIonChange={e => handleChange('walker_id', e.detail.value)}
                      placeholder="Select a walker"
                    >
                      {walkers.map(walker => (
                        <IonSelectOption key={walker.walker_id} value={walker.walker_id}>
                          {walker.first_name} {walker.last_name} - {walker.phone_mobile}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Location Label</IonLabel>
                    <IonInput
                      value={formData.location_label}
                      onIonInput={e => handleChange('location_label', e.detail.value)}
                      placeholder="e.g., Park Walk, Beach Walk"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Notes</IonLabel>
                    <IonTextarea
                      value={formData.notes}
                      onIonInput={e => handleChange('notes', e.detail.value)}
                      placeholder="Any additional notes about this slot"
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
                
                {currentStep < 2 ? (
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
