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
        { id: 1, name: "Max", breed: "Golden Retriever", owner: "John Smith" },
        { id: 2, name: "Bella", breed: "Labrador", owner: "John Smith" },
        { id: 3, name: "Charlie", breed: "Beagle", owner: "Jane Doe" },
    ];

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Admin', path: '/admin' },
        { label: 'Pets', path: '/admin/pets' }
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>All Pets</IonTitle>
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
                                <p>{pet.breed} - Owner: {pet.owner}</p>
                            </IonLabel>
                            <IonButton fill="outline">Edit</IonButton>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Pets;