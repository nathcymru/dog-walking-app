import { IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;
  
  return (
    <IonBreadcrumbs>
      {items.map((item, index) => (
        <IonBreadcrumb 
          key={index}
          href={index === items.length - 1 ? undefined : item.path}
        >
          {item.label}
        </IonBreadcrumb>
      ))}
    </IonBreadcrumbs>
  );
}
