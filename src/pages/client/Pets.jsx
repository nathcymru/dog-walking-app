import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonContent, 
  IonList, 
  IonItem, 
  IonButton, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonBreadcrumbs,
  IonBreadcrumb,
  IonLabel,
  IonIcon,
  IonGrid,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { add, pencil } from 'ionicons/icons';

const Pets = () => {
    const history = useHistory();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        history.push('/');
    };

    const petsData = [
        { id: 1, name: "Rex", breed: "Golden Retriever" },
        { id: 2, name: "Bella", breed: "Labrador" },
        // Add more pet data as needed
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>My Pets</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleLogout}>Logout</IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonBreadcrumbs>
                        <IonBreadcrumb href="/">Home</IonBreadcrumb>
                        <IonBreadcrumb>Client</IonBreadcrumb>
                        <IonBreadcrumb>My Pets</IonBreadcrumb>
                    </IonBreadcrumbs>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid className="ion-padding">
                    {petsData.length === 0 ? (
                        <IonCard>
                            <IonCardContent>
                                <p>No pets found. Add your first pet!</p>
                            </IonCardContent>
                        </IonCard>
                    ) : (
                        <IonList>
                            {petsData.map(pet => (
                                <IonItem key={pet.id}>
                                    <IonLabel>
                                        <h2>{pet.name}</h2>
                                        <p>{pet.breed}</p>
                                    </IonLabel>
                                    <IonButton fill="outline">
                                        <IonIcon icon={pencil} slot="start" />
                                        Edit
                                    </IonButton>
                                </IonItem>
                            ))}
                        </IonList>
                    )}
                    <IonButton expand="block" style={{ marginTop: '20px' }}>
                        <IonIcon icon={add} slot="start" />
                        Add Pet
                    </IonButton>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Pets;