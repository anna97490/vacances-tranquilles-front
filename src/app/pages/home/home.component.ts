import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { HomeContent } from './../../models/Home';
import { HomeContentService } from './../../services/home-content.service';
import { HomeInitializationService } from './../../services/home/home-initilization.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, MatIconModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss',           // Styles de base (commun)
    './home.component.desktop.scss',   // Styles desktop
    './home.component.mobile.scss'     // Styles mobile
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  content!: HomeContent;
  mainLogo = 'assets/pictures/logo.png';
  
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.height') height = '100%';

  constructor(
    private homeContentService: HomeContentService,
    private homeInitializationService: HomeInitializationService
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.initializeContent();
    this.initializeServices();
  }

  ngOnDestroy(): void {
    this.homeInitializationService.cleanup();
  }

  /**
   * Initialise le contenu de la page
   */
  private initializeContent(): void {
    console.log('Initializing content...');
    const content = this.homeContentService.getContent();
    this.content = content ?? this.getDefaultContent();
    console.log('Content initialized:', this.content);
  }

  /**
   * Initialise les services externes (scripts, chatbot, etc.)
   */
  private async initializeServices(): Promise<void> {
    try {
      console.log('Initializing services...');
      await this.homeInitializationService.initializeHomeServices();
      console.log('Services initialized successfully');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des services:', error);
    }
  }

  /**
   * Retourne un contenu par défaut en cas d'erreur
   */
  private getDefaultContent(): HomeContent {
    return {
      title: 'Vacances Tranquilles',
      subtitle: 'Votre partenaire de confiance pour des vacances sereines',
      introText: 'Simplifiez la gestion de vos locations saisonnières',
      btnPrestataire: 'Inscription Prestataires',
      btnParticulier: 'Inscription Particuliers',
      btnConnexion: 'Connexion',
      featuresTitle: 'Pourquoi Nous Choisir',
      iconType: 'custom',
      mainIcon: 'assets/icons/beach_access_FFA101.svg',
      features: []
    };
  }
}