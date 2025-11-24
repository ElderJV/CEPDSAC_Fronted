import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Pencil, Trash2, Plus, X } from 'lucide-angular';
import { SponsorService } from '../../../../../core/services/sponsor.service';
import { Sponsor } from '../../../../../core/models/sponsor.model';

@Component({
  selector: 'app-config-sponsors',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './config-sponsors.component.html',
  styleUrl: './config-sponsors.component.css'
})
export class ConfigSponsorsComponent implements OnInit {
  private sponsorService = inject(SponsorService);

  readonly PencilIcon = Pencil;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly XIcon = X;

  sponsors: Sponsor[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  showModal = false;
  isEditMode = false;
  currentSponsorId: number | null = null;
  
  sponsorNombre = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  
  isSubmitting = false;
  submitError: string | null = null;

  ngOnInit(): void {
    this.loadSponsors();
  }

  loadSponsors(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.sponsorService.listar().subscribe({
      next: (data) => {
        this.sponsors = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando sponsors:', err);
        this.errorMessage = 'No se pudieron cargar los sponsors';
        this.isLoading = false;
      }
    });
  }

  getImageUrl(ruta: string) {
    return this.sponsorService.getImageUrl(ruta);
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentSponsorId = null;
    this.sponsorNombre = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.submitError = null;
    this.showModal = true;
  }

  openEditModal(sponsor: Sponsor): void {
    this.isEditMode = true;
    this.currentSponsorId = sponsor.idSponsor;
    this.sponsorNombre = sponsor.nombre;
    this.selectedFile = null;
    this.imagePreview = sponsor.rutaImagen;
    this.submitError = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
        if (!file.type.startsWith('image/')) {
        this.submitError = 'Por favor selecciona una imagen válida';
        return;
      }
        if (file.size > 5 * 1024 * 1024) {
        this.submitError = 'La imagen no debe superar los 5MB';
        return;
      }
      
      this.selectedFile = file;
      this.submitError = null;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm(): void {
    if (!this.sponsorNombre.trim()) {
      this.submitError = 'El nombre es requerido';
      return;
    }
    if (!this.isEditMode && !this.selectedFile) {
      this.submitError = 'La imagen es requerida';
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    if (this.isEditMode && this.currentSponsorId !== null) {
      this.sponsorService.actualizar(
        this.currentSponsorId,
        this.sponsorNombre,
        this.selectedFile || undefined
      ).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.loadSponsors();
        },
        error: (err) => {
          console.error('Error actualizando sponsor:', err);
          this.submitError = err.error?.message || 'Error al actualizar el sponsor';
          this.isSubmitting = false;
        }
      });
    } else {
      if (!this.selectedFile) return;
      
      this.sponsorService.crear(this.sponsorNombre, this.selectedFile).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.loadSponsors();
        },
        error: (err) => {
          console.error('Error creando sponsor:', err);
          this.submitError = err.error?.message || 'Error al crear el sponsor';
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteSponsor(sponsor: Sponsor): void {
    if (!confirm(`¿Estás seguro de eliminar el sponsor "${sponsor.nombre}"?`)) {
      return;
    }
    this.sponsorService.eliminar(sponsor.idSponsor).subscribe({
      next: () => {
        this.loadSponsors();
      },
      error: (err) => {
        console.error('Error eliminando sponsor:', err);
        alert('Error al eliminar el sponsor');
      }
    });
  }

  private resetForm(): void {
    this.sponsorNombre = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.submitError = null;
    this.isSubmitting = false;
  }

  trackById(_: number, item: Sponsor) {
    return item.idSponsor;
  }
}

