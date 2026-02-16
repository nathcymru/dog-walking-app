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
import { pawOutline, timeOutline, homeOutline, schoolOutline, ribbonOutline } from 'ionicons/icons';
import Breadcrumbs from '../components/Breadcrumbs';

const Services = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Our Services</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <h2>Professional Dog Care Services</h2>
              <p>We offer a comprehensive range of services to keep your furry friends happy, healthy, and well-cared for!</p>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <IonIcon icon={pawOutline} style={{ fontSize: '64px', color: 'var(--ion-color-primary)' }} />
                  </div>
                  <IonCardTitle>Solo Dog Walking</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>One-on-one walks tailored to your dog's pace and energy level.</p>
                  <ul>
                    <li>30-minute or 60-minute sessions</li>
                    <li>Personalized attention</li>
                    <li>GPS tracking and photo updates</li>
                    <li>Flexible scheduling</li>
                  </ul>
                  <p><strong>From £15 per walk</strong></p>
                  <IonButton expand="block" color="primary" routerLink="/contact">Book Now</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <IonIcon icon={ribbonOutline} style={{ fontSize: '64px', color: 'var(--ion-color-secondary)' }} />
                  </div>
                  <IonCardTitle>Group Walking</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Socialization walks with compatible dogs in small groups.</p>
                  <ul>
                    <li>Maximum 4 dogs per group</li>
                    <li>Carefully matched playmates</li>
                    <li>Great for social dogs</li>
                    <li>Adventure routes in local parks</li>
                  </ul>
                  <p><strong>From £12 per walk</strong></p>
                  <IonButton expand="block" color="secondary" routerLink="/contact">Book Now</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <IonIcon icon={homeOutline} style={{ fontSize: '64px', color: 'var(--ion-color-tertiary)' }} />
                  </div>
                  <IonCardTitle>Dog Sitting</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Reliable in-home dog sitting services while you're away.</p>
                  <ul>
                    <li>Daily visits or overnight stays</li>
                    <li>Feeding and medication administration</li>
                    <li>Playtime and comfort</li>
                    <li>Home security checks</li>
                  </ul>
                  <p><strong>From £25 per visit</strong></p>
                  <IonButton expand="block" color="tertiary" routerLink="/contact">Book Now</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <IonIcon icon={schoolOutline} style={{ fontSize: '64px', color: 'var(--ion-color-success)' }} />
                  </div>
                  <IonCardTitle>Dog Training</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Expert training services tailored to your dog's needs.</p>
                  <ul>
                    <li>Basic obedience training</li>
                    <li>Behavioral modification</li>
                    <li>Puppy socialization</li>
                    <li>One-on-one or group sessions</li>
                  </ul>
                  <p><strong>From £40 per session</strong></p>
                  <IonButton expand="block" color="success" routerLink="/contact">Enquire Now</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <IonIcon icon={timeOutline} style={{ fontSize: '64px', color: 'var(--ion-color-warning)' }} />
                  </div>
                  <IonCardTitle>Drop-In Visits</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Perfect for midday potty breaks and feeding.</p>
                  <ul>
                    <li>15-30 minute visits</li>
                    <li>Ideal for busy schedules</li>
                    <li>Feeding and water refresh</li>
                    <li>Quick bathroom breaks</li>
                  </ul>
                  <p><strong>From £10 per visit</strong></p>
                  <IonButton expand="block" color="warning" routerLink="/contact">Book Now</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <IonIcon icon={pawOutline} style={{ fontSize: '64px', color: 'var(--ion-color-danger)' }} />
                  </div>
                  <IonCardTitle>Emergency Services</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>24/7 emergency dog care when you need it most.</p>
                  <ul>
                    <li>Available round the clock</li>
                    <li>Last-minute bookings</li>
                    <li>Emergency vet transportation</li>
                    <li>Peace of mind anytime</li>
                  </ul>
                  <p><strong>Call for pricing</strong></p>
                  <IonButton expand="block" color="danger" href="tel:02012345678">Call Now</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Why Choose PawWalkers?</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <h3>✅ Fully Insured & DBS Checked</h3>
                        <p>All our walkers are fully insured and background checked for your peace of mind.</p>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <h3>📱 Real-Time Updates</h3>
                        <p>Get GPS tracking, photos, and updates during every walk.</p>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <h3>🎓 Professional Training</h3>
                        <p>Our team has extensive experience and ongoing training in dog behavior.</p>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <h3>💚 Passionate Pet Lovers</h3>
                        <p>We genuinely love what we do and treat every dog like our own.</p>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" className="ion-text-center">
              <h2>Ready to Get Started?</h2>
              <IonButton size="large" color="primary" routerLink="/contact">
                Contact Us Today
              </IonButton>
              <IonButton size="large" fill="outline" routerLink="/login" style={{ marginLeft: '1rem' }}>
                Existing Client Login
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Services;