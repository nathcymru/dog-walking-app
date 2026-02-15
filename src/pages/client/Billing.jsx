import { useState, useEffect } from 'react';
import { FileTextIcon } from '../../components/Icons';
import api from '../../utils/api';

export default function ClientBilling() {
  const [invoices, setInvoices] = useState([]);
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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getBadgeClass = (status) => {
    if (status === 'paid') return 'badge-green';
    if (status === 'unpaid') return 'badge-gray';
    return 'badge-blue';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing & Invoices</h1>

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <FileTextIcon size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <p className="text-gray-500">No invoices yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                  <p className="text-sm text-gray-600">
                    Issued: {formatDate(invoice.issue_date)} | Due: {formatDate(invoice.due_date)}
                  </p>
                  {invoice.period && (
                    <p className="text-sm text-gray-600">Period: {invoice.period}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">£{invoice.total_amount.toFixed(2)}</p>
                  <span className={`badge ${getBadgeClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>

              {invoice.line_items && invoice.line_items.length > 0 && (
                <div className="border-t pt-3">
                  <p className="font-medium mb-2">Items:</p>
                  <div className="space-y-1">
                    {invoice.line_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.description} {item.quantity > 1 && `(x${item.quantity})`}
                        </span>
                        <span className="font-medium">£{item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {invoice.status === 'unpaid' && (
                <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#fef3c7' }}>
                  <p className="text-sm font-medium" style={{ color: '#92400e' }}>Payment Instructions:</p>
                  <p className="text-sm" style={{ color: '#78350f' }}>
                    Bank Transfer: Sort Code 12-34-56, Account 12345678<br />
                    Reference: {invoice.invoice_number}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
