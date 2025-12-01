import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Facebook, Instagram, Linkedin, Twitter } from 'lucide-angular';
import { ConfiguracionContacto } from '../../../../../core/models/configuracion.model';
import { ConfiguracionContactoService } from '../../../../../core/services/configuracion-contacto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './config-contacto.component.html',
  styleUrl: './config-contacto.component.css'
})
export class ConfigContactoComponent implements OnInit {
  private configService = inject(ConfiguracionContactoService);

  readonly FacebookIcon = Facebook;
  readonly InstagramIcon = Instagram;
  readonly LinkedinIcon = Linkedin;
  readonly TwitterIcon = Twitter;

  configContacto: ConfiguracionContacto = {
    correoContacto: '',
    telefono: '',
    whatsapp: '',
    direccion: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: ''
  };

  isLoading = true;
  isSaving = false;

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  cargarConfiguracion(): void {
    this.isLoading = true;
    this.configService.obtener().subscribe({
      next: (config) => {
        this.configContacto = config;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar configuración:', error);
        Swal.fire('Error', 'No se pudo cargar la configuración de contacto', 'error');
        this.isLoading = false;
      }
    });
  }

  guardarConfigContacto(): void {
    this.isSaving = true;
    this.configService.actualizar(this.configContacto).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Configuración de contacto guardada correctamente', 'success');
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error al guardar configuración:', error);
        Swal.fire('Error', 'No se pudo guardar la configuración', 'error');
        this.isSaving = false;
      }
    });
  }
}
