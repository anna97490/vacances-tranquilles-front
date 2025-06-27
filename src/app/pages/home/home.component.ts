import { Component, HostBinding } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  logoPath = 'assets/pictures/logo.png';

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.height') height = '100%';
}
