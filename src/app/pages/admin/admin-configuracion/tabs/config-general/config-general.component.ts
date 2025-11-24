import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionGeneral } from '../../../../../core/models/configuracion.model';
import { ConfiguracionGeneralService } from '../../../../../core/services/configuracion-general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-general.component.html',
  styleUrl: './config-general.component.css'
})
export class ConfigGeneralComponent implements OnInit {
  private configService = inject(ConfiguracionGeneralService);

  configGeneral: ConfiguracionGeneral = {
    numeroEstudiantes: 0,
    numeroCertificaciones: 0,
    numeroInstructores: 0,
    numeroCursos: 0
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
        this.configGeneral = config;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar configuración:', error);
        Swal.fire('Error', 'No se pudo cargar la configuración', 'error');
        this.isLoading = false;
      }
    });
  }

  guardarConfigGeneral(): void {
    this.isSaving = true;
    this.configService.actualizar(this.configGeneral).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Configuración general guardada correctamente', 'success');
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
