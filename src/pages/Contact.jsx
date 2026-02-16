import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonToast
} from '@ionic/react';
import { useState } from 'react';
import { sendOutline, pawOutline } from 'ionicons/icons';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dogName: '',
    dogBreed: '',
    serviceType: '',
    message: ''
  });  
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log('Form submitted:', formData);
    setShowToast(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      dogName: '',
      dogBreed: '',
      serviceType: '',
      message: ''
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
          <IonIcon icon={pawOutline} style={{ fontSize: '48px', color: 'var(--ion-color-primary)' }} />
          <h1>Get in Touch</h1>
          <p style={{ color: 'var(--ion-color-medium)', maxWidth: '500px', margin: '0 auto' }}>
            Interested in our dog walking services? Fill out the form below and we'll get back to you within 24 hours!
          </p>
        </div>

        <IonCard>
          <IonCardContent>
            <form onSubmit={handleSubmit}>
              <IonItem>
                <IonLabel position="stacked">Your Name *</IonLabel>
                <IonInput
                  value={formData.name}
                  onIonChange={(e) => handleChange('name', e.detail.value)}
                  placeholder="Enter your full name"
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Email *</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonChange={(e) => handleChange('email', e.detail.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Phone Number *</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone}
                  onIonChange={(e) => handleChange('phone', e.detail.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Dog's Name</IonLabel>
                <IonInput
                  value={formData.dogName}
                  onIonChange={(e) => handleChange('dogName', e.detail.value)}
                  placeholder="What's your pup's name?"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Dog's Breed</IonLabel>
                <IonInput
                  value={formData.dogBreed}
                  onIonChange={(e) => handleChange('dogBreed', e.detail.value)}
                  placeholder="e.g., Golden Retriever, Mixed Breed"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Service Interest *</IonLabel>
                <IonSelect
                  value={formData.serviceType}
                  onIonChange={(e) => handleChange('serviceType', e.detail.value)}
                  placeholder="Select a service"
                  required
                >
                  <IonSelectOption value="daily-walks">Daily Walks</IonSelectOption>
                  <IonSelectOption value="weekly-walks">Weekly Walks</IonSelectOption>
                  <IonSelectOption value="occasional">Occasional Walks</IonSelectOption>
                  <IonSelectOption value="pet-sitting">Pet Sitting</IonSelectOption>
                  <IonSelectOption value="group-walks">Group Walks</IonSelectOption>
                  <IonSelectOption value="other">Other / Not Sure</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Additional Information</IonLabel>
                <IonTextarea
                  value={formData.message}
                  onIonChange={(e) => handleChange('message', e.detail.value)}
                  placeholder="Tell us about your dog's personality, any special needs, preferred walking times, or any questions you have..."
                  rows={6}
                />
              </IonItem>

              <div style={{ marginTop: '2rem' }}>
                <IonButton 
                  expand="block" 
                  type="submit"
                  size="large"
                >
                  <IonIcon icon={sendOutline} slot="start" />
                  Submit Enquiry
                </IonButton>
              </div>
            </form>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ marginTop: '2rem', backgroundColor: 'var(--ion-color-light)' }}>
          <IonCardContent>
            <h3 style={{ marginTop: 0 }}>Other Ways to Reach Us</h3>
            <p><strong>Phone:</strong> (555) PAW-WALK</p>
            <p><strong>Email:</strong> hello@pawwalkers.com</p>
            <p><strong>Hours:</strong> Monday - Sunday, 7:00 AM - 7:00 PM</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--ion-color-medium)' }}>
              We typically respond to all enquiries within 24 hours during business days.
            </p>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Thank you for your enquiry! We'll be in touch soon."
          duration={3000}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
}