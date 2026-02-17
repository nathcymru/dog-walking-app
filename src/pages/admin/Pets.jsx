import React, { useState, useEffect } from 'react';
import {
  IonPage,
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
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { add, create, trash, close, pawOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import AddDogWizard from '../../components/wizard/AddDogWizard';
import { useAuth } from '../../utils/auth';

export default function AdminPets() {
  const { user } = useAuth();
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

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Pets', path: '/admin/pets' }
  ];

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

  const handleWizardSave = async (wizardData) => {
    try {
      const response = await fetch('/api/admin/pets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData),
      });

      if (response.ok) {
        showToast('Dog added successfully');
        setShowModal(false);
        fetchPets();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save dog');
      }
    } catch (error) {
      throw error; // Let wizard handle the error display
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
        <AppHeader title="Pets" />
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
      <AppHeader title="Pets" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonButton color="primary" onClick={openCreateModal}>
            <IonIcon icon={add} slot="start" />
            New Pet
          </IonButton>
          
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

        {/* Add Dog Wizard */}
        <AddDogWizard
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleWizardSave}
          isAdmin={true}
          user={user}
          clients={clients}
        />


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