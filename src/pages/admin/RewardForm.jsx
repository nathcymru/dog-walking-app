import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardContent, IonButton, IonIcon,
  IonInput, IonTextarea, IonSelect, IonSelectOption, IonLabel, IonItem,
  IonSpinner, IonToast, IonRadioGroup, IonRadio, IonDatetime
} from '@ionic/react';
import { arrowBack, arrowForward, save } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function AdminRewardForm() {
  const { id } = useParams();
  const history = useHistory();
  const isEdit = !!id;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  const [formData, setFormData] = useState({
    type: '',
    scope: 'ALL_CLIENTS',
    redemption_mode: '',
    title: '',
    description: '',
    cta_label: '',
    cta_url: '',
    image_url: '',
    starts_at: '',
    ends_at: '',
    loyalty_metric: '',
    loyalty_window: '',
    loyalty_threshold: '',
    voucher_prefix: '',
    discount_type: '',
    discount_value: '',
    shared_voucher_code: ''
  });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Rewards', path: '/admin/rewards' },
    { label: isEdit ? 'Edit Reward' : 'New Reward', path: `/admin/rewards/${id || 'new'}` }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchReward();
    }
  }, [id]);

  const fetchReward = async () => {
    try {
      const response = await fetch(`/api/admin/rewards/${id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...data,
          loyalty_threshold: data.loyalty_threshold || '',
          discount_value: data.discount_value || '',
          voucher_prefix: data.voucher_prefix || '',
          cta_url: data.cta_url || '',
          image_url: data.image_url || '',
          starts_at: data.starts_at || '',
          ends_at: data.ends_at || '',
          shared_voucher_code: data.shared_voucher_code || ''
        });
      } else {
        showToast('Failed to load reward', 'danger');
      }
    } catch (error) {
      showToast('Failed to load reward', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.type) {
        showToast('Please select a reward type', 'danger');
        return false;
      }
    } else if (step === 2) {
      if (!formData.redemption_mode) {
        showToast('Please select a redemption mode', 'danger');
        return false;
      }
    } else if (step === 3) {
      if (!formData.title || !formData.description || !formData.cta_label) {
        showToast('Please fill in all required fields', 'danger');
        return false;
      }
      if (formData.redemption_mode === 'EXTERNAL_LINK' && !formData.cta_url) {
        showToast('CTA URL is required for external link redemption', 'danger');
        return false;
      }
      if (formData.type === 'LOYALTY' && (!formData.loyalty_metric || !formData.loyalty_window || !formData.loyalty_threshold || !formData.voucher_prefix)) {
        showToast('Please fill in all loyalty fields', 'danger');
        return false;
      }
      if (formData.redemption_mode === 'INTERNAL_CODE' && !formData.discount_type) {
        showToast('Please select a discount type', 'danger');
        return false;
      }
      if (formData.starts_at && formData.ends_at && new Date(formData.starts_at) >= new Date(formData.ends_at)) {
        showToast('Start date must be before end date', 'danger');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/rewards/${id}` : '/api/admin/rewards';
      const method = isEdit ? 'PUT' : 'POST';

      // Uppercase the voucher prefix
      const submitData = {
        ...formData,
        voucher_prefix: formData.voucher_prefix ? formData.voucher_prefix.toUpperCase() : null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        showToast(`Reward ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        setTimeout(() => history.push('/admin/rewards'), 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save reward', 'danger');
      }
    } catch (error) {
      showToast('Failed to save reward', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title={isEdit ? 'Edit Reward' : 'New Reward'} />
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
      <AppHeader title={isEdit ? 'Edit Reward' : 'New Reward'} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h2>Step {step} of 3</h2>
                <p style={{ color: 'var(--ion-color-medium)' }}>
                  {step === 1 && 'Choose reward type'}
                  {step === 2 && 'Choose redemption mode'}
                  {step === 3 && 'Configure details'}
                </p>
              </div>

              {step === 1 && (
                <IonRadioGroup value={formData.type} onIonChange={e => handleChange('type', e.detail.value)}>
                  <IonLabel><strong>Reward Type</strong></IonLabel>
                  <IonItem>
                    <IonLabel>
                      <h3>One-off Reward</h3>
                      <p>Single use reward for specific clients</p>
                    </IonLabel>
                    <IonRadio slot="start" value="ONE_OFF" />
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h3>Campaign Reward</h3>
                      <p>Time-bound campaign for multiple clients</p>
                    </IonLabel>
                    <IonRadio slot="start" value="CAMPAIGN" />
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h3>Loyalty Reward</h3>
                      <p>Automatic reward based on walks/spend</p>
                    </IonLabel>
                    <IonRadio slot="start" value="LOYALTY" />
                  </IonItem>
                </IonRadioGroup>
              )}

              {step === 2 && (
                <IonRadioGroup value={formData.redemption_mode} onIonChange={e => handleChange('redemption_mode', e.detail.value)}>
                  <IonLabel><strong>Redemption Mode</strong></IonLabel>
                  <IonItem>
                    <IonLabel>
                      <h3>Internal Code</h3>
                      <p>Voucher code for discounts on invoices</p>
                    </IonLabel>
                    <IonRadio slot="start" value="INTERNAL_CODE" />
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h3>External Link</h3>
                      <p>Link to external reward page</p>
                    </IonLabel>
                    <IonRadio slot="start" value="EXTERNAL_LINK" />
                  </IonItem>
                </IonRadioGroup>
              )}

              {step === 3 && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Title *</IonLabel>
                    <IonInput
                      value={formData.title}
                      onIonInput={e => handleChange('title', e.detail.value)}
                      placeholder="Reward title"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Description *</IonLabel>
                    <IonTextarea
                      value={formData.description}
                      onIonInput={e => handleChange('description', e.detail.value)}
                      placeholder="Reward description"
                      rows={3}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">CTA Label *</IonLabel>
                    <IonInput
                      value={formData.cta_label}
                      onIonInput={e => handleChange('cta_label', e.detail.value)}
                      placeholder="e.g., Redeem Now"
                    />
                  </IonItem>

                  {formData.redemption_mode === 'EXTERNAL_LINK' && (
                    <IonItem>
                      <IonLabel position="stacked">CTA URL *</IonLabel>
                      <IonInput
                        value={formData.cta_url}
                        onIonInput={e => handleChange('cta_url', e.detail.value)}
                        placeholder="https://..."
                      />
                    </IonItem>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Image URL (optional)</IonLabel>
                    <IonInput
                      value={formData.image_url}
                      onIonInput={e => handleChange('image_url', e.detail.value)}
                      placeholder="https://..."
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Start Date (optional)</IonLabel>
                    <IonInput
                      type="datetime-local"
                      value={formData.starts_at}
                      onIonInput={e => handleChange('starts_at', e.detail.value)}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">End Date (optional)</IonLabel>
                    <IonInput
                      type="datetime-local"
                      value={formData.ends_at}
                      onIonInput={e => handleChange('ends_at', e.detail.value)}
                    />
                  </IonItem>

                  {formData.type === 'LOYALTY' && (
                    <>
                      <IonItem>
                        <IonLabel position="stacked">Loyalty Metric *</IonLabel>
                        <IonSelect
                          value={formData.loyalty_metric}
                          onIonChange={e => handleChange('loyalty_metric', e.detail.value)}
                        >
                          <IonSelectOption value="WALKS">Walks</IonSelectOption>
                          <IonSelectOption value="SPEND">Spend</IonSelectOption>
                        </IonSelect>
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Loyalty Window *</IonLabel>
                        <IonSelect
                          value={formData.loyalty_window}
                          onIonChange={e => handleChange('loyalty_window', e.detail.value)}
                        >
                          <IonSelectOption value="MONTH">Month</IonSelectOption>
                          <IonSelectOption value="QUARTER">Quarter</IonSelectOption>
                          <IonSelectOption value="SIX_MONTH">6 Months</IonSelectOption>
                          <IonSelectOption value="TWELVE_MONTH">12 Months</IonSelectOption>
                        </IonSelect>
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Loyalty Threshold *</IonLabel>
                        <IonInput
                          type="number"
                          value={formData.loyalty_threshold}
                          onIonInput={e => handleChange('loyalty_threshold', e.detail.value)}
                          placeholder="e.g., 10 (walks) or 100 (£)"
                        />
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Voucher Prefix * (will be uppercased)</IonLabel>
                        <IonInput
                          value={formData.voucher_prefix}
                          onIonInput={e => handleChange('voucher_prefix', e.detail.value)}
                          placeholder="e.g., LOYAL"
                        />
                      </IonItem>
                    </>
                  )}

                  {formData.redemption_mode === 'INTERNAL_CODE' && (
                    <>
                      <IonItem>
                        <IonLabel position="stacked">Discount Type *</IonLabel>
                        <IonSelect
                          value={formData.discount_type}
                          onIonChange={e => handleChange('discount_type', e.detail.value)}
                        >
                          <IonSelectOption value="PERCENT">Percent</IonSelectOption>
                          <IonSelectOption value="FIXED">Fixed Amount</IonSelectOption>
                        </IonSelect>
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Discount Value</IonLabel>
                        <IonInput
                          type="number"
                          value={formData.discount_value}
                          onIonInput={e => handleChange('discount_value', e.detail.value)}
                          placeholder={formData.discount_type === 'PERCENT' ? 'e.g., 10 (for 10%)' : 'e.g., 5.00 (£5)'}
                        />
                      </IonItem>

                      {formData.type !== 'LOYALTY' && (
                        <IonItem>
                          <IonLabel position="stacked">Shared Voucher Code (optional)</IonLabel>
                          <IonInput
                            value={formData.shared_voucher_code}
                            onIonInput={e => handleChange('shared_voucher_code', e.detail.value)}
                            placeholder="e.g., SUMMER2026"
                          />
                        </IonItem>
                      )}
                    </>
                  )}
                </>
              )}

              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                {step > 1 && (
                  <IonButton onClick={prevStep} fill="outline">
                    <IonIcon icon={arrowBack} slot="start" />
                    Back
                  </IonButton>
                )}
                
                {step < 3 ? (
                  <IonButton onClick={nextStep} style={{ marginLeft: 'auto' }}>
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
      </IonContent>
    </IonPage>
  );
}
