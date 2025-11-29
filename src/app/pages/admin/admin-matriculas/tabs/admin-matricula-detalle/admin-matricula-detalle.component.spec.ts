import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMatriculaDetalleComponent } from './admin-matricula-detalle.component';

describe('AdminMatriculaDetalleComponent', () => {
  let component: AdminMatriculaDetalleComponent;
  let fixture: ComponentFixture<AdminMatriculaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMatriculaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMatriculaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
