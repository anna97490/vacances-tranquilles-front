import { Component, HostBinding, OnInit } from '@angular/core';
import { HomeContentService, HomeContent } from './../../services/home-content.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  content!: HomeContent;

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.height') height = '100%';

  constructor(private homeContentService: HomeContentService) {}

  ngOnInit(): void {
    this.content = this.homeContentService.getContent();
  }
}
