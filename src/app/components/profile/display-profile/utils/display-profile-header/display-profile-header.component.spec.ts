import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayProfileHeaderComponent } from './display-profile-header.component';
import { User, UserRole } from '../../../../../services/interfaces/interfaceUser';

describe('ProfileHeaderComponent', () => {
  let component: DisplayProfileHeaderComponent;
  let fixture: ComponentFixture<DisplayProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayProfileHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayProfileHeaderComponent);
    component = fixture.componentInstance;
    component.user = {
      idUser: 1,
      profilePicture: '',
      firstName: 'Alice',
      lastName: 'Martin',
      email: 'alice.martin@example.com',
      phoneNumber: '0612345678',
      address: '12 rue de Paris',
      postalCode: 75001,
      city: 'Paris',
      role: UserRole.CLIENT
    };
    component.currentUserRole = UserRole.ADMIN;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user full name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Alice Martin');
  });

  it('should show contact info for admin', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('alice.martin@example.com');
    expect(compiled.textContent).toContain('0612345678');
  });

  it('should not show contact info for non-admin', () => {
    component.currentUserRole = UserRole.CLIENT;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('alice.martin@example.com');
    expect(compiled.textContent).not.toContain('0612345678');
  });
}); 