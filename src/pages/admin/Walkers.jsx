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
  IonBadge,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { add, create, eye, mailOutline, phonePortraitOutline, personOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory } from 'react-router-dom';

export default function Walkers() {
  const history = useHistory();
  const [walkers, setWalkers] = useState([]);
  const [filteredWalkers, setFilteredWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Walkers', path: '/admin/walkers' }
  ];

  useEffect(() => {
    fetchWalkers();
  }, []);

  useEffect(() => {
    // Filter walkers based on search text and status
    let filtered = walkers;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(walker => walker.account_status === statusFilter);
    }

    if (searchText.trim() !== '') {
      filtered = filtered.filter(walker => 
        walker.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        walker.last_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        walker.preferred_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        walker.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        walker.phone_mobile?.includes(searchText)
      );
    }

    setFilteredWalkers(filtered);
  }, [walkers, searchText, statusFilter]);

  const fetchWalkers = async () => {
    try {
      const response = await fetch('/api/admin/walkers', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        showToast('Authentication required. Please log in.', 'danger');
        setWalkers([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        showToast(data.error, 'danger');
        setWalkers([]);
      } else if (Array.isArray(data)) {
        setWalkers(data);
      } else {
        showToast('Invalid response format', 'danger');
        setWalkers([]);
      }
    } catch (error) {
      showToast('Failed to fetch walkers', 'danger');
      setWalkers([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const openCreateForm = () => {
    history.push('/admin/walkers/new');
  };

  const openEditForm = (walker) => {
    history.push(`/admin/walkers/${walker.walker_id}/edit`);
  };

  const openDetailView = (walker) => {
    history.push(`/admin/walkers/${walker.walker_id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'warning';
      case 'left':
        return 'medium';
      default:
        return 'medium';
    }
  };

  const getDisplayName = (walker) => {
    return walker.preferred_name || `${walker.first_name} ${walker.last_name}`;
  };

  const getInitials = (walker) => {
    const firstName = walker.first_name || '';
    const lastName = walker.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Walkers" />
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
      <AppHeader title="Walkers" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonButton color="primary" onClick={openCreateForm}>
            <IonIcon icon={add} slot="start" />
            Add Walker
          </IonButton>
          
          <IonSearchbar
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value)}
            placeholder="Search walkers by name, email, or phone"
          />
          
          <IonSegment value={statusFilter} onIonChange={(e) => setStatusFilter(e.detail.value)}>
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="active">
              <IonLabel>Active</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="suspended">
              <IonLabel>Suspended</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="left">
              <IonLabel>Left</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          
          {filteredWalkers.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>{searchText || statusFilter !== 'all' ? 'No walkers found matching your criteria.' : 'No walkers found. Create your first walker!'}</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonGrid>
              <IonRow>
                {filteredWalkers.map((walker) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={walker.walker_id}>
                    <IonCard>
                      <IonCardHeader>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {walker.photo_url ? (
                            <img 
                              src={walker.photo_url} 
                              alt={getDisplayName(walker)}
                              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ 
                              width: '50px', 
                              height: '50px', 
                              borderRadius: '50%', 
                              backgroundColor: 'var(--ion-color-primary)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem',
                              fontWeight: 'bold'
                            }}>
                              {getInitials(walker)}
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <IonCardTitle>{getDisplayName(walker)}</IonCardTitle>
                            <IonBadge color={getStatusColor(walker.account_status)}>
                              {walker.account_status}
                            </IonBadge>
                          </div>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonList lines="none">
                          <IonItem>
                            <IonIcon icon={phonePortraitOutline} slot="start" />
                            <IonLabel>
                              <a href={`tel:${walker.phone_mobile}`} style={{ fontSize: '0.9rem', textDecoration: 'none' }}>
                                {walker.phone_mobile}
                              </a>
                            </IonLabel>
                          </IonItem>
                          <IonItem>
                            <IonIcon icon={mailOutline} slot="start" />
                            <IonLabel>
                              <p style={{ fontSize: '0.9rem' }}>{walker.email}</p>
                            </IonLabel>
                          </IonItem>
                        </IonList>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <IonButton size="small" fill="outline" expand="block" onClick={() => openDetailView(walker)}>
                            <IonIcon icon={eye} slot="start" />
                            View
                          </IonButton>
                          <IonButton size="small" fill="outline" expand="block" onClick={() => openEditForm(walker)}>
                            <IonIcon icon={create} slot="start" />
                            Edit
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
