import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomadosGeneralComponent } from './diplomados-general.component';

describe('DiplomadosGeneralComponent', () => {
  let component: DiplomadosGeneralComponent;
  let fixture: ComponentFixture<DiplomadosGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiplomadosGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiplomadosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
