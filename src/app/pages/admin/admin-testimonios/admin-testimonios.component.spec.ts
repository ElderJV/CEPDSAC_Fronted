import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestimoniosComponent } from './admin-testimonios.component';

describe('AdminTestimoniosComponent', () => {
  let component: AdminTestimoniosComponent;
  let fixture: ComponentFixture<AdminTestimoniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTestimoniosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTestimoniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
