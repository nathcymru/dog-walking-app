import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonButtons,
  IonIcon,
  IonBadge,
  IonAlert,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFooter,
} from '@ionic/react';
import { add, create, trash, close, listOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory } from 'react-router-dom';

export default function AdminBookings() {
  const history = useHistory();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, bookingId: null });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Bookings', path: '/admin/bookings' }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        showToast('Authentication required. Please log in.', 'danger');
        setBookings([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      // Check if response is an error object
      if (data.error) {
        showToast(data.error, 'danger');
        setBookings([]);
      } else if (Array.isArray(data)) {
        setBookings(data);
      } else {
        showToast('Invalid response format', 'danger');
        setBookings([]);
      }
    } catch (error) {
      showToast('Failed to fetch bookings', 'danger');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const openCreateForm = () => {
    history.push('/admin/bookings/new');
  };

  const openEditForm = (booking) => {
    history.push(`/admin/bookings/${booking.id}/edit`);
  };

  const handleDelete = async (bookingId) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Booking deleted successfully');
        fetchBookings();
      } else {
        showToast('Failed to delete booking', 'danger');
      }
    } catch (error) {
      showToast('Error deleting booking', 'danger');
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
        <AppHeader title="Bookings" />
        <IonContent>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title="Bookings" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <IonButton color="primary" onClick={openCreateForm}>
              <IonIcon icon={add} slot="start" />
              New Booking
            </IonButton>
            <IonButton fill="outline" color="warning" onClick={() => history.push('/admin/bookings/requests')}>
              <IonIcon icon={listOutline} slot="start" />
              Requests
            </IonButton>
          </div>
          
          {bookings.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>No bookings found. Create your first booking!</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {bookings.map((booking) => (
                <IonCard key={booking.id}>
                  <IonCardHeader>
                    <IonCardTitle>
                      {booking.client_name}
                      <IonBadge color={getStatusColor(booking.status)} style={{ marginLeft: '10px' }}>
                        {booking.status}
                      </IonBadge>
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Pets:</strong> {booking.pet_names || 'N/A'}</p>
                        <p><strong>Service:</strong> {booking.service_type}</p>
                        <p><strong>Start:</strong> {new Date(booking.datetime_start).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(booking.datetime_end).toLocaleString()}</p>
                        <p><strong>Walker:</strong> {booking.walker_name || 'Not assigned'}</p>
                        {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                      </IonLabel>
                    </IonItem>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <IonButton size="small" fill="outline" onClick={() => openEditForm(booking)}>
                        <IonIcon icon={create} slot="start" />
                        Edit
                      </IonButton>
                      <IonButton size="small" fill="outline" color="danger" onClick={() => setDeleteAlert({ show: true, bookingId: booking.id })}>
                        <IonIcon icon={trash} slot="start" />
                        Delete
                      </IonButton>
                    </div>
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

        <IonAlert
          isOpen={deleteAlert.show}
          header="Confirm Delete"
          message="Are you sure you want to delete this booking?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setDeleteAlert({ show: false, bookingId: null }),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => {
                handleDelete(deleteAlert.bookingId);
                setDeleteAlert({ show: false, bookingId: null });
              },
            },
          ]}
          onDidDismiss={() => setDeleteAlert({ show: false, bookingId: null })}
        />
      </IonContent>
    </IonPage>
  );
}
