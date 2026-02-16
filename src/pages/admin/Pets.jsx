import React from 'react';
import { 
  IonPage, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, 
  IonList, 
  IonItem, 
  IonButton,
  IonLabel,
  IonButtons,
  IonIcon
} from '@ionic/react';
import { add, create } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

const Pets = () => {
    const breadcrumbItems = [
        { label: 'Admin', path: '/admin' },
        { label: 'Pets', path: '/admin/pets' }
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Pets</IonTitle>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon icon={add} slot="start" />
                            Add Pet
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Breadcrumbs items={breadcrumbItems} />
                <div className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonLabel>
                                <h2>Pet 1</h2>
                            </IonLabel>
                            <IonButton fill="outline" color="primary">
                                <IonIcon icon={create} slot="start" />
                                Edit
                            </IonButton>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h2>Pet 2</h2>
                            </IonLabel>
                            <IonButton fill="outline" color="primary">
                                <IonIcon icon={create} slot="start" />
                                Edit
                            </IonButton>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h2>Pet 3</h2>
                            </IonLabel>
                            <IonButton fill="outline" color="primary">
                                <IonIcon icon={create} slot="start" />
                                Edit
                            </IonButton>
                        </IonItem>
                    </IonList>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Pets;