import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonButtons,
  IonIcon,
  IonAlert,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
  IonBadge,
  IonRange,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { add, create, trash, close, pawOutline } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, petId: null });
  const [searchText, setSearchText] = useState('');
  const [modalSection, setModalSection] = useState('identity');

  const [formData, setFormData] = useState({
    // Identity
    client_id: '',
    profile_photo_url: '',
    name: '',
    nickname: '',
    breed: '',
    sex: 'Unknown',
    neutered: 0,
    date_of_birth: '',
    colour_markings: '',
    // Microchip
    microchipped: 0,
    microchip_number: '',
    collar_tag_present: 0,
    // Group Walk Compatibility
    group_walk_eligible: 1,
    max_group_size: 4,
    around_other_dogs: 'Unknown',
    around_puppies: 'Unknown',
    around_small_dogs: 'Unknown',
    around_large_dogs: 'Unknown',
    play_style: 'Unknown',
    resource_guarding: 'Unknown',
    resource_guarding_details: '',
    muzzle_required_for_group: 'No',
    muzzle_trained: 'No',
    // Health
    allergies: 'Unknown',
    allergy_details: '',
    medical_conditions: 'Unknown',
    condition_details: '',
    medications: 'Unknown',
    medication_details: '',
    mobility_limits: 'None',
    heat_sensitivity: 'Unknown',
    vaccination_status: 'Unknown',
    parasite_control: 'Unknown',
    // Behaviour & Handling
    lead_type: 'Standard',
    harness_type: 'None',
    pulling_level: 5,
    recall_reliability: 5,
    escape_risk: 'Unknown',
    door_darter: 'Unknown',
    bite_history: 'Unknown',
    bite_history_details: '',
    reactivity_triggers: '',
    trigger_details: '',
    // Feeding
    treats_allowed: 'Yes',
    approved_treats: '',
    do_not_give_list: '',
    food_guarding: 'Unknown',
    // Walk Preferences
    preferred_walk_type: 'Any',
    preferred_duration: 30,
    environment_restrictions: '',
    other_restriction: '',
    routine_notes: '',
  });

  useEffect(() => {
    fetchPets();
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter(pet => 
        pet.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchText.toLowerCase()) ||
        pet.client_name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPets(filtered);
    }
  }, [pets, searchText]);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/admin/pets', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 403 || response.status === 401) {
        showToast('Authentication required. Please log in.', 'danger');
        setPets([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      if (data.error) {
        showToast(data.error, 'danger');
        setPets([]);
      } else if (Array.isArray(data)) {
        setPets(data);
      } else {
        showToast('Invalid response format', 'danger');
        setPets([]);
      }
    } catch (error) {
      showToast('Failed to fetch pets', 'danger');
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setClients(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const resetFormData = () => {
    setFormData({
      client_id: '',
      profile_photo_url: '',
      name: '',
      nickname: '',
      breed: '',
      sex: 'Unknown',
      neutered: 0,
      date_of_birth: '',
      colour_markings: '',
      microchipped: 0,
      microchip_number: '',
      collar_tag_present: 0,
      group_walk_eligible: 1,
      max_group_size: 4,
      around_other_dogs: 'Unknown',
      around_puppies: 'Unknown',
      around_small_dogs: 'Unknown',
      around_large_dogs: 'Unknown',
      play_style: 'Unknown',
      resource_guarding: 'Unknown',
      resource_guarding_details: '',
      muzzle_required_for_group: 'No',
      muzzle_trained: 'No',
      allergies: 'Unknown',
      allergy_details: '',
      medical_conditions: 'Unknown',
      condition_details: '',
      medications: 'Unknown',
      medication_details: '',
      mobility_limits: 'None',
      heat_sensitivity: 'Unknown',
      vaccination_status: 'Unknown',
      parasite_control: 'Unknown',
      lead_type: 'Standard',
      harness_type: 'None',
      pulling_level: 5,
      recall_reliability: 5,
      escape_risk: 'Unknown',
      door_darter: 'Unknown',
      bite_history: 'Unknown',
      bite_history_details: '',
      reactivity_triggers: '',
      trigger_details: '',
      treats_allowed: 'Yes',
      approved_treats: '',
      do_not_give_list: '',
      food_guarding: 'Unknown',
      preferred_walk_type: 'Any',
      preferred_duration: 30,
      environment_restrictions: '',
      other_restriction: '',
      routine_notes: '',
    });
  };

  const openCreateModal = () => {
    setEditingPet(null);
    resetFormData();
    setModalSection('identity');
    setShowModal(true);
  };

  const openEditModal = async (pet) => {
    try {
      const response = await fetch(`/api/admin/pets/${pet.id}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setEditingPet(data);
      setFormData({
        client_id: data.client_id || '',
        profile_photo_url: data.profile_photo_url || '',
        name: data.name || '',
        nickname: data.nickname || '',
        breed: data.breed || '',
        sex: data.sex || 'Unknown',
        neutered: data.neutered || 0,
        date_of_birth: data.date_of_birth || '',
        colour_markings: data.colour_markings || '',
        microchipped: data.microchipped || 0,
        microchip_number: data.microchip_number || '',
        collar_tag_present: data.collar_tag_present || 0,
        group_walk_eligible: data.group_walk_eligible ?? 1,
        max_group_size: data.max_group_size || 4,
        around_other_dogs: data.around_other_dogs || 'Unknown',
        around_puppies: data.around_puppies || 'Unknown',
        around_small_dogs: data.around_small_dogs || 'Unknown',
        around_large_dogs: data.around_large_dogs || 'Unknown',
        play_style: data.play_style || 'Unknown',
        resource_guarding: data.resource_guarding || 'Unknown',
        resource_guarding_details: data.resource_guarding_details || '',
        muzzle_required_for_group: data.muzzle_required_for_group || 'No',
        muzzle_trained: data.muzzle_trained || 'No',
        allergies: data.allergies || 'Unknown',
        allergy_details: data.allergy_details || '',
        medical_conditions: data.medical_conditions || 'Unknown',
        condition_details: data.condition_details || '',
        medications: data.medications || 'Unknown',
        medication_details: data.medication_details || '',
        mobility_limits: data.mobility_limits || 'None',
        heat_sensitivity: data.heat_sensitivity || 'Unknown',
        vaccination_status: data.vaccination_status || 'Unknown',
        parasite_control: data.parasite_control || 'Unknown',
        lead_type: data.lead_type || 'Standard',
        harness_type: data.harness_type || 'None',
        pulling_level: data.pulling_level || 5,
        recall_reliability: data.recall_reliability || 5,
        escape_risk: data.escape_risk || 'Unknown',
        door_darter: data.door_darter || 'Unknown',
        bite_history: data.bite_history || 'Unknown',
        bite_history_details: data.bite_history_details || '',
        reactivity_triggers: data.reactivity_triggers || '',
        trigger_details: data.trigger_details || '',
        treats_allowed: data.treats_allowed || 'Yes',
        approved_treats: data.approved_treats || '',
        do_not_give_list: data.do_not_give_list || '',
        food_guarding: data.food_guarding || 'Unknown',
        preferred_walk_type: data.preferred_walk_type || 'Any',
        preferred_duration: data.preferred_duration || 30,
        environment_restrictions: data.environment_restrictions || '',
        other_restriction: data.other_restriction || '',
        routine_notes: data.routine_notes || '',
      });
      setModalSection('identity');
      setShowModal(true);
    } catch (error) {
      showToast('Failed to fetch pet details', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.client_id) {
      showToast('Please fill in required fields (Name and Client)', 'warning');
      return;
    }

    try {
      const url = editingPet 
        ? `/api/admin/pets/${editingPet.id}`
        : '/api/admin/pets';
      
      const method = editingPet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(editingPet ? 'Pet updated successfully' : 'Pet created successfully');
        setShowModal(false);
        fetchPets();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save pet', 'danger');
      }
    } catch (error) {
      showToast('Error saving pet', 'danger');
    }
  };

  const handleDelete = async (petId) => {
    try {
      const response = await fetch(`/api/admin/pets/${petId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        showToast('Pet deleted successfully');
        fetchPets();
      } else {
        showToast('Failed to delete pet', 'danger');
      }
    } catch (error) {
      showToast('Error deleting pet', 'danger');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Pets</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Pets</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openCreateModal}>
              <IonIcon icon={add} slot="start" />
              New Pet
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={[
          { label: 'Home', path: '/admin/dashboard' },
          { label: 'Admin', path: '/admin/dashboard' },
          { label: 'Pets', path: '/admin/pets' }
        ]} />
        <div className="ion-padding">
          <IonSearchbar
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value)}
            placeholder="Search pets by name, breed, or client"
          />
          
          {filteredPets.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>{searchText ? 'No pets found matching your search.' : 'No pets found. Create your first pet profile!'}</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonGrid>
              <IonRow>
                {filteredPets.map((pet) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={pet.id}>
                    <IonCard>
                      <IonCardHeader>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <IonIcon icon={pawOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-primary)' }} />
                          <div>
                            <IonCardTitle>{pet.name}</IonCardTitle>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ion-color-medium)' }}>{pet.breed}</p>
                          </div>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonList lines="none">
                          <IonItem>
                            <IonLabel>
                              <p><strong>Client:</strong> {pet.client_name}</p>
                              <p><strong>Sex:</strong> {pet.sex} {pet.neutered ? '(Neutered)' : ''}</p>
                              {pet.date_of_birth && <p><strong>DOB:</strong> {pet.date_of_birth}</p>}
                              {pet.microchipped && <p><strong>Microchip:</strong> {pet.microchip_number || 'Yes'}</p>}
                            </IonLabel>
                          </IonItem>
                        </IonList>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <IonButton size="small" fill="outline" expand="block" onClick={() => openEditModal(pet)}>
                            <IonIcon icon={create} slot="start" />
                            Edit
                          </IonButton>
                          <IonButton size="small" fill="outline" color="danger" expand="block" onClick={() => setDeleteAlert({ show: true, petId: pet.id })}>
                            <IonIcon icon={trash} slot="start" />
                            Delete
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}
        </div>

        {/* Create/Edit Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingPet ? 'Edit Pet' : 'Create Pet'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <IonToolbar>
              <IonSegment value={modalSection} onIonChange={(e) => setModalSection(e.detail.value)}>
                <IonSegmentButton value="identity">
                  <IonLabel>Identity</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="health">
                  <IonLabel>Health</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="behaviour">
                  <IonLabel>Behaviour</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="group">
                  <IonLabel>Group Walk</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="preferences">
                  <IonLabel>Preferences</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={handleSubmit} className="ion-padding">
              {/* Identity Section */}
              {modalSection === 'identity' && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Client *</IonLabel>
                    <IonSelect
                      value={formData.client_id}
                      onIonChange={(e) => setFormData({ ...formData, client_id: e.detail.value })}
                    >
                      <IonSelectOption value="">Select Client</IonSelectOption>
                      {clients.map((client) => (
                        <IonSelectOption key={client.id} value={client.id}>
                          {client.full_name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Pet Name *</IonLabel>
                    <IonInput
                      value={formData.name}
                      onIonInput={(e) => setFormData({ ...formData, name: e.detail.value })}
                      placeholder="Enter pet name"
                      required
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Nickname</IonLabel>
                    <IonInput
                      value={formData.nickname}
                      onIonInput={(e) => setFormData({ ...formData, nickname: e.detail.value })}
                      placeholder="Enter nickname"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Breed</IonLabel>
                    <IonInput
                      value={formData.breed}
                      onIonInput={(e) => setFormData({ ...formData, breed: e.detail.value })}
                      placeholder="Enter breed"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Sex</IonLabel>
                    <IonSelect
                      value={formData.sex}
                      onIonChange={(e) => setFormData({ ...formData, sex: e.detail.value })}
                    >
                      <IonSelectOption value="Male">Male</IonSelectOption>
                      <IonSelectOption value="Female">Female</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Neutered</IonLabel>
                    <IonCheckbox
                      checked={formData.neutered === 1}
                      onIonChange={(e) => setFormData({ ...formData, neutered: e.detail.checked ? 1 : 0 })}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Date of Birth</IonLabel>
                    <IonInput
                      type="date"
                      value={formData.date_of_birth}
                      onIonInput={(e) => setFormData({ ...formData, date_of_birth: e.detail.value })}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Color & Markings</IonLabel>
                    <IonTextarea
                      value={formData.colour_markings}
                      onIonInput={(e) => setFormData({ ...formData, colour_markings: e.detail.value })}
                      placeholder="Describe color and markings"
                      rows={2}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Microchipped</IonLabel>
                    <IonCheckbox
                      checked={formData.microchipped === 1}
                      onIonChange={(e) => setFormData({ ...formData, microchipped: e.detail.checked ? 1 : 0 })}
                    />
                  </IonItem>

                  {formData.microchipped === 1 && (
                    <IonItem>
                      <IonLabel position="stacked">Microchip Number</IonLabel>
                      <IonInput
                        value={formData.microchip_number}
                        onIonInput={(e) => setFormData({ ...formData, microchip_number: e.detail.value })}
                        placeholder="Enter microchip number"
                      />
                    </IonItem>
                  )}

                  <IonItem>
                    <IonLabel>Collar Tag Present</IonLabel>
                    <IonCheckbox
                      checked={formData.collar_tag_present === 1}
                      onIonChange={(e) => setFormData({ ...formData, collar_tag_present: e.detail.checked ? 1 : 0 })}
                    />
                  </IonItem>
                </>
              )}

              {/* Health Section */}
              {modalSection === 'health' && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Allergies</IonLabel>
                    <IonSelect
                      value={formData.allergies}
                      onIonChange={(e) => setFormData({ ...formData, allergies: e.detail.value })}
                    >
                      <IonSelectOption value="None">None</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                      <IonSelectOption value="Yes">Yes</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  {formData.allergies === 'Yes' && (
                    <IonItem>
                      <IonLabel position="stacked">Allergy Details</IonLabel>
                      <IonTextarea
                        value={formData.allergy_details}
                        onIonInput={(e) => setFormData({ ...formData, allergy_details: e.detail.value })}
                        placeholder="Describe allergies"
                        rows={3}
                      />
                    </IonItem>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Medical Conditions</IonLabel>
                    <IonSelect
                      value={formData.medical_conditions}
                      onIonChange={(e) => setFormData({ ...formData, medical_conditions: e.detail.value })}
                    >
                      <IonSelectOption value="None">None</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                      <IonSelectOption value="Yes">Yes</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  {formData.medical_conditions === 'Yes' && (
                    <IonItem>
                      <IonLabel position="stacked">Condition Details</IonLabel>
                      <IonTextarea
                        value={formData.condition_details}
                        onIonInput={(e) => setFormData({ ...formData, condition_details: e.detail.value })}
                        placeholder="Describe medical conditions"
                        rows={3}
                      />
                    </IonItem>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Medications</IonLabel>
                    <IonSelect
                      value={formData.medications}
                      onIonChange={(e) => setFormData({ ...formData, medications: e.detail.value })}
                    >
                      <IonSelectOption value="None">None</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                      <IonSelectOption value="Yes">Yes</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  {formData.medications === 'Yes' && (
                    <IonItem>
                      <IonLabel position="stacked">Medication Details</IonLabel>
                      <IonTextarea
                        value={formData.medication_details}
                        onIonInput={(e) => setFormData({ ...formData, medication_details: e.detail.value })}
                        placeholder="List medications and dosages"
                        rows={3}
                      />
                    </IonItem>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Mobility Limits</IonLabel>
                    <IonInput
                      value={formData.mobility_limits}
                      onIonInput={(e) => setFormData({ ...formData, mobility_limits: e.detail.value })}
                      placeholder="None"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Heat Sensitivity</IonLabel>
                    <IonSelect
                      value={formData.heat_sensitivity}
                      onIonChange={(e) => setFormData({ ...formData, heat_sensitivity: e.detail.value })}
                    >
                      <IonSelectOption value="Low">Low</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="High">High</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Vaccination Status</IonLabel>
                    <IonSelect
                      value={formData.vaccination_status}
                      onIonChange={(e) => setFormData({ ...formData, vaccination_status: e.detail.value })}
                    >
                      <IonSelectOption value="Up to date">Up to date</IonSelectOption>
                      <IonSelectOption value="Due soon">Due soon</IonSelectOption>
                      <IonSelectOption value="Overdue">Overdue</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Parasite Control</IonLabel>
                    <IonSelect
                      value={formData.parasite_control}
                      onIonChange={(e) => setFormData({ ...formData, parasite_control: e.detail.value })}
                    >
                      <IonSelectOption value="Up to date">Up to date</IonSelectOption>
                      <IonSelectOption value="Due soon">Due soon</IonSelectOption>
                      <IonSelectOption value="Overdue">Overdue</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </>
              )}

              {/* Behaviour Section */}
              {modalSection === 'behaviour' && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Lead Type</IonLabel>
                    <IonSelect
                      value={formData.lead_type}
                      onIonChange={(e) => setFormData({ ...formData, lead_type: e.detail.value })}
                    >
                      <IonSelectOption value="Standard">Standard</IonSelectOption>
                      <IonSelectOption value="Slip Lead">Slip Lead</IonSelectOption>
                      <IonSelectOption value="Martingale">Martingale</IonSelectOption>
                      <IonSelectOption value="Training Lead">Training Lead</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Harness Type</IonLabel>
                    <IonSelect
                      value={formData.harness_type}
                      onIonChange={(e) => setFormData({ ...formData, harness_type: e.detail.value })}
                    >
                      <IonSelectOption value="None">None</IonSelectOption>
                      <IonSelectOption value="Y-Front">Y-Front</IonSelectOption>
                      <IonSelectOption value="H-Harness">H-Harness</IonSelectOption>
                      <IonSelectOption value="Back-Clip">Back-Clip</IonSelectOption>
                      <IonSelectOption value="Front-Clip">Front-Clip</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Pulling Level (1-10)</IonLabel>
                    <IonRange
                      min={1}
                      max={10}
                      value={formData.pulling_level}
                      onIonChange={(e) => setFormData({ ...formData, pulling_level: e.detail.value })}
                      pin
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Recall Reliability (1-10)</IonLabel>
                    <IonRange
                      min={1}
                      max={10}
                      value={formData.recall_reliability}
                      onIonChange={(e) => setFormData({ ...formData, recall_reliability: e.detail.value })}
                      pin
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Escape Risk</IonLabel>
                    <IonSelect
                      value={formData.escape_risk}
                      onIonChange={(e) => setFormData({ ...formData, escape_risk: e.detail.value })}
                    >
                      <IonSelectOption value="Low">Low</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="High">High</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Door Darter</IonLabel>
                    <IonSelect
                      value={formData.door_darter}
                      onIonChange={(e) => setFormData({ ...formData, door_darter: e.detail.value })}
                    >
                      <IonSelectOption value="No">No</IonSelectOption>
                      <IonSelectOption value="Sometimes">Sometimes</IonSelectOption>
                      <IonSelectOption value="Yes">Yes</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Bite History</IonLabel>
                    <IonSelect
                      value={formData.bite_history}
                      onIonChange={(e) => setFormData({ ...formData, bite_history: e.detail.value })}
                    >
                      <IonSelectOption value="None">None</IonSelectOption>
                      <IonSelectOption value="Yes">Yes</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  {formData.bite_history === 'Yes' && (
                    <IonItem>
                      <IonLabel position="stacked">Bite History Details</IonLabel>
                      <IonTextarea
                        value={formData.bite_history_details}
                        onIonInput={(e) => setFormData({ ...formData, bite_history_details: e.detail.value })}
                        placeholder="Describe bite incidents"
                        rows={3}
                      />
                    </IonItem>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Reactivity Triggers</IonLabel>
                    <IonTextarea
                      value={formData.reactivity_triggers}
                      onIonInput={(e) => setFormData({ ...formData, reactivity_triggers: e.detail.value })}
                      placeholder="List any known triggers"
                      rows={3}
                    />
                  </IonItem>
                </>
              )}

              {/* Group Walk Section */}
              {modalSection === 'group' && (
                <>
                  <IonItem>
                    <IonLabel>Group Walk Eligible</IonLabel>
                    <IonCheckbox
                      checked={formData.group_walk_eligible === 1}
                      onIonChange={(e) => setFormData({ ...formData, group_walk_eligible: e.detail.checked ? 1 : 0 })}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Max Group Size</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.max_group_size}
                      onIonInput={(e) => setFormData({ ...formData, max_group_size: parseInt(e.detail.value, 10) || 4 })}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Around Other Dogs</IonLabel>
                    <IonSelect
                      value={formData.around_other_dogs}
                      onIonChange={(e) => setFormData({ ...formData, around_other_dogs: e.detail.value })}
                    >
                      <IonSelectOption value="Friendly">Friendly</IonSelectOption>
                      <IonSelectOption value="Selective">Selective</IonSelectOption>
                      <IonSelectOption value="Reactive">Reactive</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Around Puppies</IonLabel>
                    <IonSelect
                      value={formData.around_puppies}
                      onIonChange={(e) => setFormData({ ...formData, around_puppies: e.detail.value })}
                    >
                      <IonSelectOption value="Good">Good</IonSelectOption>
                      <IonSelectOption value="Nervous">Nervous</IonSelectOption>
                      <IonSelectOption value="Avoids">Avoids</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Around Small Dogs</IonLabel>
                    <IonSelect
                      value={formData.around_small_dogs}
                      onIonChange={(e) => setFormData({ ...formData, around_small_dogs: e.detail.value })}
                    >
                      <IonSelectOption value="Good">Good</IonSelectOption>
                      <IonSelectOption value="Nervous">Nervous</IonSelectOption>
                      <IonSelectOption value="Avoids">Avoids</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Around Large Dogs</IonLabel>
                    <IonSelect
                      value={formData.around_large_dogs}
                      onIonChange={(e) => setFormData({ ...formData, around_large_dogs: e.detail.value })}
                    >
                      <IonSelectOption value="Good">Good</IonSelectOption>
                      <IonSelectOption value="Nervous">Nervous</IonSelectOption>
                      <IonSelectOption value="Avoids">Avoids</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Play Style</IonLabel>
                    <IonSelect
                      value={formData.play_style}
                      onIonChange={(e) => setFormData({ ...formData, play_style: e.detail.value })}
                    >
                      <IonSelectOption value="Gentle">Gentle</IonSelectOption>
                      <IonSelectOption value="Moderate">Moderate</IonSelectOption>
                      <IonSelectOption value="Rough">Rough</IonSelectOption>
                      <IonSelectOption value="Non-playful">Non-playful</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Resource Guarding</IonLabel>
                    <IonSelect
                      value={formData.resource_guarding}
                      onIonChange={(e) => setFormData({ ...formData, resource_guarding: e.detail.value })}
                    >
                      <IonSelectOption value="None">None</IonSelectOption>
                      <IonSelectOption value="Mild">Mild</IonSelectOption>
                      <IonSelectOption value="Moderate">Moderate</IonSelectOption>
                      <IonSelectOption value="Severe">Severe</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  {formData.resource_guarding !== 'None' && formData.resource_guarding !== 'Unknown' && (
                    <IonItem>
                      <IonLabel position="stacked">Resource Guarding Details</IonLabel>
                      <IonTextarea
                        value={formData.resource_guarding_details}
                        onIonInput={(e) => setFormData({ ...formData, resource_guarding_details: e.detail.value })}
                        placeholder="Describe resource guarding behavior"
                        rows={3}
                      />
                    </IonItem>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Muzzle Required for Group</IonLabel>
                    <IonSelect
                      value={formData.muzzle_required_for_group}
                      onIonChange={(e) => setFormData({ ...formData, muzzle_required_for_group: e.detail.value })}
                    >
                      <IonSelectOption value="No">No</IonSelectOption>
                      <IonSelectOption value="Yes">Yes</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Muzzle Trained</IonLabel>
                    <IonSelect
                      value={formData.muzzle_trained}
                      onIonChange={(e) => setFormData({ ...formData, muzzle_trained: e.detail.value })}
                    >
                      <IonSelectOption value="No">No</IonSelectOption>
                      <IonSelectOption value="In Progress">In Progress</IonSelectOption>
                      <IonSelectOption value="Yes">Yes</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </>
              )}

              {/* Preferences Section */}
              {modalSection === 'preferences' && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Treats Allowed</IonLabel>
                    <IonSelect
                      value={formData.treats_allowed}
                      onIonChange={(e) => setFormData({ ...formData, treats_allowed: e.detail.value })}
                    >
                      <IonSelectOption value="Yes">Yes</IonSelectOption>
                      <IonSelectOption value="No">No</IonSelectOption>
                      <IonSelectOption value="Specific Only">Specific Only</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  {formData.treats_allowed !== 'No' && (
                    <IonItem>
                      <IonLabel position="stacked">Approved Treats</IonLabel>
                      <IonTextarea
                        value={formData.approved_treats}
                        onIonInput={(e) => setFormData({ ...formData, approved_treats: e.detail.value })}
                        placeholder="List approved treats"
                        rows={2}
                      />
                    </IonItem>
                  )}

                  <IonItem>
                    <IonLabel position="stacked">Do Not Give List</IonLabel>
                    <IonTextarea
                      value={formData.do_not_give_list}
                      onIonInput={(e) => setFormData({ ...formData, do_not_give_list: e.detail.value })}
                      placeholder="List foods/treats to avoid"
                      rows={2}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Food Guarding</IonLabel>
                    <IonSelect
                      value={formData.food_guarding}
                      onIonChange={(e) => setFormData({ ...formData, food_guarding: e.detail.value })}
                    >
                      <IonSelectOption value="None">None</IonSelectOption>
                      <IonSelectOption value="Mild">Mild</IonSelectOption>
                      <IonSelectOption value="Moderate">Moderate</IonSelectOption>
                      <IonSelectOption value="Severe">Severe</IonSelectOption>
                      <IonSelectOption value="Unknown">Unknown</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Preferred Walk Type</IonLabel>
                    <IonSelect
                      value={formData.preferred_walk_type}
                      onIonChange={(e) => setFormData({ ...formData, preferred_walk_type: e.detail.value })}
                    >
                      <IonSelectOption value="Any">Any</IonSelectOption>
                      <IonSelectOption value="Woodland">Woodland</IonSelectOption>
                      <IonSelectOption value="Field">Field</IonSelectOption>
                      <IonSelectOption value="Beach">Beach</IonSelectOption>
                      <IonSelectOption value="Urban">Urban</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Preferred Duration (minutes)</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.preferred_duration}
                      onIonInput={(e) => setFormData({ ...formData, preferred_duration: parseInt(e.detail.value, 10) || 30 })}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Environment Restrictions</IonLabel>
                    <IonTextarea
                      value={formData.environment_restrictions}
                      onIonInput={(e) => setFormData({ ...formData, environment_restrictions: e.detail.value })}
                      placeholder="List any restrictions (e.g., avoid water, no off-leash)"
                      rows={3}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Other Restrictions</IonLabel>
                    <IonTextarea
                      value={formData.other_restriction}
                      onIonInput={(e) => setFormData({ ...formData, other_restriction: e.detail.value })}
                      placeholder="Any other restrictions or notes"
                      rows={2}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Routine Notes</IonLabel>
                    <IonTextarea
                      value={formData.routine_notes}
                      onIonInput={(e) => setFormData({ ...formData, routine_notes: e.detail.value })}
                      placeholder="Describe daily routine preferences"
                      rows={3}
                    />
                  </IonItem>
                </>
              )}

              <div className="ion-padding-top">
                <IonButton expand="block" type="submit">
                  {editingPet ? 'Update Pet' : 'Create Pet'}
                </IonButton>
                <IonButton expand="block" fill="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </IonButton>
              </div>
            </form>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={3000}
          color={toast.color}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />

        <IonAlert
          isOpen={deleteAlert.show}
          header="Confirm Delete"
          message="Are you sure you want to delete this pet? This will also remove all associated data."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setDeleteAlert({ show: false, petId: null }),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => {
                handleDelete(deleteAlert.petId);
                setDeleteAlert({ show: false, petId: null });
              },
            },
          ]}
          onDidDismiss={() => setDeleteAlert({ show: false, petId: null })}
        />
      </IonContent>
    </IonPage>
  );
}
