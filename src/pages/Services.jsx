import React from 'react';
import { 
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButton,
  IonIcon
} from '@ionic/react';
import { walkOutline, homeOutline, schoolOutline, arrowForward } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Services = () => {
  const history = useHistory();
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Our Services</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2>What We Offer</h2>
          <p style={{ color: 'var(--ion-color-medium)', marginBottom: '2rem' }}>
            Professional pet care services tailored to your needs
          </p>
          
          <IonGrid>
            <IonRow>
              <IonCol size='12' sizeMd='6' sizeLg='4'>
                <IonCard>
                  <IonCardHeader>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <IonIcon icon={walkOutline} style={{ fontSize: '48px', color: 'var(--ion-color-primary)' }} />
                    </div>
                    <IonCardTitle>Dog Walking</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Offering professional dog walking services to keep your furry friends happy and healthy!</p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                      <li>30-minute or 60-minute walks</li>
                      <li>Individual or group walks</li>
                      <li>GPS tracking and photo updates</li>
                      <li>Flexible scheduling</li>
                    </ul>
                    <IonButton expand='block' fill="outline" style={{ marginTop: '1rem' }} onClick={() => history.push('/contact')}>
                      Book Now
                      <IonIcon icon={arrowForward} slot="end" />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              
              <IonCol size='12' sizeMd='6' sizeLg='4'>
                <IonCard>
                  <IonCardHeader>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <IonIcon icon={homeOutline} style={{ fontSize: '48px', color: 'var(--ion-color-secondary)' }} />
                    </div>
                    <IonCardTitle>Pet Visits & Sitting</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Providing reliable pet sitting and home visit services while you are away.</p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                      <li>Home visits for feeding and care</li>
                      <li>Overnight sitting available</li>
                      <li>Medication administration</li>
                      <li>House security checks</li>
                    </ul>
                    <IonButton expand='block' fill="outline" style={{ marginTop: '1rem' }} onClick={() => history.push('/contact')}>
                      Learn More
                      <IonIcon icon={arrowForward} slot="end" />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              
              <IonCol size='12' sizeMd='6' sizeLg='4'>
                <IonCard>
                  <IonCardHeader>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <IonIcon icon={schoolOutline} style={{ fontSize: '48px', color: 'var(--ion-color-tertiary)' }} />
                    </div>
                    <IonCardTitle>Behavioral Support</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Expert behavioral support and training services tailored to your dog's needs.</p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                      <li>Basic obedience training</li>
                      <li>Leash walking techniques</li>
                      <li>Socialization support</li>
                      <li>Reactivity management</li>
                    </ul>
                    <IonButton expand='block' fill="outline" style={{ marginTop: '1rem' }} onClick={() => history.push('/contact')}>
                      Get Started
                      <IonIcon icon={arrowForward} slot="end" />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardHeader>
              <IonCardTitle>Why Choose PawWalkers?</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <h4>✓ Experienced Professionals</h4>
                    <p>All our walkers are trained, insured, and passionate about dogs.</p>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <h4>✓ Flexible Scheduling</h4>
                    <p>Book regular walks or one-off services that fit your schedule.</p>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <h4>✓ Real-Time Updates</h4>
                    <p>Get photos and GPS tracking of every walk.</p>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <h4>✓ Personalized Care</h4>
                    <p>Every dog gets individual attention tailored to their needs.</p>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
            <IonButton size="large" color="primary" onClick={() => history.push('/contact')}>
              Get in Touch
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Services;