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
  IonTextarea,
  IonItem,
  IonLabel,
  IonAlert,
} from '@ionic/react';
import { checkmarkCircle, closeCircle, timeOutline, personOutline, pawOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function BookingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [decisionAlert, setDecisionAlert] = useState({ show: false, bookingId: null, action: null });
  const [decisionNotes, setDecisionNotes] = useState('');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Bookings', path: '/admin/bookings' },
    { label: 'Requests', path: '/admin/bookings/requests' },
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/bookings/requests', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
      } else {
        showToast('Failed to fetch booking requests', 'danger');
      }
    } catch {
      showToast('Failed to fetch booking requests', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const handleDecision = async (bookingId, action) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/${action}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision_notes: decisionNotes }),
      });

      if (response.ok) {
        showToast(`Booking ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        setDecisionNotes('');
        fetchRequests();
      } else {
        const err = await response.json();
        showToast(err.error || `Failed to ${action} booking`, 'danger');
      }
    } catch {
      showToast(`Failed to ${action} booking`, 'danger');
    }
  };

  const openDecisionAlert = (bookingId, action) => {
    setDecisionNotes('');
    setDecisionAlert({ show: true, bookingId, action });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Booking Requests" />
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
      <AppHeader title="Booking Requests" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          {requests.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>
                  No pending booking requests. 🎉
                </p>
              </IonCardContent>
            </IonCard>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {requests.map((req) => (
                <IonCard key={req.id}>
                  <IonCardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <IonCardTitle>Booking #{req.id}</IonCardTitle>
                      <IonBadge color="warning">Pending</IonBadge>
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonIcon icon={personOutline} color="primary" />
                        <span><strong>Client:</strong> {req.client_name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonIcon icon={pawOutline} color="success" />
                        <span><strong>Pets:</strong> {req.pet_names || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonIcon icon={timeOutline} color="tertiary" />
                        <span>
                          <strong>Slot:</strong> {formatDateTime(req.slot_start_at || req.datetime_start)}
                          {req.slot_walk_type && (
                            <IonBadge color={req.slot_walk_type === 'GROUP' ? 'primary' : 'success'} style={{ marginLeft: '8px' }}>
                              {req.slot_walk_type}
                            </IonBadge>
                          )}
                        </span>
                      </div>
                      {req.slot_location && (
                        <p style={{ margin: 0, paddingLeft: '28px' }}>
                          <strong>Location:</strong> {req.slot_location}
                        </p>
                      )}
                      {req.walker_name && (
                        <p style={{ margin: 0, paddingLeft: '28px' }}>
                          <strong>Walker:</strong> {req.walker_name}
                        </p>
                      )}
                      {req.notes && (
                        <p style={{ margin: 0, paddingLeft: '28px' }}>
                          <strong>Notes:</strong> {req.notes}
                        </p>
                      )}
                      <p style={{ margin: 0, color: 'var(--ion-color-medium)', fontSize: '0.85rem' }}>
                        Requested: {formatDateTime(req.requested_at)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <IonButton
                        color="success"
                        onClick={() => openDecisionAlert(req.id, 'approve')}
                        style={{ flex: 1 }}
                      >
                        <IonIcon icon={checkmarkCircle} slot="start" />
                        Approve
                      </IonButton>
                      <IonButton
                        color="danger"
                        fill="outline"
                        onClick={() => openDecisionAlert(req.id, 'reject')}
                        style={{ flex: 1 }}
                      >
                        <IonIcon icon={closeCircle} slot="start" />
                        Reject
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>

        <IonAlert
          isOpen={decisionAlert.show}
          onDidDismiss={() => setDecisionAlert({ show: false, bookingId: null, action: null })}
          header={decisionAlert.action === 'approve' ? 'Approve Booking' : 'Reject Booking'}
          message={
            decisionAlert.action === 'approve'
              ? 'Are you sure you want to approve this booking request?'
              : 'Are you sure you want to reject this booking request? You can add a note below.'
          }
          inputs={[
            {
              name: 'decision_notes',
              type: 'textarea',
              placeholder: decisionAlert.action === 'approve'
                ? 'Optional note to client...'
                : 'Reason for rejection (recommended)...',
            },
          ]}
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            {
              text: decisionAlert.action === 'approve' ? 'Approve' : 'Reject',
              role: 'confirm',
              handler: (data) => {
                setDecisionNotes(data?.decision_notes || '');
                handleDecision(decisionAlert.bookingId, decisionAlert.action);
              },
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
