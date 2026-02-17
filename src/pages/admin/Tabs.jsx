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
        <IonTabButton tab="dashboard" href="/admin/dashboard">
          <IonIcon icon={home} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="clients" href="/admin/clients">
          <IonIcon icon={people} />
          <IonLabel>Clients</IonLabel>
        </IonTabButton>
        <IonTabButton tab="pets" href="/admin/pets">
          <IonIcon icon={paw} />
          <IonLabel>Pets</IonLabel>
        </IonTabButton>
        <IonTabButton tab="bookings" href="/admin/bookings">
          <IonIcon icon={calendar} />
          <IonLabel>Bookings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="incidents" href="/admin/incidents">
          <IonIcon icon={warning} />
          <IonLabel>Incidents</IonLabel>
        </IonTabButton>
        <IonTabButton tab="account" href="/admin/account">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
