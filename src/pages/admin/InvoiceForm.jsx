import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonAlert,
  IonList,
} from '@ionic/react';
import { save, close as closeIcon, add, trash } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory, useParams } from 'react-router-dom';

export default function InvoiceForm() {
  const { id } = useParams();
  const history = useHistory();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    client_id: '',
    invoice_number: '',
    issue_date: '',
    due_date: '',
    status: 'unpaid',
    payment_method: '',
    payment_date: '',
    notes: '',
    line_items: [
      { description: '', quantity: 1, unit_price: 0, amount: 0 }
    ],
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Invoices', path: '/admin/invoices' },
    { label: isEdit ? 'Edit Invoice' : 'New Invoice', path: `/admin/invoices/${id || 'new'}` }
  ];

  useEffect(() => {
    fetchClients();
    if (isEdit) {
      fetchInvoice();
    }
  }, [id]);

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

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/admin/invoices/${id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          client_id: data.client_id || '',
          invoice_number: data.invoice_number || '',
          issue_date: data.issue_date || '',
          due_date: data.due_date || '',
          status: data.status || 'unpaid',
          payment_method: data.payment_method || '',
          payment_date: data.payment_date || '',
          notes: data.notes || '',
          line_items: data.line_items ? JSON.parse(data.line_items) : [
            { description: '', quantity: 1, unit_price: 0, amount: 0 }
          ],
        });
      } else {
        showToast('Failed to load invoice', 'danger');
      }
    } catch (error) {
      showToast('Failed to load invoice', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...formData.line_items];
    newLineItems[index] = { ...newLineItems[index], [field]: value };
    
    // Recalculate amount for this line item
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : newLineItems[index].quantity;
      const unitPrice = field === 'unit_price' ? parseFloat(value) || 0 : newLineItems[index].unit_price;
      newLineItems[index].amount = quantity * unitPrice;
    }
    
    handleChange('line_items', newLineItems);
  };

  const addLineItem = () => {
    handleChange('line_items', [
      ...formData.line_items,
      { description: '', quantity: 1, unit_price: 0, amount: 0 }
    ]);
  };

  const removeLineItem = (index) => {
    if (formData.line_items.length > 1) {
      const newLineItems = formData.line_items.filter((_, i) => i !== index);
      handleChange('line_items', newLineItems);
    }
  };

  const calculateTotal = () => {
    return formData.line_items.reduce((total, item) => total + (item.amount || 0), 0).toFixed(2);
  };

  const showToast = (message, color) => {
    setToast({ show: true, message, color });
  };

  const validate = () => {
    const newErrors = {};

    // Client required
    if (!formData.client_id) {
      newErrors.client_id = 'Client is required';
    }
    
    // Issue date required
    if (!formData.issue_date) {
      newErrors.issue_date = 'Issue date is required';
    }
    
    // Due date required
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }
    
    // Validate due date is after issue date
    if (formData.issue_date && formData.due_date) {
      if (new Date(formData.due_date) < new Date(formData.issue_date)) {
        newErrors.due_date = 'Due date must be after issue date';
      }
    }
    
    // At least one line item with description
    const hasValidLineItem = formData.line_items.some(item => item.description && item.description.trim());
    if (!hasValidLineItem) {
      newErrors.line_items = 'At least one line item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndExit = async () => {
    // Minimal validation - only require client and dates
    if (!formData.client_id || !formData.issue_date || !formData.due_date) {
      showToast('Client, issue date, and due date are required', 'danger');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        line_items: JSON.stringify(formData.line_items),
        total_amount: calculateTotal(),
        status: 'DRAFT',
      };

      const url = isEdit ? `/api/admin/invoices/${id}` : '/api/admin/invoices';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast('Invoice saved as draft', 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/billing');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save invoice', 'danger');
      }
    } catch (error) {
      showToast('Failed to save invoice', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showToast('Please complete all required fields', 'danger');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        line_items: JSON.stringify(formData.line_items),
        total_amount: calculateTotal(),
      };

      const url = isEdit ? `/api/admin/invoices/${id}` : '/api/admin/invoices';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast(`Invoice ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        setHasUnsavedChanges(false);
        setTimeout(() => {
          history.push('/admin/billing');
        }, 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save invoice', 'danger');
      }
    } catch (error) {
      showToast('Failed to save invoice', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCancelAlert(true);
    } else {
      history.push('/admin/billing');
    }
  };

  const confirmClose = () => {
    setShowCancelAlert(false);
    history.push('/admin/billing');
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title={isEdit ? 'Edit Invoice' : 'New Invoice'} />
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
      <AppHeader title={isEdit ? 'Edit Invoice' : 'New Invoice'} />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonCard>
            <IonCardContent>
              <h2>Invoice Details</h2>

              <IonItem>
                <IonLabel position="stacked">Client *</IonLabel>
                <IonSelect
                  value={formData.client_id}
                  onIonChange={e => handleChange('client_id', e.detail.value)}
                  placeholder="Select client"
                >
                  {clients.map(client => (
                    <IonSelectOption key={client.id} value={client.id}>
                      {client.full_name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              {errors.client_id && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.client_id}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Invoice Number</IonLabel>
                <IonInput
                  value={formData.invoice_number}
                  onIonInput={e => handleChange('invoice_number', e.detail.value)}
                  placeholder="Auto-generated if left blank"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Issue Date *</IonLabel>
                <IonInput
                  type="date"
                  value={formData.issue_date}
                  onIonInput={e => handleChange('issue_date', e.detail.value)}
                />
              </IonItem>
              {errors.issue_date && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.issue_date}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Due Date *</IonLabel>
                <IonInput
                  type="date"
                  value={formData.due_date}
                  onIonInput={e => handleChange('due_date', e.detail.value)}
                />
              </IonItem>
              {errors.due_date && (
                <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                  {errors.due_date}
                </p>
              )}

              <IonItem>
                <IonLabel position="stacked">Status</IonLabel>
                <IonSelect
                  value={formData.status}
                  onIonChange={e => handleChange('status', e.detail.value)}
                >
                  <IonSelectOption value="unpaid">Unpaid</IonSelectOption>
                  <IonSelectOption value="paid">Paid</IonSelectOption>
                  <IonSelectOption value="overdue">Overdue</IonSelectOption>
                  <IonSelectOption value="cancelled">Cancelled</IonSelectOption>
                </IonSelect>
              </IonItem>

              {formData.status === 'paid' && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Payment Method</IonLabel>
                    <IonInput
                      value={formData.payment_method}
                      onIonInput={e => handleChange('payment_method', e.detail.value)}
                      placeholder="e.g., Card, Bank Transfer"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Payment Date</IonLabel>
                    <IonInput
                      type="date"
                      value={formData.payment_date}
                      onIonInput={e => handleChange('payment_date', e.detail.value)}
                    />
                  </IonItem>
                </>
              )}

              <div style={{ marginTop: '24px' }}>
                <h3>Line Items</h3>
                <IonList>
                  {formData.line_items.map((item, index) => (
                    <div key={index} style={{ border: '1px solid var(--ion-color-light)', borderRadius: '8px', padding: '8px', marginBottom: '12px' }}>
                      <IonItem>
                        <IonLabel position="stacked">Description</IonLabel>
                        <IonInput
                          value={item.description}
                          onIonInput={e => handleLineItemChange(index, 'description', e.detail.value)}
                          placeholder="Service description"
                        />
                      </IonItem>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <IonItem style={{ flex: 1 }}>
                          <IonLabel position="stacked">Qty</IonLabel>
                          <IonInput
                            type="number"
                            value={item.quantity}
                            onIonInput={e => handleLineItemChange(index, 'quantity', e.detail.value)}
                          />
                        </IonItem>

                        <IonItem style={{ flex: 1 }}>
                          <IonLabel position="stacked">Unit Price (£)</IonLabel>
                          <IonInput
                            type="number"
                            step="0.01"
                            value={item.unit_price}
                            onIonInput={e => handleLineItemChange(index, 'unit_price', e.detail.value)}
                          />
                        </IonItem>

                        <IonItem style={{ flex: 1 }}>
                          <IonLabel position="stacked">Amount (£)</IonLabel>
                          <IonInput
                            value={item.amount.toFixed(2)}
                            readonly
                          />
                        </IonItem>
                      </div>

                      {formData.line_items.length > 1 && (
                        <IonButton
                          size="small"
                          fill="clear"
                          color="danger"
                          onClick={() => removeLineItem(index)}
                        >
                          <IonIcon icon={trash} slot="start" />
                          Remove
                        </IonButton>
                      )}
                    </div>
                  ))}
                </IonList>

                <IonButton size="small" fill="outline" onClick={addLineItem}>
                  <IonIcon icon={add} slot="start" />
                  Add Line Item
                </IonButton>

                {errors.line_items && (
                  <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.875rem', marginLeft: '16px' }}>
                    {errors.line_items}
                  </p>
                )}

                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--ion-color-light)', borderRadius: '8px' }}>
                  <h3 style={{ margin: 0 }}>Total: £{calculateTotal()}</h3>
                </div>
              </div>

              <IonItem>
                <IonLabel position="stacked">Notes</IonLabel>
                <IonTextarea
                  value={formData.notes}
                  onIonInput={e => handleChange('notes', e.detail.value)}
                  placeholder="Additional notes"
                  rows={3}
                />
              </IonItem>

              {/* Primary Action */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <IonButton onClick={handleSubmit} disabled={saving}>
                  <IonIcon icon={save} slot="start" />
                  {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                </IonButton>
              </div>

              {/* Secondary Controls */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--ion-color-light)', display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                <IonButton onClick={handleSaveAndExit} fill="outline" disabled={saving}>
                  <IonIcon icon={save} slot="start" />
                  Save & Exit
                </IonButton>
                <IonButton onClick={handleClose} fill="clear" color="medium">
                  <IonIcon icon={closeIcon} slot="start" />
                  Close
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={2000}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />

        <IonAlert
          isOpen={showCancelAlert}
          header="Discard changes?"
          message="You have unsaved changes. Are you sure you want to close this form?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setShowCancelAlert(false)
            },
            {
              text: 'Discard',
              role: 'destructive',
              handler: confirmClose
            }
          ]}
          onDidDismiss={() => setShowCancelAlert(false)}
        />
      </IonContent>
    </IonPage>
  );
}
