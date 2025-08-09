import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactService, ContactFormData } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const mockContactData: ContactFormData = {
    nom: 'Dupont',
    prenom: 'Jean',
    objet: 'Demande d\'information',
    demande: 'Je souhaite des informations sur vos services.'
  };

  const mockApiUrl = '/api/contact';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendContactForm', () => {
    it('should send contact form successfully', (done) => {
      const mockResponse = { message: 'Formulaire envoyé avec succès' };

      service.sendContactForm(mockContactData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: (error) => {
          fail('Should not have an error');
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockContactData);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      
      req.flush(mockResponse);
    });

    it('should handle client-side error (ErrorEvent)', (done) => {
      const mockError = {
        error: new ErrorEvent('Network error', { message: 'Erreur réseau' }),
        status: 0
      };

      service.sendContactForm(mockContactData).subscribe({
        next: () => {
          fail('Should not have a success response');
        },
        error: (error) => {
          expect(error.message).toBe('Erreur: Erreur réseau');
          done();
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.error(mockError.error, mockError);
    });

    it('should handle 400 Bad Request error', (done) => {
      const mockError = {
        status: 400,
        message: 'Bad Request'
      };

      service.sendContactForm(mockContactData).subscribe({
        next: () => {
          fail('Should not have a success response');
        },
        error: (error) => {
          expect(error.message).toBe('Données invalides. Veuillez vérifier vos informations.');
          done();
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 Unauthorized error', (done) => {
      const mockError = {
        status: 401,
        message: 'Unauthorized'
      };

      service.sendContactForm(mockContactData).subscribe({
        next: () => {
          fail('Should not have a success response');
        },
        error: (error) => {
          expect(error.message).toBe('Non autorisé. Veuillez vous connecter.');
          done();
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 403 Forbidden error', (done) => {
      const mockError = {
        status: 403,
        message: 'Forbidden'
      };

      service.sendContactForm(mockContactData).subscribe({
        next: () => {
          fail('Should not have a success response');
        },
        error: (error) => {
          expect(error.message).toBe('Accès interdit.');
          done();
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 404 Not Found error', (done) => {
      const mockError = {
        status: 404,
        message: 'Not Found'
      };

      service.sendContactForm(mockContactData).subscribe({
        next: () => {
          fail('Should not have a success response');
        },
        error: (error) => {
          expect(error.message).toBe('Service non trouvé.');
          done();
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 Internal Server Error', (done) => {
      const mockError = {
        status: 500,
        message: 'Internal Server Error'
      };

      service.sendContactForm(mockContactData).subscribe({
        next: () => {
          fail('Should not have a success response');
        },
        error: (error) => {
          expect(error.message).toBe('Erreur serveur. Veuillez réessayer plus tard.');
          done();
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle unknown status code error', (done) => {
      const mockError = {
        status: 418,
        message: 'I\'m a teapot'
      };

      service.sendContactForm(mockContactData).subscribe({
        next: () => {
          fail('Should not have a success response');
        },
        error: (error) => {
          expect(error.message).toBe('Erreur 418: Http failure response for /api/contact: 418 I\'m a teapot');
          done();
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('I\'m a teapot', { status: 418, statusText: 'I\'m a teapot' });
    });

    it('should handle error without status', (done) => {
      const mockError = {
        message: 'Unknown error'
      };

      service.sendContactForm(mockContactData).subscribe({
        next: () => {
          fail('Should not have a success response');
        },
        error: (error) => {
          expect(error.message).toBe('Une erreur est survenue lors de l\'envoi du formulaire.');
          done();
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Unknown error', { status: 0, statusText: 'Unknown' });
    });
  });

  describe('ContactFormData interface', () => {
    it('should have correct structure', () => {
      expect(Object.prototype.hasOwnProperty.call(mockContactData, 'nom')).toBeTrue();
      expect(Object.prototype.hasOwnProperty.call(mockContactData, 'prenom')).toBeTrue();
      expect(Object.prototype.hasOwnProperty.call(mockContactData, 'objet')).toBeTrue();
      expect(Object.prototype.hasOwnProperty.call(mockContactData, 'demande')).toBeTrue();

      expect(typeof mockContactData.nom).toBe('string');
      expect(typeof mockContactData.prenom).toBe('string');
      expect(typeof mockContactData.objet).toBe('string');
      expect(typeof mockContactData.demande).toBe('string');
    });
  });
});
