import { useState, useEffect } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs';
import api from '../../utils/api';

export default function ClientBilling() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      const data = await api.client.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  }

  async function viewInvoice(invoice) {
    setSelectedInvoice(invoice);
    // In real implementation, fetch full invoice details including line items and pets
    // For now, simulate the structure
    const mockDetails = {
      ...invoice,
      client: {
        full_name: 'John Smith',
        address_line1: '123 Dog Street',
        town: 'London',
        postcode: 'N1 1AA',
        email: 'client@example.com',
      },
      petsWithServices: [
        {
          pet: {
            id: 1,
            name: 'Max',
            breed: 'Golden Retriever',
            profile_photo_url: ''
          },
          lineItems: [
            { id: 1, date: '2024-02-01', description: 'Solo Walk (45 mins)', quantity: 1, unit_price: 15.00, total: 15.00 },
            { id: 2, date: '2024-02-03', description: 'Solo Walk (45 mins)', quantity: 1, unit_price: 15.00, total: 15.00 },
            { id: 3, date: '2024-02-05', description: 'Group Walk (30 mins)', quantity: 1, unit_price: 12.00, total: 12.00 },
          ],
          subtotal: 42.00
        }
      ],
      subtotal: 42.00,
      discount: 0,
      total_amount: 42.00
    };
    setInvoiceDetails(mockDetails);
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function getStatusBadge(status) {
    if (status === 'paid') return 'badge badge-green';
    if (status === 'unpaid') return 'badge badge-warning';
    if (status === 'part_paid') return 'badge badge-blue';
    return 'badge badge-gray';
  }

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/client' },
    selectedInvoice ? { label: 'Billing', path: '/client/billing' } : null,
    selectedInvoice ? { label: `Invoice ${selectedInvoice.invoice_number}`, path: '#' } : { label: 'Billing', path: '/client/billing' }
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="page-content">
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Invoice Detail View
  if (selectedInvoice && invoiceDetails) {
    const inv = invoiceDetails;
    
    return (
      <div className="page-content">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-lg">
          <button onClick={() => setSelectedInvoice(null)} className="btn btn-secondary">
            ← Back to all invoices
          </button>
        </div>

        <div className="invoice-container">
          {/* Invoice Header */}
          <div className="invoice-header">
            <div className="invoice-business">
              <div className="invoice-business-name">PawWalkers</div>
              <div className="invoice-tagline">Professional Dog Walking Services</div>
              <div>Email: hello@pawwalkers.com</div>
              <div>Phone: 020 1234 5678</div>
            </div>
            <div className="invoice-details">
              <div className="invoice-label">INVOICE</div>
              <div className="invoice-meta">
                <div>Invoice #: {inv.invoice_number}</div>
                <div>Date: {formatDate(inv.issue_date)}</div>
                <div>Due: {formatDate(inv.due_date)}</div>
                <div>
                  <span className={`${getStatusBadge(inv.status)}`} style={{fontSize: '0.875rem', padding: '0.25rem 0.75rem'}}>
                    {inv.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="invoice-bill-to">
            <div className="invoice-bill-to-title">BILL TO</div>
            <div>{inv.client.full_name}</div>
            <div>{inv.client.address_line1}</div>
            <div>{inv.client.town}, {inv.client.postcode}</div>
            <div>{inv.client.email}</div>
          </div>

          {/* REPEATING PET SECTIONS */}
          {inv.petsWithServices.map((petData, petIndex) => (
            <div key={petData.pet.id} className="pet-billing-section">
              {/* Pet Header */}
              <div className="pet-section-header">
                {petData.pet.profile_photo_url ? (
                  <img src={petData.pet.profile_photo_url} alt={petData.pet.name} className="pet-avatar" />
                ) : (
                  <div className="pet-avatar" style={{
                    background: 'linear-gradient(135deg, var(--pastel-sky) 0%, var(--pastel-lavender) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    🐕
                  </div>
                )}
                <div>
                  <div className="pet-section-title">Services for {petData.pet.name}</div>
                  <div className="pet-section-meta">{petData.pet.breed}</div>
                </div>
              </div>

              {/* Services Table */}
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Service</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {petData.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.description}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">£{item.unit_price.toFixed(2)}</td>
                      <td className="text-right">£{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pet Subtotal */}
              <div className="pet-subtotal">
                <span>Subtotal for {petData.pet.name}</span>
                <span>£{petData.subtotal.toFixed(2)}</span>
              </div>
            </div>
          ))}

          {/* Invoice Summary */}
          <div className="invoice-summary">
            <div className="invoice-summary-row">
              <span>Combined Subtotal</span>
              <span>£{inv.subtotal.toFixed(2)}</span>
            </div>
            {inv.discount > 0 && (
              <div className="invoice-summary-row">
                <span>Discount</span>
                <span>-£{inv.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="invoice-summary-row invoice-total">
              <span>Total Due</span>
              <span>£{inv.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details */}
          {inv.status !== 'paid' && (
            <div className="invoice-payment-details">
              <strong>Payment Details:</strong><br />
              Bank Transfer: Sort Code 12-34-56, Account 12345678<br />
              Reference: {inv.invoice_number}<br />
              <br />
              <em>Please include your invoice number as the payment reference.</em><br />
              <br />
              Thank you for your business! 🐾
            </div>
          )}

          {inv.status === 'paid' && inv.payment_date && (
            <div className="alert alert-success" style={{marginTop: 'var(--space-xl)'}}>
              ✓ This invoice was paid on {formatDate(inv.payment_date)} via {inv.payment_method || 'bank transfer'}.
              {inv.payment_notes && <div className="mt-sm text-sm">{inv.payment_notes}</div>}
            </div>
          )}

          {/* Print Button */}
          <div style={{marginTop: 'var(--space-xl)', textAlign: 'center'}}>
            <button onClick={() => window.print()} className="btn btn-primary">
              🖨️ Print Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Invoice List View
  return (
    <div className="page-content">
      <Breadcrumbs items={breadcrumbItems} />
      
      <h1 className="text-3xl font-bold mb-xl">Billing & Invoices</h1>

      {invoices.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No invoices yet.</p>
        </div>
      ) : (
        <div className="space-y-md">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="card card-hover" onClick={() => viewInvoice(invoice)} style={{cursor: 'pointer'}}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-md mb-sm">
                    <h3 className="font-bold text-lg">Invoice {invoice.invoice_number}</h3>
                    <span className={getStatusBadge(invoice.status)}>
                      {invoice.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {invoice.period && <div>Period: {invoice.period}</div>}
                    <div>Issued: {formatDate(invoice.issue_date)}</div>
                    <div>Due: {formatDate(invoice.due_date)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">£{invoice.total_amount.toFixed(2)}</div>
                  <button className="btn btn-primary btn-sm mt-sm">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
