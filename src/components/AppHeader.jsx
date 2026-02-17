import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/react';
import { InitialsAvatar } from './InitialsAvatar';
import { useAuth } from '../utils/auth';

/**
 * AppHeader component displays a header with title and user avatar
 * @param {string} title - Title to display in the header
 */
export const AppHeader = ({ title }) => {
  const { user } = useAuth();

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center' }}>
            <InitialsAvatar 
              fullName={user?.full_name || 'User'} 
              photoUrl={user?.photo_url || ''} 
              sizePx={40}
              ariaLabel="User profile avatar"
            />
          </div>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};
