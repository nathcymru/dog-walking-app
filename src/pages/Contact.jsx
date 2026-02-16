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
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { mailOutline, callOutline, locationOutline, personOutline, sendOutline } from 'ionicons/icons';
import Breadcrumbs from '../components/Breadcrumbs';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.detail.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission logic here
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setToastMessage('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setToastMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setToastMessage('An error occurred. Please try again.');
    }
    setShowToast(true);
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
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
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Get In Touch</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Have a question or want to book our services? Fill out the form and we'll get back to you as soon as possible!</p>
                  
                  <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <IonItem>
                      <IonIcon icon={personOutline} slot="start" />
                      <IonLabel position="floating">Name *</IonLabel>
                      <IonInput
                        name="name"
                        value={formData.name}
                        onIonChange={(e) => setFormData({ ...formData, name: e.detail.value })}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonIcon icon={mailOutline} slot="start" />
                      <IonLabel position="floating">Email *</IonLabel>
                      <IonInput
                        type="email"
                        name="email"
                        value={formData.email}
                        onIonChange={(e) => setFormData({ ...formData, email: e.detail.value })}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonIcon icon={callOutline} slot="start" />
                      <IonLabel position="floating">Phone</IonLabel>
                      <IonInput
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onIonChange={(e) => setFormData({ ...formData, phone: e.detail.value })}
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Message *</IonLabel>
                      <IonTextarea
                        name="message"
                        value={formData.message}
                        onIonChange={(e) => setFormData({ ...formData, message: e.detail.value })}
                        rows={6}
                        required
                      />
                    </IonItem>

                    <IonButton expand="block" type="submit" color="primary" style={{ marginTop: '1rem' }}>
                      <IonIcon icon={sendOutline} slot="start" />
                      Send Message
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Contact Information</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem lines="none">
                    <IonIcon icon={mailOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h3>Email</h3>
                      <p>info@pawwalkers.com</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem lines="none">
                    <IonIcon icon={callOutline} slot="start" color="success" />
                    <IonLabel>
                      <h3>Phone</h3>
                      <p>020 1234 5678</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem lines="none">
                    <IonIcon icon={locationOutline} slot="start" color="tertiary" />
                    <IonLabel>
                      <h3>Address</h3>
                      <p>123 Dog Street</p>
                      <p>London, N1 1AA</p>
                      <p>United Kingdom</p>
                    </IonLabel>
                  </IonItem>
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Business Hours</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p><strong>Monday - Friday:</strong> 7:00 AM - 7:00 PM</p>
                  <p><strong>Saturday:</strong> 8:00 AM - 6:00 PM</p>
                  <p><strong>Sunday:</strong> 9:00 AM - 5:00 PM</p>
                  <p style={{ marginTop: '1rem' }}><em>Emergency services available 24/7</em></p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
          color={toastMessage.includes('success') || toastMessage.includes('Thank') ? 'success' : 'danger'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Contact;
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
