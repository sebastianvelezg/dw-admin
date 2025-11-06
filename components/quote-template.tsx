"use client"

import * as React from "react"
import { type Quote } from "@/lib/stores/quote-store"

interface QuoteTemplateProps {
  quote: Quote & { terms?: string }
  companyInfo?: {
    name: string
    tagline: string
    address: string
    city: string
    phone: string
    email: string
    website: string
    logo?: string
  }
}

export const QuoteTemplate = React.forwardRef<HTMLDivElement, QuoteTemplateProps>(
  ({ quote, companyInfo }, ref) => {
    const defaultCompanyInfo = {
      name: "DW Admin",
      tagline: "Software & Design Solutions",
      address: "123 Software Street",
      city: "Tech City, TC 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@dwadmin.com",
      website: "www.dwadmin.com",
      ...companyInfo,
    }

    const defaultTerms = quote.terms || `1. Validez de la Cotización: Esta cotización es válida hasta ${quote.validUntil}.

2. Forma de Pago: El pago se realizará según los hitos acordados en el contrato del proyecto.

3. Alcance del Proyecto: Los servicios descritos en esta cotización incluyen únicamente los ítems mencionados. Cualquier trabajo adicional será cotizado por separado.

4. Tiempo de Entrega: Los plazos de entrega se establecerán en el contrato del proyecto y dependerán de la aprobación oportuna de entregables y feedback del cliente.

5. Propiedad Intelectual: Todos los derechos de propiedad intelectual del trabajo entregado serán transferidos al cliente una vez completado el pago total.

6. Revisiones: Se incluyen hasta 2 rondas de revisiones por cada entregable. Revisiones adicionales se cotizarán por separado.

7. Garantía: Ofrecemos 30 días de soporte post-lanzamiento para corrección de errores.

8. Cancelación: En caso de cancelación del proyecto, se cobrará el trabajo completado hasta la fecha más un 25% del trabajo restante.`

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <style>{`
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          .quote-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .quote-table th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px; text-align: left; }
          .quote-table td { padding: 14px; border-bottom: 1px solid #e5e7eb; }
          .quote-table tfoot td { border-top: 2px solid #667eea; font-weight: 600; }
        `}</style>

        {/* Header with Gradient */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '32px', borderRadius: '12px', marginBottom: '32px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                {defaultCompanyInfo.name}
              </h1>
              <p style={{ margin: '0 0 20px 0', fontSize: '16px', opacity: '0.9' }}>
                {defaultCompanyInfo.tagline}
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px', opacity: '0.8' }}>{defaultCompanyInfo.address}</p>
              <p style={{ margin: '4px 0', fontSize: '14px', opacity: '0.8' }}>{defaultCompanyInfo.city}</p>
              <p style={{ margin: '4px 0', fontSize: '14px', opacity: '0.8' }}>
                {defaultCompanyInfo.phone} | {defaultCompanyInfo.email}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 'bold', margin: '0 0 8px 0', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                COTIZACIÓN
              </h2>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px 16px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Número:</strong> {quote.quoteNumber}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Fecha:</strong> {quote.issueDate}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>Válido hasta:</strong> {quote.validUntil}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ padding: '20px', borderRadius: '8px', border: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#667eea', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cliente:
            </h3>
            <p style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
              {quote.clientName}
            </p>
          </div>
        </div>

        {/* Project Description */}
        {quote.title && (
          <div style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>
              Proyecto: {quote.title}
            </h3>
          </div>
        )}

        {/* Services Table */}
        <table className="quote-table">
          <thead>
            <tr>
              <th style={{ width: '5%', borderTopLeftRadius: '8px' }}>#</th>
              <th style={{ width: '50%' }}>Servicio / Descripción</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Cant.</th>
              <th style={{ width: '16%', textAlign: 'right' }}>Precio Unit.</th>
              <th style={{ width: '17%', textAlign: 'right', borderTopRightRadius: '8px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                <td style={{ color: '#6b7280', fontWeight: '500' }}>{index + 1}</td>
                <td>
                  <p style={{ margin: '0', fontWeight: '500', color: '#1f2937' }}>{item.description}</p>
                </td>
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
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <td colSpan={4} style={{ textAlign: 'right', color: '#6b7280', fontSize: '15px' }}>Subtotal:</td>
              <td style={{ textAlign: 'right', fontSize: '15px' }}>
                ${quote.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <td colSpan={4} style={{ textAlign: 'right', color: '#6b7280', fontSize: '15px' }}>IVA (16%):</td>
              <td style={{ textAlign: 'right', fontSize: '15px' }}>
                ${quote.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <td colSpan={4} style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', padding: '16px 14px' }}>
                Inversión Total:
              </td>
              <td style={{ textAlign: 'right', fontSize: '24px', fontWeight: 'bold', padding: '16px 14px' }}>
                ${quote.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Notes */}
        {quote.notes && (
          <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#92400e' }}>
              Notas Adicionales:
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#78350f', lineHeight: '1.6' }}>
              {quote.notes}
            </p>
          </div>
        )}

        {/* What's Included Section */}
        <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #6ee7b7' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✨ Qué Incluye Este Proyecto
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
              <span style={{ color: '#059669', fontSize: '18px' }}>✓</span>
              <span style={{ fontSize: '14px', color: '#065f46' }}>Diseño profesional y moderno</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
              <span style={{ color: '#059669', fontSize: '18px' }}>✓</span>
              <span style={{ fontSize: '14px', color: '#065f46' }}>Desarrollo responsivo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
              <span style={{ color: '#059669', fontSize: '18px' }}>✓</span>
              <span style={{ fontSize: '14px', color: '#065f46' }}>Optimización SEO básica</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
              <span style={{ color: '#059669', fontSize: '18px' }}>✓</span>
              <span style={{ fontSize: '14px', color: '#065f46' }}>Soporte técnico (30 días)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
              <span style={{ color: '#059669', fontSize: '18px' }}>✓</span>
              <span style={{ fontSize: '14px', color: '#065f46' }}>Documentación completa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
              <span style={{ color: '#059669', fontSize: '18px' }}>✓</span>
              <span style={{ fontSize: '14px', color: '#065f46' }}>Capacitación del equipo</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            Términos y Condiciones
          </h4>
          <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
            {defaultTerms}
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ marginTop: '32px', padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>
            Próximos Pasos
          </h4>
          <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
            <li>Revisar esta cotización y los términos adjuntos</li>
            <li>Contactarnos para resolver cualquier duda</li>
            <li>Aprobar la cotización para iniciar el proyecto</li>
            <li>Firmar el contrato y realizar el pago inicial</li>
          </ol>
        </div>

        {/* Acceptance Section */}
        <div style={{ marginTop: '32px', padding: '24px', border: '2px dashed #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
            Aceptación de Cotización
          </h4>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280' }}>
            Al firmar a continuación, acepto los términos y condiciones especificados en esta cotización.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '32px' }}>
            <div>
              <div style={{ borderBottom: '2px solid #1f2937', paddingBottom: '8px', marginBottom: '8px' }}></div>
              <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Firma del Cliente</p>
            </div>
            <div>
              <div style={{ borderBottom: '2px solid #1f2937', paddingBottom: '8px', marginBottom: '8px' }}></div>
              <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Fecha</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
            ¿Preguntas? Estamos aquí para ayudar
          </p>
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6b7280' }}>
            📧 {defaultCompanyInfo.email} | 📞 {defaultCompanyInfo.phone}
          </p>
          <p style={{ margin: '0', fontSize: '13px', color: '#667eea', fontWeight: '500' }}>
            🌐 {defaultCompanyInfo.website}
          </p>
          <p style={{ margin: '16px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
            © {new Date().getFullYear()} {defaultCompanyInfo.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    )
  }
)

QuoteTemplate.displayName = "QuoteTemplate"
