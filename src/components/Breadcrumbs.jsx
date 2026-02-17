import { IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';
import { useHistory } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  const history = useHistory();

  if (!items || items.length === 0) return null;

  return (
    <IonBreadcrumbs style={{ padding: '0.5rem 1rem' }}>
      {items.map((item, index) => (
        <IonBreadcrumb
          key={index}
          onClick={() => index < items.length - 1 && history.push(item.path)}
          active={index === items.length - 1}
          style={{ cursor: index < items.length - 1 ? 'pointer' : 'default' }}
        >
          {item.label}
        </IonBreadcrumb>
      ))}
    </IonBreadcrumbs>
  );
}
