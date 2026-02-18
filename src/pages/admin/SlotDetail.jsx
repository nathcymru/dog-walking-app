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
  IonText,
  IonAlert,
} from '@ionic/react';
import { createOutline, closeCircleOutline, arrowBack } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function SlotDetail() {
  const { slotId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [slot, setSlot] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Slots', path: '/admin/slots' },
    { label: 'Slot Detail', path: `/admin/slots/${slotId}` }
  ];

  useEffect(() => {
    fetchSlot();
  }, [slotId]);

  const fetchSlot = async () => {
    try {
      const response = await fetch(`/api/admin/slots/${slotId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSlot(data);
      } else {
        showToast('Failed to load slot', 'danger');
      }
    } catch (error) {
      showToast('Failed to load slot', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
  };

  const handleCancelSlot = async () => {
    setCancelling(true);
    try {
      const response = await fetch(`/api/admin/slots/${slotId}/cancel`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        showToast('Slot cancelled', 'success');
        setTimeout(() => {
          history.goBack();
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Error cancelling slot', 'danger');
      }
    } catch (error) {
      showToast('Error cancelling slot', 'danger');
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWalkTypeBadgeColor = (walkType) => {
    return walkType === 'GROUP' ? 'primary' : 'success';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'CANCELLED': return 'danger';
      case 'LOCKED': return 'warning';
      default: return 'medium';
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Slot Detail" />
        <IonContent>
          <Breadcrumbs items={breadcrumbItems} />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!slot) {
    return (
      <IonPage>
        <AppHeader title="Slot Detail" />
        <IonContent>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="ion-padding">
            <IonCard>
              <IonCardContent>
                <IonText color="danger">
                  <p>Slot not found</p>
                </IonText>
                <IonButton onClick={() => history.push('/admin/slots')}>
                  Back to Slots
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const remainingCapacity = slot.capacity_dogs - (slot.booked_count || 0);

  return (
    <IonPage>
      <AppHeader title="Slot Detail" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2>{formatDate(slot.start_at)}</h2>
              <p style={{ color: 'var(--ion-color-medium)' }}>
                {formatTime(slot.start_at)} - {formatTime(slot.end_at)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <IonBadge color={getWalkTypeBadgeColor(slot.walk_type)}>
                {slot.walk_type}
              </IonBadge>
              <IonBadge color={getStatusBadgeColor(slot.status)}>
                {slot.status}
              </IonBadge>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <IonButton onClick={() => history.goBack()} fill="outline">
              <IonIcon icon={arrowBack} slot="start" />
              Back
            </IonButton>
            {slot.status === 'AVAILABLE' && (
              <>
                <IonButton onClick={() => history.push(`/admin/slots/${slotId}/edit`)}>
                  <IonIcon icon={createOutline} slot="start" />
                  Edit
                </IonButton>
                <IonButton 
                  color="danger" 
                  fill="outline"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelling}
                >
                  <IonIcon icon={closeCircleOutline} slot="start" />
                  Cancel Slot
                </IonButton>
              </>
            )}
          </div>

          {/* Slot Info */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Slot Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p><strong>Walk Type:</strong> {slot.walk_type}</p>
                <p><strong>Capacity:</strong> {slot.capacity_dogs} dogs</p>
                <p><strong>Status:</strong> {slot.status}</p>
                {slot.location_label && (
                  <p><strong>Location:</strong> {slot.location_label}</p>
                )}
                {slot.notes && (
                  <p><strong>Notes:</strong> {slot.notes}</p>
                )}
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Walker Info */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Walker</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p><strong>Name:</strong> {slot.walker_name}</p>
                <p><strong>Phone:</strong> <a href={`tel:${slot.walker_phone}`}>{slot.walker_phone}</a></p>
                {slot.walker_email && (
                  <p><strong>Email:</strong> <a href={`mailto:${slot.walker_email}`}>{slot.walker_email}</a></p>
                )}
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Capacity Summary */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Capacity Summary</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p><strong>Total Capacity:</strong> {slot.capacity_dogs} dogs</p>
                <p><strong>Booked:</strong> {slot.booked_count || 0} dogs</p>
                <p><strong>Remaining:</strong> {remainingCapacity} dogs</p>
              </IonText>
              <div style={{ marginTop: '12px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '24px', 
                  backgroundColor: 'var(--ion-color-light)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${(slot.booked_count || 0) / slot.capacity_dogs * 100}%`,
                    height: '100%',
                    backgroundColor: 'var(--ion-color-primary)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Bookings List (Empty for Phase 2) */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Bookings</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText color="medium">
                <p>Booking list will be available in Phase 4</p>
              </IonText>
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
          isOpen={showCancelConfirm}
          onDidDismiss={() => setShowCancelConfirm(false)}
          header="Cancel Slot"
          message="Are you sure you want to cancel this slot? This action cannot be undone."
          buttons={[
            { text: 'No', role: 'cancel' },
            { text: 'Yes, Cancel Slot', handler: handleCancelSlot }
          ]}
        />
      </IonContent>
    </IonPage>
  );
}
