import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { UserRole } from '../../models/User';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',           // Styles de base (commun)
    './header.component.desktop.scss',   // Styles desktop
    './header.component.mobile.scss'     // Styles mobile
  ]
})
export class HeaderComponent implements OnInit {
  mainLogo = 'assets/pictures/logo.png';
  hoveredItem: any = null;
  isMobileMenuOpen = false;

  menu = [
    {
      label: 'Accueil',
      icon: 'assets/icons/cottage_24dp_FFFFF.svg',
      iconActive: 'assets/icons/cottage_24dp_FFA101.svg',
      path: '/home'
    },
    {
      label: 'Profil',
      icon: 'assets/icons/person_24dp_FFFFFF.svg',
      iconActive: 'assets/icons/person_24dp_FFA101.svg',
      path: '/profile'
    },
    {
      label: 'Messagerie',
      icon: 'assets/icons/chat_bubble_24dp_FFFFFF.svg',
      iconActive: 'assets/icons/chat_bubble_24dp_FFA101.svg',
      path: '/messagerie'
    },
    {
      label: 'Assistance',
      icon: 'assets/icons/contact_support_24dp_FFFFF.svg',
      iconActive: 'assets/icons/contact_support_24dp_FFA101.svg',
      path: '/assistance'
    }
  ];

  // Bouton de déconnexion
  logoutItem = {
    label: 'Se déconnecter',
    icon: 'assets/icons/logout_24dp_FFFFFF.svg',
    iconActive: 'assets/icons/logout_24dp_FFA101.svg',
    action: 'logout'
  };

  currentPath: string = '';
  
  constructor(
    private readonly router: Router, 
    public location: Location,
    private readonly authStorage: AuthStorageService
  ) {}
  
  ngOnInit(): void {
    this.currentPath = this.location.path() || '/home';
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentPath = this.location.path() || '/home';
    });
  }

  /**
   * Détermine le chemin de navigation pour un élément du menu
   * @param item L'élément du menu
   * @returns Le chemin de navigation
   */
  getNavigationPath(item: any): string {
    // Si c'est l'élément "Accueil" et que l'utilisateur est connecté avec le rôle CLIENT
    if (item.label === 'Accueil' && this.isClientUser()) {
      return '/service-search';
    }
    return item.path;
  }

  /**
   * Vérifie si l'utilisateur connecté est un client
   * @returns true si l'utilisateur est connecté et a le rôle CLIENT
   */
  private isClientUser(): boolean {
    return this.authStorage.isAuthenticated() && 
           this.authStorage.getUserRole() === UserRole.CLIENT;
  }

  /**
   * Gère la navigation vers un élément du menu
   * @param item L'élément du menu
   */
  onMenuNavigation(item: any): void {
    const path = this.getNavigationPath(item);
    
    // Si on navigue vers le profil depuis le header, nettoyer le localStorage
    // pour s'assurer qu'on affiche le profil de l'utilisateur connecté
    if (item.label === 'Profil') {
      localStorage.removeItem('displayedUserId');
      
      // Si on est déjà sur la page profil, forcer le rechargement
      if (this.currentPath === '/profile') {
        // Recharger la page pour forcer le rechargement des données
        window.location.reload();
        return;
      }
    }
    
    this.router.navigate([path]);
    this.closeMobileMenu();
  }

  /**
   * Écoute les clics en dehors du menu pour le fermer
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.mobile-menu-container') && !target.closest('.burger-btn')) {
      this.closeMobileMenu();
    }
  }

  /**
   * Écoute les touches du clavier pour fermer le menu avec Escape
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMobileMenu();
  }

  /**
   * Bascule l'état du menu mobile
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.toggleBodyScroll();
    setTimeout(() => this.focusMobileMenu(), 0);
  }

  /**
   * Ferme le menu mobile
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.toggleBodyScroll();
  }

  /**
   * Empêche le défilement du body quand le menu est ouvert
   */
  private toggleBodyScroll(): void {
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  private focusMobileMenu(): void {
    const menu = document.getElementById('mobile-menu');
    if (this.isMobileMenuOpen && menu) {
      menu.setAttribute('tabindex', '-1');
      (menu as HTMLElement).focus();
    }
  }

  isActive(path: string): boolean {
    // Si c'est le chemin "Accueil" et que l'utilisateur est un client connecté
    // sur la page service-search, considérer Accueil comme actif
    if (path === '/home' && this.isClientUser() && this.currentPath === '/service-search') {
      return true;
    }
    return this.currentPath === path;
  }

  getIcon(item: any): string {
    // Affiche l'icône active si l'item est survolé OU si la route est active
    if ((this.hoveredItem === item || this.isActive(item.path)) && item.iconActive) {
      return item.iconActive;
    }
    return item.icon;
  }

  /**
   * Gère le clic sur un élément du menu (dont le logout)
   */
  onMenuItemClick(item: any): void {
    if (item.action === 'logout') {
      this.logout();
    } else {
      this.closeMobileMenu();
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.clear();
    this.closeMobileMenu();
    this.router.navigate(['/home']);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}
