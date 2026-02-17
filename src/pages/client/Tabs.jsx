import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home, calendar, paw, receipt, person } from 'ionicons/icons';

import Dashboard from './Dashboard';
import Bookings from './Bookings';
import Pets from './Pets';
import Billing from './Billing';
import { AccountPage } from '../Account';

export default function ClientTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/client"><Redirect to="/client/dashboard" /></Route>
        <Route exact path="/client/dashboard" component={Dashboard} />
        <Route exact path="/client/bookings" component={Bookings} />
        <Route exact path="/client/pets" component={Pets} />
        <Route exact path="/client/billing" component={Billing} />
        <Route exact path="/client/account" component={AccountPage} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/client/dashboard">
          <IonIcon icon={home} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="bookings" href="/client/bookings">
          <IonIcon icon={calendar} />
          <IonLabel>Bookings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="pets" href="/client/pets">
          <IonIcon icon={paw} />
          <IonLabel>Pets</IonLabel>
        </IonTabButton>
        <IonTabButton tab="billing" href="/client/billing">
          <IonIcon icon={receipt} />
          <IonLabel>Billing</IonLabel>
        </IonTabButton>
        <IonTabButton tab="account" href="/client/account">
          <IonIcon icon={person} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
