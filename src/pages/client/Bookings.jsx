import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

export default function ClientBookings() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pastel-header">
          <IonTitle>Bookings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <p>Convert your existing Bookings component to use Ionic components.</p>
          <p>See documentation for examples.</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
