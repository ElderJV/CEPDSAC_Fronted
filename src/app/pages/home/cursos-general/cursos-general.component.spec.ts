import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosGeneralComponent } from './cursos-general.component';

describe('CursosGeneralComponent', () => {
  let component: CursosGeneralComponent;
  let fixture: ComponentFixture<CursosGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
