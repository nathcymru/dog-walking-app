import React from 'react';
import { IonPage, IonHeader, IonContent, IonList, IonItem, IonButton, IonTitle, IonToolbar } from '@ionic/react';

const Pets = () => {
    const petsData = [
        { id: 1, name: "Rex", breed: "Golden Retriever" },
        { id: 2, name: "Bella", breed: "Labrador" },
        // Add more pet data as needed
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Pets</IonTitle>
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