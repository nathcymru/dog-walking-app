import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonButton,
  IonCard,
  IonCardContent,
  IonToast,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { logOutOutline } from "ionicons/icons";
import { InitialsAvatar } from "../components/InitialsAvatar";
import { useAuth } from "../utils/auth";

export const AccountPage = () => {
  const { user, updateUser, logout } = useAuth();
  const history = useHistory();
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url ?? "");
  const [photoHint, setPhotoHint] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", color: "success" });

  useEffect(() => {
    if (!photoUrl) {
      setPhotoHint("");
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => !cancelled && setPhotoHint("");
    img.onerror = () =>
      !cancelled && setPhotoHint("Photo URL couldn't be loaded — showing initials instead.");
    img.src = photoUrl;
    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  const handleSave = () => {
    try {
      updateUser({ ...user, full_name: fullName, email, phone, photo_url: photoUrl });
      setToast({ show: true, message: "Profile updated successfully", color: "success" });
    } catch (error) {
      setToast({ show: true, message: "Error updating profile", color: "danger" });
    }
  };

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: "grid", placeItems: "center", marginTop: 20, marginBottom: 24 }}>
          <InitialsAvatar 
            fullName={fullName} 
            photoUrl={photoUrl} 
            sizePx={96} 
            ariaLabel="Profile avatar" 
          />
          {photoHint && (
            <IonText color="medium" style={{ marginTop: 10, textAlign: "center", fontSize: '0.875rem' }}>
              <small>{photoHint}</small>
            </IonText>
          )}
        </div>

        <IonCard>
          <IonCardContent>
            <IonList inset={false}>
              <IonItem>
                <IonLabel position="stacked">Full Name</IonLabel>
                <IonInput 
                  value={fullName} 
                  onIonInput={(e) => setFullName(e.detail.value ?? "")} 
                  placeholder="Enter your full name"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput 
                  type="email"
                  value={email} 
                  onIonInput={(e) => setEmail(e.detail.value ?? "")} 
                  placeholder="Enter your email"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Phone</IonLabel>
                <IonInput 
                  type="tel"
                  value={phone} 
                  onIonInput={(e) => setPhone(e.detail.value ?? "")} 
                  placeholder="Enter your phone number"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Photo URL (optional)</IonLabel>
                <IonInput 
                  type="url"
                  value={photoUrl} 
                  onIonInput={(e) => setPhotoUrl(e.detail.value ?? "")} 
                  placeholder="https://example.com/photo.jpg"
                />
              </IonItem>
            </IonList>

            <div style={{ marginTop: 20 }}>
              <IonButton expand="block" onClick={handleSave}>
                Save Changes
              </IonButton>
            </div>

            <div style={{ marginTop: 10 }}>
              <IonButton expand="block" fill="outline" color="danger" onClick={handleLogout}>
                <IonIcon icon={logOutOutline} slot="start" />
                Logout
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={3000}
          color={toast.color}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>
    </IonPage>
  );
};
