import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { HomeContent } from './../../models/Home';
import { HomeContentService } from './../../services/home-content/home-content.service';
import { HomeInitializationService } from './../../services/home/home-initilization.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ServiceSearchComponent } from '../service-search/service-search.component';
import { AuthStorageService } from '../../services/login/auth-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ServiceSearchComponent],
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
  isAuthenticated = false;

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.height') height = '100%';

  constructor(
    private readonly homeContentService: HomeContentService,
    private readonly homeInitializationService: HomeInitializationService,
    private readonly authStorage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authStorage.isAuthenticated();
    this.initializeContent();
    this.initializeServices();
  }

  ngOnDestroy(): void {
    this.homeInitializationService.cleanup();
  }

  private initializeContent(): void {
    this.content = this.homeContentService.getContent();
  }

  private initializeServices(): void {
    setTimeout(() => {
      this.homeInitializationService.initializeHomeServices();
    }, 2000);
  }
}
