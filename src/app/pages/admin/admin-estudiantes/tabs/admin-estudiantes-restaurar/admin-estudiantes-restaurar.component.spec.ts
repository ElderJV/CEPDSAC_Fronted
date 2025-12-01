import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEstudiantesRestaurarComponent } from './admin-estudiantes-restaurar.component';

describe('AdminEstudiantesRestaurarComponent', () => {
  let component: AdminEstudiantesRestaurarComponent;
  let fixture: ComponentFixture<AdminEstudiantesRestaurarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEstudiantesRestaurarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEstudiantesRestaurarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
