import { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonButtons,
  IonBackButton,
  IonNote
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { mailOutline, lockClosedOutline, pawOutline, alertCircleOutline } from 'ionicons/icons';
import { useAuth } from '../../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        history.push('/admin');
      } else {
        history.push('/client');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@pawwalkers.com');
      setPassword('admin123');
    } else {
      setEmail('client@example.com');
      setPassword('client123');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '2rem' }}>
          {/* Logo/Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <IonIcon icon={pawOutline} style={{ fontSize: '64px', color: 'var(--ion-color-primary)' }} />
            <h1 style={{ marginTop: '1rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--ion-color-medium)' }}>Sign in to access your account</p>
          </div>

          {/* Login Form */}
          <IonCard>
            <IonCardContent>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ 
                    padding: '1rem', 
                    marginBottom: '1rem', 
                    backgroundColor: 'var(--ion-color-danger-tint)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <IonIcon icon={alertCircleOutline} color="danger" />
                    <IonText color="danger">
                      <small>{error}</small>
                    </IonText>
                  </div>
                )}

                <IonItem>
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel position="stacked">Email Address</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </IonItem>

                <IonItem style={{ marginTop: '1rem' }}>
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value)}
                    placeholder="Enter your password"
                    required
                  />
                </IonItem>

                <IonButton 
                  expand="block" 
                  type="submit" 
                  style={{ marginTop: '2rem' }}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>

          {/* Demo Credentials Card */}
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Demo Accounts</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <IonNote>
                  <strong>Admin Account:</strong><br />
                  Email: admin@pawwalkers.com<br />
                  Password: admin123
                </IonNote>
                <IonButton 
                  size="small" 
                  fill="outline" 
                  onClick={() => fillDemoCredentials('admin')}
                  style={{ marginTop: '0.5rem' }}
                >
                  Use Admin Login
                </IonButton>
              </div>

              <div>
                <IonNote>
                  <strong>Client Account:</strong><br />
                  Email: client@example.com<br />
                  Password: client123
                </IonNote>
                <IonButton 
                  size="small" 
                  fill="outline" 
                  onClick={() => fillDemoCredentials('client')}
                  style={{ marginTop: '0.5rem' }}
                >
                  Use Client Login
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}