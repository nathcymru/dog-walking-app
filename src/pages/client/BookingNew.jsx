import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonBadge,
  IonText,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { arrowBack, arrowForward, checkmarkCircle, timeOutline, pawOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory } from 'react-router-dom';

const STEPS = ['Select Slot', 'Select Pets', 'Confirm'];

export default function BookingNew() {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots] = useState([]);
  const [pets, setPets] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [walkTypeFilter, setWalkTypeFilter] = useState('');

  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const [notes, setNotes] = useState('');

  const breadcrumbItems = [
    { label: 'Client', path: '/client' },
    { label: 'Bookings', path: '/client/bookings' },
    { label: 'Book a Walk', path: '/client/bookings/new' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slotsRes, petsRes] = await Promise.all([
        fetch('/api/client/slots/available', { credentials: 'include' }),
        fetch('/api/client/pets', { credentials: 'include' }),
      ]);

      if (slotsRes.ok) {
        const data = await slotsRes.json();
        setSlots(Array.isArray(data) ? data : []);
      }
      if (petsRes.ok) {
        const data = await petsRes.json();
        setPets(Array.isArray(data) ? data : []);
      }
    } catch {
      showToast('Failed to load data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  const filteredSlots = walkTypeFilter
    ? slots.filter((s) => s.walk_type === walkTypeFilter)
    : slots;

  const handleNext = () => {
    if (currentStep === 1 && !selectedSlotId) {
      showToast('Please select a slot', 'warning');
      return;
    }
    if (currentStep === 2 && selectedPetIds.length === 0) {
      showToast('Please select at least one pet', 'warning');
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/client/bookings', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot_id: selectedSlotId,
          pet_ids: selectedPetIds,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        showToast('Booking request submitted! You will be notified when it is approved.');
        setTimeout(() => history.push('/client/bookings'), 2000);
      } else {
        const err = await response.json();
        showToast(err.error || 'Failed to submit booking', 'danger');
      }
    } catch {
      showToast('Failed to submit booking', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const togglePet = (petId) => {
    setSelectedPetIds((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Book a Walk" />
        <IonContent>
          <Breadcrumbs items={breadcrumbItems} />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title="Book a Walk" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          {/* Step Indicator */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              {STEPS.map((label, i) => {
                const step = i + 1;
                const active = step === currentStep;
                const done = step < currentStep;
                return (
                  <div
                    key={step}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: done
                        ? 'var(--ion-color-success)'
                        : active
                        ? 'var(--ion-color-primary)'
                        : 'var(--ion-color-light)',
                      color: done || active ? 'white' : 'var(--ion-color-medium)',
                      fontSize: '0.85rem',
                      fontWeight: active ? 'bold' : 'normal',
                    }}
                  >
                    <span>{done ? '✓' : step}</span>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1: Select Slot */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ marginBottom: '8px' }}>Choose a Walk Slot</h2>
              <IonSegment
                value={walkTypeFilter}
                onIonChange={(e) => setWalkTypeFilter(e.detail.value)}
                style={{ marginBottom: '16px' }}
              >
                <IonSegmentButton value="">All</IonSegmentButton>
                <IonSegmentButton value="GROUP">Group</IonSegmentButton>
                <IonSegmentButton value="PRIVATE">Private</IonSegmentButton>
              </IonSegment>

              {filteredSlots.length === 0 ? (
                <IonCard>
                  <IonCardContent>
                    <IonText color="medium">
                      <p style={{ textAlign: 'center' }}>No available slots at the moment. Please check back soon!</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {filteredSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <IonCard
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        style={{
                          cursor: 'pointer',
                          border: isSelected
                            ? '2px solid var(--ion-color-primary)'
                            : '2px solid transparent',
                          margin: 0,
                        }}
                      >
                        <IonCardContent>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                <IonIcon icon={timeOutline} color="primary" />
                                <strong>{formatDateTime(slot.start_at)}</strong>
                                <IonBadge color={slot.walk_type === 'GROUP' ? 'primary' : 'success'}>
                                  {slot.walk_type}
                                </IonBadge>
                              </div>
                              {slot.walker_name && (
                                <p style={{ margin: '0 0 4px', color: 'var(--ion-color-medium)' }}>
                                  Walker: {slot.walker_name}
                                </p>
                              )}
                              {slot.location_label && (
                                <p style={{ margin: '0 0 4px', color: 'var(--ion-color-medium)' }}>
                                  {slot.location_label}
                                </p>
                              )}
                              <IonBadge
                                color={slot.spots_remaining <= 1 ? 'warning' : 'light'}
                                style={{ color: slot.spots_remaining <= 1 ? undefined : 'var(--ion-color-dark)' }}
                              >
                                {slot.spots_remaining} spot{slot.spots_remaining !== 1 ? 's' : ''} left
                              </IonBadge>
                            </div>
                            {isSelected && (
                              <IonIcon icon={checkmarkCircle} color="primary" style={{ fontSize: '1.5rem' }} />
                            )}
                          </div>
                        </IonCardContent>
                      </IonCard>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Pets */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ marginBottom: '8px' }}>Which dogs are coming?</h2>
              {pets.length === 0 ? (
                <IonCard>
                  <IonCardContent>
                    <IonText color="medium">
                      <p>No pets found. Please add a pet to your account first.</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {pets.map((pet) => (
                    <IonItem
                      key={pet.id}
                      button
                      onClick={() => togglePet(pet.id)}
                      style={{
                        '--background': selectedPetIds.includes(pet.id)
                          ? 'var(--ion-color-primary-tint)'
                          : undefined,
                      }}
                    >
                      <IonCheckbox
                        slot="start"
                        checked={selectedPetIds.includes(pet.id)}
                        onIonChange={() => togglePet(pet.id)}
                      />
                      <IonLabel>
                        <h3>{pet.name}</h3>
                        <p>{pet.breed || 'Unknown breed'}</p>
                      </IonLabel>
                      <IonIcon icon={pawOutline} slot="end" color="medium" />
                    </IonItem>
                  ))}
                </div>
              )}

              <IonItem style={{ marginTop: '16px' }}>
                <IonLabel position="stacked">Notes (optional)</IonLabel>
                <IonTextarea
                  value={notes}
                  onIonInput={(e) => setNotes(e.detail.value)}
                  placeholder="Any notes for the walker..."
                  rows={3}
                />
              </IonItem>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && selectedSlot && (
            <div>
              <h2 style={{ marginBottom: '16px' }}>Confirm Your Booking</h2>
              <IonCard>
                <IonCardContent>
                  <h3 style={{ marginTop: 0 }}>Walk Slot</h3>
                  <p><strong>Date & Time:</strong> {formatDateTime(selectedSlot.start_at)}</p>
                  <p><strong>Type:</strong> {selectedSlot.walk_type}</p>
                  {selectedSlot.walker_name && (
                    <p><strong>Walker:</strong> {selectedSlot.walker_name}</p>
                  )}
                  {selectedSlot.location_label && (
                    <p><strong>Location:</strong> {selectedSlot.location_label}</p>
                  )}
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardContent>
                  <h3 style={{ marginTop: 0 }}>Dogs</h3>
                  {pets
                    .filter((p) => selectedPetIds.includes(p.id))
                    .map((pet) => (
                      <p key={pet.id} style={{ margin: '4px 0' }}>
                        <IonIcon icon={pawOutline} /> {pet.name} ({pet.breed || 'Unknown breed'})
                      </p>
                    ))}
                </IonCardContent>
              </IonCard>

              {notes && (
                <IonCard>
                  <IonCardContent>
                    <h3 style={{ marginTop: 0 }}>Notes</h3>
                    <p>{notes}</p>
                  </IonCardContent>
                </IonCard>
              )}

              <IonCard color="light">
                <IonCardContent>
                  <IonText color="medium">
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      ⏳ Your booking will be reviewed and confirmed by the team within 24 hours.
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            {currentStep > 1 ? (
              <IonButton fill="outline" onClick={handleBack}>
                <IonIcon icon={arrowBack} slot="start" />
                Back
              </IonButton>
            ) : (
              <IonButton fill="outline" color="medium" onClick={() => history.goBack()}>
                Cancel
              </IonButton>
            )}

            {currentStep < 3 ? (
              <IonButton onClick={handleNext}>
                Next
                <IonIcon icon={arrowForward} slot="end" />
              </IonButton>
            ) : (
              <IonButton
                color="success"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <IonSpinner name="crescent" /> : 'Submit Request'}
              </IonButton>
            )}
          </div>
        </div>

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={4000}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>
    </IonPage>
  );
}
