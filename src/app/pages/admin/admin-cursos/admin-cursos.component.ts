import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ToastService } from '../../../core/services/toast.service';
import { CursoDiplomado, CursoDiplomadoViewAdmin } from '../../../core/models/curso-diplomado.model';
import { Categoria } from '../../../core/models/categoria.model';
import { LucideAngularModule, Book, Plus, Pencil, Trash2, Search, Info, CheckCircle, XCircle, Type, Tag, Image, Target, Award, List, Package } from 'lucide-angular';

@Component({
  selector: 'app-admin-cursos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-cursos.component.html',
  styleUrls: ['../../admin/admin-styles.css', './admin-cursos.component.css']
})
export class AdminCursosComponent implements OnInit {
  private cursoService = inject(CursoDiplomadoService);
  private categoriaService = inject(CategoriaService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  cursos = signal<CursoDiplomadoViewAdmin[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  searchText = signal('');
  searchCategoriaText = signal('');

  cursoForm: FormGroup;

  readonly Book = Book;
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
  readonly List = List;
  readonly Package = Package;

  constructor() {
    this.cursoForm = this.fb.group({
      idCursoDiplomado: [null],
      titulo: ['', Validators.required],
      idCategoria: [null, Validators.required],
      tipo: ['CURSO', Validators.required],
      otorgaCertificado: [true],
      urlCurso: [''],
      objetivo: [''],
      materialesIncluidos: [''],
      requisitos: ['']
    });
  }

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarCategorias();
  }

  get filteredCursos() {
    const term = this.searchText().toLowerCase();
    return this.cursos().filter(c => 
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

  cargarCursos() {
    this.loading.set(true);
    this.cursoService.listarCursosAdmin().subscribe({
      next: (data) => {
        this.cursos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error al cargar cursos');
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
    this.cursoForm.patchValue({ idCategoria: id });
  }

  nuevo() {
    this.isEditing.set(false);
    this.showForm.set(true);
    this.searchCategoriaText.set('');
    this.cursoForm.reset({ 
      tipo: 'CURSO', 
      otorgaCertificado: true 
    });
  }

  editar(curso: CursoDiplomadoViewAdmin) {
    this.isEditing.set(true);
    this.showForm.set(true);
    this.searchCategoriaText.set('');
    
    this.cursoForm.patchValue({
      idCursoDiplomado: curso.idCursoDiplomado,
      titulo: curso.titulo,
      idCategoria: curso.idCategoria,
      tipo: curso.tipo || 'CURSO',
      otorgaCertificado: curso.otorgaCertificado,
      urlCurso: curso.urlCurso,
      objetivo: curso.objetivo,
      materialesIncluidos: curso.materialesIncluidos,
      requisitos: curso.requisitos
    });
  }

  cancelarEdicion() {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.cursoForm.reset();
  }

  guardar() {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      this.toast.warning('Complete todos los campos requeridos');
      return;
    }

    const val = this.cursoForm.value;
    
    const cursoDto: any = {
      titulo: val.titulo,
      idCategoria: val.idCategoria,
      tipo: val.tipo === 'DIPLOMADO',
      otorgaCertificado: val.otorgaCertificado,
      urlCurso: val.urlCurso,
      objetivo: val.objetivo,
      materialesIncluidos: val.materialesIncluidos,
      requisitos: val.requisitos
    };

    if (this.isEditing() && val.idCursoDiplomado) {
      this.cursoService.actualizar(val.idCursoDiplomado, cursoDto).subscribe({
        next: () => {
          this.toast.success('Curso actualizado correctamente');
          this.cargarCursos();
          this.cancelarEdicion();
        },
        error: () => this.toast.error('Error al actualizar curso')
      });
    } else {
      this.cursoService.crear(cursoDto).subscribe({
        next: () => {
          this.toast.success('Curso creado correctamente');
          this.cargarCursos();
          this.cancelarEdicion();
        },
        error: () => this.toast.error('Error al crear curso')
      });
    }
  }

  async eliminar(id: number) {
    const confirmed = await this.toast.confirm(
      '¿Eliminar Curso?',
      '¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    this.cursoService.eliminar(id).subscribe({
      next: () => {
        this.toast.success('Curso eliminado correctamente');
        this.cargarCursos();
      },
      error: () => this.toast.error('Error al eliminar curso')
    });
  }
}
