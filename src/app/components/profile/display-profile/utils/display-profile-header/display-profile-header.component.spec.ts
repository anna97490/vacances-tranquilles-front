import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayProfileHeaderComponent } from './display-profile-header.component';
import { User, UserRole } from '../../../../../models/User';

describe('DisplayProfileHeaderComponent', () => {
  let component: DisplayProfileHeaderComponent;
  let fixture: ComponentFixture<DisplayProfileHeaderComponent>;

  const mockUser: User = {
    idUser: 1,
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice.martin@example.com',
    phoneNumber: '0612345678',
    address: '12 rue de Paris',
    postalCode: 75001,
    city: 'Paris',
    role: UserRole.CLIENT
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayProfileHeaderComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayProfileHeaderComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    component.userRole = UserRole.ADMIN;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should accept user input', () => {
      // Arrange & Act
      component.user = mockUser;

      // Assert
      expect(component.user).toEqual(mockUser);
    });

    it('should accept userRole input', () => {
      // Arrange & Act
      component.userRole = UserRole.PROVIDER;

      // Assert
      expect(component.userRole).toEqual(UserRole.PROVIDER);
    });
  });

  describe('Properties', () => {
    it('should have default rating value', () => {
      expect(component.rating).toBe(3.5);
    });

    it('should have default reviewsCount value', () => {
      expect(component.reviewsCount).toBe(142);
    });

    it('should allow rating to be modified', () => {
      // Arrange & Act
      component.rating = 4.2;

      // Assert
      expect(component.rating).toBe(4.2);
    });

    it('should allow reviewsCount to be modified', () => {
      // Arrange & Act
      component.reviewsCount = 200;

      // Assert
      expect(component.reviewsCount).toBe(200);
    });
  });

  describe('isAdmin getter', () => {
    it('should return true when userRole is ADMIN', () => {
      // Arrange
      component.userRole = UserRole.ADMIN;

      // Act & Assert
      expect(component.isAdmin).toBe(true);
    });

    it('should return false when userRole is CLIENT', () => {
      // Arrange
      component.userRole = UserRole.CLIENT;

      // Act & Assert
      expect(component.isAdmin).toBe(false);
    });

    it('should return false when userRole is PROVIDER', () => {
      // Arrange
      component.userRole = UserRole.PROVIDER;

      // Act & Assert
      expect(component.isAdmin).toBe(false);
    });
  });

  describe('fullStars getter', () => {
    it('should return correct number of full stars for rating 3.5', () => {
      // Arrange
      component.rating = 3.5;

      // Act
      const fullStars = component.fullStars;

      // Assert
      expect(fullStars.length).toBe(3);
    });

    it('should return correct number of full stars for rating 4.0', () => {
      // Arrange
      component.rating = 4.0;

      // Act
      const fullStars = component.fullStars;

      // Assert
      expect(fullStars.length).toBe(4);
    });

    it('should return correct number of full stars for rating 2.7', () => {
      // Arrange
      component.rating = 2.7;

      // Act
      const fullStars = component.fullStars;

      // Assert
      expect(fullStars.length).toBe(2);
    });

    it('should return 0 full stars for rating 0.3', () => {
      // Arrange
      component.rating = 0.3;

      // Act
      const fullStars = component.fullStars;

      // Assert
      expect(fullStars.length).toBe(0);
    });

    it('should return 5 full stars for rating 5.0', () => {
      // Arrange
      component.rating = 5.0;

      // Act
      const fullStars = component.fullStars;

      // Assert
      expect(fullStars.length).toBe(5);
    });
  });

  describe('hasHalfStar getter', () => {
    it('should return true when rating has decimal >= 0.5', () => {
      // Arrange
      component.rating = 3.5;

      // Act & Assert
      expect(component.hasHalfStar).toBe(true);
    });

    it('should return true when rating has decimal > 0.5', () => {
      // Arrange
      component.rating = 3.7;

      // Act & Assert
      expect(component.hasHalfStar).toBe(true);
    });

    it('should return false when rating has decimal < 0.5', () => {
      // Arrange
      component.rating = 3.3;

      // Act & Assert
      expect(component.hasHalfStar).toBe(false);
    });

    it('should return false when rating is whole number', () => {
      // Arrange
      component.rating = 4.0;

      // Act & Assert
      expect(component.hasHalfStar).toBe(false);
    });

    it('should return false when rating is 0', () => {
      // Arrange
      component.rating = 0;

      // Act & Assert
      expect(component.hasHalfStar).toBe(false);
    });
  });

  describe('emptyStars getter', () => {
    it('should return correct number of empty stars for rating 3.5', () => {
      // Arrange
      component.rating = 3.5;

      // Act
      const emptyStars = component.emptyStars;

      // Assert
      expect(emptyStars.length).toBe(1); // 5 - Math.ceil(3.5) = 5 - 4 = 1
    });

    it('should return correct number of empty stars for rating 4.0', () => {
      // Arrange
      component.rating = 4.0;

      // Act
      const emptyStars = component.emptyStars;

      // Assert
      expect(emptyStars.length).toBe(1); // 5 - Math.ceil(4.0) = 5 - 4 = 1
    });

    it('should return correct number of empty stars for rating 2.7', () => {
      // Arrange
      component.rating = 2.7;

      // Act
      const emptyStars = component.emptyStars;

      // Assert
      expect(emptyStars.length).toBe(2); // 5 - Math.ceil(2.7) = 5 - 3 = 2
    });

    it('should return 4 empty stars for rating 1.0', () => {
      // Arrange
      component.rating = 1.0;

      // Act
      const emptyStars = component.emptyStars;

      // Assert
      expect(emptyStars.length).toBe(4); // 5 - Math.ceil(1.0) = 5 - 1 = 4
    });

    it('should return 0 empty stars for rating 5.0', () => {
      // Arrange
      component.rating = 5.0;

      // Act
      const emptyStars = component.emptyStars;

      // Assert
      expect(emptyStars.length).toBe(0); // 5 - Math.ceil(5.0) = 5 - 5 = 0
    });

    it('should return 5 empty stars for rating 0.0', () => {
      // Arrange
      component.rating = 0.0;

      // Act
      const emptyStars = component.emptyStars;

      // Assert
      expect(emptyStars.length).toBe(5); // 5 - Math.ceil(0.0) = 5 - 0 = 5
    });
  });

  describe('Template rendering', () => {
    it('should display user full name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.profile-name')?.textContent).toContain('Alice Martin');
    });

    it('should show contact info for admin', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('alice.martin@example.com');
      expect(compiled.textContent).toContain('0612345678');
    });

    it('should not show contact info for non-admin', () => {
      // Arrange
      component.userRole = UserRole.CLIENT;
      fixture.detectChanges();

      // Act & Assert
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('alice.martin@example.com');
      expect(compiled.textContent).not.toContain('0612345678');
    });

    it('should not show contact info for provider', () => {
      // Arrange
      component.userRole = UserRole.PROVIDER;
      fixture.detectChanges();

      // Act & Assert
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('alice.martin@example.com');
      expect(compiled.textContent).not.toContain('0612345678');
    });

    it('should show verified icon for provider role', () => {
      // Arrange
      component.user.role = UserRole.PROVIDER;
      fixture.detectChanges();

      // Act & Assert
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-icon[color="warn"]')).toBeTruthy();
    });

    it('should not show verified icon for client role', () => {
      // Arrange
      component.user.role = UserRole.CLIENT;
      fixture.detectChanges();

      // Act & Assert
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-icon[color="warn"]')).toBeFalsy();
    });

    it('should show description when user has description', () => {
      // Arrange
      component.user.description = 'Test description';
      fixture.detectChanges();

      // Act & Assert
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Test description');
    });

    it('should not show description when user has no description', () => {
      // Arrange
      component.user.description = undefined;
      fixture.detectChanges();

      // Act & Assert
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Description');
    });

    it('should show city when user has city', () => {
      // Arrange
      component.user.city = 'Paris';
      fixture.detectChanges();

      // Act & Assert
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Paris');
    });

    it('should not show city when user has no city', () => {
      // Arrange
      component.user.city = '';
      fixture.detectChanges();

      // Act & Assert
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Localisation');
    });
  });
}); 