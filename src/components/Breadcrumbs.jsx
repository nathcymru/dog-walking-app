import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from '@ionic/react';
import { home } from 'ionicons/icons';

export default function Breadcrumbs({ items }) {
  return (
    <IonBreadcrumbs style={{ padding: '10px 16px' }}>
      <IonBreadcrumb href="/">
        <IonIcon icon={home} slot="start" />
        Home
      </IonBreadcrumb>
      {items.map((item, index) => (
        <IonBreadcrumb key={index} href={item.path} active={index === items.length - 1}>
          {item.label}
        </IonBreadcrumb>
      ))}
    </IonBreadcrumbs>
  );
}
