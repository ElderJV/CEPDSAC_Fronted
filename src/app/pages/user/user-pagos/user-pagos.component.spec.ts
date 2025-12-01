import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPagosComponent } from './user-pagos.component';

describe('UserPagosComponent', () => {
  let component: UserPagosComponent;
  let fixture: ComponentFixture<UserPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPagosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
