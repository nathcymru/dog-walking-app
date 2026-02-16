import React from 'react';
import { IonPage, IonContent, IonList, IonItem, IonButton } from '@ionic/react';

const Pets = () => {
    return (
        <IonPage>
            <IonContent>
                <IonList>
                    <IonItem>
                        <h2>Pet 1</h2>
                        <IonButton fill="outline">Edit</IonButton>
                    </IonItem>
                    <IonItem>
                        <h2>Pet 2</h2>
                        <IonButton fill="outline">Edit</IonButton>
                    </IonItem>
                    <IonItem>
                        <h2>Pet 3</h2>
                        <IonButton fill="outline">Edit</IonButton>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Pets;