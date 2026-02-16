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
  IonButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonSpinner,
  IonToast,
  IonButtons,
  IonIcon,
  IonBadge,
  IonAlert,
} from '@ionic/react';
import { add, create, trash, close } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function AdminIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [pets, setPets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, incidentId: null });

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Admin', path: '/admin' },
    { label: 'Incidents', path: '/admin/incidents' }
  ];

  const [formData, setFormData] = useState({
    incident_datetime: '',
    incident_type: 'injury',
    related_pet_id: '',
    related_booking_id: '',
    location: '',
    summary: '',
    actions_taken: '',
    owner_informed: false,
    attachments: '',
    follow_up_required: false,
    follow_up_notes: '',
  });

  useEffect(() => {
    fetchIncidents();
    fetchPets();
    fetchBookings();
  }, []);

  const fetchIncidents = async () => {
    try {
      // Mock data for demo purposes
      const mockData = [
        {
          id: 1,
          incident_datetime: new Date(Date.now() - 172800000).toISOString(),
          incident_type: 'injury',
          related_pet_id: 1,
          pet_name: 'Max',
          location: 'Oak Park',
          summary: 'Small cut on paw',
          actions_taken: 'Cleaned and bandaged',
          owner_informed: true,
          follow_up_required: false
        },
        {
          id: 2,
          incident_datetime: new Date(Date.now() - 432000000).toISOString(),
          incident_type: 'aggressive_behavior',
          related_pet_id: 3,
          pet_name: 'Charlie',
          location: 'Main Street',
          summary: 'Barked at another dog',
          actions_taken: 'Separated the dogs, continued walk',
          owner_informed: true,
          follow_up_required: true,
          follow_up_notes: 'Discuss training options'
        }
      ];
      
      setIncidents(mockData);
    } catch (error) {
      showToast('Failed to fetch incidents', 'danger');
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      // Mock data for demo purposes
      const mockData = [
        { id: 1, name: 'Max', breed: 'Golden Retriever' },
        { id: 2, name: 'Bella', breed: 'Labrador' },
        { id: 3, name: 'Charlie', breed: 'Beagle' },
        { id: 4, name: 'Luna', breed: 'Poodle' }
      ];
      setPets(mockData);
    } catch (error) {
      console.error('Failed to fetch pets', error);
      setPets([]);
    }
  };

  const fetchBookings = async () => {
    try {
      // Mock data for demo purposes
      const mockData = [
        {
          id: 1,
          datetime_start: new Date(Date.now() + 86400000).toISOString(),
          client_name: 'John Smith',
          pet_names: 'Max, Bella'
        },
        {
          id: 2,
          datetime_start: new Date(Date.now() + 172800000).toISOString(),
          client_name: 'Jane Doe',
          pet_names: 'Charlie'
        }
      ];
      setBookings(mockData);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      setBookings([]);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const openCreateModal = () => {
    setEditingIncident(null);
    setFormData({
      incident_datetime: '',
      incident_type: 'injury',
      related_pet_id: '',
      related_booking_id: '',
      location: '',
      summary: '',
      actions_taken: '',
      owner_informed: false,
      attachments: '',
      follow_up_required: false,
      follow_up_notes: '',
    });
    setShowModal(true);
  };

  const openEditModal = async (incident) => {
    try {
      const response = await fetch(`/api/admin/incidents/${incident.id}`);
      const data = await response.json();
      setEditingIncident(data);
      setFormData({
        incident_datetime: data.incident_datetime,
        incident_type: data.incident_type,
        related_pet_id: data.related_pet_id,
        related_booking_id: data.related_booking_id || '',
        location: data.location || '',
        summary: data.summary,
        actions_taken: data.actions_taken,
        owner_informed: Boolean(data.owner_informed),
        attachments: data.attachments || '',
        follow_up_required: Boolean(data.follow_up_required),
        follow_up_notes: data.follow_up_notes || '',
      });
      setShowModal(true);
    } catch (error) {
      showToast('Failed to fetch incident details', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.incident_datetime || !formData.incident_type || !formData.related_pet_id || !formData.summary || !formData.actions_taken) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    try {
      const url = editingIncident 
        ? `/api/admin/incidents/${editingIncident.id}`
        : '/api/admin/incidents';
      
      const method = editingIncident ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(editingIncident ? 'Incident updated successfully' : 'Incident logged successfully');
        setShowModal(false);
        fetchIncidents();
      } else {
        showToast('Failed to save incident', 'danger');
      }
    } catch (error) {
      showToast('Error saving incident', 'danger');
    }
  };

  const handleDelete = async (incidentId) => {
    try {
      const response = await fetch(`/api/admin/incidents/${incidentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Incident deleted successfully');
        fetchIncidents();
      } else {
        showToast('Failed to delete incident', 'danger');
      }
    } catch (error) {
      showToast('Error deleting incident', 'danger');
    }
  };

  const getIncidentTypeColor = (type) => {
    const colors = {
      injury: 'danger',
      illness: 'warning',
      altercation: 'danger',
      escape: 'warning',
      'property damage': 'medium',
    };
    return colors[type] || 'medium';
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Incidents</IonTitle>
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
          <IonTitle>Incidents</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openCreateModal}>
              <IonIcon icon={add} slot="start" />
              Log Incident
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Breadcrumbs items={breadcrumbItems} />
        <div>
          {incidents.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>No incidents found.</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {incidents.map((incident) => (
                <IonCard key={incident.id}>
                  <IonCardHeader>
                    <IonCardTitle>
                      {incident.pet_name} - {incident.client_name}
                      <IonBadge color={getIncidentTypeColor(incident.incident_type)} style={{ marginLeft: '10px' }}>
                        {incident.incident_type}
                      </IonBadge>
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Date:</strong> {new Date(incident.incident_datetime).toLocaleString()}</p>
                        <p><strong>Location:</strong> {incident.location || 'N/A'}</p>
                        <p><strong>Summary:</strong> {incident.summary}</p>
                        <p><strong>Actions Taken:</strong> {incident.actions_taken}</p>
                        <p><strong>Owner Informed:</strong> {incident.owner_informed ? 'Yes' : 'No'}</p>
                        {incident.follow_up_required && (
                          <p><strong>Follow-up Required:</strong> Yes</p>
                        )}
                        {incident.follow_up_notes && (
                          <p><strong>Follow-up Notes:</strong> {incident.follow_up_notes}</p>
                        )}
                      </IonLabel>
                    </IonItem>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <IonButton size="small" fill="outline" onClick={() => openEditModal(incident)}>
                        <IonIcon icon={create} slot="start" />
                        Edit
                      </IonButton>
                      <IonButton size="small" fill="outline" color="danger" onClick={() => setDeleteAlert({ show: true, incidentId: incident.id })}>
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

        {/* Create/Edit Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingIncident ? 'Edit Incident' : 'Log New Incident'}</IonTitle>
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
                <IonLabel position="stacked">Incident Date & Time *</IonLabel>
                <IonInput
                  type="datetime-local"
                  value={formData.incident_datetime}
                  onIonInput={(e) => setFormData({ ...formData, incident_datetime: e.detail.value })}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Incident Type *</IonLabel>
                <IonSelect
                  value={formData.incident_type}
                  onIonChange={(e) => setFormData({ ...formData, incident_type: e.detail.value })}
                >
                  <IonSelectOption value="injury">Injury</IonSelectOption>
                  <IonSelectOption value="illness">Illness</IonSelectOption>
                  <IonSelectOption value="altercation">Altercation</IonSelectOption>
                  <IonSelectOption value="escape">Escape</IonSelectOption>
                  <IonSelectOption value="property damage">Property Damage</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Pet *</IonLabel>
                <IonSelect
                  value={formData.related_pet_id}
                  onIonChange={(e) => setFormData({ ...formData, related_pet_id: e.detail.value })}
                >
                  <IonSelectOption value="">Select Pet</IonSelectOption>
                  {pets.map((pet) => (
                    <IonSelectOption key={pet.id} value={pet.id}>
                      {pet.name} ({pet.client_name})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Related Booking (Optional)</IonLabel>
                <IonSelect
                  value={formData.related_booking_id}
                  onIonChange={(e) => setFormData({ ...formData, related_booking_id: e.detail.value })}
                >
                  <IonSelectOption value="">None</IonSelectOption>
                  {bookings.map((booking) => (
                    <IonSelectOption key={booking.id} value={booking.id}>
                      {booking.client_name} - {new Date(booking.datetime_start).toLocaleDateString()}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Location</IonLabel>
                <IonInput
                  value={formData.location}
                  onIonInput={(e) => setFormData({ ...formData, location: e.detail.value })}
                  placeholder="Enter location"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Summary *</IonLabel>
                <IonTextarea
                  value={formData.summary}
                  onIonInput={(e) => setFormData({ ...formData, summary: e.detail.value })}
                  placeholder="Describe the incident"
                  rows={4}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Actions Taken *</IonLabel>
                <IonTextarea
                  value={formData.actions_taken}
                  onIonInput={(e) => setFormData({ ...formData, actions_taken: e.detail.value })}
                  placeholder="Describe actions taken"
                  rows={4}
                />
              </IonItem>

              <IonItem>
                <IonLabel>Owner Informed</IonLabel>
                <IonCheckbox
                  checked={formData.owner_informed}
                  onIonChange={(e) => setFormData({ ...formData, owner_informed: e.detail.checked })}
                  slot="start"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Attachments (URLs)</IonLabel>
                <IonInput
                  value={formData.attachments}
                  onIonInput={(e) => setFormData({ ...formData, attachments: e.detail.value })}
                  placeholder="Enter attachment URLs"
                />
              </IonItem>

              <IonItem>
                <IonLabel>Follow-up Required</IonLabel>
                <IonCheckbox
                  checked={formData.follow_up_required}
                  onIonChange={(e) => setFormData({ ...formData, follow_up_required: e.detail.checked })}
                  slot="start"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Follow-up Notes</IonLabel>
                <IonTextarea
                  value={formData.follow_up_notes}
                  onIonInput={(e) => setFormData({ ...formData, follow_up_notes: e.detail.value })}
                  placeholder="Enter follow-up notes"
                  rows={3}
                />
              </IonItem>

              <div className="ion-padding-top">
                <IonButton expand="block" type="submit">
                  {editingIncident ? 'Update Incident' : 'Log Incident'}
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
          message="Are you sure you want to delete this incident?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setDeleteAlert({ show: false, incidentId: null }),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => {
                handleDelete(deleteAlert.incidentId);
                setDeleteAlert({ show: false, incidentId: null });
              },
            },
          ]}
          onDidDismiss={() => setDeleteAlert({ show: false, incidentId: null })}
        />
      </IonContent>
    </IonPage>
  );
}
