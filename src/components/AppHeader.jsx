import React, { useState } from "react";
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { InitialsAvatar } from "./InitialsAvatar";
import { useAuth } from "../utils/auth";

export const AppHeader = ({ title }) => {
  const history = useHistory();
  const { user, logout } = useAuth();
  const [popoverEvent, setPopoverEvent] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
    await logout();
    history.push('/login');
  };

  const handleAccount = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
    if (user?.role === 'admin') {
      history.push('/admin/account');
    } else {
      history.push('/client/account');
    }
  };

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>{title}</IonTitle>

        <IonButtons slot="end">
          <IonButton
            fill="clear"
            aria-label="User menu"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPopoverEvent(e.nativeEvent);
              setIsOpen(true);
            }}
            style={{ paddingInline: 6 }}
          >
            <InitialsAvatar 
              fullName={user?.full_name} 
              photoUrl={user?.photo_url} 
              sizePx={36} 
            />
          </IonButton>
        </IonButtons>

        <IonPopover
          isOpen={isOpen}
          event={popoverEvent}
          onDidDismiss={() => setIsOpen(false)}
          showBackdrop={true}
        >
          <IonList>
            <IonItem
              button
              detail={false}
              onClick={handleAccount}
              onTouchEnd={handleAccount}
              style={{ cursor: 'pointer' }}
            >
              <IonLabel>Account</IonLabel>
            </IonItem>

            <IonItem
              button
              detail={false}
              lines="none"
              onClick={handleLogout}
              onTouchEnd={handleLogout}
              style={{ cursor: 'pointer' }}
            >
              <IonLabel color="danger">Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>
      </IonToolbar>
    </IonHeader>
  );
};
