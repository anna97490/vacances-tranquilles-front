import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatListModule, MatSidenavModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  mainLogo = 'assets/pictures/logo.png';
  hoveredItem: any = null;
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
      path: '/profil'
    },
    {
      label: 'Messagerie',
      icon: 'assets/icons/chat_bubble_24dp_FFFFFF.svg',
      iconActive: 'assets/icons/chat_bubble_24dp_FFA101.svg',
      path: '/messagerie'
    },
    {
      label: 'Agenda',
      icon: 'assets/icons/calendar_month_24dp_FFFFF.svg',
      iconActive: 'assets/icons/calendar_FFA101.svg',
      path: '/agenda'
    },
    {
      label: 'Assistance',
      icon: 'assets/icons/contact_support_24dp_FFFFF.svg',
      iconActive: 'assets/icons/contact_support_24dp_FFA101.svg',
      path: '/assistance'
    }
  ];

  currentPath: string = '';
  menuOpen:boolean = false;

  constructor(private router: Router, public location: Location) {}

  ngOnInit(): void {
    this.currentPath = this.location.path() || '/home';
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentPath = this.location.path() || '/home';
    });
  }

  toggleMenu() { 
    console.log('Menu toggled');
    this.menuOpen = !this.menuOpen; 
  }

  closeMenu() { 
    console.log('Menu closed');
    this.menuOpen = false; 
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  getIcon(item: any): string {
    // Affiche l'icône active si l'item est survolé OU si la route est active
    if ((this.hoveredItem === item || this.isActive(item.path)) && item.iconActive) {
      return item.iconActive;
    }
    return item.icon;
  }
}