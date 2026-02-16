import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonInput, IonItem, IonLabel, IonTextarea, IonToast } from '@ionic/react';
import { person, mail, call } from 'ionicons/icons';

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

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => { /* code to go back */ }}>Back</IonButton>
          </IonButtons>
          <IonTitle>Contact Us</IonTitle>
        </IonToolbar>
      </IonHeader>

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
        <IonButton expand="full" type="submit">Submit</IonButton>
      </form>

      <IonToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message="Your message has been sent!"
        duration={2000}
      />

      <div>Contact Information:</div>
      <div>Email: info@pawwalkers.co.uk</div>
      <div>Phone: 07123 456789</div>
      <div>Hours: Monday-Sunday 7am-7pm</div>
    </IonContent>
  );
};

export default Contact;
