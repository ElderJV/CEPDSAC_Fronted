import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ConfiguracionContactoService } from '../../core/services/configuracion-contacto.service';

interface Link {
  url?: string;
  text: string;
  action?: () => void;
}

interface ContactInfo {
  url: string;
  iconClass: string;
  text: string;
  ariaLabel: string;
}

interface SocialLink {
  url: string;
  iconClass: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  private contactoService = inject(ConfiguracionContactoService);

  public anioActual: number = new Date().getFullYear();

  public isModalVisible = false;
  public modalTitle = '';
  public modalContent = '';

  public legalLinks: Link[] = [
    {
      text: 'Políticas de Privacidad',
      action: () => this.openModal('privacy'),
    },
    {
      text: 'Términos y Condiciones',
      action: () => this.openModal('terms'),
    },
  ];

  public contactInfo: ContactInfo[] = [];

  public socialLinks: SocialLink[] = [];

  ngOnInit(): void {
    this.cargarConfiguracionContacto();
  }

  cargarConfiguracionContacto(): void {
    this.contactoService.obtener().subscribe({
      next: (config) => {
        // Configurar información de contacto
        this.contactInfo = [];
        
        if (config.whatsapp) {
          this.contactInfo.push({
            url: `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`,
            iconClass: 'fab fa-whatsapp',
            text: config.whatsapp,
            ariaLabel: 'Contactar por WhatsApp',
          });
        }

        if (config.correoContacto) {
          this.contactInfo.push({
            url: `mailto:${config.correoContacto}`,
            iconClass: 'fas fa-envelope',
            text: config.correoContacto,
            ariaLabel: 'Enviar correo electrónico',
          });
        }

        if (config.telefono) {
          this.contactInfo.push({
            url: `tel:${config.telefono.replace(/[^0-9+]/g, '')}`,
            iconClass: 'fas fa-phone',
            text: config.telefono,
            ariaLabel: 'Llamar por teléfono',
          });
        }

        // Configurar redes sociales
        this.socialLinks = [];

        if (config.facebook) {
          this.socialLinks.push({
            url: config.facebook,
            iconClass: 'fab fa-facebook-f',
            ariaLabel: 'Visita nuestra página de Facebook',
          });
        }

        if (config.instagram) {
          this.socialLinks.push({
            url: config.instagram,
            iconClass: 'fab fa-instagram',
            ariaLabel: 'Síguenos en Instagram',
          });
        }

        if (config.linkedin) {
          this.socialLinks.push({
            url: config.linkedin,
            iconClass: 'fab fa-linkedin-in',
            ariaLabel: 'Conecta con nosotros en LinkedIn',
          });
        }

        if (config.twitter) {
          this.socialLinks.push({
            url: config.twitter,
            iconClass: 'fab fa-twitter',
            ariaLabel: 'Síguenos en Twitter',
          });
        }
      },
      error: (err) => {
        console.error('Error cargando configuración de contacto:', err);
        // Mantener valores por defecto vacíos en caso de error
      }
    });
  }

  // --- Modal con textos formateados en HTML ---
  openModal(type: 'privacy' | 'terms'): void {
    if (type === 'privacy') {
      this.modalTitle = 'Políticas de Privacidad';
      this.modalContent = `
        <p>📅 <strong>Última actualización: 02/10/2025</strong></p>
        <p>En <strong>CEDP S.A.C.</strong> nos comprometemos a proteger la privacidad y seguridad de nuestros usuarios.</p>
        <p>Recopilamos y tratamos datos personales como nombre, correo electrónico, número de teléfono,
        información de facturación y matrícula, únicamente con fines académicos, administrativos y de facturación.</p>
        <p>Tus datos no serán compartidos con terceros sin tu autorización, salvo proveedores de servicios
        tecnológicos y financieros que son necesarios para operar nuestra plataforma, o en casos de requerimiento legal.</p>
        <p>Tienes derecho a acceder, rectificar o eliminar tus datos, así como oponerte a su uso para
        fines de marketing. Puedes ejercer estos derechos escribiendo a: <strong>info@cedpsac.com</strong>.</p>
        <p>Nuestra plataforma también utiliza cookies para mejorar la experiencia de usuario y fines estadísticos.</p>
      `;
    } else {
      this.modalTitle = 'Términos y Condiciones';
      this.modalContent = `
        <p>📅 <strong>Última actualización: 02/10/2025</strong></p>
        <p>Al acceder y utilizar los servicios de <strong>CEDP S.A.C.</strong>, el usuario acepta los siguientes Términos y Condiciones:</p>
        <ul>
          <li><strong>Registro:</strong> El usuario debe proporcionar datos verídicos al momento de registrarse.</li>
          <li><strong>Pagos:</strong> Todos los pagos son procesados mediante pasarelas seguras. El acceso a cursos se habilita una vez confirmado el pago.</li>
          <li><strong>Acceso:</strong> El acceso a los cursos es personal e intransferible. Compartir credenciales puede ocasionar la suspensión de la cuenta.</li>
          <li><strong>Propiedad Intelectual:</strong> Los contenidos (videos, materiales, guías) son propiedad de CEDP S.A.C. y no pueden ser copiados, distribuidos ni utilizados con fines comerciales sin autorización expresa.</li>
          <li><strong>Reembolsos:</strong> Los reembolsos pueden solicitarse dentro de un plazo determinado siempre que el curso no haya sido consumido significativamente.</li>
          <li><strong>Responsabilidad:</strong> CEDP S.A.C. no garantiza resultados de aprendizaje, ya que estos dependen del compromiso del estudiante.</li>
          <li><strong>Modificaciones:</strong> CEDP S.A.C. se reserva el derecho de actualizar los presentes términos, notificando los cambios en la plataforma.</li>
        </ul>
        <p>El uso continuado de la plataforma implica la aceptación de estas condiciones.</p>
      `;
    }
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
