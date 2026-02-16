import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton } from '@ionic/react';
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
                </IonToolbar>
                <IonToolbar>
                    <Breadcrumbs items={breadcrumbItems} />
                </IonToolbar>
            </IonHeader>
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