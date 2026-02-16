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
  IonBadge,
  IonSpinner,
  IonToast,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonBreadcrumbs,
  IonBreadcrumb,
} from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

export default function ClientBilling() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedInvoices, setExpandedInvoices] = useState(new Set());
  const [toast, setToast] = useState({ show: false, message: '', color: 'danger' });
  const history = useHistory();
  const { logout } = useAuth();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/client/invoices', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        setError('Authentication required. Please log in.');
        setInvoices([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      // Check if response is an error object
      if (data.error) {
        setError(data.error);
        setInvoices([]);
      } else if (Array.isArray(data)) {
        setInvoices(data);
        setError(null);
      } else {
        setError('Invalid response format');
        setInvoices([]);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleInvoiceExpansion = (invoiceId) => {
    const newExpanded = new Set(expandedInvoices);
    if (newExpanded.has(invoiceId)) {
      newExpanded.delete(invoiceId);
    } else {
      newExpanded.add(invoiceId);
    }
    setExpandedInvoices(newExpanded);
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'success',
      unpaid: 'danger',
      part_paid: 'warning',
      pending: 'warning',
    };
    return colors[status] || 'medium';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Billing</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleLogout}>Logout</IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonBreadcrumbs>
              <IonBreadcrumb href="/">Home</IonBreadcrumb>
              <IonBreadcrumb>Client</IonBreadcrumb>
              <IonBreadcrumb>Billing</IonBreadcrumb>
            </IonBreadcrumbs>
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
          <IonTitle>Billing</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonBreadcrumbs>
            <IonBreadcrumb href="/">Home</IonBreadcrumb>
            <IonBreadcrumb>Client</IonBreadcrumb>
            <IonBreadcrumb>Billing</IonBreadcrumb>
          </IonBreadcrumbs>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          {error ? (
            <IonCard>
              <IonCardContent>
                <p style={{ color: 'var(--ion-color-danger)' }}>{error}</p>
              </IonCardContent>
            </IonCard>
          ) : invoices.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>No invoices found.</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {invoices.map((invoice) => (
                <IonCard key={invoice.id}>
                  <IonCardHeader>
                    <IonCardTitle>
                      Invoice #{invoice.invoice_number}
                      <IonBadge color={getStatusColor(invoice.status)} style={{ marginLeft: '10px' }}>
                        {invoice.status.replace('_', ' ')}
                      </IonBadge>
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Issue Date:</strong> {new Date(invoice.issue_date).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>
                        {invoice.period && <p><strong>Period:</strong> {invoice.period}</p>}
                        <p><strong>Amount:</strong> {formatCurrency(invoice.total_amount)}</p>
                        {invoice.payment_method && (
                          <p><strong>Payment Method:</strong> {invoice.payment_method}</p>
                        )}
                        {invoice.payment_date && (
                          <p><strong>Payment Date:</strong> {new Date(invoice.payment_date).toLocaleDateString()}</p>
                        )}
                      </IonLabel>
                    </IonItem>

                    {invoice.line_items && invoice.line_items.length > 0 && (
                      <div style={{ marginTop: '15px' }}>
                        <IonButton
                          fill="outline"
                          size="small"
                          onClick={() => toggleInvoiceExpansion(invoice.id)}
                        >
                          <IonIcon
                            icon={expandedInvoices.has(invoice.id) ? chevronUp : chevronDown}
                            slot="start"
                          />
                          {expandedInvoices.has(invoice.id) ? 'Hide' : 'Show'} Line Items
                        </IonButton>

                        {expandedInvoices.has(invoice.id) && (
                          <div style={{ marginTop: '10px', background: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Line Items:</h4>
                            {invoice.line_items.map((item, index) => (
                              <div key={index} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '8px 0',
                                borderBottom: index < invoice.line_items.length - 1 ? '1px solid #e5e7eb' : 'none'
                              }}>
                                <div style={{ flex: 1 }}>
                                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{item.description}</p>
                                  {item.quantity > 1 && (
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                                      {item.quantity} × {formatCurrency(item.unit_price)}
                                    </p>
                                  )}
                                </div>
                                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                  {formatCurrency(item.amount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          )}
        </div>

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
}
