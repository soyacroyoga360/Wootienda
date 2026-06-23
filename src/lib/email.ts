import { Resend } from "resend"

// Instancia global de Resend (busca la variable de entorno RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_for_build")

const SENDER_EMAIL = process.env.SMTP_ADMIN_EMAIL || "hola@wootienda.com"
const SENDER_NAME = process.env.SMTP_SENDER_NAME || "Wootienda"

/**
 * Plantilla HTML: Correo de Bienvenida a Wootienda
 */
function getWelcomeEmailHtml(name: string, businessSlug: string): string {
  const landingUrl = `http://2.24.104.66:3000/${businessSlug}`
  const dashboardUrl = `http://2.24.104.66:3000/dashboard`

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Bienvenido a Wootienda!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
        <!-- Header -->
        <tr>
          <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #EE1D6D 0%, #a21caf 100%);">
            <div style="display: inline-block; width: 48px; height: 48px; background-color: #ffffff; border-radius: 50%; text-align: center; line-height: 48px; margin-bottom: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              <span style="font-weight: 900; font-size: 24px; color: #EE1D6D; font-family: sans-serif;">W</span>
            </div>
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; tracking-tight: -0.025em;">¡Bienvenido a Wootienda!</h1>
            <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Tu negocio ya está listo para vender en internet</p>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-top: 0;">Hola <strong>${name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">¡Estamos muy emocionados de tenerte con nosotros! Hemos creado tu cuenta con éxito y tu landing page comercial ya se encuentra activa para recibir clientes.</p>
            
            <!-- Info Box -->
            <div style="background-color: #f1f5f9; border-left: 4px solid #EE1D6D; border-radius: 8px 16px 16px 8px; padding: 20px; margin: 30px 0; text-align: left;">
              <h3 style="margin: 0 0 10px; color: #0f172a; font-size: 16px; font-weight: 700;">🌐 Tu enlace público:</h3>
              <a href="${landingUrl}" style="color: #EE1D6D; font-size: 15px; font-weight: 600; text-decoration: none; word-break: break-all;" target="_blank">${landingUrl}</a>
              <p style="margin: 10px 0 0; font-size: 13px; color: #64748b;">Comparte este enlace en tus redes sociales (Instagram, WhatsApp, TikTok) para que tus clientes comiencen a ver tu catálogo.</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">Ingresa a tu panel administrativo para personalizar los colores de tu landing, subir nuevos productos, actualizar precios y gestionar los detalles de contacto.</p>
            
            <!-- Button -->
            <div style="text-align: center; margin: 35px 0 25px;">
              <a href="${dashboardUrl}" style="background-color: #EE1D6D; color: #ffffff; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(238, 29, 109, 0.3); transition: transform 0.2s;" target="_blank">Ir a mi Panel de Control</a>
            </div>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding: 0 40px;">
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;" />
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 30px 40px 40px; text-align: center; font-size: 13px; color: #94a3b8; line-height: 1.5;">
            <p style="margin: 0;">Este es un correo automático enviado por Wootienda. Por favor, no respondas directamente a este mensaje.</p>
            <p style="margin: 6px 0 0;">© 2026 Wootienda. Todos los derechos reservados.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Plantilla HTML: Alerta de Interés / Compra de Cliente (para el dueño del negocio)
 */
function getInquiryEmailHtml(
  businessName: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  productName: string,
  productPrice: number
): string {
  const whatsappUrl = `https://wa.me/${customerPhone.replace(/[^0-9]/g, "")}`

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Nuevo cliente interesado en tu catálogo!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
        <!-- Header -->
        <tr>
          <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-bottom: 4px solid #EE1D6D;">
            <span style="font-size: 40px; margin-bottom: 12px; display: inline-block;">🎉</span>
            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; tracking-tight: -0.025em;">¡Tienes un cliente interesado!</h1>
            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 15px;">Un cliente ha solicitado información desde tu landing de Wootienda</p>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-top: 0;">Hola <strong>${businessName}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">Un usuario acaba de marcar interés en uno de tus productos. A continuación tienes los detalles completos para ponerte en contacto:</p>
            
            <!-- Lead Details Card -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 16px; padding: 24px; margin: 25px 0; border: 1px solid #f1f5f9;">
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; color: #64748b; font-weight: 600; width: 140px;">Cliente:</td>
                <td style="padding-bottom: 12px; font-size: 15px; color: #0f172a; font-weight: 700;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; color: #64748b; font-weight: 600;">Teléfono:</td>
                <td style="padding-bottom: 12px; font-size: 15px; color: #0f172a;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; color: #64748b; font-weight: 600;">Email:</td>
                <td style="padding-bottom: 12px; font-size: 15px; color: #0f172a;"><a href="mailto:${customerEmail}" style="color: #EE1D6D; text-decoration: none;">${customerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0 0; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; font-weight: 600;">🛍️ Producto:</td>
                <td style="padding: 12px 0 0; border-top: 1px solid #e2e8f0; font-size: 15px; color: #EE1D6D; font-weight: 700;">${productName}</td>
              </tr>
              <tr>
                <td style="padding-top: 8px; font-size: 14px; color: #64748b; font-weight: 600;">💰 Precio:</td>
                <td style="padding-top: 8px; font-size: 15px; color: #0f172a; font-weight: 700;">$${productPrice.toLocaleString("es-MX")}</td>
              </tr>
            </table>

            <p style="font-size: 15px; line-height: 1.6; color: #64748b; text-align: center;">Te recomendamos contactarlo lo antes posible vía WhatsApp para asegurar tu venta.</p>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0 10px;">
              <a href="${whatsappUrl}" style="background-color: #25D366; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; margin-right: 10px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);" target="_blank">💬 Escribir por WhatsApp</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 30px 40px 40px; text-align: center; font-size: 13px; color: #94a3b8; line-height: 1.5; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">Este aviso fue enviado desde tu catálogo activo en <strong>Wootienda</strong>.</p>
            <p style="margin: 6px 0 0;">© 2026 Wootienda. Todos los derechos reservados.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Envia el correo de bienvenida al registrar una nueva cuenta de negocio
 */
export async function sendWelcomeEmail(to: string, name: string, businessSlug: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY no está configurado. Correo de bienvenida omitido.")
    return { success: false, error: "Missing API Key" }
  }

  try {
    const html = getWelcomeEmailHtml(name, businessSlug)
    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to,
      subject: "🚀 ¡Bienvenido a Wootienda! Tu negocio está en línea",
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("❌ Error en sendWelcomeEmail:", error)
    return { success: false, error }
  }
}

/**
 * Envia una alerta de lead/cliente interesado al dueño del negocio
 */
export async function sendInquiryEmail(
  businessEmail: string,
  businessName: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  productName: string,
  productPrice: number
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY no está configurado. Notificación de cliente omitida.")
    return { success: false, error: "Missing API Key" }
  }

  try {
    const html = getInquiryEmailHtml(
      businessName,
      customerName,
      customerPhone,
      customerEmail,
      productName,
      productPrice
    )
    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: businessEmail,
      subject: `🎉 ¡Nuevo cliente interesado! - ${customerName}`,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("❌ Error en sendInquiryEmail:", error)
    return { success: false, error }
  }
}
