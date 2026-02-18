import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonIcon,
  IonAvatar,
  IonText,
} from '@ionic/react';
import { create, personCircle } from 'ionicons/icons';

const Step4Review = ({ 
  formData, 
  onEdit,
  isAdmin,
  clients = []
}) => {
  const getClientName = () => {
    if (!isAdmin) return null;
    const client = clients.find(c => c.user_id === parseInt(formData.client_id));
    return client ? `${client.full_name} (${client.email})` : 'Unknown';
  };

  const calculateAge = () => {
    if (formData.age) {
      return `${formData.age} years`;
    }
    if (formData.date_of_birth) {
      const today = new Date();
      const birthDate = new Date(formData.date_of_birth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years`;
    }
    return 'Unknown';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Review & Confirm</h2>
      <p className="review-subtitle">Please review all information before saving</p>

      {/* Section 1: Dog Profile */}
      <IonCard className="review-section">
        <IonCardHeader>
          <div className="review-section-header">
            <h3>Dog Profile</h3>
            <IonButton fill="clear" size="small" onClick={() => onEdit(1)}>
              <IonIcon slot="start" icon={create} />
              Edit
            </IonButton>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <div className="profile-photo-section">
            <IonAvatar className="review-avatar">
              {formData.profile_photo_url ? (
                <img src={formData.profile_photo_url} alt="Dog" />
              ) : (
                <IonIcon icon={personCircle} />
              )}
            </IonAvatar>
          </div>
          
          <div className="review-field">
            <strong>Name:</strong> {formData.name}
          </div>
          <div className="review-field">
            <strong>Breed:</strong> {formData.breed}
          </div>
          <div className="review-field">
            <strong>Date of Birth:</strong> {formData.date_of_birth ? formatDate(formData.date_of_birth) : 'N/A'} 
            {' '}(Age: {calculateAge()})
          </div>
          <div className="review-field">
            <strong>Sex:</strong> {formData.sex}
          </div>
          <div className="review-field">
            <strong>Microchipped:</strong> {formData.microchipped}
            {formData.microchipped === 'Yes' && formData.microchip_number && 
              ` (${formData.microchip_number})`
            }
          </div>
          
          {isAdmin && (
            <div className="review-field owner-field">
              <strong>Owner:</strong> {getClientName()}
            </div>
          )}
        </IonCardContent>
      </IonCard>

      {/* Section 2: Walk Setup */}
      <IonCard className="review-section">
        <IonCardHeader>
          <div className="review-section-header">
            <h3>Walk Setup</h3>
            <IonButton fill="clear" size="small" onClick={() => onEdit(2)}>
              <IonIcon slot="start" icon={create} />
              Edit
            </IonButton>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <div className="eligibility-section">
            <div className="policy-badge">📋 Walk Eligibility</div>
          </div>
          
          <div className="review-field">
            <strong>Handling:</strong> {formData.handling_requirement || 'Not specified'}
          </div>
          <div className="review-field">
            <strong>Walk Preference:</strong> {formData.walk_type_preference || 'Not specified'}
          </div>
          
          <div className="eligibility-badges">
            <span className={`eligibility-badge ${formData.eligible_for_group_walk ? 'eligible' : 'not-eligible'}`}>
              {formData.eligible_for_group_walk ? '✅' : '❌'} Group Walks
            </span>
            <span className={`eligibility-badge ${formData.eligible_for_private_walk ? 'eligible' : 'not-eligible'}`}>
              {formData.eligible_for_private_walk ? '✅' : '❌'} Private Walks
            </span>
          </div>
          
          <div className="review-field">
            <strong>Recall:</strong> {formData.recall_reliability || 'Not specified'}
          </div>
          
          {formData.reactivity_flags && formData.reactivity_flags.length > 0 && (
            <div className="review-field">
              <strong>Reactivity:</strong> {formData.reactivity_flags.join(', ')}
              {formData.reactivity_flags.includes('Other') && formData.reactivity_other_details && (
                <div className="review-subfield">Details: {formData.reactivity_other_details}</div>
              )}
            </div>
          )}
          
          {formData.handling_notes && (
            <div className="review-field">
              <strong>Handling Notes:</strong>
              <div className="review-notes">{formData.handling_notes}</div>
            </div>
          )}
        </IonCardContent>
      </IonCard>

      {/* Section 3: Health, Vet & Insurance */}
      <IonCard className="review-section">
        <IonCardHeader>
          <div className="review-section-header">
            <h3>Health, Vet & Insurance</h3>
            <IonButton fill="clear" size="small" onClick={() => onEdit(3)}>
              <IonIcon slot="start" icon={create} />
              Edit
            </IonButton>
          </div>
        </IonCardHeader>
        <IonCardContent>
          {formData.medical_conditions && (
            <div className="review-field">
              <strong>Medical Conditions:</strong>
              <div className="review-notes">{formData.medical_conditions}</div>
            </div>
          )}
          
          {formData.medications && (
            <div className="review-field">
              <strong>Medications:</strong>
              <div className="review-notes">{formData.medications}</div>
            </div>
          )}
          
          {formData.allergies && (
            <div className="review-field allergies-review">
              <strong>⚠️ Allergies:</strong>
              <div className="review-notes">{formData.allergies}</div>
            </div>
          )}
          
          {formData.vet_practice_name && (
            <div className="review-field">
              <strong>Vet:</strong> {formData.vet_practice_name}
            </div>
          )}
          
          {formData.vet_phone && (
            <div className="review-field">
              <strong>Vet Phone:</strong> {formData.vet_phone}
            </div>
          )}
          
          <div className="review-field">
            <strong>Insurance:</strong> {formData.insurance_status}
            {formData.insurance_status === 'Yes' && formData.insurance_provider && 
              ` (${formData.insurance_provider})`
            }
          </div>
          
          {formData.insurance_status === 'Yes' && formData.insurance_policy_number && (
            <div className="review-field">
              <strong>Policy Number:</strong> {formData.insurance_policy_number}
            </div>
          )}
          
          {/* Show empty state if no health info */}
          {!formData.medical_conditions && !formData.medications && !formData.allergies && 
           !formData.vet_practice_name && !formData.vet_phone && (
            <IonText color="medium">
              <p>No health or vet information provided</p>
            </IonText>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default Step4Review;
