import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDiplomadosComponent } from './teacher-diplomados.component';

describe('TeacherDiplomadosComponent', () => {
  let component: TeacherDiplomadosComponent;
  let fixture: ComponentFixture<TeacherDiplomadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDiplomadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherDiplomadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
