import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

export default function ClientPets() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pastel-header">
          <IonTitle>Pets</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <p>Convert your existing Pets component to use Ionic components.</p>
          <p>See documentation for examples.</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
