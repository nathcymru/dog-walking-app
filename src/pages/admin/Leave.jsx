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
  IonBadge,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonAlert,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { add, trash, createOutline, personOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Maternity/Paternity', 'Compassionate', 'Unpaid', 'Training', 'Other'];

const emptyForm = {
  walker_id: '',
  leave_type: '',
  start_date: '',
  end_date: '',
  notes: '',
};

export default function Leave() {
  const [leaveList, setLeaveList] = useState([]);
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteAlert, setDeleteAlert] = useState({ show: false, id: null });
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Leave', path: '/admin/leave' },
  ];

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leaveRes, walkersRes] = await Promise.all([
        fetch(`/api/admin/leave${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`, { credentials: 'include' }),
        fetch('/api/admin/walkers?status=active', { credentials: 'include' }),
      ]);
      if (leaveRes.ok) setLeaveList(await leaveRes.json());
      if (walkersRes.ok) setWalkers(await walkersRes.json());
    } catch {
      showToast('Failed to load data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => setToast({ show: true, message, color });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = () => {
    const errs = {};
    if (!formData.walker_id) errs.walker_id = 'Walker is required';
    if (!formData.leave_type) errs.leave_type = 'Leave type is required';
    if (!formData.start_date) errs.start_date = 'Start date is required';
    if (!formData.end_date) errs.end_date = 'End date is required';
    if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
      errs.end_date = 'End date must be on or after start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => {
    setFormData(emptyForm);
    setErrors({});
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (record) => {
    setFormData({
      walker_id: record.walker_id,
      leave_type: record.leave_type,
      start_date: record.start_date,
      end_date: record.end_date,
      notes: record.notes || '',
    });
    setErrors({});
    setEditId(record.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const url = editId ? `/api/admin/leave/${editId}` : '/api/admin/leave';
      const method = editId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'approved' }),
      });
      if (response.ok) {
        showToast(editId ? 'Leave updated' : 'Leave recorded');
        setShowForm(false);
        fetchData();
      } else {
        const err = await response.json();
        showToast(err.error || 'Failed to save', 'danger');
      }
    } catch {
      showToast('Failed to save', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/leave/${id}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        showToast('Leave record deleted');
        fetchData();
      } else {
        showToast('Failed to delete', 'danger');
      }
    } catch {
      showToast('Failed to delete', 'danger');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'medium';
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const calcDays = (start, end) => {
    if (!start || !end) return null;
    const MS_PER_DAY = 86400000;
    const diff = (new Date(end) - new Date(start)) / MS_PER_DAY;
    return Math.round(diff) + 1;
  };

  return (
    <IonPage>
      <AppHeader title="Leave Management" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>Leave Records</h2>
            <IonButton onClick={openCreate}>
              <IonIcon icon={add} slot="start" />
              Add Leave
            </IonButton>
          </div>

          <IonSegment value={statusFilter} onIonChange={(e) => setStatusFilter(e.detail.value)} style={{ marginBottom: '16px' }}>
            <IonSegmentButton value="all"><IonLabel>All</IonLabel></IonSegmentButton>
            <IonSegmentButton value="approved"><IonLabel>Approved</IonLabel></IonSegmentButton>
            <IonSegmentButton value="pending"><IonLabel>Pending</IonLabel></IonSegmentButton>
          </IonSegment>

          {/* Form */}
          {showForm && (
            <IonCard style={{ marginBottom: '16px', border: '2px solid var(--ion-color-primary)' }}>
              <IonCardHeader>
                <IonCardTitle>{editId ? 'Edit Leave Record' : 'Add Leave Record'}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem className={errors.walker_id ? 'ion-invalid' : ''}>
                  <IonLabel position="stacked">Walker *</IonLabel>
                  <IonSelect
                    value={formData.walker_id}
                    onIonChange={(e) => handleChange('walker_id', e.detail.value)}
                    placeholder="Select walker"
                  >
                    {walkers.map((w) => (
                      <IonSelectOption key={w.walker_id} value={w.walker_id}>
                        {w.first_name} {w.last_name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                {errors.walker_id && <p style={{ color: 'var(--ion-color-danger)', margin: '4px 16px', fontSize: '0.85rem' }}>{errors.walker_id}</p>}

                <IonItem className={errors.leave_type ? 'ion-invalid' : ''}>
                  <IonLabel position="stacked">Leave Type *</IonLabel>
                  <IonSelect
                    value={formData.leave_type}
                    onIonChange={(e) => handleChange('leave_type', e.detail.value)}
                    placeholder="Select type"
                  >
                    {LEAVE_TYPES.map((t) => (
                      <IonSelectOption key={t} value={t}>{t}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                {errors.leave_type && <p style={{ color: 'var(--ion-color-danger)', margin: '4px 16px', fontSize: '0.85rem' }}>{errors.leave_type}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                  <IonItem className={errors.start_date ? 'ion-invalid' : ''}>
                    <IonLabel position="stacked">Start Date *</IonLabel>
                    <IonInput
                      type="date"
                      value={formData.start_date}
                      onIonInput={(e) => handleChange('start_date', e.detail.value)}
                    />
                  </IonItem>
                  <IonItem className={errors.end_date ? 'ion-invalid' : ''}>
                    <IonLabel position="stacked">End Date *</IonLabel>
                    <IonInput
                      type="date"
                      value={formData.end_date}
                      onIonInput={(e) => handleChange('end_date', e.detail.value)}
                    />
                  </IonItem>
                </div>
                {errors.start_date && <p style={{ color: 'var(--ion-color-danger)', margin: '4px 16px', fontSize: '0.85rem' }}>{errors.start_date}</p>}
                {errors.end_date && <p style={{ color: 'var(--ion-color-danger)', margin: '4px 16px', fontSize: '0.85rem' }}>{errors.end_date}</p>}

                <IonItem>
                  <IonLabel position="stacked">Notes</IonLabel>
                  <IonTextarea
                    value={formData.notes}
                    onIonInput={(e) => handleChange('notes', e.detail.value)}
                    placeholder="Optional notes..."
                    rows={3}
                  />
                </IonItem>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <IonButton onClick={handleSave} disabled={saving}>
                    {saving ? <IonSpinner name="crescent" /> : (editId ? 'Update' : 'Save')}
                  </IonButton>
                  <IonButton fill="outline" color="medium" onClick={() => setShowForm(false)}>
                    Cancel
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <IonSpinner />
            </div>
          ) : leaveList.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>No leave records found.</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {leaveList.map((record) => (
                <IonCard key={record.id}>
                  <IonCardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <IonIcon icon={personOutline} color="primary" />
                          <strong>{record.walker_name}</strong>
                          <IonBadge color="secondary">{record.leave_type}</IonBadge>
                          <IonBadge color={getStatusColor(record.status)}>{record.status}</IonBadge>
                        </div>
                        <p style={{ margin: '0 0 4px' }}>
                          <strong>{formatDate(record.start_date)}</strong>
                          {' → '}
                          <strong>{formatDate(record.end_date)}</strong>
                          {' '}
                          <span style={{ color: 'var(--ion-color-medium)', fontSize: '0.85rem' }}>
                            ({calcDays(record.start_date, record.end_date)} day{calcDays(record.start_date, record.end_date) !== 1 ? 's' : ''})
                          </span>
                        </p>
                        {record.notes && (
                          <p style={{ margin: 0, color: 'var(--ion-color-medium)', fontSize: '0.85rem' }}>
                            {record.notes}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <IonButton size="small" fill="outline" onClick={() => openEdit(record)}>
                          <IonIcon icon={createOutline} />
                        </IonButton>
                        <IonButton size="small" fill="outline" color="danger" onClick={() => setDeleteAlert({ show: true, id: record.id })}>
                          <IonIcon icon={trash} />
                        </IonButton>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>

        <IonAlert
          isOpen={deleteAlert.show}
          onDidDismiss={() => setDeleteAlert({ show: false, id: null })}
          header="Delete Leave Record"
          message="Are you sure you want to delete this leave record?"
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => handleDelete(deleteAlert.id),
            },
          ]}
        />

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={3000}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>
    </IonPage>
  );
}
