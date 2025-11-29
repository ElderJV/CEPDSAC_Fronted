import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMatriculaPersonalizadaComponent } from './admin-matricula-personalizada.component';

describe('AdminMatriculaPersonalizadaComponent', () => {
  let component: AdminMatriculaPersonalizadaComponent;
  let fixture: ComponentFixture<AdminMatriculaPersonalizadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMatriculaPersonalizadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMatriculaPersonalizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
