import React from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonRadioGroup,
  IonRadio,
  IonText,
  IonNote,
} from '@ionic/react';
import './Step3HealthVetInsurance.css';

const Step3HealthVetInsurance = ({ 
  formData, 
  onChange, 
  errors 
}) => {
  return (
    <div className="step-container">
      <h2 className="step-title">Health, Vet & Insurance</h2>

      <IonList>
        {/* Medical Conditions */}
        <IonItem>
          <IonLabel position="stacked">
            <h3>Medical Conditions (optional)</h3>
          </IonLabel>
          <IonTextarea
            value={formData.medical_conditions}
            placeholder="List any medical conditions (e.g. arthritis, diabetes)..."
            rows={3}
            maxlength={500}
            onIonInput={(e) => onChange('medical_conditions', e.detail.value)}
          />
          <IonNote slot="helper">Max 500 characters</IonNote>
        </IonItem>

        {/* Medications */}
        <IonItem>
          <IonLabel position="stacked">
            <h3>Medications (optional)</h3>
          </IonLabel>
          <IonTextarea
            value={formData.medications}
            placeholder="List current medications and dosages..."
            rows={3}
            maxlength={500}
            onIonInput={(e) => onChange('medications', e.detail.value)}
          />
          <IonNote slot="helper">Max 500 characters</IonNote>
        </IonItem>

        {/* Allergies - Emphasized */}
        <IonItem className="allergies-item">
          <IonLabel position="stacked">
            <h3 className="allergies-label">⚠️ Allergies (optional)</h3>
          </IonLabel>
          <IonTextarea
            value={formData.allergies}
            placeholder="⚠️ List any allergies (foods, medications, environmental)..."
            rows={3}
            maxlength={500}
            onIonInput={(e) => onChange('allergies', e.detail.value)}
            className="allergies-textarea"
          />
          <IonNote slot="helper" className="allergies-note">
            Important safety information - Max 500 characters
          </IonNote>
        </IonItem>

        {/* Vet Practice Name */}
        <IonItem>
          <IonLabel position="stacked">
            <h3>Vet Practice Name (optional)</h3>
          </IonLabel>
          <IonInput
            value={formData.vet_practice_name}
            placeholder="e.g. Greenwood Veterinary Practice"
            maxlength={80}
            onIonInput={(e) => onChange('vet_practice_name', e.detail.value)}
          />
        </IonItem>

        {/* Vet Phone Number */}
        <IonItem>
          <IonLabel position="stacked">
            <h3>Vet Phone Number (optional)</h3>
          </IonLabel>
          <IonInput
            type="tel"
            value={formData.vet_phone}
            placeholder="e.g. 01234 567890"
            onIonInput={(e) => {
              // Allow +, digits, spaces
              const val = e.detail.value.replace(/[^\d\s+]/g, '');
              onChange('vet_phone', val);
            }}
          />
          <IonNote slot="helper">UK phone number</IonNote>
        </IonItem>

        {/* Insurance Status */}
        <IonItem className="section-header">
          <IonLabel>
            <h3>Insurance <IonText color="danger">*</IonText></h3>
          </IonLabel>
        </IonItem>
        <IonRadioGroup 
          value={formData.insurance_status} 
          onIonChange={(e) => {
            onChange('insurance_status', e.detail.value);
            if (e.detail.value !== 'Yes') {
              onChange('insurance_provider', '');
              onChange('insurance_policy_number', '');
            }
          }}
        >
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
        {errors.insurance_status && (
          <IonText color="danger" className="ion-padding-start">
            <small>{errors.insurance_status}</small>
          </IonText>
        )}

        {/* Conditional: Insurance Provider */}
        {formData.insurance_status === 'Yes' && (
          <>
            <IonItem>
              <IonLabel position="stacked">
                Provider Name <IonText color="danger">*</IonText>
              </IonLabel>
              <IonInput
                value={formData.insurance_provider}
                placeholder="e.g. Petplan, Animal Friends"
                maxlength={60}
                onIonInput={(e) => onChange('insurance_provider', e.detail.value)}
              />
              {errors.insurance_provider && (
                <IonText color="danger">
                  <small>{errors.insurance_provider}</small>
                </IonText>
              )}
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                Policy Number (optional)
              </IonLabel>
              <IonInput
                value={formData.insurance_policy_number}
                placeholder="Optional policy reference"
                maxlength={40}
                onIonInput={(e) => onChange('insurance_policy_number', e.detail.value)}
              />
            </IonItem>
          </>
        )}
      </IonList>
    </div>
  );
};

export default Step3HealthVetInsurance;
