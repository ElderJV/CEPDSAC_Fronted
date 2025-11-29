import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCrearProgramacionCursoComponent } from './admin-crear-programacion-curso.component';

describe('AdminCrearProgramacionCursoComponent', () => {
  let component: AdminCrearProgramacionCursoComponent;
  let fixture: ComponentFixture<AdminCrearProgramacionCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCrearProgramacionCursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCrearProgramacionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
