import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HomeContentService, HomeContent } from '../../services/home-content.service';
import { provideRouter } from '@angular/router';
import { Renderer2 } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHomeContentService: jasmine.SpyObj<HomeContentService>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  const mockFeature = {
    iconType: 'custom',
    icon: 'assets/icons/custom.svg',
    title: 'Avantage Test',
    desc: 'Description de test'
  };

  const mockContent: HomeContent = {
    title: 'Accueil',
    subtitle: 'Sous-titre',
    introText: 'Introduction...',
    btnPrestataire: 'Inscription Prestataire',
    btnParticulier: 'Inscription Particulier',
    btnConnexion: 'Connexion',
    featuresTitle: 'Fonctionnalités',
    iconType: 'custom',
    mainIcon: 'home',
    features: [
      {
        iconType: 'custom',
        icon: 'assets/icons/custom.svg',
        title: 'Avantage Test',
        desc: 'Description de test'
      }
    ]
  };


  beforeEach(async () => {
    mockHomeContentService = jasmine.createSpyObj('HomeContentService', ['getContent']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: HomeContentService, useValue: mockHomeContentService },
        { provide: Renderer2, useValue: mockRenderer }
      ]
    }).compileComponents();

    mockHomeContentService.getContent.and.returnValue(mockContent);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize content in ngOnInit', () => {
    expect(component.content).toEqual(mockContent);
  });

  it('should bind logo path correctly', () => {
    expect(component.mainLogo).toBe('assets/pictures/logo.png');
  });

  it('should render DOM elements from content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain(mockContent.title);
    expect(compiled.querySelector('.subtitle')?.textContent).toContain(mockContent.subtitle);
    expect(compiled.querySelector('.intro-text')?.textContent).toContain(mockContent.introText);
    expect(compiled.querySelector('.features-title')?.textContent).toContain(mockContent.featuresTitle);
    expect(compiled.querySelector('.feature-title')?.textContent).toContain(mockFeature.title);
    expect(compiled.querySelector('.feature-desc')?.textContent).toContain(mockFeature.desc);
  });

  it('should render feature card with image for iconType "custom"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('.feature-card img');
    expect(image).toBeTruthy();
    expect(image?.getAttribute('src')).toBe(mockFeature.icon);
  });

  it('should call addScript with correct URLs', () => {
    const scriptElement = document.createElement('script');
    mockRenderer.createElement.and.returnValue(scriptElement);
    component['addScript']('https://example.com/test-script.js');
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(document.body, scriptElement);
    expect(component['scriptElements'].length).toBeGreaterThan(0);
  });

  it('should remove script elements on ngOnDestroy', () => {
    const script1 = document.createElement('script');
    const script2 = document.createElement('script');
    document.body.appendChild(script1);
    document.body.appendChild(script2);
    component['scriptElements'].push(script1, script2);
    component.ngOnDestroy();
    expect(document.body.contains(script1)).toBeFalse();
    expect(document.body.contains(script2)).toBeFalse();
  });

  it('should generate a random ID matching pattern', () => {
    const id = component['generateRandomId']();
    expect(id).toMatch(/^id-[a-z0-9]{16}$/);
  });

  it('should not throw if botpressWebChat is undefined', () => {
    // simule l'absence du widget botpress
    spyOn<any>(window, 'botpressWebChat').and.returnValue(undefined);
    expect(() => component['sendBonjourToBotpress']()).not.toThrow();
  });

  it('sendBonjourToBotpress should not throw even if botpressWebChat is undefined', () => {
    spyOnProperty(window as any, 'botpressWebChat', 'get').and.returnValue(undefined);
    expect(() => component['sendBonjourToBotpress']()).not.toThrow();
  });

  it('should try to send message when botpressWebChat is available', (done) => {
    const bpMock = {
      conversationId: 'conv123'
    };

    (window as any).botpressWebChat = bpMock;

    spyOn(component as any, 'generateRandomId').and.returnValue('random-id');
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'ok' })
    }) as any);
    expect(window.fetch).toHaveBeenCalled();
  });
});
