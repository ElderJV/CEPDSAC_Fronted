import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDescuentoComponent } from './admin-descuento.component';

describe('AdminDescuentoComponent', () => {
  let component: AdminDescuentoComponent;
  let fixture: ComponentFixture<AdminDescuentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDescuentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
