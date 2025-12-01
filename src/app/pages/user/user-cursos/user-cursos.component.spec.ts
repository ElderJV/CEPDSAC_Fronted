import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCursosComponent } from './user-cursos.component';

describe('UserCursosComponent', () => {
  let component: UserCursosComponent;
  let fixture: ComponentFixture<UserCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
