import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDiplomadosComponent } from './user-diplomados.component';

describe('UserDiplomadosComponent', () => {
  let component: UserDiplomadosComponent;
  let fixture: ComponentFixture<UserDiplomadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDiplomadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDiplomadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
