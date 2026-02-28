import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonAlert,
} from '@ionic/react';
import { create, arrowBack, mailOutline, phonePortraitOutline, locationOutline, personOutline, briefcaseOutline, medicalOutline, add, shieldCheckmarkOutline, trash } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

const COMPLIANCE_TYPES = [
  'DBS Check',
  'First Aid Certificate',
  'Public Liability Insurance',
  'Pet First Aid',
  'Driving Licence',
  'Vehicle Insurance',
  'Dog Walking Licence',
  'Other',
];

const emptyCompliance = {
  item_type: '',
  status: 'valid',
  issued_at: '',
  expires_at: '',
  reference_number: '',
  notes: '',
};

export default function WalkerDetail() {
  const { walkerId } = useParams();
  const history = useHistory();
  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  // Compliance state
  const [compliance, setCompliance] = useState([]);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [showComplianceForm, setShowComplianceForm] = useState(false);
  const [editComplianceId, setEditComplianceId] = useState(null);
  const [complianceForm, setComplianceForm] = useState(emptyCompliance);
  const [savingCompliance, setSavingCompliance] = useState(false);
  const [deleteComplianceAlert, setDeleteComplianceAlert] = useState({ show: false, id: null });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Walkers', path: '/admin/walkers' },
    { label: 'Walker Details', path: `/admin/walkers/${walkerId}` }
  ];

  useEffect(() => {
    fetchWalker();
    fetchCompliance();
  }, [walkerId]);

  const fetchWalker = async () => {
    try {
      const response = await fetch(`/api/admin/walkers/${walkerId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.status === 404) { showToast('Walker not found', 'danger'); return; }
      if (response.status === 403 || response.status === 401) { showToast('Authentication required', 'danger'); return; }
      const data = await response.json();
      if (data.error) showToast(data.error, 'danger');
      else setWalker(data);
    } catch {
      showToast('Failed to fetch walker', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompliance = async () => {
    setComplianceLoading(true);
    try {
      const response = await fetch(`/api/admin/walkers/${walkerId}/compliance`, { credentials: 'include' });
      if (response.ok) setCompliance(await response.json());
    } catch {
      // Non-critical, don't show error
    } finally {
      setComplianceLoading(false);
    }
  };

  const showToast = (message, color = 'success') => setToast({ show: true, message, color });

  const goBack = () => history.push('/admin/walkers');
  const openEditForm = () => history.push(`/admin/walkers/${walkerId}/edit`);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'left': return 'medium';
      default: return 'medium';
    }
  };

  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'success';
      case 'expired': return 'danger';
      case 'pending': return 'warning';
      case 'not_required': return 'medium';
      default: return 'medium';
    }
  };

  const isExpiringSoon = (expiresAt) => {
    if (!expiresAt) return false;
    const diff = new Date(expiresAt) - new Date();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000; // 30 days
  };

  const getDisplayName = (walker) => {
    if (!walker) return '';
    return walker.preferred_name || `${walker.first_name} ${walker.last_name}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const openAddCompliance = () => {
    setComplianceForm(emptyCompliance);
    setEditComplianceId(null);
    setShowComplianceForm(true);
  };

  const openEditCompliance = (record) => {
    setComplianceForm({
      item_type: record.item_type,
      status: record.status,
      issued_at: record.issued_at || '',
      expires_at: record.expires_at || '',
      reference_number: record.reference_number || '',
      notes: record.notes || '',
    });
    setEditComplianceId(record.id);
    setShowComplianceForm(true);
  };

  const handleSaveCompliance = async () => {
    if (!complianceForm.item_type) {
      showToast('Item type is required', 'danger');
      return;
    }
    setSavingCompliance(true);
    try {
      const url = editComplianceId
        ? `/api/admin/compliance/${editComplianceId}`
        : `/api/admin/walkers/${walkerId}/compliance`;
      const method = editComplianceId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complianceForm),
      });
      if (response.ok) {
        showToast(editComplianceId ? 'Compliance record updated' : 'Compliance record added');
        setShowComplianceForm(false);
        fetchCompliance();
      } else {
        const err = await response.json();
        showToast(err.error || 'Failed to save', 'danger');
      }
    } catch {
      showToast('Failed to save', 'danger');
    } finally {
      setSavingCompliance(false);
    }
  };

  const handleDeleteCompliance = async (id) => {
    try {
      const response = await fetch(`/api/admin/compliance/${id}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        showToast('Record deleted');
        fetchCompliance();
      } else {
        showToast('Failed to delete', 'danger');
      }
    } catch {
      showToast('Failed to delete', 'danger');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Walker Details" />
        <IonContent>
          <div className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!walker) {
    return (
      <IonPage>
        <AppHeader title="Walker Details" />
        <IonContent>
          <div className="ion-padding">
            <IonCard>
              <IonCardContent>
                <p>Walker not found.</p>
                <IonButton onClick={goBack}>
                  <IonIcon icon={arrowBack} slot="start" />
                  Back to Walkers
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title={getDisplayName(walker)} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <IonButton onClick={goBack} fill="outline">
              <IonIcon icon={arrowBack} slot="start" />
              Back
            </IonButton>
            <IonButton onClick={openEditForm} color="primary">
              <IonIcon icon={create} slot="start" />
              Edit
            </IonButton>
          </div>

          {/* Contact Information */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IonCardTitle>Contact Information</IonCardTitle>
                <IonBadge color={getStatusColor(walker.account_status)}>
                  {walker.account_status}
                </IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel>
                    <h3>Full Name</h3>
                    <p>{walker.first_name} {walker.last_name}</p>
                  </IonLabel>
                </IonItem>
                {walker.preferred_name && (
                  <IonItem>
                    <IonIcon icon={personOutline} slot="start" />
                    <IonLabel>
                      <h3>Preferred Name</h3>
                      <p>{walker.preferred_name}</p>
                    </IonLabel>
                  </IonItem>
                )}
                <IonItem>
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel>
                    <h3>Email</h3>
                    <p><a href={`mailto:${walker.email}`}>{walker.email}</a></p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={phonePortraitOutline} slot="start" />
                  <IonLabel>
                    <h3>Mobile Phone</h3>
                    <p><a href={`tel:${walker.phone_mobile}`}>{walker.phone_mobile}</a></p>
                  </IonLabel>
                </IonItem>
                {walker.phone_alternative && (
                  <IonItem>
                    <IonIcon icon={phonePortraitOutline} slot="start" />
                    <IonLabel>
                      <h3>Alternative Phone</h3>
                      <p><a href={`tel:${walker.phone_alternative}`}>{walker.phone_alternative}</a></p>
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Address */}
          {(walker.address_line_1 || walker.town_city || walker.postcode) && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Address</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  <IonItem>
                    <IonIcon icon={locationOutline} slot="start" />
                    <IonLabel>
                      <h3>Address</h3>
                      <p>
                        {walker.address_line_1 && <>{walker.address_line_1}<br /></>}
                        {walker.town_city && <>{walker.town_city}<br /></>}
                        {walker.postcode && <>{walker.postcode}</>}
                      </p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          {/* Emergency Contact */}
          {(walker.emergency_contact_name || walker.emergency_contact_phone) && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Emergency Contact</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  {walker.emergency_contact_name && (
                    <IonItem>
                      <IonIcon icon={medicalOutline} slot="start" />
                      <IonLabel>
                        <h3>Name</h3>
                        <p>{walker.emergency_contact_name}</p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {walker.emergency_contact_phone && (
                    <IonItem>
                      <IonIcon icon={phonePortraitOutline} slot="start" />
                      <IonLabel>
                        <h3>Phone</h3>
                        <p><a href={`tel:${walker.emergency_contact_phone}`}>{walker.emergency_contact_phone}</a></p>
                      </IonLabel>
                    </IonItem>
                  )}
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          {/* Employment Details */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Employment Details</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonIcon icon={briefcaseOutline} slot="start" />
                  <IonLabel>
                    <h3>Employment Status</h3>
                    <p style={{ textTransform: 'capitalize' }}>{walker.employment_status}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={briefcaseOutline} slot="start" />
                  <IonLabel>
                    <h3>Start Date</h3>
                    <p>{formatDate(walker.start_date)}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Compliance Tracking */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonIcon icon={shieldCheckmarkOutline} style={{ fontSize: '1.2rem' }} />
                  <IonCardTitle>Compliance</IonCardTitle>
                </div>
                <IonButton size="small" onClick={openAddCompliance}>
                  <IonIcon icon={add} slot="start" />
                  Add
                </IonButton>
              </div>
            </IonCardHeader>
            <IonCardContent>
              {/* Compliance Add/Edit Form */}
              {showComplianceForm && (
                <div style={{ background: 'var(--ion-color-light)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                  <h4 style={{ marginTop: 0 }}>{editComplianceId ? 'Edit Record' : 'Add Record'}</h4>
                  <IonItem>
                    <IonLabel position="stacked">Type *</IonLabel>
                    <IonSelect
                      value={complianceForm.item_type}
                      onIonChange={(e) => setComplianceForm((p) => ({ ...p, item_type: e.detail.value }))}
                      placeholder="Select type"
                    >
                      {COMPLIANCE_TYPES.map((t) => (
                        <IonSelectOption key={t} value={t}>{t}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Status</IonLabel>
                    <IonSelect
                      value={complianceForm.status}
                      onIonChange={(e) => setComplianceForm((p) => ({ ...p, status: e.detail.value }))}
                    >
                      <IonSelectOption value="valid">Valid</IonSelectOption>
                      <IonSelectOption value="expired">Expired</IonSelectOption>
                      <IonSelectOption value="pending">Pending</IonSelectOption>
                      <IonSelectOption value="not_required">Not Required</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                    <IonItem>
                      <IonLabel position="stacked">Issued</IonLabel>
                      <IonInput
                        type="date"
                        value={complianceForm.issued_at}
                        onIonInput={(e) => setComplianceForm((p) => ({ ...p, issued_at: e.detail.value }))}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Expires</IonLabel>
                      <IonInput
                        type="date"
                        value={complianceForm.expires_at}
                        onIonInput={(e) => setComplianceForm((p) => ({ ...p, expires_at: e.detail.value }))}
                      />
                    </IonItem>
                  </div>
                  <IonItem>
                    <IonLabel position="stacked">Reference Number</IonLabel>
                    <IonInput
                      value={complianceForm.reference_number}
                      onIonInput={(e) => setComplianceForm((p) => ({ ...p, reference_number: e.detail.value }))}
                      placeholder="e.g. cert number, policy number"
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Notes</IonLabel>
                    <IonTextarea
                      value={complianceForm.notes}
                      onIonInput={(e) => setComplianceForm((p) => ({ ...p, notes: e.detail.value }))}
                      rows={2}
                    />
                  </IonItem>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <IonButton size="small" onClick={handleSaveCompliance} disabled={savingCompliance}>
                      {savingCompliance ? <IonSpinner name="crescent" /> : 'Save'}
                    </IonButton>
                    <IonButton size="small" fill="outline" color="medium" onClick={() => setShowComplianceForm(false)}>
                      Cancel
                    </IonButton>
                  </div>
                </div>
              )}

              {complianceLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                  <IonSpinner />
                </div>
              ) : compliance.length === 0 ? (
                <p style={{ color: 'var(--ion-color-medium)', textAlign: 'center' }}>
                  No compliance records yet.
                </p>
              ) : (
                <IonList lines="full">
                  {compliance.map((record) => (
                    <IonItem key={record.id}>
                      <IonLabel>
                        <h3>{record.item_type}</h3>
                        <p>
                          {record.issued_at && `Issued: ${formatDate(record.issued_at)}`}
                          {record.issued_at && record.expires_at && ' · '}
                          {record.expires_at && (
                            <span style={{ color: isExpiringSoon(record.expires_at) ? 'var(--ion-color-warning)' : undefined }}>
                              Expires: {formatDate(record.expires_at)}
                              {isExpiringSoon(record.expires_at) && ' ⚠️'}
                            </span>
                          )}
                        </p>
                        {record.reference_number && (
                          <p>Ref: {record.reference_number}</p>
                        )}
                      </IonLabel>
                      <IonBadge slot="end" color={getComplianceStatusColor(record.status)}>
                        {record.status}
                      </IonBadge>
                      <IonButton slot="end" fill="clear" size="small" onClick={() => openEditCompliance(record)}>
                        <IonIcon icon={create} />
                      </IonButton>
                      <IonButton slot="end" fill="clear" size="small" color="danger" onClick={() => setDeleteComplianceAlert({ show: true, id: record.id })}>
                        <IonIcon icon={trash} />
                      </IonButton>
                    </IonItem>
                  ))}
                </IonList>
              )}
            </IonCardContent>
          </IonCard>

          {/* Notes */}
          {walker.notes_internal && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Internal Notes</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p style={{ whiteSpace: 'pre-wrap' }}>{walker.notes_internal}</p>
              </IonCardContent>
            </IonCard>
          )}
        </div>

        <IonAlert
          isOpen={deleteComplianceAlert.show}
          onDidDismiss={() => setDeleteComplianceAlert({ show: false, id: null })}
          header="Delete Record"
          message="Are you sure you want to delete this compliance record?"
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            { text: 'Delete', role: 'destructive', handler: () => handleDeleteCompliance(deleteComplianceAlert.id) },
          ]}
        />

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={3000}
          color={toast.color}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>
    </IonPage>
  );
}
