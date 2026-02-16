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
} from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function ClientBilling() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedInvoices, setExpandedInvoices] = useState(new Set());
  const [toast, setToast] = useState({ show: false, message: '', color: 'danger' });

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Client', path: '/client' },
    { label: 'Billing', path: '/client/billing' }
  ];

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // Mock data for demo purposes
      const mockData = [
        {
          id: 1,
          invoice_number: 'INV-2026-001',
          issue_date: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
          due_date: new Date(Date.now() - 1296000000).toISOString(), // 15 days ago
          status: 'paid',
          total_amount: 150.00,
          period: 'January 2026',
          payment_method: 'Credit Card',
          payment_date: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
          line_items: [
            { description: 'Dog Walking - 5 sessions', quantity: 5, unit_price: 25.00, amount: 125.00 },
            { description: 'Pet Sitting - 1 session', quantity: 1, unit_price: 25.00, amount: 25.00 }
          ]
        },
        {
          id: 2,
          invoice_number: 'INV-2026-002',
          issue_date: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
          due_date: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
          status: 'unpaid',
          total_amount: 200.00,
          period: 'February 2026',
          payment_method: null,
          payment_date: null,
          line_items: [
            { description: 'Dog Walking - 8 sessions', quantity: 8, unit_price: 25.00, amount: 200.00 }
          ]
        }
      ];
      
      setInvoices(mockData);
      setError(null);
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
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Breadcrumbs items={breadcrumbItems} />
        <div>
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
