import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAlumnosCursoComponent } from './teacher-alumnos-curso.component';

describe('TeacherAlumnosCursoComponent', () => {
  let component: TeacherAlumnosCursoComponent;
  let fixture: ComponentFixture<TeacherAlumnosCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAlumnosCursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAlumnosCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
