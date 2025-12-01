import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { ToastService } from '../../../core/services/toast.service';
import { Usuario } from '../../../core/models/usuarios.model';
import { LucideAngularModule, GraduationCap, Plus, Pencil, Trash2, Search, Info, CheckCircle, XCircle, User, Mail, Hash, CreditCard, Globe, Lock, Phone } from 'lucide-angular';
import { PaisService, Pais } from '../../../core/services/pais.service';
import { TipoIdentificacionService, TipoIdentificacionInicial } from '../../../core/services/tipo-identificacion.service';

@Component({
  selector: 'app-admin-profesores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-profesores.component.html',
  styleUrls: ['../../admin/admin-styles.css', './admin-profesores.component.css']
})
export class AdminProfesoresComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private paisService = inject(PaisService);
  private tipoService = inject(TipoIdentificacionService);

  profesores = signal<Usuario[]>([]);
  paises = signal<Pais[]>([]);
  tiposIdentificacion = signal<TipoIdentificacionInicial[]>([]);
  loading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  searchText = signal('');

  profesorForm: FormGroup;

  readonly GraduationCap = GraduationCap;
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly Info = Info;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly User = User;
  readonly Mail = Mail;
  readonly Hash = Hash;
  readonly CreditCard = CreditCard;
  readonly Globe = Globe;
  readonly Lock = Lock;
  readonly Phone = Phone;

  showPasswordStrength = signal(false);

  constructor() {
    this.profesorForm = this.fb.group({
      idUsuario: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['DOCENTE'],
      estado: ['ACTIVO'],
      activo: [true],
      inicialesTipoIdentificacion: ['DNI', Validators.required],
      numeroIdentificacion: ['', Validators.required],
      numeroCelular: [''],
      idTipoIdentificacion: [1],
      password: [''],
      id_codigo_pais: [51]
    });
  }

  ngOnInit(): void {
    this.cargarProfesores();
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.paisService.getPaises().subscribe(data => this.paises.set(data || []));
    this.tipoService.getIniciales().subscribe(data => this.tiposIdentificacion.set(data || []));
  }

  get filteredProfesores() {
    const term = this.searchText().toLowerCase();
    return this.profesores().filter(p => 
      p.nombre.toLowerCase().includes(term) || 
      p.apellido.toLowerCase().includes(term) ||
      p.numeroIdentificacion.includes(term)
    );
  }

  cargarProfesores() {
    this.loading.set(true);
    this.usuariosService.listarPorRol('DOCENTE').subscribe({
      next: (data) => {
        console.log('Profesores cargados:', data);
        this.profesores.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error al cargar profesores');
        this.loading.set(false);
      }
    });
  }

  get passwordValue(): string {
    return this.profesorForm.get('password')?.value || '';
  }

  hasMinLength(): boolean {
    return this.passwordValue.length >= 8;
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.passwordValue);
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }

  hasNumber(): boolean {
    return /\d/.test(this.passwordValue);
  }

  hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.passwordValue);
  }

  nuevo() {
    this.isEditing.set(false);
    this.showForm.set(true);
    this.profesorForm.reset({ 
      rol: 'DOCENTE', 
      estado: 'ACTIVO',
      activo: true,
      inicialesTipoIdentificacion: 'DNI',
      idTipoIdentificacion: 1,
      id_codigo_pais: 51
    });
    this.profesorForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.profesorForm.get('password')?.updateValueAndValidity();
  }

  editar(profesor: Usuario) {
    this.isEditing.set(true);
    this.showForm.set(true);
    
    this.profesorForm.get('password')?.clearValidators();
    this.profesorForm.get('password')?.updateValueAndValidity();
    
    this.usuariosService.obtener(profesor.idUsuario).subscribe({
      next: (usuarioCompleto) => {
        this.profesorForm.patchValue({
          idUsuario: usuarioCompleto.idUsuario,
          nombre: usuarioCompleto.nombre,
          apellido: usuarioCompleto.apellido,
          correo: usuarioCompleto.correo,
          rol: usuarioCompleto.rol,
          estado: usuarioCompleto.estado,
          activo: usuarioCompleto.estado === 'ACTIVO',
          inicialesTipoIdentificacion: usuarioCompleto.inicialesTipoIdentificacion,
          numeroIdentificacion: usuarioCompleto.numeroIdentificacion,
          numeroCelular: usuarioCompleto.numeroCelular,
          idTipoIdentificacion: usuarioCompleto.idTipoIdentificacion,
          id_codigo_pais: usuarioCompleto.id_codigo_pais || (usuarioCompleto as any).idPais || 51 
        });
      },
      error: () => {
        this.toast.error('Error al cargar detalles del profesor');
        this.cancelarEdicion();
      }
    });
  }

  cancelarEdicion() {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.profesorForm.reset();
  }

  guardar() {
    if (this.profesorForm.invalid) {
      this.profesorForm.markAllAsTouched();
      this.toast.warning('Complete todos los campos requeridos');
      return;
    }

    const val = this.profesorForm.value;
    val.estado = val.activo ? 'ACTIVO' : 'INACTIVO';

    if (this.isEditing() && val.idUsuario) {
      if (!val.password) {
        delete val.password;
      }
      
      this.usuariosService.actualizar(val.idUsuario, val).subscribe({
        next: () => {
          this.toast.success('Profesor actualizado correctamente');
          this.cargarProfesores();
          this.cancelarEdicion();
        },
        error: (err) => this.toast.error(err?.error?.message || 'Error al actualizar profesor')
      });
    } else {
      const createDto = {
        nombre: val.nombre,
        apellido: val.apellido,
        correo: val.correo,
        password: val.password,
        rol: val.rol,
        estado: val.estado,
        numeroIdentificacion: val.numeroIdentificacion,
        numeroCelular: val.numeroCelular,
        idTipoIdentificacion: val.idTipoIdentificacion
      };
      
      this.usuariosService.crear(createDto).subscribe({ 
        next: () => {
          this.toast.success('Profesor creado correctamente');
          this.cargarProfesores();
          this.cancelarEdicion();
        },
        error: (err) => this.toast.error(err?.error?.message || 'Error al crear profesor')
      });
    }
  }

  async eliminar(id: number) {
    const confirmed = await this.toast.confirm(
      '¿Eliminar Profesor?',
      '¿Estás seguro de eliminar este profesor? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    this.usuariosService.eliminar(id).subscribe({
      next: () => {
        this.toast.success('Profesor eliminado correctamente');
        this.cargarProfesores();
      },
      error: () => this.toast.error('Error al eliminar profesor')
    });
  }

  toggleEstado(profesor: Usuario) {
    const nuevoEstado = profesor.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    this.profesores.update(users => 
      users.map(u => u.idUsuario === profesor.idUsuario ? { ...u, estado: nuevoEstado } : u)
    );

    this.usuariosService.actualizarParcial(profesor.idUsuario, { estado: nuevoEstado }).subscribe({
      next: () => {
        this.toast.success(`Estado de ${profesor.nombre} actualizado`);
      },
      error: () => {
        this.toast.error('Error al cambiar estado');
        this.profesores.update(users => 
          users.map(u => u.idUsuario === profesor.idUsuario ? { ...u, estado: profesor.estado } : u)
        );
      }
    });
  }
  getErrorMessage(controlName: string): string {
    const control = this.profesorForm.get(controlName);
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('email')) return 'Correo electrónico inválido';
    if (control?.hasError('minlength')) return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    if (control?.hasError('maxlength')) return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    if (control?.hasError('pattern')) return 'Formato inválido';
    return '';
  }
}
