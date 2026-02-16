import { IonBreadcrumbs, IonBreadcrumb, IonIcon } from '@ionic/react';

export default function IonBreadcrumbsNav({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <IonBreadcrumbs className="ion-padding-horizontal">
      {items.map((item, index) => (
        <IonBreadcrumb 
          key={index} 
          href={item.path}
          active={index === items.length - 1}
        >
          {item.icon && <IonIcon icon={item.icon} slot="start" />}
          {item.label}
        </IonBreadcrumb>
      ))}
    </IonBreadcrumbs>
  );
}
