import { IonBreadcrumbs, IonBreadcrumb, IonIcon } from '@ionic/react';
import { homeOutline } from 'ionicons/icons';

export default function Breadcrumbs({ items }) {
  return (
    <IonBreadcrumbs style={{ padding: '0.75rem 1rem' }}>
      {items.map((item, index) => (
        <IonBreadcrumb 
          key={index} 
          href={item.path}
          active={index === items.length - 1}
        >
          {index === 0 && <IonIcon icon={homeOutline} slot="start" />}
          {item.label}
        </IonBreadcrumb>
      ))}
    </IonBreadcrumbs>
  );
}
