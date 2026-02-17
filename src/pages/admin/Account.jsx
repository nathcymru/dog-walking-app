import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import { personOutline, mailOutline, logOutOutline, saveOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../utils/auth';
import Breadcrumbs from '../../components/Breadcrumbs';

const AdminAccount = () => {
  const { user, logout, updateUser } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Account', path: '/admin/account' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real implementation, you'd call an API endpoint to update admin profile
      // For now, just update local state
      await updateUser({
        ...user,
        full_name: formData.full_name,
        email: formData.email,
      });

      setToast({
        show: true,
        message: 'Account updated successfully',
        color: 'success'
      });
    } catch (error) {
      console.error('Save error:', error);
      setToast({
        show: true,
        message: 'Failed to update account',
        color: 'danger'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Account Settings" />
        <IonContent>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title="Account Settings" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          {/* Profile Information Card */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Profile Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonIcon icon={personOutline} slot="start" />
                <IonLabel position="stacked">Full Name</IonLabel>
                <IonInput
                  value={formData.full_name}
                  onIonChange={(e) => handleInputChange('full_name', e.detail.value)}
                  placeholder="Enter your name"
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  value={formData.email}
                  type="email"
                  onIonChange={(e) => handleInputChange('email', e.detail.value)}
                  placeholder="Enter your email"
                />
              </IonItem>

              <div style={{ marginTop: '20px' }}>
                <IonButton 
                  expand="block" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  <IonIcon icon={saveOutline} slot="start" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Account Actions Card */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Account Actions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton 
                expand="block" 
                fill="outline" 
                color="danger" 
                onClick={handleLogout}
              >
                <IonIcon icon={logOutOutline} slot="start" />
                Logout
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Role Information */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Role Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem lines="none">
                <IonLabel>
                  <h3>Account Type</h3>
                  <p>Administrator</p>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonLabel>
                  <h3>User ID</h3>
                  <p>{user?.id}</p>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
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
};

export default AdminAccount;
