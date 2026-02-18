import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonToast,
  IonIcon,
  IonBadge,
  IonAlert,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { add, create, trash } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function AdminIncidents() {
  const history = useHistory();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, incidentId: null });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Incidents', path: '/admin/incidents' }
  ];

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/admin/incidents', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        showToast('Authentication required. Please log in.', 'danger');
        setIncidents([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      // Check if response is an error object
      if (data.error) {
        showToast(data.error, 'danger');
        setIncidents([]);
      } else if (Array.isArray(data)) {
        setIncidents(data);
      } else {
        showToast('Invalid response format', 'danger');
        setIncidents([]);
      }
    } catch (error) {
      showToast('Failed to fetch incidents', 'danger');
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const openCreateForm = () => {
    history.push('/admin/incidents/new');
  };

  const openEditForm = (incident) => {
    history.push(`/admin/incidents/${incident.id}/edit`);
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
        <AppHeader title="Incidents" />
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
      <AppHeader title="Incidents" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonButton color="primary" onClick={openCreateForm}>
            <IonIcon icon={add} slot="start" />
            Report Incident
          </IonButton>
          
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
                      <IonButton size="small" fill="outline" onClick={() => openEditForm(incident)}>
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
