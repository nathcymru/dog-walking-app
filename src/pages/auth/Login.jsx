import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

export default function Login() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pastel-header">
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>Use your existing login form here with Ionic components.</p>
      </IonContent>
    </IonPage>
  );
}
