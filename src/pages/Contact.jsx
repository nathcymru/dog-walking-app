import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonInput, IonTextarea, IonButton } from '@ionic/react';

const Contact: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contact Us</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <form>
                    <IonInput placeholder="Your Name" required></IonInput>
                    <IonInput type="email" placeholder="Your Email" required></IonInput>
                    <IonTextarea placeholder="Your Message" required></IonTextarea>
                    <IonButton expand="full" type="submit">Send Message</IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Contact;