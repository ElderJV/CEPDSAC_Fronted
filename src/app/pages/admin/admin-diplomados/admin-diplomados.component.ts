import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ToastService } from '../../../core/services/toast.service';
import { CursoDiplomado, CursoDiplomadoViewAdmin } from '../../../core/models/curso-diplomado.model';
import { Categoria } from '../../../core/models/categoria.model';
import { LucideAngularModule, GraduationCap, Plus, Pencil, Trash2, Search, Info, CheckCircle, XCircle, Type, Tag, Image, Target, Award } from 'lucide-angular';

@Component({
  selector: 'app-admin-diplomados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-diplomados.component.html',
  styleUrls: ['../../admin/admin-styles.css', './admin-diplomados.component.css']
})
export class AdminDiplomadosComponent implements OnInit {
  private cursoService = inject(CursoDiplomadoService);
  private categoriaService = inject(CategoriaService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  diplomados = signal<CursoDiplomadoViewAdmin[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  searchText = signal('');
  searchCategoriaText = signal('');

  diplomadoForm: FormGroup;

  readonly GraduationCap = GraduationCap;
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly Info = Info;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Type = Type;
  readonly Tag = Tag;
  readonly Image = Image;
  readonly Target = Target;
  readonly Award = Award;

  constructor() {
    this.diplomadoForm = this.fb.group({
      idCursoDiplomado: [null],
      titulo: ['', Validators.required],
      idCategoria: [null, Validators.required],
      tipo: ['DIPLOMADO', Validators.required],
      otorgaCertificado: [true],
      urlCurso: [''],
      objetivo: ['']
    });
  }

  ngOnInit(): void {
    this.cargarDiplomados();
    this.cargarCategorias();
  }

  get filteredDiplomados() {
    const term = this.searchText().toLowerCase();
    return this.diplomados().filter(c => 
      c.titulo.toLowerCase().includes(term) || 
      c.nombreCategoria.toLowerCase().includes(term)
    );
  }

  get filteredCategoriasForm() {
    const term = this.searchCategoriaText().toLowerCase();
    return this.categorias().filter(c => 
      c.nombre.toLowerCase().includes(term)
    );
  }

  cargarDiplomados() {
    this.loading.set(true);
    this.cursoService.listarDiplomadosAdmin().subscribe({
      next: (data) => {
        this.diplomados.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error al cargar diplomados');
        this.loading.set(false);
      }
    });
  }

  cargarCategorias() {
    this.categoriaService.listarActivas().subscribe({
      next: (data) => this.categorias.set(data),
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  selectCategoria(id: number) {
    this.diplomadoForm.patchValue({ idCategoria: id });
  }

  nuevo() {
    this.isEditing.set(false);
    this.showForm.set(true);
    this.searchCategoriaText.set('');
    this.diplomadoForm.reset({ 
      tipo: 'DIPLOMADO', 
      otorgaCertificado: true 
    });
  }

  editar(diplomado: CursoDiplomadoViewAdmin) {
    this.isEditing.set(true);
    this.showForm.set(true);
    this.searchCategoriaText.set('');
    
    this.diplomadoForm.patchValue({
      idCursoDiplomado: diplomado.idCursoDiplomado,
      titulo: diplomado.titulo,
      idCategoria: diplomado.idCategoria,
      tipo: diplomado.tipo,
      otorgaCertificado: diplomado.otorgaCertificado,
      urlCurso: diplomado.urlCurso,
      objetivo: diplomado.objetivo
    });
  }

  cancelarEdicion() {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.diplomadoForm.reset();
  }

  guardar() {
    if (this.diplomadoForm.invalid) {
      this.diplomadoForm.markAllAsTouched();
      this.toast.warning('Complete todos los campos requeridos');
      return;
    }

    const val = this.diplomadoForm.value;
    
    const diplomadoDto: any = {
      titulo: val.titulo,
      idCategoria: val.idCategoria,
      tipo: val.tipo === 'DIPLOMADO',
      otorgaCertificado: val.otorgaCertificado,
      urlCurso: val.urlCurso,
      objetivo: val.objetivo
    };

    if (this.isEditing() && val.idCursoDiplomado) {
      this.cursoService.actualizar(val.idCursoDiplomado, diplomadoDto).subscribe({
        next: () => {
          this.toast.success('Diplomado actualizado correctamente');
          this.cargarDiplomados();
          this.cancelarEdicion();
        },
        error: () => this.toast.error('Error al actualizar diplomado')
      });
    } else {
      this.cursoService.crear(diplomadoDto).subscribe({
        next: () => {
          this.toast.success('Diplomado creado correctamente');
          this.cargarDiplomados();
          this.cancelarEdicion();
        },
        error: () => this.toast.error('Error al crear diplomado')
      });
    }
  }

  async eliminar(id: number) {
    const confirmed = await this.toast.confirm(
      '¿Eliminar Diplomado?',
      '¿Estás seguro de eliminar este diplomado? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    this.cursoService.eliminar(id).subscribe({
      next: () => {
        this.toast.success('Diplomado eliminado correctamente');
        this.cargarDiplomados();
      },
      error: () => this.toast.error('Error al eliminar diplomado')
    });
  }
}
