import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { DescuentoService } from '../../../core/services/descuento.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { MatriculaService } from '../../../core/services/matricula.service';
import { ToastService } from '../../../core/services/toast.service';
import { Descuento, DescuentoAplicacion, DescuentoCreateDTO, DescuentoAplicacionCreateDTO } from '../../../core/models/descuento.model';
import { Categoria } from '../../../core/models/categoria.model';
import { CursoDiplomadoViewAdmin } from '../../../core/models/curso-diplomado.model';
import { LucideAngularModule, Tags, Plus, Percent, Network, Pencil, Trash2, Info, Book, CheckCircle, IdCard, CreditCard, Search } from 'lucide-angular';

@Component({
  selector: 'app-admin-descuento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-descuento.component.html',
  styleUrl: './admin-descuento.component.css'
})
export class AdminDescuentoComponent implements OnInit {
  private descuentoService = inject(DescuentoService);
  private categoriaService = inject(CategoriaService);
  private cursoService = inject(CursoDiplomadoService);
  private matriculaService = inject(MatriculaService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  activeTab = signal<'descuentos' | 'aplicaciones'>('descuentos');
  descuentos = signal<Descuento[]>([]);
  aplicaciones = signal<DescuentoAplicacion[]>([]);
  
  categorias = signal<Categoria[]>([]);
  cursos = signal<CursoDiplomadoViewAdmin[]>([]);
  matriculas = signal<any[]>([]);

  loading = signal(false);
  searchText = signal('');
  readonly Tags = Tags;
  readonly Plus = Plus;
  readonly Percent = Percent;
  readonly Network = Network;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Info = Info;
  readonly Book = Book;
  readonly CheckCircle = CheckCircle;
  readonly IdCard = IdCard;
  readonly CreditCard = CreditCard;
  readonly Search = Search;

  showForm = signal(false);
  isEditing = signal(false);
  descuentoForm: FormGroup;
  aplicacionForm: FormGroup;

  constructor() {
    this.descuentoForm = this.fb.group({
      idDescuento: [null],
      tipoDescuento: ['PORCENTAJE', Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      vigente: [true],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });

    this.aplicacionForm = this.fb.group({
      idDescuentoAplicacion: [null],
      tipoAplicacion: ['CURSO', Validators.required],
      idDescuento: [null, Validators.required],
      idCategoria: [null],
      idCursoDiplomado: [null],
      idMatricula: [null]
    });

    this.aplicacionForm.get('tipoAplicacion')?.valueChanges.subscribe(() => {
      this.searchText.set('');
    });
  }
  
  get filteredCursos() {
    const term = this.searchText().toLowerCase();
    return this.cursos().filter(c => 
      c.titulo.toLowerCase().includes(term) || 
      c.tipo.toLowerCase().includes(term)
    );
  }

  get filteredCategorias() {
    const term = this.searchText().toLowerCase();
    return this.categorias().filter(c => 
      c.nombre.toLowerCase().includes(term)
    );
  }

  get filteredMatriculas() {
    const term = this.searchText().toLowerCase();
    return this.matriculas().filter(m => 
      m.nombreCompletoAlumno?.toLowerCase().includes(term) || 
      m.tituloCurso?.toLowerCase().includes(term) ||
      m.dniAlumno?.toLowerCase().includes(term)
    );
  }

  toggleSelection(field: string, value: any) {
    const current = this.aplicacionForm.get(field)?.value;
    if (current === value) {
      this.aplicacionForm.get(field)?.setValue(null);
    } else {
      this.aplicacionForm.get(field)?.setValue(value);
    }
  }

  ngOnInit(): void {
    this.cargarDescuentos();
    this.cargarAplicaciones();
    this.cargarListasSeleccion();
  }

  switchTab(tab: 'descuentos' | 'aplicaciones') {
    this.activeTab.set(tab);
    this.cancelarEdicion();
  }

  cargarDescuentos() {
    this.loading.set(true);
    this.descuentoService.listar().subscribe({
      next: (data) => {
        this.descuentos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.toast.error('Error al cargar descuentos');
        this.loading.set(false);
      }
    });
  }

  cargarAplicaciones() {
    this.descuentoService.listarAplicaciones().subscribe({
      next: (data) => this.aplicaciones.set(data),
      error: (err) => this.toast.error('Error al cargar aplicaciones')
    });
  }

  cargarListasSeleccion() {
    this.categoriaService.listarActivas().subscribe({
      next: (data) => this.categorias.set(data)
    });
    this.cursoService.listar().subscribe({
      next: (data) => this.cursos.set(data)
    });
    this.matriculaService.listarMatriculasAdmin(0, 100).subscribe({
      next: (data) => this.matriculas.set(data.content)
    });
  }

  nuevo() {
    this.isEditing.set(false);
    this.showForm.set(true);
    if (this.activeTab() === 'descuentos') {
      this.descuentoForm.reset({ tipoDescuento: 'PORCENTAJE', vigente: true, valor: 0 });
    } else {
      this.aplicacionForm.reset({ tipoAplicacion: 'CURSO' });
    }
  }

  editarDescuento(d: Descuento) {
    this.activeTab.set('descuentos');
    this.isEditing.set(true);
    this.showForm.set(true);
    this.descuentoForm.patchValue(d);
  }

  editarAplicacion(a: DescuentoAplicacion) {
    this.activeTab.set('aplicaciones');
    this.isEditing.set(true);
    this.showForm.set(true);
    this.aplicacionForm.patchValue(a);
  }

  cancelarEdicion() {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.descuentoForm.reset();
    this.aplicacionForm.reset();
  }

  guardar() {
    if (this.activeTab() === 'descuentos') {
      this.guardarDescuento();
    } else {
      this.guardarAplicacion();
    }
  }

  private guardarDescuento() {
    if (this.descuentoForm.invalid) {
      this.toast.error('Formulario inválido');
      return;
    }
    const val = this.descuentoForm.value;
    const { idDescuento, ...dto } = val;

    if (this.isEditing() && idDescuento) {
      this.descuentoService.actualizar(val).subscribe({
        next: () => {
          this.toast.success('Descuento actualizado');
          this.cargarDescuentos();
          this.cancelarEdicion();
        },
        error: () => this.toast.error('Error al actualizar')
      });
    } else {
      this.descuentoService.crear(dto).subscribe({
        next: () => {
          this.toast.success('Descuento creado');
          this.cargarDescuentos();
          this.cancelarEdicion();
        },
        error: () => this.toast.error('Error al crear')
      });
    }
  }

  private guardarAplicacion() {
    if (this.aplicacionForm.invalid) {
      this.toast.error('Formulario inválido');
      return;
    }
    const val = this.aplicacionForm.value;
    const { idDescuentoAplicacion, ...dto } = val;
    
    if (this.isEditing() && idDescuentoAplicacion) {
      this.descuentoService.actualizarAplicacion(idDescuentoAplicacion, dto).subscribe({
        next: () => {
          this.toast.success('Regla actualizada');
          this.cargarAplicaciones();
          this.cancelarEdicion();
        },
        error: () => this.toast.error('Error al actualizar regla')
      });
    } else {
      this.descuentoService.crearAplicacion(dto).subscribe({
        next: () => {
          this.toast.success('Regla creada');
          this.cargarAplicaciones();
          this.cancelarEdicion();
        },
        error: () => this.toast.error('Error al crear regla')
      });
    }
  }

  async eliminarDescuento(id: number) {
    const confirmed = await this.toast.confirm(
      '¿Eliminar Descuento?',
      '¿Estás seguro de eliminar este descuento?'
    );
    if (!confirmed) return;

    this.descuentoService.eliminar(id).subscribe({
      next: () => {
        this.toast.success('Descuento eliminado');
        this.cargarDescuentos();
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  async eliminarAplicacion(id: number) {
    const confirmed = await this.toast.confirm(
      '¿Eliminar Regla?',
      '¿Estás seguro de eliminar esta regla de descuento?'
    );
    if (!confirmed) return;

    this.descuentoService.eliminarAplicacion(id).subscribe({
      next: () => {
        this.toast.success('Regla eliminada');
        this.cargarAplicaciones();
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}
