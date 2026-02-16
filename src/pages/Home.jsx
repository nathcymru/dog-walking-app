import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { pawOutline, heartOutline, timeOutline, shieldCheckmarkOutline, mailOutline, logInOutline } from 'ionicons/icons';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Home() {
  const history = useHistory();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' }
  ];
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>PawWalkers</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Breadcrumbs items={breadcrumbItems} />
        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <IonIcon icon={pawOutline} style={{ fontSize: '64px', color: 'var(--ion-color-primary)' }} />
          <h1 style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>Welcome to PawWalkers</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--ion-color-medium)', maxWidth: '600px', margin: '1rem auto' }}>
            Professional dog walking services you can trust. We treat your furry friends like family!
          </p>
        </div>

        {/* Features Grid */}
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <IonIcon icon={heartOutline} style={{ fontSize: '48px', color: 'var(--ion-color-secondary)' }} />
                  <h3 style={{ marginTop: '1rem' }}>Loving Care</h3>
                  <p>Every walk is tailored to your dog's needs and personality</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <IonIcon icon={shieldCheckmarkOutline} style={{ fontSize: '48px', color: 'var(--ion-color-tertiary)' }} />
                  <h3 style={{ marginTop: '1rem' }}>Trusted & Insured</h3>
                  <p>Fully insured and background-checked professional walkers</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <IonIcon icon={timeOutline} style={{ fontSize: '48px', color: 'var(--ion-color-success)' }} />
                  <h3 style={{ marginTop: '1rem' }}>Flexible Scheduling</h3>
                  <p>Book walks that fit your schedule, from daily routines to one-off adventures</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <IonIcon icon={pawOutline} style={{ fontSize: '48px', color: 'var(--ion-color-warning)' }} />
                  <h3 style={{ marginTop: '1rem' }}>Real-Time Updates</h3>
                  <p>Track your dog's walk and receive photos and updates in real-time</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* About Section */}
        <IonCard style={{ marginTop: '2rem' }}>
          <IonCardHeader>
            <IonCardTitle>About PawWalkers</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              PawWalkers is your local, trusted dog walking service dedicated to keeping your pets happy, 
              healthy, and exercised. With over 10 years of experience, our team of passionate animal lovers 
              provides personalized care for dogs of all breeds and sizes.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Whether you need daily walks, occasional outings, or special adventure hikes, we're here to 
              ensure your furry companion gets the exercise and attention they deserve while you're at work 
              or away.
            </p>
          </IonCardContent>
        </IonCard>

        {/* Call to Action Buttons */}
        <div style={{ marginTop: '2rem', textAlign: 'center', paddingBottom: '2rem' }}>
          <IonButton 
            expand="block" 
            size="large" 
            color="primary"
            onClick={() => history.push('/contact')}
            style={{ maxWidth: '400px', margin: '0 auto 1rem' }}
          >
            <IonIcon icon={mailOutline} slot="start" />
            Contact Us / New Business Enquiry
          </IonButton>
          
          <IonButton 
            expand="block" 
            size="large" 
            fill="outline"
            onClick={() => history.push('/login')}
            style={{ maxWidth: '400px', margin: '0 auto' }}
          >
            <IonIcon icon={logInOutline} slot="start" />
            Existing Client Login
          </IonButton>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--ion-color-medium)' }}>
          <p style={{ fontSize: '0.9rem' }}>
            © 2026 PawWalkers. Professional Dog Walking Services.<br />
            Serving the local community with love and care.
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}