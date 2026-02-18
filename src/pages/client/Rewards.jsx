import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonText, IonSpinner,
  IonChip, IonToast
} from '@ionic/react';
import { giftOutline, copyOutline, openOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function ClientRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  const breadcrumbItems = [
    { label: 'Client', path: '/client' },
    { label: 'My Rewards', path: '/client/rewards' }
  ];

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/client/rewards', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRewards(data);
      }
    } catch (error) {
      console.error('Failed to fetch rewards', error);
    } finally {
      setLoading(false);
    }
  };

  const copyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setToast({ show: true, message: 'Voucher code copied!', color: 'success' });
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : null;
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="My Rewards" />
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
      <AppHeader title="My Rewards" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          {rewards.length === 0 ? (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
                <IonIcon icon={giftOutline} style={{ fontSize: '64px', color: 'var(--ion-color-medium)' }} />
                <h2>No active rewards</h2>
                <p>Keep walking to earn loyalty rewards!</p>
              </IonCardContent>
            </IonCard>
          ) : (
            rewards.map(reward => (
              <IonCard key={reward.id}>
                {reward.image_url && (
                  <img src={reward.image_url} alt={reward.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                )}
                <IonCardHeader>
                  <IonCardTitle>{reward.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{reward.description}</p>
                  
                  {reward.voucher_code && (
                    <div style={{ marginTop: '16px', padding: '12px', background: 'var(--ion-color-light)', borderRadius: '8px' }}>
                      <IonText color="medium">
                        <small>Your Voucher Code</small>
                      </IonText>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <IonChip color="primary">
                          <strong>{reward.voucher_code}</strong>
                        </IonChip>
                        <IonButton size="small" fill="clear" onClick={() => copyVoucher(reward.voucher_code)}>
                          <IonIcon icon={copyOutline} slot="icon-only" />
                        </IonButton>
                      </div>
                    </div>
                  )}
                  
                  {(reward.starts_at || reward.ends_at) && (
                    <IonText color="medium" style={{ display: 'block', marginTop: '12px' }}>
                      <small>
                        Valid {reward.starts_at && `from ${formatDate(reward.starts_at)}`}
                        {reward.starts_at && reward.ends_at && ' '}
                        {reward.ends_at && `until ${formatDate(reward.ends_at)}`}
                      </small>
                    </IonText>
                  )}
                  
                  {reward.redemption_mode === 'EXTERNAL_LINK' && (
                    <IonButton expand="block" href={reward.cta_url} target="_blank" style={{ marginTop: '16px' }}>
                      {reward.cta_label}
                      <IonIcon icon={openOutline} slot="end" />
                    </IonButton>
                  )}
                </IonCardContent>
              </IonCard>
            ))
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
