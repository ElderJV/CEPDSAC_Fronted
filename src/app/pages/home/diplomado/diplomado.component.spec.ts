import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomadoComponent } from './diplomado.component';

describe('DiplomadoComponent', () => {
  let component: DiplomadoComponent;
  let fixture: ComponentFixture<DiplomadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiplomadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiplomadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
