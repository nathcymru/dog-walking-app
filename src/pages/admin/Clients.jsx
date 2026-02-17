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
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonButtons,
  IonIcon,
  IonAlert,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
} from '@ionic/react';
import { add, create, trash, close, mailOutline, phonePortraitOutline, locationOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, clientId: null });
  const [searchText, setSearchText] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
  });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Clients', path: '/admin/clients' }
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    // Filter clients based on search text
    if (searchText.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => 
        client.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        client.phone?.includes(searchText)
      );
      setFilteredClients(filtered);
    }
  }, [clients, searchText]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        showToast('Authentication required. Please log in.', 'danger');
        setClients([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        showToast(data.error, 'danger');
        setClients([]);
      } else if (Array.isArray(data)) {
        setClients(data);
      } else {
        showToast('Invalid response format', 'danger');
        setClients([]);
      }
    } catch (error) {
      showToast('Failed to fetch clients', 'danger');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      email: '',
      password: '',
      full_name: '',
      phone: '',
      address: '',
    });
    setShowModal(true);
  };

  const openEditModal = async (client) => {
    try {
      const response = await fetch(`/api/admin/clients/${client.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setEditingClient(data);
      setFormData({
        email: data.email || '',
        password: '', // Don't populate password for security
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
      setShowModal(true);
    } catch (error) {
      showToast('Failed to fetch client details', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!formData.full_name || !formData.email) {
      showToast('Please fill in required fields (Name and Email)', 'warning');
      return;
    }

    if (!editingClient && !formData.password) {
      showToast('Password is required for new clients', 'warning');
      return;
    }

    try {
      const url = editingClient 
        ? `/api/admin/clients/${editingClient.id}`
        : '/api/admin/clients';
      
      const method = editingClient ? 'PUT' : 'POST';

      // Only include password if it's set
      const payload = { ...formData };
      if (editingClient && !formData.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast(editingClient ? 'Client updated successfully' : 'Client created successfully');
        setShowModal(false);
        fetchClients();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save client', 'danger');
      }
    } catch (error) {
      showToast('Error saving client', 'danger');
    }
  };

  const handleDelete = async (clientId) => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showToast('Client deleted successfully');
        fetchClients();
      } else {
        showToast('Failed to delete client', 'danger');
      }
    } catch (error) {
      showToast('Error deleting client', 'danger');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Clients" />
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
      <AppHeader title="Clients" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonButton color="primary" onClick={openCreateModal}>
            <IonIcon icon={add} slot="start" />
            Add Client
          </IonButton>
          
          <IonSearchbar
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value)}
            placeholder="Search clients by name, email, or phone"
          />
          
          {filteredClients.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>{searchText ? 'No clients found matching your search.' : 'No clients found. Create your first client!'}</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonGrid>
              <IonRow>
                {filteredClients.map((client) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={client.id}>
                    <IonCard>
                      <IonCardHeader>
                        <IonCardTitle>{client.full_name}</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonList lines="none">
                          <IonItem>
                            <IonIcon icon={mailOutline} slot="start" />
                            <IonLabel>
                              <p style={{ fontSize: '0.9rem' }}>{client.email}</p>
                            </IonLabel>
                          </IonItem>
                          {client.phone && (
                            <IonItem>
                              <IonIcon icon={phonePortraitOutline} slot="start" />
                              <IonLabel>
                                <p style={{ fontSize: '0.9rem' }}>{client.phone}</p>
                              </IonLabel>
                            </IonItem>
                          )}
                          {client.address && (
                            <IonItem>
                              <IonIcon icon={locationOutline} slot="start" />
                              <IonLabel>
                                <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{client.address}</p>
                              </IonLabel>
                            </IonItem>
                          )}
                        </IonList>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <IonButton size="small" fill="outline" expand="block" onClick={() => openEditModal(client)}>
                            <IonIcon icon={create} slot="start" />
                            Edit
                          </IonButton>
                          <IonButton size="small" fill="outline" color="danger" expand="block" onClick={() => setDeleteAlert({ show: true, clientId: client.id })}>
                            <IonIcon icon={trash} slot="start" />
                            Delete
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}
        </div>

        {/* Create/Edit Modal */}
        <IonModal 
          isOpen={showModal} 
          onDidDismiss={() => setShowModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingClient ? 'Edit Client' : 'Create Client'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Full Name <span className="required">*</span></IonLabel>
                <IonInput
                  value={formData.full_name}
                  onIonInput={(e) => setFormData({ ...formData, full_name: e.detail.value })}
                  placeholder="Enter full name"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Email <span className="required">*</span></IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => setFormData({ ...formData, email: e.detail.value })}
                  placeholder="Enter email address"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">
                  Password {editingClient ? '(leave blank to keep current)' : ''} {!editingClient && <span className="required">*</span>}
                </IonLabel>
                <IonInput
                  type="password"
                  value={formData.password}
                  onIonInput={(e) => setFormData({ ...formData, password: e.detail.value })}
                  placeholder={editingClient ? 'Enter new password to change' : 'Enter password'}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Phone</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone}
                  onIonInput={(e) => setFormData({ ...formData, phone: e.detail.value })}
                  placeholder="Enter phone number"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Address</IonLabel>
                <IonTextarea
                  value={formData.address}
                  onIonInput={(e) => setFormData({ ...formData, address: e.detail.value })}
                  placeholder="Enter address"
                  rows={3}
                />
              </IonItem>
            </IonList>
          </IonContent>

          <IonFooter>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Cancel</IonButton>
                <IonButton strong onClick={handleSubmit}>
                  {editingClient ? 'Update' : 'Save'}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonFooter>
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
          message="Are you sure you want to delete this client? This will also delete all associated pets and data."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setDeleteAlert({ show: false, clientId: null }),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => {
                handleDelete(deleteAlert.clientId);
                setDeleteAlert({ show: false, clientId: null });
              },
            },
          ]}
          onDidDismiss={() => setDeleteAlert({ show: false, clientId: null })}
        />
      </IonContent>
    </IonPage>
  );
}