import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonRadio,
  IonText,
  IonNote,
  IonAvatar,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { camera, personCircle } from 'ionicons/icons';

const Step1DogProfile = ({ 
  formData, 
  onChange, 
  errors, 
  isAdmin,
  clients = []
}) => {
  const [useAge, setUseAge] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (formData.date_of_birth) {
      setUseAge(false);
    } else if (formData.age) {
      setUseAge(true);
    }
  }, [formData.date_of_birth, formData.age]);

  useEffect(() => {
    if (formData.client_id && clients.length > 0) {
      const client = clients.find(c => c.user_id === parseInt(formData.client_id));
      setSelectedClient(client);
    }
  }, [formData.client_id, clients]);

  const handleAgeToggle = (value) => {
    setUseAge(value === 'age');
    if (value === 'age') {
      onChange('date_of_birth', '');
    } else {
      onChange('age', '');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('profile_photo_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Dog Profile</h2>
      
      {/* Admin Only: Owner Selection */}
      {isAdmin && (
        <div className="owner-selection-section">
          <IonList>
            <IonItem>
              <IonLabel position="stacked">
                Owner/Client <IonText color="danger">*</IonText>
              </IonLabel>
              <IonSelect
                value={formData.client_id}
                placeholder="Select owner"
                onIonChange={(e) => onChange('client_id', e.detail.value)}
                interface="popover"
              >
                {clients.map((client) => (
                  <IonSelectOption key={client.user_id} value={client.user_id}>
                    {client.full_name} ({client.email})
                  </IonSelectOption>
                ))}
              </IonSelect>
              {errors.client_id && (
                <IonText color="danger">
                  <small>{errors.client_id}</small>
                </IonText>
              )}
            </IonItem>
          </IonList>
          
          {selectedClient && (
            <div className="selected-owner-display">
              <IonText color="medium">
                <p>Adding dog for: <strong>{selectedClient.full_name}</strong></p>
              </IonText>
            </div>
          )}
        </div>
      )}

      {/* Photo Upload */}
      <div className="photo-upload-section">
        <IonLabel>Dog Photo/Avatar</IonLabel>
        <div className="photo-upload-container">
          <IonAvatar className="dog-avatar">
            {formData.profile_photo_url ? (
              <img src={formData.profile_photo_url} alt="Dog" />
            ) : (
              <IonIcon icon={personCircle} />
            )}
          </IonAvatar>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          <IonButton
            fill="outline"
            size="small"
            onClick={() => document.getElementById('photo-upload').click()}
          >
            <IonIcon slot="start" icon={camera} />
            Upload Photo
          </IonButton>
        </div>
        <IonNote>Optional - Max 5MB</IonNote>
      </div>

      <IonList>
        {/* Dog Name */}
        <IonItem>
          <IonLabel position="stacked">
            Dog Name <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            value={formData.name}
            placeholder="e.g. Max"
            onIonInput={(e) => onChange('name', e.detail.value)}
            onIonBlur={(e) => onChange('name', e.detail.value.trim())}
            maxlength={40}
          />
          {errors.name && (
            <IonText color="danger">
              <small>{errors.name}</small>
            </IonText>
          )}
        </IonItem>

        {/* Breed */}
        <IonItem>
          <IonLabel position="stacked">
            Breed <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            value={formData.breed}
            placeholder="e.g. Labrador Retriever"
            onIonInput={(e) => onChange('breed', e.detail.value)}
            onIonBlur={(e) => onChange('breed', e.detail.value.trim())}
            maxlength={60}
          />
          {errors.breed && (
            <IonText color="danger">
              <small>{errors.breed}</small>
            </IonText>
          )}
        </IonItem>

        {/* DOB or Age Toggle */}
        <IonItem>
          <IonLabel>Age Entry Method <IonText color="danger">*</IonText></IonLabel>
        </IonItem>
        <IonRadioGroup value={useAge ? 'age' : 'dob'} onIonChange={(e) => handleAgeToggle(e.detail.value)}>
          <IonItem>
            <IonLabel>Use Date of Birth</IonLabel>
            <IonRadio slot="start" value="dob" />
          </IonItem>
          <IonItem>
            <IonLabel>Use Age (years)</IonLabel>
            <IonRadio slot="start" value="age" />
          </IonItem>
        </IonRadioGroup>

        {/* Date of Birth or Age Input */}
        {!useAge ? (
          <IonItem>
            <IonLabel position="stacked">Date of Birth</IonLabel>
            <IonInput
              type="date"
              value={formData.date_of_birth}
              max={new Date().toISOString().split('T')[0]}
              onIonInput={(e) => onChange('date_of_birth', e.detail.value)}
            />
            {errors.date_of_birth && (
              <IonText color="danger">
                <small>{errors.date_of_birth}</small>
              </IonText>
            )}
          </IonItem>
        ) : (
          <IonItem>
            <IonLabel position="stacked">Age (years)</IonLabel>
            <IonInput
              type="number"
              value={formData.age}
              placeholder="e.g. 5"
              min="0"
              max="30"
              onIonInput={(e) => {
                const val = e.detail.value;
                if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 30)) {
                  onChange('age', val);
                }
              }}
            />
            {errors.age && (
              <IonText color="danger">
                <small>{errors.age}</small>
              </IonText>
            )}
          </IonItem>
        )}

        {/* Sex */}
        <IonItem>
          <IonLabel>Sex <IonText color="danger">*</IonText></IonLabel>
        </IonItem>
        <IonRadioGroup value={formData.sex} onIonChange={(e) => onChange('sex', e.detail.value)}>
          <IonItem>
            <IonLabel>Male</IonLabel>
            <IonRadio slot="start" value="Male" />
          </IonItem>
          <IonItem>
            <IonLabel>Female</IonLabel>
            <IonRadio slot="start" value="Female" />
          </IonItem>
        </IonRadioGroup>
        {errors.sex && (
          <IonText color="danger" className="ion-padding-start">
            <small>{errors.sex}</small>
          </IonText>
        )}

        {/* Microchipped */}
        <IonItem>
          <IonLabel>Microchipped <IonText color="danger">*</IonText></IonLabel>
        </IonItem>
        <IonRadioGroup value={formData.microchipped} onIonChange={(e) => onChange('microchipped', e.detail.value)}>
          <IonItem>
            <IonLabel>Yes</IonLabel>
            <IonRadio slot="start" value="Yes" />
          </IonItem>
          <IonItem>
            <IonLabel>No</IonLabel>
            <IonRadio slot="start" value="No" />
          </IonItem>
          <IonItem>
            <IonLabel>Unknown</IonLabel>
            <IonRadio slot="start" value="Unknown" />
          </IonItem>
        </IonRadioGroup>
        {errors.microchipped && (
          <IonText color="danger" className="ion-padding-start">
            <small>{errors.microchipped}</small>
          </IonText>
        )}

        {/* Conditional: Microchip Number */}
        {formData.microchipped === 'Yes' && (
          <IonItem>
            <IonLabel position="stacked">
              Microchip Number <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput
              value={formData.microchip_number}
              placeholder="Usually 15 digits"
              onIonInput={(e) => {
                const val = e.detail.value.replace(/\D/g, '');
                onChange('microchip_number', val);
              }}
              maxlength={15}
            />
            <IonNote slot="helper">Must be exactly 15 digits</IonNote>
            {errors.microchip_number && (
              <IonText color="danger">
                <small>{errors.microchip_number}</small>
              </IonText>
            )}
          </IonItem>
        )}
      </IonList>
    </div>
  );
};

export default Step1DogProfile;
