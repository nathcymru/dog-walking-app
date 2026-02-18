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
} from '@ionic/react';
import { save, close as closeIcon } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function WalkerForm() {
  const { walkerId } = useParams();
  const history = useHistory();
  const isEdit = !!walkerId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    preferred_name: '',
    email: '',
    phone_mobile: '',
    phone_alternative: '',
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

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name || formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name is required (min 2 characters)';
    }
    
    if (!formData.last_name || formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name is required (min 2 characters)';
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formData.phone_mobile || formData.phone_mobile.trim().length < 10) {
      newErrors.phone_mobile = 'Valid phone number is required (min 10 digits)';
    }
    
    if (!formData.employment_status) {
      newErrors.employment_status = 'Employment status is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('Please fix validation errors before saving', 'danger');
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
        showToast(`Walker ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/walkers');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save walker', 'danger');
      }
    } catch (error) {
      showToast('Failed to save walker', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCancelAlert(true);
    } else {
      history.push('/admin/walkers');
    }
  };

  const confirmClose = () => {
    setShowCancelAlert(false);
    history.push('/admin/walkers');
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
              <h2>{isEdit ? 'Edit Walker' : 'Add Walker'}</h2>
              
              {/* Personal Information */}
              <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Personal Information</h3>
              
              <IonItem>
                <IonLabel position="stacked">First Name *</IonLabel>
                <IonInput
                  value={formData.first_name}
                  onIonInput={e => handleChange('first_name', e.detail.value)}
                  placeholder="Enter first name"
                />
              </IonItem>
              {errors.first_name && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.first_name}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Last Name *</IonLabel>
                <IonInput
                  value={formData.last_name}
                  onIonInput={e => handleChange('last_name', e.detail.value)}
                  placeholder="Enter last name"
                />
              </IonItem>
              {errors.last_name && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.last_name}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Preferred Name</IonLabel>
                <IonInput
                  value={formData.preferred_name}
                  onIonInput={e => handleChange('preferred_name', e.detail.value)}
                  placeholder="Enter preferred name (optional)"
                />
              </IonItem>

              {/* Contact Information */}
              <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Contact Information</h3>

              <IonItem>
                <IonLabel position="stacked">Email *</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonInput={e => handleChange('email', e.detail.value)}
                  placeholder="Enter email address"
                />
              </IonItem>
              {errors.email && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.email}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Mobile Phone *</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone_mobile}
                  onIonInput={e => handleChange('phone_mobile', e.detail.value)}
                  placeholder="Enter mobile phone number"
                />
              </IonItem>
              {errors.phone_mobile && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.phone_mobile}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Alternative Phone</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone_alternative}
                  onIonInput={e => handleChange('phone_alternative', e.detail.value)}
                  placeholder="Enter alternative phone (optional)"
                />
              </IonItem>

              {/* Address */}
              <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Address</h3>

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
                  placeholder="Enter postcode"
                />
              </IonItem>

              {/* Emergency Contact */}
              <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Emergency Contact</h3>

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

              {/* Employment Details */}
              <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Employment Details</h3>

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
              {errors.employment_status && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.employment_status}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Start Date *</IonLabel>
                <IonInput
                  type="date"
                  value={formData.start_date}
                  onIonInput={e => handleChange('start_date', e.detail.value)}
                />
              </IonItem>
              {errors.start_date && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.start_date}
                </p>
              )}

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

              {/* Notes */}
              <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Notes</h3>

              <IonItem>
                <IonLabel position="stacked">Internal Notes</IonLabel>
                <IonTextarea
                  value={formData.notes_internal}
                  onIonInput={e => handleChange('notes_internal', e.detail.value)}
                  placeholder="Enter any internal notes (not visible to walker)"
                  rows={4}
                />
              </IonItem>

              {/* Buttons */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                <IonButton onClick={handleSubmit} disabled={saving} color="primary">
                  <IonIcon icon={save} slot="start" />
                  {saving ? 'Saving...' : 'Save'}
                </IonButton>
                <IonButton onClick={handleClose} fill="outline" color="medium">
                  <IonIcon icon={closeIcon} slot="start" />
                  Cancel
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
