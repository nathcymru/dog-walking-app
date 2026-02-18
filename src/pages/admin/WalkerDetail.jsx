import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
} from '@ionic/react';
import { create, arrowBack, mailOutline, phonePortraitOutline, locationOutline, personOutline, briefcaseOutline, medicalOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function WalkerDetail() {
  const { walkerId } = useParams();
  const history = useHistory();
  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Walkers', path: '/admin/walkers' },
    { label: 'Walker Details', path: `/admin/walkers/${walkerId}` }
  ];

  useEffect(() => {
    fetchWalker();
  }, [walkerId]);

  const fetchWalker = async () => {
    try {
      const response = await fetch(`/api/admin/walkers/${walkerId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 404) {
        showToast('Walker not found', 'danger');
        setLoading(false);
        return;
      }

      if (response.status === 403 || response.status === 401) {
        showToast('Authentication required. Please log in.', 'danger');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        showToast(data.error, 'danger');
      } else {
        setWalker(data);
      }
    } catch (error) {
      showToast('Failed to fetch walker', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const goBack = () => {
    history.push('/admin/walkers');
  };

  const openEditForm = () => {
    history.push(`/admin/walkers/${walkerId}/edit`);
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
    if (!walker) return '';
    return walker.preferred_name || `${walker.first_name} ${walker.last_name}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Walker Details" />
        <IonContent>
          <div className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!walker) {
    return (
      <IonPage>
        <AppHeader title="Walker Details" />
        <IonContent>
          <div className="ion-padding">
            <IonCard>
              <IonCardContent>
                <p>Walker not found.</p>
                <IonButton onClick={goBack}>
                  <IonIcon icon={arrowBack} slot="start" />
                  Back to Walkers
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title={getDisplayName(walker)} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <IonButton onClick={goBack} fill="outline">
              <IonIcon icon={arrowBack} slot="start" />
              Back
            </IonButton>
            <IonButton onClick={openEditForm} color="primary">
              <IonIcon icon={create} slot="start" />
              Edit
            </IonButton>
          </div>

          {/* Contact Information */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IonCardTitle>Contact Information</IonCardTitle>
                <IonBadge color={getStatusColor(walker.account_status)}>
                  {walker.account_status}
                </IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel>
                    <h3>Full Name</h3>
                    <p>{walker.first_name} {walker.last_name}</p>
                  </IonLabel>
                </IonItem>
                {walker.preferred_name && (
                  <IonItem>
                    <IonIcon icon={personOutline} slot="start" />
                    <IonLabel>
                      <h3>Preferred Name</h3>
                      <p>{walker.preferred_name}</p>
                    </IonLabel>
                  </IonItem>
                )}
                <IonItem>
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel>
                    <h3>Email</h3>
                    <p><a href={`mailto:${walker.email}`}>{walker.email}</a></p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={phonePortraitOutline} slot="start" />
                  <IonLabel>
                    <h3>Mobile Phone</h3>
                    <p><a href={`tel:${walker.phone_mobile}`}>{walker.phone_mobile}</a></p>
                  </IonLabel>
                </IonItem>
                {walker.phone_alternative && (
                  <IonItem>
                    <IonIcon icon={phonePortraitOutline} slot="start" />
                    <IonLabel>
                      <h3>Alternative Phone</h3>
                      <p><a href={`tel:${walker.phone_alternative}`}>{walker.phone_alternative}</a></p>
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Address */}
          {(walker.address_line_1 || walker.town_city || walker.postcode) && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Address</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  <IonItem>
                    <IonIcon icon={locationOutline} slot="start" />
                    <IonLabel>
                      <h3>Address</h3>
                      <p>
                        {walker.address_line_1 && <>{walker.address_line_1}<br /></>}
                        {walker.town_city && <>{walker.town_city}<br /></>}
                        {walker.postcode && <>{walker.postcode}</>}
                      </p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          {/* Emergency Contact */}
          {(walker.emergency_contact_name || walker.emergency_contact_phone) && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Emergency Contact</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  {walker.emergency_contact_name && (
                    <IonItem>
                      <IonIcon icon={medicalOutline} slot="start" />
                      <IonLabel>
                        <h3>Name</h3>
                        <p>{walker.emergency_contact_name}</p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {walker.emergency_contact_phone && (
                    <IonItem>
                      <IonIcon icon={phonePortraitOutline} slot="start" />
                      <IonLabel>
                        <h3>Phone</h3>
                        <p><a href={`tel:${walker.emergency_contact_phone}`}>{walker.emergency_contact_phone}</a></p>
                      </IonLabel>
                    </IonItem>
                  )}
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          {/* Employment Details */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Employment Details</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonIcon icon={briefcaseOutline} slot="start" />
                  <IonLabel>
                    <h3>Employment Status</h3>
                    <p style={{ textTransform: 'capitalize' }}>{walker.employment_status}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={briefcaseOutline} slot="start" />
                  <IonLabel>
                    <h3>Start Date</h3>
                    <p>{formatDate(walker.start_date)}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Notes */}
          {walker.notes_internal && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Internal Notes</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p style={{ whiteSpace: 'pre-wrap' }}>{walker.notes_internal}</p>
              </IonCardContent>
            </IonCard>
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
