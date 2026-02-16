import React from 'react';
import { 
  IonPage, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, 
  IonList, 
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

const Pets = () => {
    const petsData = [
        { id: 1, name: "Rex", breed: "Golden Retriever" },
        { id: 2, name: "Bella", breed: "Labrador" },
        // Add more pet data as needed
    ];

    const breadcrumbItems = [
        { label: 'Client', path: '/client' },
        { label: 'My Pets', path: '/client/pets' }
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>My Pets</IonTitle>
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
                        {petsData.map(pet => (
                            <IonItem key={pet.id}>
                                <IonLabel>
                                    <h2>{pet.name}</h2>
                                    <p>{pet.breed}</p>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Pets;