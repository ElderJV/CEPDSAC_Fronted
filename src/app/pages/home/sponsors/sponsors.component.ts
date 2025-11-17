import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SponsorService } from '../../../core/services/sponsor.service';
import { Sponsor } from '../../../core/models/sponsor.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sponsors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sponsors.component.html',
  styleUrl: './sponsors.component.css',
})
export class SponsorsComponent implements OnInit {
  private sponsorService = inject(SponsorService);
  private route = inject(ActivatedRoute);

  sponsors: Sponsor[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const resolved = this.route.snapshot.data?.['sponsors'] as Sponsor[] | undefined;
    if (resolved && Array.isArray(resolved)) {
      this.sponsors = resolved;
      this.isLoading = false;
    } else {
      this.cargarSponsors();
    }
  }

  cargarSponsors(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.sponsorService.listar().subscribe({
      next: (data) => {
        this.sponsors = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar sponsors:', err);
        this.errorMessage = 'No se pudieron cargar los sponsors';
        this.isLoading = false;
      }
    });
  }

  getImageUrl(rutaImagen: string): string {
    return this.sponsorService.getImageUrl(rutaImagen);
  }
}
