import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDiplomadosComponent } from './admin-diplomados.component';

describe('AdminDiplomadosComponent', () => {
  let component: AdminDiplomadosComponent;
  let fixture: ComponentFixture<AdminDiplomadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDiplomadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDiplomadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
