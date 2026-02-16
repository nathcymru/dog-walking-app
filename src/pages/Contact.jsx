import React, { useState } from 'react';
import { 
  IonPage,
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonBackButton,
  IonContent, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonTextarea, 
  IonToast,
  IonCard,
  IonCardContent,
  IonIcon
} from '@ionic/react';
import { person, mail, call, location } from 'ionicons/icons';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.detail?.value !== undefined ? e.detail.value : e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowToast(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Failed to send message', error);
    }
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
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Get in Touch</h2>
          <p style={{ color: 'var(--ion-color-medium)' }}>
            Have questions or want to book a service? Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit}>
            <IonItem>
              <IonIcon icon={person} slot="start" />
              <IonLabel position="floating">Name *</IonLabel>
              <IonInput 
                name="name" 
                value={formData.name}
                onIonChange={handleChange} 
                required
              />
            </IonItem>
            
            <IonItem>
              <IonIcon icon={mail} slot="start" />
              <IonLabel position="floating">Email *</IonLabel>
              <IonInput 
                type="email" 
                name="email" 
                value={formData.email}
                onIonChange={handleChange} 
                required
              />
            </IonItem>
            
            <IonItem>
              <IonIcon icon={call} slot="start" />
              <IonLabel position="floating">Phone</IonLabel>
              <IonInput 
                type="tel" 
                name="phone" 
                value={formData.phone}
                onIonChange={handleChange}
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="floating">Message *</IonLabel>
              <IonTextarea 
                name="message" 
                value={formData.message}
                onIonChange={handleChange} 
                rows={5}
                required
              />
            </IonItem>
            
            <IonButton expand="block" type="submit" style={{ marginTop: '1rem' }}>
              Send Message
            </IonButton>
          </form>

          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h3>Contact Information</h3>
              <div style={{ marginTop: '1rem' }}>
                <p>
                  <IonIcon icon={mail} style={{ marginRight: '0.5rem' }} />
                  <strong>Email:</strong> info@pawwalkers.co.uk
                </p>
                <p>
                  <IonIcon icon={call} style={{ marginRight: '0.5rem' }} />
                  <strong>Phone:</strong> 07123 456789
                </p>
                <p>
                  <IonIcon icon={location} style={{ marginRight: '0.5rem' }} />
                  <strong>Service Area:</strong> Local community area
                </p>
                <p style={{ marginTop: '1rem', color: 'var(--ion-color-medium)' }}>
                  <strong>Hours:</strong> Monday-Sunday, 7:00 AM - 7:00 PM
                </p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Your message has been sent! We'll get back to you soon."
        duration={3000}
        color="success"
      />
    </IonPage>
  );
};

export default Contact;
