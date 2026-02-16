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
  IonIcon
} from '@ionic/react';
import { person, mail, call } from 'ionicons/icons';
import Breadcrumbs from '../components/Breadcrumbs';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [showToast, setShowToast] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Contact Us</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <Breadcrumbs items={breadcrumbItems} />
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <IonCard>
            <IonCardContent>
              <form onSubmit={handleSubmit}>
                <IonItem>
                  <IonIcon icon={person} slot="start" />
                  <IonLabel position="floating">Name</IonLabel>
                  <IonInput name="name" onIonChange={handleChange} required></IonInput>
                </IonItem>
                <IonItem>
                  <IonIcon icon={mail} slot="start" />
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput type="email" name="email" onIonChange={handleChange} required></IonInput>
                </IonItem>
                <IonItem>
                  <IonIcon icon={call} slot="start" />
                  <IonLabel position="floating">Phone</IonLabel>
                  <IonInput type="tel" name="phone" onIonChange={handleChange} required></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Message</IonLabel>
                  <IonTextarea name="message" onIonChange={handleChange} required></IonTextarea>
                </IonItem>
                <IonButton expand="block" type="submit" style={{ marginTop: '1rem' }}>Submit</IonButton>
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
        </div>

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
