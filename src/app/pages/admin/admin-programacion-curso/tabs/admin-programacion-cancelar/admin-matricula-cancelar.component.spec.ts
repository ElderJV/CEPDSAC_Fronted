import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMatriculaCancelarComponent } from './admin-matricula-cancelar.component';

describe('AdminMatriculaCancelarComponent', () => {
  let component: AdminMatriculaCancelarComponent;
  let fixture: ComponentFixture<AdminMatriculaCancelarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMatriculaCancelarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMatriculaCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
