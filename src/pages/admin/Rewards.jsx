import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonList,
  IonBadge, IonSpinner, IonAlert, IonToast, IonSearchbar
} from '@ionic/react';
import { add, create, trash, playCircleOutline, stopCircleOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory } from 'react-router-dom';

export default function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [deleteAlert, setDeleteAlert] = useState({ show: false, id: null });
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const history = useHistory();

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Rewards', path: '/admin/rewards' }
  ];

  useEffect(() => {
    fetchRewards();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredRewards(rewards);
    } else {
      const filtered = rewards.filter(r =>
        r.title.toLowerCase().includes(searchText.toLowerCase()) ||
        r.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredRewards(filtered);
    }
  }, [rewards, searchText]);

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/admin/rewards', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRewards(data);
      }
    } catch (error) {
      showToast('Failed to fetch rewards', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentState) => {
    try {
      const endpoint = currentState ? 'deactivate' : 'activate';
      const response = await fetch(`/api/admin/rewards/${id}/${endpoint}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        showToast(`Reward ${currentState ? 'deactivated' : 'activated'}`, 'success');
        fetchRewards();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update status', 'danger');
      }
    } catch (error) {
      showToast('Failed to update status', 'danger');
    }
  };

  const runLoyalty = async (id) => {
    try {
      const response = await fetch(`/api/admin/rewards/${id}/run-loyalty`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        showToast(`Issued ${data.count} rewards`, 'success');
      } else {
        showToast('Failed to run loyalty calculation', 'danger');
      }
    } catch (error) {
      showToast('Failed to run loyalty', 'danger');
    }
  };

  const deleteReward = async (id) => {
    try {
      const response = await fetch(`/api/admin/rewards/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        showToast('Reward deleted', 'success');
        fetchRewards();
      } else {
        showToast('Failed to delete reward', 'danger');
      }
    } catch (error) {
      showToast('Failed to delete', 'danger');
    }
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'LOYALTY': return 'warning';
      case 'CAMPAIGN': return 'secondary';
      case 'ONE_OFF': return 'tertiary';
      default: return 'medium';
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Rewards" />
        <IonContent>
          <Breadcrumbs items={breadcrumbItems} />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title="Rewards" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonButton color="primary" onClick={() => history.push('/admin/rewards/new')}>
            <IonIcon icon={add} slot="start" />
            New Reward
          </IonButton>

          <IonSearchbar
            value={searchText}
            onIonInput={e => setSearchText(e.detail.value)}
            placeholder="Search rewards..."
            style={{ marginTop: '16px' }}
          />

          {filteredRewards.length === 0 ? (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
                <p>No rewards found</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {filteredRewards.map(reward => (
                <IonCard key={reward.id}>
                  <IonCardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <IonCardTitle>{reward.title}</IonCardTitle>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <IonBadge color={getTypeColor(reward.type)}>
                          {reward.type}
                        </IonBadge>
                        {reward.is_active ? (
                          <IonBadge color="success">Active</IonBadge>
                        ) : (
                          <IonBadge color="medium">Inactive</IonBadge>
                        )}
                      </div>
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>{reward.description}</p>
                    
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <IonButton 
                        size="small" 
                        fill="outline"
                        onClick={() => history.push(`/admin/rewards/${reward.id}`)}
                      >
                        <IonIcon icon={create} slot="start" />
                        Edit
                      </IonButton>
                      
                      <IonButton 
                        size="small" 
                        fill="outline"
                        color={reward.is_active ? 'danger' : 'success'}
                        onClick={() => toggleActive(reward.id, reward.is_active)}
                      >
                        <IonIcon icon={reward.is_active ? stopCircleOutline : playCircleOutline} slot="start" />
                        {reward.is_active ? 'Deactivate' : 'Activate'}
                      </IonButton>
                      
                      {reward.type === 'LOYALTY' && reward.is_active && (
                        <IonButton 
                          size="small" 
                          fill="outline"
                          color="primary"
                          onClick={() => runLoyalty(reward.id)}
                        >
                          <IonIcon icon={playCircleOutline} slot="start" />
                          Run Loyalty
                        </IonButton>
                      )}
                      
                      <IonButton 
                        size="small" 
                        fill="outline"
                        color="danger"
                        onClick={() => setDeleteAlert({ show: true, id: reward.id })}
                      >
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

        <IonAlert
          isOpen={deleteAlert.show}
          header="Delete Reward"
          message="Are you sure you want to delete this reward? This action cannot be undone."
          buttons={[
            { text: 'Cancel', role: 'cancel', handler: () => setDeleteAlert({ show: false, id: null }) },
            { text: 'Delete', role: 'destructive', handler: () => {
              deleteReward(deleteAlert.id);
              setDeleteAlert({ show: false, id: null });
            }}
          ]}
        />

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
