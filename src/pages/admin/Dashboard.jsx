import React from 'react';
import { IonPage, IonContent, IonCard, IonGrid, IonRow, IonCol } from '@ionic/react';

const Dashboard = () => {
    return (
        <IonPage>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonCard>
                                <h2>Statistics Overview</h2>
                                <p>Total Walks: 150</p>
                                <p>Total Dogs Walked: 200</p>
                                <p>Total Walkers: 15</p>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonCard>
                                <h2>Latest Activity</h2>
                                <p>Walker John Doe walked Buddy on 2026-01-30</p>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Dashboard;