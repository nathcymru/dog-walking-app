import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonBackButton, 
  IonContent, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonTextarea, 
  IonToast, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonIcon 
} from '@ionic/react';
import { person, mail, call } from 'ionicons/icons';
import IonBreadcrumbsNav from '../components/IonBreadcrumbsNav';
import { homeOutline } from 'ionicons/icons';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setShowToast(true);
  };

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: homeOutline },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Contact Us</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonBreadcrumbsNav items={breadcrumbs} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="8" offsetMd="2" sizeLg="6" offsetLg="3">
              <IonCard>
                <IonCardContent>
                  <form onSubmit={handleSubmit}>
                    <IonItem>
                      <IonLabel position="floating">
                        <IonIcon icon={person} /> Name
                      </IonLabel>
                      <IonInput name="name" onIonChange={handleChange} required></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">
                        <IonIcon icon={mail} /> Email
                      </IonLabel>
                      <IonInput type="email" name="email" onIonChange={handleChange} required></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">
                        <IonIcon icon={call} /> Phone
                      </IonLabel>
                      <IonInput type="tel" name="phone" onIonChange={handleChange} required></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Message</IonLabel>
                      <IonTextarea name="message" onIonChange={handleChange} required></IonTextarea>
                    </IonItem>
                    <IonButton expand="block" type="submit" color="primary" style={{ marginTop: '1rem' }}>
                      Submit
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>

              <IonCard style={{ marginTop: '2rem' }}>
                <IonCardContent>
                  <h3>Contact Information</h3>
                  <p><strong>Email:</strong> info@pawwalkers.co.uk</p>
                  <p><strong>Phone:</strong> 07123 456789</p>
                  <p><strong>Hours:</strong> Monday-Sunday 7am-7pm</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Your message has been sent!"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Contact;
