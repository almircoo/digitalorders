import resend
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone

class EmailService:
    def __init__(self):
        resend.api_key = settings.RESEND_API_KEY
        self.from_email = settings.DEFAULT_FROM_EMAIL
        self.frontend_url = settings.FRONTEND_URL
    
    def send_verification_email(self, user, token):
        """Enviar email de verificación de cuenta"""
        subject = "Verifica tu cuenta en DigitalOrder"
        verification_url = f"{self.frontend_url}/verify-email?token={token.token}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #333;">DigitalOrder</h1>
                </div>
                <div style="padding: 30px;">
                    <h2>Hola {user.first_name}!</h2>
                    <p>Gracias por registrarte en DigitalOrder. Para completar tu registro, 
                    por favor verifica tu dirección de email haciendo clic en el siguiente botón:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_url}" 
                           style="background-color: #28a745; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verificar Email
                        </a>
                    </div>
                    
                    <p>O copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; color: #666;">{verification_url}</p>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        Este enlace expirará en 24 horas. Si no solicitaste esta verificación, 
                        puedes ignorar este email.
                    </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2024 DigitalOrder. Todos los derechos reservados.</p>
                </div>
            </body>
        </html>
        """
        
        try:
            response = resend.Emails.send({
                "from": self.from_email,
                "to": user.email,
                "subject": subject,
                "html": html_content
            })
            return True, response
        except Exception as e:
            return False, str(e)
    
    def send_password_reset_email(self, user, token):
        """Enviar email de recuperación de contraseña"""
        subject = "Recupera tu contraseña - DigitalOrder"
        reset_url = f"{self.frontend_url}/reset-password?token={token.token}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #333;">DigitalOrder</h1>
                </div>
                <div style="padding: 30px;">
                    <h2>Recuperación de Contraseña</h2>
                    <p>Hola {user.first_name},</p>
                    <p>Recibimos una solicitud para restablecer tu contraseña. 
                    Si no realizaste esta solicitud, puedes ignorar este email.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_url}" 
                           style="background-color: #007bff; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Restablecer Contraseña
                        </a>
                    </div>
                    
                    <p>O copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; color: #666;">{reset_url}</p>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        Por seguridad, este enlace expirará en 2 horas.
                    </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2024 DigitalOrder. Todos los derechos reservados.</p>
                </div>
            </body>
        </html>
        """
        
        try:
            response = resend.Emails.send({
                "from": self.from_email,
                "to": user.email,
                "subject": subject,
                "html": html_content
            })
            return True, response
        except Exception as e:
            return False, str(e)
    
    def send_password_changed_email(self, user):
        """Notificar cambio de contraseña exitoso"""
        subject = "Tu contraseña ha sido cambiada - DigitalOrder"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #333;">DigitalOrder</h1>
                </div>
                <div style="padding: 30px;">
                    <h2>Contraseña Actualizada</h2>
                    <p>Hola {user.first_name},</p>
                    <p>Tu contraseña ha sido actualizada exitosamente.</p>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; 
                                padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            <strong>Importante:</strong> Si no realizaste este cambio, 
                            contacta inmediatamente a nuestro equipo de soporte.
                        </p>
                    </div>
                    
                    <p>Fecha del cambio: {timezone.now().strftime('%d/%m/%Y %H:%M')}</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2024 DigitalOrder. Todos los derechos reservados.</p>
                </div>
            </body>
        </html>
        """
        
        try:
            response = resend.Emails.send({
                "from": self.from_email,
                "to": user.email,
                "subject": subject,
                "html": html_content
            })
            return True, response
        except Exception as e:
            return False, str(e)