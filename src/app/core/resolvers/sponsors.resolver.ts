import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Sponsor } from '../models/sponsor.model';
import { SponsorService } from '../services/sponsor.service';

@Injectable({ providedIn: 'root' })
export class SponsorsResolver implements Resolve<Sponsor[]> {
  constructor(private sponsorService: SponsorService) {}

  resolve(): Observable<Sponsor[]> {
    return this.sponsorService.listar();
  }
}
