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
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/react';
import { add, eyeOutline, createOutline, closeCircleOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory } from 'react-router-dom';

export default function Slots() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [walkers, setWalkers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  // Filters
  const [dateFrom, setDateFrom] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => {
    const sevenDays = new Date();
    sevenDays.setDate(sevenDays.getDate() + 7);
    return sevenDays.toISOString().split('T')[0];
  });
  const [filterWalkerId, setFilterWalkerId] = useState('');
  const [filterWalkType, setFilterWalkType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Slots', path: '/admin/slots' }
  ];

  useEffect(() => {
    fetchWalkers();
    fetchSlots();
  }, [dateFrom, dateTo, filterWalkerId, filterWalkType, filterStatus]);

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

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', `${dateFrom}T00:00:00.000Z`);
      if (dateTo) params.append('date_to', `${dateTo}T23:59:59.999Z`);
      if (filterWalkerId) params.append('walker_id', filterWalkerId);
      if (filterWalkType) params.append('walk_type', filterWalkType);
      if (filterStatus) params.append('status', filterStatus);

      const response = await fetch(`/api/admin/slots?${params.toString()}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSlots(data);
      } else {
        showToast('Failed to fetch slots', 'danger');
      }
    } catch (error) {
      showToast('Failed to fetch slots', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
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

  return (
    <IonPage>
      <AppHeader title="Slots" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2>Walk Slots</h2>
            <IonButton onClick={() => history.push('/admin/slots/new')}>
              <IonIcon icon={add} slot="start" />
              Add Slot
            </IonButton>
          </div>

          {/* Filters */}
          <IonCard>
            <IonCardContent>
              <h3>Filters</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <IonItem>
                    <IonLabel position="stacked">Date From</IonLabel>
                    <IonInput
                      type="date"
                      value={dateFrom}
                      onIonInput={e => setDateFrom(e.detail.value)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Date To</IonLabel>
                    <IonInput
                      type="date"
                      value={dateTo}
                      onIonInput={e => setDateTo(e.detail.value)}
                    />
                  </IonItem>
                </div>
                <IonItem>
                  <IonLabel position="stacked">Walker</IonLabel>
                  <IonSelect
                    value={filterWalkerId}
                    onIonChange={e => setFilterWalkerId(e.detail.value)}
                    placeholder="All Walkers"
                  >
                    <IonSelectOption value="">All Walkers</IonSelectOption>
                    {walkers.map(walker => (
                      <IonSelectOption key={walker.walker_id} value={walker.walker_id}>
                        {walker.first_name} {walker.last_name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <IonItem>
                    <IonLabel position="stacked">Walk Type</IonLabel>
                    <IonSelect
                      value={filterWalkType}
                      onIonChange={e => setFilterWalkType(e.detail.value)}
                      placeholder="All Types"
                    >
                      <IonSelectOption value="">All Types</IonSelectOption>
                      <IonSelectOption value="GROUP">Group</IonSelectOption>
                      <IonSelectOption value="PRIVATE">Private</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Status</IonLabel>
                    <IonSelect
                      value={filterStatus}
                      onIonChange={e => setFilterStatus(e.detail.value)}
                      placeholder="All Statuses"
                    >
                      <IonSelectOption value="">All Statuses</IonSelectOption>
                      <IonSelectOption value="AVAILABLE">Available</IonSelectOption>
                      <IonSelectOption value="CANCELLED">Cancelled</IonSelectOption>
                      <IonSelectOption value="LOCKED">Locked</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Slots List */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <IonSpinner />
            </div>
          ) : slots.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <IonText color="medium">
                  <p style={{ textAlign: 'center' }}>No slots found for the selected filters.</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {slots.map(slot => (
                <IonCard key={slot.id}>
                  <IonCardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <IonCardTitle>
                        {formatDate(slot.start_at)}
                      </IonCardTitle>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <IonBadge color={getWalkTypeBadgeColor(slot.walk_type)}>
                          {slot.walk_type}
                        </IonBadge>
                        <IonBadge color={getStatusBadgeColor(slot.status)}>
                          {slot.status}
                        </IonBadge>
                      </div>
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <div style={{ marginBottom: '12px' }}>
                      <IonText>
                        <p><strong>Time:</strong> {formatTime(slot.start_at)} - {formatTime(slot.end_at)}</p>
                        <p><strong>Walker:</strong> {slot.walker_name}</p>
                        <p><strong>Capacity:</strong> {slot.booked_count}/{slot.capacity_dogs} dogs</p>
                        {slot.location_label && (
                          <p><strong>Location:</strong> {slot.location_label}</p>
                        )}
                      </IonText>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <IonButton 
                        size="small" 
                        onClick={() => history.push(`/admin/slots/${slot.id}`)}
                      >
                        <IonIcon icon={eyeOutline} slot="start" />
                        View
                      </IonButton>
                      {slot.status === 'AVAILABLE' && (
                        <IonButton 
                          size="small" 
                          fill="outline"
                          onClick={() => history.push(`/admin/slots/${slot.id}/edit`)}
                        >
                          <IonIcon icon={createOutline} slot="start" />
                          Edit
                        </IonButton>
                      )}
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
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
