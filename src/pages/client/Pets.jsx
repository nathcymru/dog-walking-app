import React from 'react';
import { IonPage, IonHeader, IonContent, IonList, IonItem, IonButton, IonTitle, IonToolbar } from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

const Pets = () => {
    const petsData = [
        { id: 1, name: "Rex", breed: "Golden Retriever" },
        { id: 2, name: "Bella", breed: "Labrador" },
        // Add more pet data as needed
    ];

    const breadcrumbItems = [
        { label: 'Client', path: '/client' },
        { label: 'Pets', path: '/client/pets' }
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>My Pets</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <Breadcrumbs items={breadcrumbItems} />
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {petsData.map(pet => (
                        <IonItem key={pet.id}>
                            {pet.name} - {pet.breed}
                        </IonItem>
                    ))}
                </IonList>
                <IonButton expand="full">Add Pet</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Pets;