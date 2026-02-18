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
} from '@ionic/react';
import { save, close as closeIcon } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function IncidentForm() {
  const { id } = useParams();
  const history = useHistory();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pets, setPets] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    incident_datetime: '',
    incident_type: 'injury',
    related_pet_id: '',
    related_booking_id: '',
    location: '',
    summary: '',
    actions_taken: '',
    owner_informed: false,
    attachments: '',
    follow_up_required: false,
    follow_up_notes: '',
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Incidents', path: '/admin/incidents' },
    { label: isEdit ? 'Edit Incident' : 'New Incident', path: `/admin/incidents/${id || 'new'}` }
  ];

  useEffect(() => {
    fetchPets();
    fetchBookings();
    if (isEdit) {
      fetchIncident();
    }
  }, [id]);

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

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setBookings(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  const fetchIncident = async () => {
    try {
      const response = await fetch(`/api/admin/incidents/${id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          incident_datetime: data.incident_datetime || '',
          incident_type: data.incident_type || 'injury',
          related_pet_id: data.related_pet_id || '',
          related_booking_id: data.related_booking_id || '',
          location: data.location || '',
          summary: data.summary || '',
          actions_taken: data.actions_taken || '',
          owner_informed: data.owner_informed || false,
          attachments: data.attachments || '',
          follow_up_required: data.follow_up_required || false,
          follow_up_notes: data.follow_up_notes || '',
        });
      } else {
        showToast('Failed to load incident', 'danger');
      }
    } catch (error) {
      showToast('Failed to load incident', 'danger');
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

  const validate = () => {
    const newErrors = {};

    // Datetime required
    if (!formData.incident_datetime) {
      newErrors.incident_datetime = 'Incident date/time is required';
    }
    
    // Type required
    if (!formData.incident_type) {
      newErrors.incident_type = 'Incident type is required';
    }
    
    // Summary required
    if (!formData.summary || formData.summary.trim().length < 10) {
      newErrors.summary = 'Summary is required (min 10 characters)';
    }
    
    // Actions taken required
    if (!formData.actions_taken) {
      newErrors.actions_taken = 'Actions taken is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndExit = async () => {
    // Minimal validation - only require datetime and summary
    if (!formData.incident_datetime || !formData.summary) {
      showToast('Incident date/time and summary are required', 'danger');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData, status: 'DRAFT' };

      const url = isEdit ? `/api/admin/incidents/${id}` : '/api/admin/incidents';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast('Incident saved as draft', 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/incidents');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save incident', 'danger');
      }
    } catch (error) {
      showToast('Failed to save incident', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showToast('Please complete all required fields', 'danger');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData, status: 'ACTIVE' };

      const url = isEdit ? `/api/admin/incidents/${id}` : '/api/admin/incidents';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast(`Incident ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/incidents');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save incident', 'danger');
      }
    } catch (error) {
      showToast('Failed to save incident', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCancelAlert(true);
    } else {
      history.push('/admin/incidents');
    }
  };

  const confirmClose = () => {
    setShowCancelAlert(false);
    history.push('/admin/incidents');
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title={isEdit ? 'Edit Incident' : 'New Incident'} />
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
      <AppHeader title={isEdit ? 'Edit Incident' : 'New Incident'} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              <h2>Incident Report</h2>

              <IonItem>
                <IonLabel position="stacked">Incident Date/Time *</IonLabel>
                <IonInput
                  type="datetime-local"
                  value={formData.incident_datetime}
                  onIonInput={e => handleChange('incident_datetime', e.detail.value)}
                />
              </IonItem>
              {errors.incident_datetime && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.incident_datetime}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Incident Type *</IonLabel>
                <IonSelect
                  value={formData.incident_type}
                  onIonChange={e => handleChange('incident_type', e.detail.value)}
                >
                  <IonSelectOption value="injury">Injury</IonSelectOption>
                  <IonSelectOption value="illness">Illness</IonSelectOption>
                  <IonSelectOption value="behavioral">Behavioral</IonSelectOption>
                  <IonSelectOption value="escape">Escape</IonSelectOption>
                  <IonSelectOption value="property_damage">Property Damage</IonSelectOption>
                  <IonSelectOption value="other">Other</IonSelectOption>
                </IonSelect>
              </IonItem>
              {errors.incident_type && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.incident_type}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Related Pet</IonLabel>
                <IonSelect
                  value={formData.related_pet_id}
                  onIonChange={e => handleChange('related_pet_id', e.detail.value)}
                  placeholder="Select pet (optional)"
                >
                  <IonSelectOption value="">None</IonSelectOption>
                  {pets.map(pet => (
                    <IonSelectOption key={pet.id} value={pet.id}>
                      {pet.name} ({pet.client_name})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Related Booking</IonLabel>
                <IonSelect
                  value={formData.related_booking_id}
                  onIonChange={e => handleChange('related_booking_id', e.detail.value)}
                  placeholder="Select booking (optional)"
                >
                  <IonSelectOption value="">None</IonSelectOption>
                  {bookings.map(booking => (
                    <IonSelectOption key={booking.id} value={booking.id}>
                      Booking #{booking.id} - {booking.client_name} ({new Date(booking.datetime_start).toLocaleDateString()})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Location</IonLabel>
                <IonInput
                  value={formData.location}
                  onIonInput={e => handleChange('location', e.detail.value)}
                  placeholder="Where did the incident occur?"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Summary *</IonLabel>
                <IonTextarea
                  value={formData.summary}
                  onIonInput={e => handleChange('summary', e.detail.value)}
                  placeholder="Describe what happened"
                  rows={4}
                />
              </IonItem>
              {errors.summary && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.summary}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Actions Taken *</IonLabel>
                <IonTextarea
                  value={formData.actions_taken}
                  onIonInput={e => handleChange('actions_taken', e.detail.value)}
                  placeholder="What actions were taken?"
                  rows={3}
                />
              </IonItem>
              {errors.actions_taken && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.actions_taken}
                </p>
              )}

              <IonItem>
                <IonCheckbox
                  checked={formData.owner_informed}
                  onIonChange={e => handleChange('owner_informed', e.detail.checked)}
                />
                <IonLabel style={{ marginLeft: '8px' }}>Owner Informed</IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Attachments (URLs)</IonLabel>
                <IonTextarea
                  value={formData.attachments}
                  onIonInput={e => handleChange('attachments', e.detail.value)}
                  placeholder="Photo/document URLs (one per line)"
                  rows={2}
                />
              </IonItem>

              <IonItem>
                <IonCheckbox
                  checked={formData.follow_up_required}
                  onIonChange={e => handleChange('follow_up_required', e.detail.checked)}
                />
                <IonLabel style={{ marginLeft: '8px' }}>Follow-up Required</IonLabel>
              </IonItem>

              {formData.follow_up_required && (
                <IonItem>
                  <IonLabel position="stacked">Follow-up Notes</IonLabel>
                  <IonTextarea
                    value={formData.follow_up_notes}
                    onIonInput={e => handleChange('follow_up_notes', e.detail.value)}
                    placeholder="What follow-up is needed?"
                    rows={3}
                  />
                </IonItem>
              )}

              {/* Primary Action */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <IonButton onClick={handleSubmit} disabled={saving}>
                  <IonIcon icon={save} slot="start" />
                  {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                </IonButton>
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
