import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  currentTitle: string = 'Vacances Tranquilles';
  private routerSubscription: Subscription | undefined;
  
  constructor(
    public location: Location,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // S'abonner aux événements de navigation
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Mettre à jour le titre à chaque changement de route
      this.currentTitle = this.getPageTitle(this.location.path());
    });
    
    // Initialiser le titre au chargement
    this.currentTitle = this.getPageTitle(this.location.path());
  }
  
  ngOnDestroy(): void {
    // Désabonnement pour éviter les fuites de mémoire
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  goBack(): void {
    this.location.back();
  }
  
  getPageTitle(path: string): string {
    if (path.includes('/home')) {
      return 'Accueil';
    } else if (path.includes('/auth/login')) {
      return 'Connexion';
    } else if (path.includes('/auth/register')) {
      return 'Inscription';
    } else if (path.includes('/cgu')) {
      return 'CGU';
    } else if (path.includes('/cgv')) {
      return 'CGV';
    } else {
      return 'Vacances Tranquilles';
    }
  }
}