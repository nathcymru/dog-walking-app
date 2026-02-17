import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home, people, paw, calendar, warning, personCircleOutline } from 'ionicons/icons';

import Dashboard from './Dashboard';
import Clients from './Clients';
import Pets from './Pets';
import Bookings from './Bookings';
import Incidents from './Incidents';
import AdminAccount from './Account';

export default function AdminTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/admin"><Redirect to="/admin/dashboard" /></Route>
        <Route exact path="/admin/dashboard" component={Dashboard} />
        <Route exact path="/admin/clients" component={Clients} />
        <Route exact path="/admin/pets" component={Pets} />
        <Route exact path="/admin/bookings" component={Bookings} />
        <Route exact path="/admin/incidents" component={Incidents} />
        <Route exact path="/admin/account" component={AdminAccount} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="admin-dashboard" href="/admin/dashboard">
          <IonIcon icon={home} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="admin-clients" href="/admin/clients">
          <IonIcon icon={people} />
          <IonLabel>Clients</IonLabel>
        </IonTabButton>
        <IonTabButton tab="admin-pets" href="/admin/pets">
          <IonIcon icon={paw} />
          <IonLabel>Pets</IonLabel>
        </IonTabButton>
        <IonTabButton tab="admin-bookings" href="/admin/bookings">
          <IonIcon icon={calendar} />
          <IonLabel>Bookings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="admin-incidents" href="/admin/incidents">
          <IonIcon icon={warning} />
          <IonLabel>Incidents</IonLabel>
        </IonTabButton>
        <IonTabButton tab="admin-account" href="/admin/account">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
