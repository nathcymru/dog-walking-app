import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonToast,
  IonItem,
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function ClientBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', color: 'danger' });

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Client', path: '/client' },
    { label: 'Bookings', path: '/client/bookings' }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, selectedStatus]);

  const fetchBookings = async () => {
    try {
      // Mock data for demo purposes
      const mockData = [
        {
          id: 1,
          service_type: 'walk',
          status: 'approved',
          datetime_start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          datetime_end: new Date(Date.now() + 90000000).toISOString(),
          pet_names: 'Max, Bella',
          walker_name: 'Sarah Johnson',
          notes: 'Max needs his leash',
          recurrence: 'One-off'
        },
        {
          id: 2,
          service_type: 'walk',
          status: 'completed',
          datetime_start: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          datetime_end: new Date(Date.now() - 82800000).toISOString(),
          pet_names: 'Charlie',
          walker_name: 'Mike Davis',
          notes: null,
          recurrence: 'Weekly'
        },
        {
          id: 3,
          service_type: 'sitting',
          status: 'pending',
          datetime_start: new Date(Date.now() + 172800000).toISOString(), // In 2 days
          datetime_end: new Date(Date.now() + 176400000).toISOString(),
          pet_names: 'Luna',
          walker_name: null,
          notes: 'Luna loves treats',
          recurrence: 'One-off'
        }
      ];
      
      setBookings(mockData);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    const now = new Date();
    
    if (selectedStatus === 'all') {
      setFilteredBookings(bookings);
    } else if (selectedStatus === 'upcoming') {
      // Show approved bookings with future start times
      setFilteredBookings(
        bookings.filter(
          (b) => new Date(b.datetime_start) > now && b.status === 'approved'
        )
      );
    } else if (selectedStatus === 'past') {
      // Show bookings where the end time has passed or status is completed
      setFilteredBookings(
        bookings.filter(
          (b) => b.status === 'completed' || new Date(b.datetime_end) < now
        )
      );
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === selectedStatus));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: 'success',
      pending: 'warning',
      cancelled: 'danger',
      completed: 'medium',
    };
    return colors[status] || 'medium';
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Bookings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Bookings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Breadcrumbs items={breadcrumbItems} />
        <div>
          <IonSegment value={selectedStatus} onIonChange={(e) => setSelectedStatus(e.detail.value)}>
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="upcoming">
              <IonLabel>Upcoming</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="past">
              <IonLabel>Past</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pending">
              <IonLabel>Pending</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cancelled">
              <IonLabel>Cancelled</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {error ? (
            <IonCard>
              <IonCardContent>
                <p style={{ color: 'var(--ion-color-danger)' }}>{error}</p>
              </IonCardContent>
            </IonCard>
          ) : filteredBookings.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>No bookings found for the selected filter.</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {filteredBookings.map((booking) => (
                <IonCard key={booking.id}>
                  <IonCardHeader>
                    <IonCardTitle>
                      {booking.service_type.charAt(0).toUpperCase() + booking.service_type.slice(1)}
                      <IonBadge color={getStatusColor(booking.status)} style={{ marginLeft: '10px' }}>
                        {booking.status}
                      </IonBadge>
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Pets:</strong> {booking.pet_names || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(booking.datetime_start).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {new Date(booking.datetime_start).toLocaleTimeString()} - {new Date(booking.datetime_end).toLocaleTimeString()}</p>
                        <p><strong>Walker:</strong> {booking.walker_name || 'To be assigned'}</p>
                        {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                        {booking.recurrence && booking.recurrence !== 'One-off' && (
                          <p><strong>Recurrence:</strong> {booking.recurrence}</p>
                        )}
                      </IonLabel>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          )}
        </div>

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
