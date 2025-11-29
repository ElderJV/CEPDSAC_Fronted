import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProgramacionCursoComponent } from './admin-programacion-curso.component';

describe('AdminProgramacionCursoComponent', () => {
  let component: AdminProgramacionCursoComponent;
  let fixture: ComponentFixture<AdminProgramacionCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProgramacionCursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProgramacionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
