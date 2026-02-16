import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

export default function AdminIncidents() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pastel-header">
          <IonTitle>Incidents</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <p>Convert your existing Incidents component to use Ionic components.</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
