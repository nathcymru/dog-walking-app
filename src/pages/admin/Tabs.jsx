import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home, people, paw, calendar, warning, gift, personCircleOutline } from 'ionicons/icons';

import Dashboard from './Dashboard';
import Clients from './Clients';
import Pets from './Pets';
import Bookings from './Bookings';
import Incidents from './Incidents';
import Rewards from './Rewards';
import RewardForm from './RewardForm';
import AdminAccount from './Account';
import ClientForm from './ClientForm';
import PetForm from './PetForm';
import BookingForm from './BookingForm';
import IncidentForm from './IncidentForm';
import InvoiceForm from './InvoiceForm';

export default function AdminTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/admin"><Redirect to="/admin/dashboard" /></Route>
        <Route exact path="/admin/dashboard" component={Dashboard} />
        <Route exact path="/admin/clients" component={Clients} />
        <Route exact path="/admin/clients/new" component={ClientForm} />
        <Route path="/admin/clients/:id/edit" component={ClientForm} />
        <Route exact path="/admin/pets" component={Pets} />
        <Route exact path="/admin/pets/new" component={PetForm} />
        <Route path="/admin/pets/:id/edit" component={PetForm} />
        <Route exact path="/admin/bookings" component={Bookings} />
        <Route exact path="/admin/bookings/new" component={BookingForm} />
        <Route path="/admin/bookings/:id/edit" component={BookingForm} />
        <Route exact path="/admin/incidents" component={Incidents} />
        <Route exact path="/admin/incidents/new" component={IncidentForm} />
        <Route path="/admin/incidents/:id/edit" component={IncidentForm} />
        <Route exact path="/admin/invoices/new" component={InvoiceForm} />
        <Route path="/admin/invoices/:id/edit" component={InvoiceForm} />
        <Route exact path="/admin/rewards" component={Rewards} />
        <Route path="/admin/rewards/:id" component={RewardForm} />
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
        <IonTabButton tab="admin-rewards" href="/admin/rewards">
          <IonIcon icon={gift} />
          <IonLabel>Rewards</IonLabel>
        </IonTabButton>
        <IonTabButton tab="admin-account" href="/admin/account">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
