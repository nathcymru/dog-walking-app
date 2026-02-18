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
} from '@ionic/react';
import { arrowBack, arrowForward, save, close as closeIcon } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function ClientForm() {
  const { id } = useParams();
  const history = useHistory();
  const isEdit = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Identity
    email: '',
    password: '',
    full_name: '',
    
    // Step 2: Contact/Address
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Clients', path: '/admin/clients' },
    { label: isEdit ? 'Edit Client' : 'New Client', path: `/admin/clients/${id || 'new'}` }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          email: data.email || '',
          password: '', // Never pre-fill password
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } else {
        showToast('Failed to load client', 'danger');
      }
    } catch (error) {
      showToast('Failed to load client', 'danger');
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
      // Full name required
      if (!formData.full_name || formData.full_name.trim().length < 2) {
        newErrors.full_name = 'Full name is required (min 2 characters)';
      }
      
      // Email required and valid
      if (!formData.email || !formData.email.includes('@')) {
        newErrors.email = 'Valid email is required';
      }
      
      // Password required for new clients
      if (!isEdit && !formData.password) {
        newErrors.password = 'Password is required for new clients';
      }
      
      // Password minimum length if provided
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (step === 2) {
      // Phone optional but validate format if provided
      if (formData.phone && formData.phone.length < 10) {
        newErrors.phone = 'Phone number should be at least 10 digits';
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
    // Minimal validation - only require email and name
    if (!formData.full_name || !formData.email) {
      showToast('Name and email are required', 'danger');
      return;
    }

    if (!isEdit && !formData.password) {
      showToast('Password is required for new clients', 'danger');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData, status: 'DRAFT' };
      
      // Don't send password if editing and it's empty
      if (isEdit && !formData.password) {
        delete payload.password;
      }

      const url = isEdit ? `/api/admin/clients/${id}` : '/api/admin/clients';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast('Client saved as draft', 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/clients');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save client', 'danger');
      }
    } catch (error) {
      showToast('Failed to save client', 'danger');
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
      const payload = { ...formData, status: 'ACTIVE' };
      
      // Don't send password if editing and it's empty
      if (isEdit && !formData.password) {
        delete payload.password;
      }

      const url = isEdit ? `/api/admin/clients/${id}` : '/api/admin/clients';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast(`Client ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/clients');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save client', 'danger');
      }
    } catch (error) {
      showToast('Failed to save client', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCancelAlert(true);
    } else {
      history.push('/admin/clients');
    }
  };

  const confirmClose = () => {
    setShowCancelAlert(false);
    history.push('/admin/clients');
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title={isEdit ? 'Edit Client' : 'New Client'} />
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
      <AppHeader title={isEdit ? 'Edit Client' : 'New Client'} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h2>Step {currentStep} of 2</h2>
                <p style={{ color: 'var(--ion-color-medium)' }}>
                  {currentStep === 1 && 'Identity Information'}
                  {currentStep === 2 && 'Contact & Address'}
                </p>
              </div>

              {/* Step 1: Identity */}
              {currentStep === 1 && (
                <div>
                  <IonItem>
                    <IonLabel position="stacked">Full Name *</IonLabel>
                    <IonInput
                      value={formData.full_name}
                      onIonInput={e => handleChange('full_name', e.detail.value)}
                      placeholder="Enter full name"
                    />
                  </IonItem>
                  {errors.full_name && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.full_name}
                    </p>
                  )}

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
                    <IonLabel position="stacked">
                      Password {!isEdit && '*'} {isEdit && '(leave blank to keep current)'}
                    </IonLabel>
                    <IonInput
                      type="password"
                      value={formData.password}
                      onIonInput={e => handleChange('password', e.detail.value)}
                      placeholder={isEdit ? 'Enter new password (optional)' : 'Enter password'}
                    />
                  </IonItem>
                  {errors.password && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              {/* Step 2: Contact & Address */}
              {currentStep === 2 && (
                <div>
                  <IonItem>
                    <IonLabel position="stacked">Phone</IonLabel>
                    <IonInput
                      type="tel"
                      value={formData.phone}
                      onIonInput={e => handleChange('phone', e.detail.value)}
                      placeholder="Enter phone number"
                    />
                  </IonItem>
                  {errors.phone && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.phone}
                    </p>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Address</IonLabel>
                    <IonTextarea
                      value={formData.address}
                      onIonInput={e => handleChange('address', e.detail.value)}
                      placeholder="Enter full address"
                      rows={4}
                    />
                  </IonItem>
                  {errors.address && (
                    <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                      {errors.address}
                    </p>
                  )}

                  {/* Review Section */}
                  <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--ion-color-light)', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0 }}>Review</h3>
                    <p><strong>Name:</strong> {formData.full_name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    {formData.phone && <p><strong>Phone:</strong> {formData.phone}</p>}
                    {formData.address && <p><strong>Address:</strong> {formData.address}</p>}
                  </div>
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
