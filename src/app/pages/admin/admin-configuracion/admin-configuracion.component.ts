import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigGeneralComponent } from './tabs/config-general/config-general.component';
import { ConfigMetodosPagoComponent } from './tabs/config-metodos-pago/config-metodos-pago.component';
import { ConfigSponsorsComponent } from './tabs/config-sponsors/config-sponsors.component';
import { ConfigTestimoniosComponent } from './tabs/config-testimonios/config-testimonios.component';
import { ConfigContactoComponent } from './tabs/config-contacto/config-contacto.component';

@Component({
  selector: 'app-admin-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    ConfigGeneralComponent,
    ConfigMetodosPagoComponent,
    ConfigSponsorsComponent,
    ConfigTestimoniosComponent,
    ConfigContactoComponent
  ],
  templateUrl: './admin-configuracion.component.html',
  styleUrl: './admin-configuracion.component.css'
})
export class AdminConfiguracionComponent {
  activeTab: string = 'general';

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
