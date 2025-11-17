import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaGeneralComponent } from './matricula-general.component';

describe('MatriculaGeneralComponent', () => {
  let component: MatriculaGeneralComponent;
  let fixture: ComponentFixture<MatriculaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculaGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatriculaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
