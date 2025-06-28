import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
        CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  rating = 4;
  feedback = '';
  showHelperText = true;

  setRating(note: number) {
    this.rating = note;
  }

  clearHelper() {
    this.showHelperText = false;
  }

  onSubmit() {
    const avis = {
      note: this.rating,
      commentaire: this.feedback
    };
    console.log('Avis envoyé :', avis);
  }
}
