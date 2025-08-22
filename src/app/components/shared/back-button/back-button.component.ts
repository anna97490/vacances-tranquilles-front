import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {
  @Input() ariaLabel: string = 'Retour à la page précédente';
  @Input() title: string = 'Retour à la page précédente';
  @Output() backClick = new EventEmitter<void>();

  onBackClick(): void {
    this.backClick.emit();
  }
}
