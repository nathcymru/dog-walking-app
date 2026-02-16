import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

const Dashboard = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <h2>Card 1</h2>
                <p>Content for Card 1</p>
              </IonCard>
            </IonCol>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <h2>Card 2</h2>
                <p>Content for Card 2</p>
              </IonCard>
            </IonCol>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <h2>Card 3</h2>
                <p>Content for Card 3</p>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;