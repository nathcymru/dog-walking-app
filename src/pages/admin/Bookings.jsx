import React, { useState, useEffect, useMemo } from 'react';
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
  IonButton,
  IonModal,
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
} from '@ionic/react';
import { add, create, trash, close } from 'ionicons/icons';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, bookingId: null });

  const [formData, setFormData] = useState({
    client_id: '',
    datetime_start: '',
    datetime_end: '',
    service_type: 'walk',
    status: 'approved',
    walker_name: '',
    notes: '',
    admin_comment: '',
    time_window_start: '',
    time_window_end: '',
    recurrence: 'One-off',
    pet_ids: [],
  });

  useEffect(() => {
    fetchBookings();
    fetchClients();
    fetchPets();
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

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        console.error('Authentication required for clients');
        setClients([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Failed to fetch clients', data.error);
        setClients([]);
      } else if (Array.isArray(data)) {
        setClients(data);
      } else {
        console.error('Invalid response format for clients');
        setClients([]);
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
      setClients([]);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/admin/pets', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        console.error('Authentication required for pets');
        setPets([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Failed to fetch pets', data.error);
        setPets([]);
      } else if (Array.isArray(data)) {
        setPets(data);
      } else {
        console.error('Invalid response format for pets');
        setPets([]);
      }
    } catch (error) {
      console.error('Failed to fetch pets', error);
      setPets([]);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const openCreateModal = () => {
    setEditingBooking(null);
    setFormData({
      client_id: '',
      datetime_start: '',
      datetime_end: '',
      service_type: 'walk',
      status: 'approved',
      walker_name: '',
      notes: '',
      admin_comment: '',
      time_window_start: '',
      time_window_end: '',
      recurrence: 'One-off',
      pet_ids: [],
    });
    setShowModal(true);
  };

  const openEditModal = async (booking) => {
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`);
      const data = await response.json();
      setEditingBooking(data);
      setFormData({
        client_id: data.client_id,
        datetime_start: data.datetime_start,
        datetime_end: data.datetime_end,
        service_type: data.service_type,
        status: data.status,
        walker_name: data.walker_name || '',
        notes: data.notes || '',
        admin_comment: data.admin_comment || '',
        time_window_start: data.time_window_start || '',
        time_window_end: data.time_window_end || '',
        recurrence: data.recurrence || 'One-off',
        pet_ids: data.pet_ids || [],
      });
      setShowModal(true);
    } catch (error) {
      showToast('Failed to fetch booking details', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client_id || !formData.datetime_start || !formData.datetime_end || !formData.service_type) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    try {
      const url = editingBooking 
        ? `/api/admin/bookings/${editingBooking.id}`
        : '/api/admin/bookings';
      
      const method = editingBooking ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(editingBooking ? 'Booking updated successfully' : 'Booking created successfully');
        setShowModal(false);
        fetchBookings();
      } else {
        showToast('Failed to save booking', 'danger');
      }
    } catch (error) {
      showToast('Error saving booking', 'danger');
    }
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

  // Memoize filtered pets to avoid recalculating on every render
  // Only show pets for the selected client, or empty list if no client selected
  const filteredPets = useMemo(() => {
    if (!formData.client_id) return [];
    return pets.filter(pet => pet.client_id === formData.client_id);
  }, [pets, formData.client_id]);

  const getStatusColor = (status) => {
    const colors = {
      approved: 'success',
      pending: 'warning',
      cancelled: 'danger',
      completed: 'medium',
    };
    return colors[status] || 'medium';
  };

import React, { useState, useEffect, useMemo } from 'react';
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
  IonButton,
  IonModal,
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
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { add, create, trash, close } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, bookingId: null });

  const [formData, setFormData] = useState({
    client_id: '',
    datetime_start: '',
    datetime_end: '',
    service_type: 'walk',
    status: 'approved',
    walker_name: '',
    notes: '',
    admin_comment: '',
    time_window_start: '',
    time_window_end: '',
    recurrence: 'One-off',
    pet_ids: [],
  });

  useEffect(() => {
    fetchBookings();
    fetchClients();
    fetchPets();
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

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        console.error('Authentication required for clients');
        setClients([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Failed to fetch clients', data.error);
        setClients([]);
      } else if (Array.isArray(data)) {
        setClients(data);
      } else {
        console.error('Invalid response format for clients');
        setClients([]);
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
      setClients([]);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/admin/pets', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        console.error('Authentication required for pets');
        setPets([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Failed to fetch pets', data.error);
        setPets([]);
      } else if (Array.isArray(data)) {
        setPets(data);
      } else {
        console.error('Invalid response format for pets');
        setPets([]);
      }
    } catch (error) {
      console.error('Failed to fetch pets', error);
      setPets([]);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const openCreateModal = () => {
    setEditingBooking(null);
    setFormData({
      client_id: '',
      datetime_start: '',
      datetime_end: '',
      service_type: 'walk',
      status: 'approved',
      walker_name: '',
      notes: '',
      admin_comment: '',
      time_window_start: '',
      time_window_end: '',
      recurrence: 'One-off',
      pet_ids: [],
    });
    setShowModal(true);
  };

  const openEditModal = async (booking) => {
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`);
      const data = await response.json();
      setEditingBooking(data);
      setFormData({
        client_id: data.client_id,
        datetime_start: data.datetime_start,
        datetime_end: data.datetime_end,
        service_type: data.service_type,
        status: data.status,
        walker_name: data.walker_name || '',
        notes: data.notes || '',
        admin_comment: data.admin_comment || '',
        time_window_start: data.time_window_start || '',
        time_window_end: data.time_window_end || '',
        recurrence: data.recurrence || 'One-off',
        pet_ids: data.pet_ids || [],
      });
      setShowModal(true);
    } catch (error) {
      showToast('Failed to fetch booking details', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client_id || !formData.datetime_start || !formData.datetime_end || !formData.service_type) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    try {
      const url = editingBooking 
        ? `/api/admin/bookings/${editingBooking.id}`
        : '/api/admin/bookings';
      
      const method = editingBooking ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(editingBooking ? 'Booking updated successfully' : 'Booking created successfully');
        setShowModal(false);
        fetchBookings();
      } else {
        showToast('Failed to save booking', 'danger');
      }
    } catch (error) {
      showToast('Error saving booking', 'danger');
    }
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

  // Memoize filtered pets to avoid recalculating on every render
  // Only show pets for the selected client, or empty list if no client selected
  const filteredPets = useMemo(() => {
    if (!formData.client_id) return [];
    return pets.filter(pet => pet.client_id === formData.client_id);
  }, [pets, formData.client_id]);

  const getStatusColor = (status) => {
    const colors = {
      approved: 'success',
      pending: 'warning',
      cancelled: 'danger',
      completed: 'medium',
    };
    return colors[status] || 'medium';
  };

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Bookings', path: '/admin/bookings' }
  ];

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Bookings</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <Breadcrumbs items={breadcrumbItems} />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner color="primary" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Bookings</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openCreateModal}>
              <IonIcon icon={add} slot="start" />
              New
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonButton expand="block" color="primary" onClick={openCreateModal}>
                <IonIcon icon={add} slot="start" />
                Add New Booking
              </IonButton>
            </IonCol>
          </IonRow>

          {bookings.length === 0 ? (
            <IonRow>
              <IonCol size="12">
                <IonCard>
                  <IonCardContent className="ion-text-center">
                    <p>No bookings found. Create your first booking!</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          ) : (
            <IonRow>
              {bookings.map((booking) => (
                <IonCol size="12" sizeMd="6" sizeLg="4" key={booking.id}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        {booking.client_name}
                        <IonBadge color={getStatusColor(booking.status)} style={{ marginLeft: '10px' }}>
                          {booking.status}
                        </IonBadge>
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList lines="none">
                        <IonItem>
                          <IonLabel>
                            <h3>Pets</h3>
                            <p>{booking.pet_names || 'N/A'}</p>
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonLabel>
                            <h3>Service</h3>
                            <p>{booking.service_type}</p>
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonLabel>
                            <h3>Start</h3>
                            <p>{new Date(booking.datetime_start).toLocaleString()}</p>
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonLabel>
                            <h3>End</h3>
                            <p>{new Date(booking.datetime_end).toLocaleString()}</p>
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonLabel>
                            <h3>Walker</h3>
                            <p>{booking.walker_name || 'Not assigned'}</p>
                          </IonLabel>
                        </IonItem>
                        {booking.notes && (
                          <IonItem>
                            <IonLabel>
                              <h3>Notes</h3>
                              <p>{booking.notes}</p>
                            </IonLabel>
                          </IonItem>
                        )}
                      </IonList>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <IonButton expand="block" fill="outline" color="primary" onClick={() => openEditModal(booking)}>
                          <IonIcon icon={create} slot="start" />
                          Edit
                        </IonButton>
                        <IonButton expand="block" fill="outline" color="danger" onClick={() => setDeleteAlert({ show: true, bookingId: booking.id })}>
                          <IonIcon icon={trash} slot="start" />
                          Delete
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          )}
        </IonGrid>

        {/* Create/Edit Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>{editingBooking ? 'Edit Booking' : 'Create Booking'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={handleSubmit} className="ion-padding">
              <IonItem>
                <IonLabel position="stacked">Client *</IonLabel>
                <IonSelect
                  value={formData.client_id}
                  onIonChange={(e) => setFormData({ ...formData, client_id: e.detail.value })}
                >
                  <IonSelectOption value="">Select Client</IonSelectOption>
                  {clients.map((client) => (
                    <IonSelectOption key={client.id} value={client.id}>
                      {client.full_name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Pets</IonLabel>
                <IonSelect
                  multiple
                  value={formData.pet_ids}
                  onIonChange={(e) => setFormData({ ...formData, pet_ids: e.detail.value })}
                >
                  {filteredPets.map((pet) => (
                    <IonSelectOption key={pet.id} value={pet.id}>
                      {pet.name} ({pet.client_name})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Start Date & Time *</IonLabel>
                <IonInput
                  type="datetime-local"
                  value={formData.datetime_start}
                  onIonInput={(e) => setFormData({ ...formData, datetime_start: e.detail.value })}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">End Date & Time *</IonLabel>
                <IonInput
                  type="datetime-local"
                  value={formData.datetime_end}
                  onIonInput={(e) => setFormData({ ...formData, datetime_end: e.detail.value })}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Service Type *</IonLabel>
                <IonSelect
                  value={formData.service_type}
                  onIonChange={(e) => setFormData({ ...formData, service_type: e.detail.value })}
                >
                  <IonSelectOption value="walk">Walk</IonSelectOption>
                  <IonSelectOption value="visit">Visit</IonSelectOption>
                  <IonSelectOption value="sitting">Sitting</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Status</IonLabel>
                <IonSelect
                  value={formData.status}
                  onIonChange={(e) => setFormData({ ...formData, status: e.detail.value })}
                >
                  <IonSelectOption value="approved">Approved</IonSelectOption>
                  <IonSelectOption value="pending">Pending</IonSelectOption>
                  <IonSelectOption value="cancelled">Cancelled</IonSelectOption>
                  <IonSelectOption value="completed">Completed</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Walker Name</IonLabel>
                <IonInput
                  value={formData.walker_name}
                  onIonInput={(e) => setFormData({ ...formData, walker_name: e.detail.value })}
                  placeholder="Enter walker name"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Recurrence</IonLabel>
                <IonSelect
                  value={formData.recurrence}
                  onIonChange={(e) => setFormData({ ...formData, recurrence: e.detail.value })}
                >
                  <IonSelectOption value="One-off">One-off</IonSelectOption>
                  <IonSelectOption value="Daily">Daily</IonSelectOption>
                  <IonSelectOption value="Weekly">Weekly</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Time Window Start</IonLabel>
                <IonInput
                  type="time"
                  value={formData.time_window_start}
                  onIonInput={(e) => setFormData({ ...formData, time_window_start: e.detail.value })}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Time Window End</IonLabel>
                <IonInput
                  type="time"
                  value={formData.time_window_end}
                  onIonInput={(e) => setFormData({ ...formData, time_window_end: e.detail.value })}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Notes</IonLabel>
                <IonTextarea
                  value={formData.notes}
                  onIonInput={(e) => setFormData({ ...formData, notes: e.detail.value })}
                  placeholder="Enter any notes"
                  rows={3}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Admin Comment</IonLabel>
                <IonTextarea
                  value={formData.admin_comment}
                  onIonInput={(e) => setFormData({ ...formData, admin_comment: e.detail.value })}
                  placeholder="Enter admin comments"
                  rows={3}
                />
              </IonItem>

              <div className="ion-padding-top">
                <IonButton expand="block" type="submit" color="primary">
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                </IonButton>
                <IonButton expand="block" fill="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </IonButton>
              </div>
            </form>
          </IonContent>
        </IonModal>

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
