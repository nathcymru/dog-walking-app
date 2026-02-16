import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

export default function ClientBilling() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pastel-header">
          <IonTitle>Billing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <p>Convert your existing Billing component to use Ionic components.</p>
          <p>See documentation for examples.</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
