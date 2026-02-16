import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

export default function Home() {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pastel-header">
          <IonTitle>PawWalkers</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-text-center ion-padding">
        <h1>Welcome to PawWalkers</h1>
        <IonButton onClick={() => history.push('/login')}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
}
