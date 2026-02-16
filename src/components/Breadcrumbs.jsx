import { IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';

export default function Breadcrumbs({ items }) {
  return (
    <IonBreadcrumbs>
      {items.map((item, index) => (
        <IonBreadcrumb 
          key={index}
          routerLink={index === items.length - 1 ? undefined : item.path}
          active={index === items.length - 1}
        >
          {item.label}
        </IonBreadcrumb>
      ))}
    </IonBreadcrumbs>
  );
}
