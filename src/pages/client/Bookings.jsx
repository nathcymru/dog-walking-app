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

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, selectedStatus]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/client/bookings', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        setError('Authentication required. Please log in.');
        setBookings([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      // Check if response is an error object
      if (data.error) {
        setError(data.error);
        setBookings([]);
      } else if (Array.isArray(data)) {
        setBookings(data);
        setError(null);
      } else {
        setError('Invalid response format');
        setBookings([]);
      }
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
      <IonContent>
        <Breadcrumbs items={[
          { label: 'Home', path: '/client/dashboard' },
          { label: 'Client', path: '/client/dashboard' },
          { label: 'Bookings', path: '/client/bookings' }
        ]} />
        <div className="ion-padding">
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
