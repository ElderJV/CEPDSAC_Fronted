import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { CursosComponent } from '../cursos/cursos.component';
import { DiplomadosComponent } from '../diplomados/diplomados.component';
import { NosotrosComponent } from '../nosotros/nosotros.component';
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';
import { SponsorsComponent } from '../sponsors/sponsors.component';
import { TestimoniosComponent } from '../testimonios/testimonios.component';

@Component({
  selector: 'app-hero',
  imports: [
    SliderComponent,
    CursosComponent,
    DiplomadosComponent,
    NosotrosComponent,
    EstadisticasComponent,
    SponsorsComponent,
    TestimoniosComponent,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {}
