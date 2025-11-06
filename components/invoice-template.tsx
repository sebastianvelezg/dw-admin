"use client"

import * as React from "react"
import { type Invoice } from "@/lib/stores/invoice-store"

interface InvoiceTemplateProps {
  invoice: Invoice
  companyInfo?: {
    name: string
    address: string
    city: string
    phone: string
    email: string
    website: string
    logo?: string
  }
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ invoice, companyInfo }, ref) => {
    const defaultCompanyInfo = {
      name: "DW Admin",
      address: "123 Software Street",
      city: "Tech City, TC 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@dwadmin.com",
      website: "www.dwadmin.com",
      ...companyInfo,
    }

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <style>{`
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          .invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .invoice-table th { background-color: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
          .invoice-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .invoice-table tfoot td { border-top: 2px solid #e5e7eb; font-weight: 600; }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', paddingBottom: '20px', borderBottom: '3px solid #2563eb' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
              {defaultCompanyInfo.name}
            </h1>
            <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>{defaultCompanyInfo.address}</p>
            <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>{defaultCompanyInfo.city}</p>
            <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>
              {defaultCompanyInfo.phone} | {defaultCompanyInfo.email}
            </p>
            <p style={{ margin: '4px 0', color: '#2563eb', fontSize: '14px', fontWeight: '500' }}>
              {defaultCompanyInfo.website}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb', margin: '0 0 16px 0' }}>
              FACTURA
            </h2>
            <div style={{ backgroundColor: '#f3f4f6', padding: '12px 16px', borderRadius: '6px' }}>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                <strong>Número:</strong> {invoice.invoiceNumber}
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                <strong>Fecha:</strong> {invoice.issueDate}
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                <strong>Vencimiento:</strong> {invoice.dueDate}
              </p>
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0', fontSize: '12px', fontWeight: '600', color: invoice.status === 'Pagada' ? '#059669' : invoice.status === 'Vencida' ? '#dc2626' : '#f59e0b' }}>
                  Estado: {invoice.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #2563eb' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Facturar a:
            </h3>
            <p style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
              {invoice.clientName}
            </p>
            {invoice.projectName && (
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                Proyecto: <strong>{invoice.projectName}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{ width: '50%' }}>Descripción</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Cantidad</th>
              <th style={{ width: '17.5%', textAlign: 'right' }}>Precio Unit.</th>
              <th style={{ width: '17.5%', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td style={{ color: '#1f2937' }}>{item.description}</td>
                <td style={{ textAlign: 'center', color: '#6b7280' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', color: '#6b7280' }}>
                  ${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: 'right', fontWeight: '500', color: '#1f2937' }}>
                  ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right', color: '#6b7280' }}>Subtotal:</td>
              <td style={{ textAlign: 'right' }}>
                ${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right', color: '#6b7280' }}>IVA (16%):</td>
              <td style={{ textAlign: 'right' }}>
                ${invoice.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <td colSpan={3} style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Total a Pagar:
              </td>
              <td style={{ textAlign: 'right', fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                ${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Notes */}
        {invoice.notes && (
          <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#92400e' }}>
              Notas:
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#78350f', lineHeight: '1.5' }}>
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Payment Info */}
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Información de Pago
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>Banco:</p>
              <p style={{ margin: '0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Banco Nacional</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>Cuenta:</p>
              <p style={{ margin: '0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>1234-5678-9012-3456</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>Beneficiario:</p>
              <p style={{ margin: '0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{defaultCompanyInfo.name}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>Referencia:</p>
              <p style={{ margin: '0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
            Gracias por su negocio
          </p>
          <p style={{ margin: '0', fontSize: '11px', color: '#9ca3af' }}>
            Este documento es una factura legalmente vinculante. Por favor, conserve una copia para sus registros.
          </p>
          <p style={{ margin: '12px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
            {defaultCompanyInfo.name} | {defaultCompanyInfo.email} | {defaultCompanyInfo.website}
          </p>
        </div>
      </div>
    )
  }
)

InvoiceTemplate.displayName = "InvoiceTemplate"
