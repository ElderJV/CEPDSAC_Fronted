import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { ToastService } from '../../../core/services/toast.service';
import { Usuario } from '../../../core/models/usuarios.model';
import { UsuarioCreateDTO } from '../../../core/models/usuario-create.model';
import { UsuarioValidators, USUARIO_ERROR_MESSAGES } from '../../../core/validators/usuario.validators';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Users, Plus, Pencil, Trash2, Search, Info, CheckCircle, XCircle, User, Mail, Hash, CreditCard, Filter, ChevronLeft, ChevronRight, Globe, Lock, Phone, RefreshCw } from 'lucide-angular';
import { PaisService, Pais } from '../../../core/services/pais.service';
import { TipoIdentificacionService, TipoIdentificacionInicial } from '../../../core/services/tipo-identificacion.service';

@Component({
  selector: 'app-admin-estudiantes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './admin-estudiantes.component.html',
  styleUrls: ['../../admin/admin-styles.css', './admin-estudiantes.component.css']
})
export class AdminEstudiantesComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private paisService = inject(PaisService);
  private tipoService = inject(TipoIdentificacionService);

  estudiantes = signal<Usuario[]>([]);
  paises = signal<Pais[]>([]);
  tiposIdentificacion = signal<TipoIdentificacionInicial[]>([]);
  loading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  
  searchText = signal('');
  soloConMatricula = signal(false);
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);

  private searchSubject = new Subject<string>();

  estudianteForm: FormGroup;

  readonly Users = Users;
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
  readonly Filter = Filter;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Globe = Globe;
  readonly Lock = Lock;
  readonly Phone = Phone;
  readonly RefreshCw = RefreshCw;

  showPasswordStrength = signal(false);

  constructor() {
    this.estudianteForm = this.fb.group({
      idUsuario: [null],
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        UsuarioValidators.nombre()
      ]],
      apellido: ['', [
        Validators.maxLength(50),
        UsuarioValidators.apellido()
      ]],
      correo: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]],
      rol: ['ALUMNO'],
      estado: ['ACTIVO'],
      activo: [true],
      inicialesTipoIdentificacion: ['DNI', Validators.required],
      numeroIdentificacion: ['', [
        Validators.maxLength(20),
        UsuarioValidators.numeroIdentificacion()
      ]],
      numeroCelular: ['', [
        Validators.maxLength(15),
        UsuarioValidators.numeroCelular()
      ]],
      idTipoIdentificacion: [1, Validators.required],
      password: [''],
      id_codigo_pais: [51]
    });
  }

  ngOnInit(): void {
    this.cargarEstudiantes();
    this.cargarCatalogos();

    this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchText.set(term);
      this.currentPage.set(0);
      this.cargarEstudiantes();
    });
  }

  cargarCatalogos() {
    this.paisService.getPaises().subscribe(data => this.paises.set(data || []));
    this.tipoService.getIniciales().subscribe(data => this.tiposIdentificacion.set(data || []));
  }

  cargarEstudiantes() {
    this.loading.set(true);
    this.usuariosService.listarAlumnosPaginado(
      this.currentPage(),
      this.pageSize(),
      this.searchText(),
      this.soloConMatricula()
    ).subscribe({
      next: (page) => {
        this.estudiantes.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error al cargar estudiantes');
        this.loading.set(false);
      }
    });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onSearchEnter(term: string) {
    this.searchText.set(term);
    this.currentPage.set(0);
    this.cargarEstudiantes();
  }

  onFilterChange(checked: boolean) {
    this.soloConMatricula.set(checked);
    this.currentPage.set(0);
    this.cargarEstudiantes();
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.cargarEstudiantes();
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.estudianteForm.get(fieldName);
    if (!control || !control.errors) {
      return '';
    }
    
    const errors = control.errors;
    const messages = USUARIO_ERROR_MESSAGES[fieldName as keyof typeof USUARIO_ERROR_MESSAGES];
    
    for (const errorKey in errors) {
      if (messages && messages[errorKey as keyof typeof messages]) {
        return messages[errorKey as keyof typeof messages] as string;
      }
    }
    
    return 'Campo inválido';
  }

  get passwordValue(): string {
    return this.estudianteForm.get('password')?.value || '';
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
    this.estudianteForm.reset({ 
      rol: 'ALUMNO', 
      estado: 'ACTIVO',
      activo: true,
      inicialesTipoIdentificacion: 'DNI',
      idTipoIdentificacion: 1,
      id_codigo_pais: 51
    });
    this.estudianteForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128),
      UsuarioValidators.password()
    ]);
    this.estudianteForm.get('password')?.updateValueAndValidity();
  }

  editar(estudiante: Usuario) {
    this.isEditing.set(true);
    this.showForm.set(true);
    
    this.estudianteForm.get('password')?.clearValidators();
    this.estudianteForm.get('password')?.updateValueAndValidity();
    
    this.usuariosService.obtener(estudiante.idUsuario).subscribe({
      next: (usuarioCompleto) => {
        this.estudianteForm.patchValue({
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
          id_codigo_pais: usuarioCompleto.id_codigo_pais || (usuarioCompleto as any).idPais || 51,
        });
      },
      error: () => {
        this.toast.error('Error al cargar detalles del estudiante');
        this.cancelarEdicion();
      }
    });
  }

  cancelarEdicion() {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.estudianteForm.reset();
  }

  guardar() {
    if (this.estudianteForm.invalid) {
      this.estudianteForm.markAllAsTouched();
      this.toast.warning('Complete todos los campos requeridos');
      return;
    }

    const val = this.estudianteForm.value;
    val.estado = val.activo ? 'ACTIVO' : 'INACTIVO';

    if (this.isEditing() && val.idUsuario) {
      if (!val.password) {
        delete val.password;
      }
      
      this.usuariosService.actualizar(val.idUsuario, val).subscribe({
        next: () => {
          this.toast.success('Estudiante actualizado correctamente');
          this.cargarEstudiantes();
          this.cancelarEdicion();
        },
        error: (err) => this.toast.error(err?.error?.message || 'Error al actualizar estudiante')
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
          this.toast.success('Estudiante creado correctamente');
          this.cargarEstudiantes();
          this.cancelarEdicion();
        },
        error: (err) => this.toast.error(err?.error?.message || 'Error al crear estudiante')
      });
    }
  }

  async eliminar(id: number) {
    const confirmed = await this.toast.confirm(
      '¿Eliminar Estudiante?',
      '¿Estás seguro de eliminar este estudiante? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    this.usuariosService.eliminar(id).subscribe({
      next: () => {
        this.toast.success('Estudiante eliminado correctamente');
        this.cargarEstudiantes();
      },
      error: () => this.toast.error('Error al eliminar estudiante')
    });
  }

  toggleEstado(estudiante: Usuario) {
    const nuevoEstado = estudiante.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    
    this.estudiantes.update(users => 
      users.map(u => u.idUsuario === estudiante.idUsuario ? { ...u, estado: nuevoEstado } : u)
    );

    this.usuariosService.actualizarParcial(estudiante.idUsuario, { estado: nuevoEstado }).subscribe({
      next: () => {
        this.toast.success(`Estado de ${estudiante.nombre} actualizado`);
      },
      error: () => {
        this.toast.error('Error al cambiar estado');
        this.estudiantes.update(users => 
          users.map(u => u.idUsuario === estudiante.idUsuario ? { ...u, estado: estudiante.estado } : u)
        );
      }
    });
  }
}
