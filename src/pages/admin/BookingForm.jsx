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
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonAlert,
  IonCheckbox,
  IonList,
} from '@ionic/react';
import { arrowBack, arrowForward, save, close as closeIcon } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function BookingForm() {
  const { id } = useParams();
  const history = useHistory();
  const isEdit = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    client_id: '',
    datetime_start: '',
    datetime_end: '',
    service_type: 'walk',
    status: 'approved',
    pet_ids: [],
    
    // Step 2: Details
    walker_name: '',
    notes: '',
    admin_comment: '',
    time_window_start: '',
    time_window_end: '',
    recurrence: 'One-off',
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Bookings', path: '/admin/bookings' },
    { label: isEdit ? 'Edit Booking' : 'New Booking', path: `/admin/bookings/${id || 'new'}` }
  ];

  useEffect(() => {
    fetchClients();
    fetchPets();
    if (isEdit) {
      fetchBooking();
    }
  }, [id]);

  useEffect(() => {
    // Filter pets by selected client
    if (formData.client_id) {
      const clientPets = pets.filter(pet => pet.client_id === parseInt(formData.client_id));
      setFilteredPets(clientPets);
    } else {
      setFilteredPets([]);
    }
  }, [formData.client_id, pets]);

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

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/admin/pets', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setPets(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch pets', error);
    }
  };

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          client_id: data.client_id || '',
          datetime_start: data.datetime_start || '',
          datetime_end: data.datetime_end || '',
          service_type: data.service_type || 'walk',
          status: data.status || 'approved',
          pet_ids: data.pet_ids ? JSON.parse(data.pet_ids) : [],
          walker_name: data.walker_name || '',
          notes: data.notes || '',
          admin_comment: data.admin_comment || '',
          time_window_start: data.time_window_start || '',
          time_window_end: data.time_window_end || '',
          recurrence: data.recurrence || 'One-off',
        });
      } else {
        showToast('Failed to load booking', 'danger');
      }
    } catch (error) {
      showToast('Failed to load booking', 'danger');
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

  const handlePetToggle = (petId) => {
    const currentPets = formData.pet_ids || [];
    const newPets = currentPets.includes(petId)
      ? currentPets.filter(id => id !== petId)
      : [...currentPets, petId];
    handleChange('pet_ids', newPets);
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Client required
      if (!formData.client_id) {
        newErrors.client_id = 'Client is required';
      }
      
      // At least one pet required
      if (!formData.pet_ids || formData.pet_ids.length === 0) {
        newErrors.pet_ids = 'At least one pet must be selected';
      }
      
      // Start datetime required
      if (!formData.datetime_start) {
        newErrors.datetime_start = 'Start date/time is required';
      }
      
      // End datetime required
      if (!formData.datetime_end) {
        newErrors.datetime_end = 'End date/time is required';
      }
      
      // Validate end is after start
      if (formData.datetime_start && formData.datetime_end) {
        if (new Date(formData.datetime_end) <= new Date(formData.datetime_start)) {
          newErrors.datetime_end = 'End time must be after start time';
        }
      }
      
      // Service type required
      if (!formData.service_type) {
        newErrors.service_type = 'Service type is required';
      }
    }

    if (step === 2) {
      // Walker name recommended but not required
      // Notes optional
      // Time window validation if provided
      if (formData.time_window_start && formData.time_window_end) {
        if (formData.time_window_end <= formData.time_window_start) {
          newErrors.time_window_end = 'Window end must be after window start';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    } else {
      showToast('Please fix validation errors before proceeding', 'danger');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSaveAndExit = async () => {
    // Minimal validation - only require client and dates
    if (!formData.client_id || !formData.datetime_start || !formData.datetime_end) {
      showToast('Client, start date, and end date are required', 'danger');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        pet_ids: JSON.stringify(formData.pet_ids || []),
        status: 'DRAFT',
      };

      const url = isEdit ? `/api/admin/bookings/${id}` : '/api/admin/bookings';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast('Booking saved as draft', 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/bookings');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save booking', 'danger');
      }
    } catch (error) {
      showToast('Failed to save booking', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Full validation for both steps
    const allValid = [1, 2].every(step => validateStep(step));
    
    if (!allValid) {
      showToast('Please complete all required fields', 'danger');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        pet_ids: JSON.stringify(formData.pet_ids || []),
        status: formData.status || 'approved',
      };

      const url = isEdit ? `/api/admin/bookings/${id}` : '/api/admin/bookings';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast(`Booking ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/bookings');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save booking', 'danger');
      }
    } catch (error) {
      showToast('Failed to save booking', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCancelAlert(true);
    } else {
      history.push('/admin/bookings');
    }
  };

  const confirmClose = () => {
    setShowCancelAlert(false);
    history.push('/admin/bookings');
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title={isEdit ? 'Edit Booking' : 'New Booking'} />
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
      <AppHeader title={isEdit ? 'Edit Booking' : 'New Booking'} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h2>Step {currentStep} of 2</h2>
                <p style={{ color: 'var(--ion-color-medium)' }}>
                  {currentStep === 1 && 'Basic Information'}
                  {currentStep === 2 && 'Details & Schedule'}
                </p>
              </div>

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div>
                  <IonItem>
                    <IonLabel position="stacked">Client *</IonLabel>
                    <IonSelect
                      value={formData.client_id}
                      onIonChange={e => handleChange('client_id', e.detail.value)}
                      placeholder="Select client"
                    >
                      {clients.map(client => (
                        <IonSelectOption key={client.id} value={client.id}>
                          {client.full_name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  {errors.client_id && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.client_id}
                    </p>
                  )}

                  {filteredPets.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <IonLabel style={{ marginLeft: '16px' }}><strong>Pets *</strong></IonLabel>
                      <IonList>
                        {filteredPets.map(pet => (
                          <IonItem key={pet.id}>
                            <IonCheckbox
                              checked={formData.pet_ids?.includes(pet.id)}
                              onIonChange={() => handlePetToggle(pet.id)}
                            />
                            <IonLabel style={{ marginLeft: '8px' }}>
                              {pet.name} ({pet.breed})
                            </IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                      {errors.pet_ids && (
                        <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                          {errors.pet_ids}
                        </p>
                      )}
                    </div>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Service Type *</IonLabel>
                    <IonSelect
                      value={formData.service_type}
                      onIonChange={e => handleChange('service_type', e.detail.value)}
                    >
                      <IonSelectOption value="walk">Walk</IonSelectOption>
                      <IonSelectOption value="daycare">Daycare</IonSelectOption>
                      <IonSelectOption value="boarding">Boarding</IonSelectOption>
                      <IonSelectOption value="grooming">Grooming</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  {errors.service_type && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.service_type}
                    </p>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Start Date/Time *</IonLabel>
                    <IonInput
                      type="datetime-local"
                      value={formData.datetime_start}
                      onIonInput={e => handleChange('datetime_start', e.detail.value)}
                    />
                  </IonItem>
                  {errors.datetime_start && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.datetime_start}
                    </p>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">End Date/Time *</IonLabel>
                    <IonInput
                      type="datetime-local"
                      value={formData.datetime_end}
                      onIonInput={e => handleChange('datetime_end', e.detail.value)}
                    />
                  </IonItem>
                  {errors.datetime_end && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.datetime_end}
                    </p>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Status</IonLabel>
                    <IonSelect
                      value={formData.status}
                      onIonChange={e => handleChange('status', e.detail.value)}
                    >
                      <IonSelectOption value="pending">Pending</IonSelectOption>
                      <IonSelectOption value="approved">Approved</IonSelectOption>
                      <IonSelectOption value="completed">Completed</IonSelectOption>
                      <IonSelectOption value="cancelled">Cancelled</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div>
                  <IonItem>
                    <IonLabel position="stacked">Walker Name</IonLabel>
                    <IonInput
                      value={formData.walker_name}
                      onIonInput={e => handleChange('walker_name', e.detail.value)}
                      placeholder="Assigned walker"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Notes</IonLabel>
                    <IonTextarea
                      value={formData.notes}
                      onIonInput={e => handleChange('notes', e.detail.value)}
                      placeholder="Booking notes"
                      rows={3}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Admin Comment</IonLabel>
                    <IonTextarea
                      value={formData.admin_comment}
                      onIonInput={e => handleChange('admin_comment', e.detail.value)}
                      placeholder="Internal admin comment"
                      rows={2}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Recurrence</IonLabel>
                    <IonSelect
                      value={formData.recurrence}
                      onIonChange={e => handleChange('recurrence', e.detail.value)}
                    >
                      <IonSelectOption value="One-off">One-off</IonSelectOption>
                      <IonSelectOption value="Daily">Daily</IonSelectOption>
                      <IonSelectOption value="Weekly">Weekly</IonSelectOption>
                      <IonSelectOption value="Bi-weekly">Bi-weekly</IonSelectOption>
                      <IonSelectOption value="Monthly">Monthly</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Time Window Start (optional)</IonLabel>
                    <IonInput
                      type="time"
                      value={formData.time_window_start}
                      onIonInput={e => handleChange('time_window_start', e.detail.value)}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Time Window End (optional)</IonLabel>
                    <IonInput
                      type="time"
                      value={formData.time_window_end}
                      onIonInput={e => handleChange('time_window_end', e.detail.value)}
                    />
                  </IonItem>
                  {errors.time_window_end && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.time_window_end}
                    </p>
                  )}
                </div>
              )}

              {/* Primary Navigation */}
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
