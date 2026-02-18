import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonText,
  IonCheckbox,
  IonTextarea,
  IonInput,
  IonNote,
  IonCard,
  IonCardContent,
} from '@ionic/react';

const Step2WalkSetup = ({ 
  formData, 
  onChange, 
  errors 
}) => {
  const [showAutoCorrectAlert, setShowAutoCorrectAlert] = useState(false);

  // Walk Eligibility Enforcement Logic
  useEffect(() => {
    const handlingReq = formData.handling_requirement;
    const walkPref = formData.walk_type_preference;

    if (handlingReq === 'Long-Line Required' || handlingReq === 'Lead Required') {
      // Set eligibility flags
      onChange('eligible_for_group_walk', false);
      onChange('eligible_for_private_walk', true);
      
      // Auto-correct walk type if needed
      if (walkPref === 'Group Walk' || walkPref === 'Any Walk') {
        onChange('walk_type_preference', 'Private Walk');
        setShowAutoCorrectAlert(true);
        
        // Clear alert after 5 seconds
        setTimeout(() => setShowAutoCorrectAlert(false), 5000);
      }
    } else if (handlingReq === 'Off-Lead Approved') {
      // Enable all options
      onChange('eligible_for_group_walk', true);
      onChange('eligible_for_private_walk', true);
      setShowAutoCorrectAlert(false);
    }
  }, [formData.handling_requirement, formData.walk_type_preference, onChange]);

  const isGroupWalkDisabled = formData.handling_requirement === 'Long-Line Required' || 
                               formData.handling_requirement === 'Lead Required';
  const isAnyWalkDisabled = isGroupWalkDisabled;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Walk Setup</h2>

      {/* Walk Eligibility Policy Notice */}
      <IonCard className="policy-notice">
        <IonCardContent>
          <div className="policy-header">
            <span className="policy-icon">📋</span>
            <strong>Walk Eligibility Policy</strong>
          </div>
          <p>
            Dogs requiring a lead or long-line are eligible for <strong>Private Walks only</strong>.
          </p>
          <p>
            Group Walks are reserved for dogs approved for safe off-lead interaction.
          </p>
        </IonCardContent>
      </IonCard>

      {/* Auto-correct Alert */}
      {showAutoCorrectAlert && (
        <div className="auto-correct-alert">
          <IonText color="warning">
            <p>⚠️ Updated to Private Walk to match lead requirement.</p>
          </IonText>
        </div>
      )}

      <IonList>
        {/* Handling Requirement */}
        <IonItem>
          <IonLabel>
            <h3>Handling Requirement <IonText color="danger">*</IonText></h3>
            <p>How must this dog be handled during walks?</p>
          </IonLabel>
        </IonItem>
        <IonRadioGroup 
          value={formData.handling_requirement} 
          onIonChange={(e) => onChange('handling_requirement', e.detail.value)}
        >
          <IonItem className="handling-option">
            <IonLabel>
              <h3 className="handling-label">✓ Off-Lead Approved</h3>
              <p>Safe for off-lead walking with reliable recall</p>
            </IonLabel>
            <IonRadio slot="start" value="Off-Lead Approved" />
          </IonItem>
          <IonItem className="handling-option">
            <IonLabel>
              <h3 className="handling-label">✓ Long-Line Required</h3>
              <p>Needs long-line for safety/training purposes</p>
            </IonLabel>
            <IonRadio slot="start" value="Long-Line Required" />
          </IonItem>
          <IonItem className="handling-option">
            <IonLabel>
              <h3 className="handling-label">✓ Lead Required</h3>
              <p>Must remain on standard lead at all times</p>
            </IonLabel>
            <IonRadio slot="start" value="Lead Required" />
          </IonItem>
        </IonRadioGroup>
        {errors.handling_requirement && (
          <IonText color="danger" className="ion-padding-start">
            <small>{errors.handling_requirement}</small>
          </IonText>
        )}

        {/* Walk Type Preference */}
        <IonItem className="section-header">
          <IonLabel>
            <h3>Walk Type Preference <IonText color="danger">*</IonText></h3>
          </IonLabel>
        </IonItem>
        <IonRadioGroup 
          value={formData.walk_type_preference} 
          onIonChange={(e) => onChange('walk_type_preference', e.detail.value)}
        >
          <IonItem disabled={isGroupWalkDisabled} className="walk-type-option">
            <IonLabel>
              <h3>○ Group Walk</h3>
              <p>Walk with other dogs (off-lead only)</p>
            </IonLabel>
            <IonRadio slot="start" value="Group Walk" disabled={isGroupWalkDisabled} />
          </IonItem>
          <IonItem className="walk-type-option">
            <IonLabel>
              <h3>○ Private Walk</h3>
              <p>One-on-one walks (any handling type)</p>
            </IonLabel>
            <IonRadio slot="start" value="Private Walk" />
          </IonItem>
          <IonItem disabled={isAnyWalkDisabled} className="walk-type-option">
            <IonLabel>
              <h3>○ Any Walk</h3>
              <p>Flexible - any available walk type</p>
            </IonLabel>
            <IonRadio slot="start" value="Any Walk" disabled={isAnyWalkDisabled} />
          </IonItem>
        </IonRadioGroup>
        {errors.walk_type_preference && (
          <IonText color="danger" className="ion-padding-start">
            <small>{errors.walk_type_preference}</small>
          </IonText>
        )}

        {/* Eligibility Display */}
        {formData.handling_requirement && (
          <div className="eligibility-display">
            <IonText color="medium">
              <p><strong>Eligibility:</strong></p>
              <p>
                {formData.eligible_for_group_walk ? '✅' : '❌'} Group Walks<br />
                {formData.eligible_for_private_walk ? '✅' : '❌'} Private Walks
              </p>
            </IonText>
          </div>
        )}

        {/* Recall Reliability */}
        <IonItem className="section-header">
          <IonLabel>
            <h3>Recall Reliability <IonText color="danger">*</IonText></h3>
          </IonLabel>
        </IonItem>
        <IonRadioGroup 
          value={formData.recall_reliability} 
          onIonChange={(e) => onChange('recall_reliability', e.detail.value)}
        >
          <IonItem>
            <IonLabel>Reliable</IonLabel>
            <IonRadio slot="start" value="Reliable" />
          </IonItem>
          <IonItem>
            <IonLabel>Mixed</IonLabel>
            <IonRadio slot="start" value="Mixed" />
          </IonItem>
          <IonItem>
            <IonLabel>Unreliable</IonLabel>
            <IonRadio slot="start" value="Unreliable" />
          </IonItem>
          <IonItem>
            <IonLabel>Unknown</IonLabel>
            <IonRadio slot="start" value="Unknown" />
          </IonItem>
        </IonRadioGroup>
        {errors.recall_reliability && (
          <IonText color="danger" className="ion-padding-start">
            <small>{errors.recall_reliability}</small>
          </IonText>
        )}

        {/* Reactivity Flags */}
        <IonItem className="section-header">
          <IonLabel>
            <h3>Reactivity (optional)</h3>
            <p>Select all that apply</p>
          </IonLabel>
        </IonItem>
        
        {['Dogs', 'People', 'Children', 'Traffic', 'Bikes/Scooters', 'Other'].map((flag) => (
          <IonItem key={flag}>
            <IonLabel>{flag}</IonLabel>
            <IonCheckbox
              slot="start"
              checked={formData.reactivity_flags?.includes(flag) || false}
              onIonChange={(e) => {
                const currentFlags = formData.reactivity_flags || [];
                if (e.detail.checked) {
                  onChange('reactivity_flags', [...currentFlags, flag]);
                } else {
                  onChange('reactivity_flags', currentFlags.filter(f => f !== flag));
                  if (flag === 'Other') {
                    onChange('reactivity_other_details', '');
                  }
                }
              }}
            />
          </IonItem>
        ))}

        {/* Conditional: Other Details */}
        {formData.reactivity_flags?.includes('Other') && (
          <IonItem>
            <IonLabel position="stacked">
              Other Reactivity Details <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput
              value={formData.reactivity_other_details}
              placeholder="Describe other reactivity triggers"
              onIonInput={(e) => onChange('reactivity_other_details', e.detail.value)}
              maxlength={120}
            />
            {errors.reactivity_other_details && (
              <IonText color="danger">
                <small>{errors.reactivity_other_details}</small>
              </IonText>
            )}
          </IonItem>
        )}

        {/* Handling Notes */}
        <IonItem>
          <IonLabel position="stacked">
            <h3>Handling Notes (optional)</h3>
          </IonLabel>
          <IonTextarea
            value={formData.handling_notes}
            placeholder="Any additional handling instructions..."
            rows={4}
            maxlength={500}
            onIonInput={(e) => onChange('handling_notes', e.detail.value)}
          />
          <IonNote slot="helper">Max 500 characters</IonNote>
        </IonItem>
      </IonList>
    </div>
  );
};

export default Step2WalkSetup;
