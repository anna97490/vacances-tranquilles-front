import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss'],
  standalone: true,
  imports: [MatIconModule, NgForOf],
})
export class RatingStarsComponent {
  @Input() rating: number = 3;
  @Input() reviewsCount: number = 0;

  stars = [0, 1, 2, 3, 4];
  
  getStarIcon(index: number): string {
  if (index < Math.floor(this.rating)) {
    return 'star';
  } else if (index < this.rating) {
    return 'star_half';
  } else {
    return 'star_border';
  }
}
}
