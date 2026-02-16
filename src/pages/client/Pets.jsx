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
  IonCard,
  IonCardContent,
  IonLabel
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

const Pets = () => {
    const petsData = [
        { id: 1, name: "Max", breed: "Golden Retriever" },
        { id: 2, name: "Bella", breed: "Labrador" },
    ];

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Client', path: '/client' },
        { label: 'Pets', path: '/client/pets' }
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>My Pets</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <Breadcrumbs items={breadcrumbItems} />
                <IonCard>
                    <IonCardContent>
                        <IonButton expand="block">Add Pet</IonButton>
                    </IonCardContent>
                </IonCard>
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
            </IonContent>
        </IonPage>
    );
};

export default Pets;