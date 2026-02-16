import { IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';
import { useHistory } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  const history = useHistory();
  
  return (
    <IonBreadcrumbs>
      {items.map((item, index) => (
        <IonBreadcrumb
          key={index}
          active={index === items.length - 1}
          onClick={() => {
            if (index !== items.length - 1 && item.path) {
              history.push(item.path);
            }
          }}
          style={{ cursor: index !== items.length - 1 ? 'pointer' : 'default' }}
        >
          {item.label}
        </IonBreadcrumb>
      ))}
    </IonBreadcrumbs>
  );
}
