
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SponsorService } from '../../../core/services/sponsor.service';
import { Sponsor } from '../../../core/models/sponsor.model';

@Component({
  selector: 'app-admin-sponsors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-sponsors.component.html',
  styleUrl: './admin-sponsors.component.css'
})
export class AdminSponsorsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sponsorService = inject(SponsorService);

  sponsors: Sponsor[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const resolved = this.route.snapshot.data?.['sponsors'] as Sponsor[] | undefined;
    if (resolved && Array.isArray(resolved)) {
      this.sponsors = resolved;
      this.isLoading = false;
    } else {
      this.loadSponsors();
    }
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
        console.error('Error cargando sponsors (admin):', err);
        this.errorMessage = 'No se pudieron cargar los sponsors';
        this.isLoading = false;
      }
    });
  }

  getImageUrl(ruta: string) {
    return this.sponsorService.getImageUrl(ruta);
  }

  trackById(_: number, item: Sponsor) {
    return item.idSponsor;
  }
}
