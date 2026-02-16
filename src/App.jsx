import { IonApp, IonRouterOutlet, IonPage, IonContent, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import './theme/variables.css';

import HomePage from './pages/Home';
import ContactPage from './pages/Contact';
import LoginPage from './pages/auth/Login';
import ClientTabs from './pages/client/Tabs';
import AdminTabs from './pages/admin/Tabs';
import { AuthProvider, useAuth } from './utils/auth';

setupIonicReact({ mode: 'ios' });

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-text-center">
          <div style={{ marginTop: '50%' }}>
            <IonSpinner color="primary" />
          </div>
        </IonContent>
      </IonPage>
    );
  }
  if (!user) return <Redirect to="/login" />;
  if (requiredRole && user.role !== requiredRole) {
    return <Redirect to={user.role === 'admin' ? '/admin' : '/client'} />;
  }
  return children;
}

function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/contact" component={ContactPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route path="/client">
        <ProtectedRoute requiredRole="client"><ClientTabs /></ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute requiredRole="admin"><AdminTabs /></ProtectedRoute>
      </Route>
      <Route render={() => <Redirect to="/" />} />
    </IonRouterOutlet>
  );
}

export default function App() {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
}