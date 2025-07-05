import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private renderer: Renderer2) {}

  title = 'frontend';

   // Fonction pour ajuster dynamiquement la hauteur des champs
   adjustTextFieldHeight() {
    const textFields = document.querySelectorAll('.mdc-text-field--filled');
    textFields.forEach((textField) => {
      this.renderer.setStyle(textField, 'height', '36px');
      this.renderer.setStyle(textField, 'font-size', '14px');
      this.renderer.setStyle(textField, 'padding', '0 8px');
    });
  }

//  Fonction pour supprimer les classes mat-mdc-text-field-wrapper et mat-mdc-text-field--field
  removeClasses() {
    const textFields = document.querySelectorAll('.mat-mdc-text-field-wrapper, .mat-mdc-text-field--field');
    textFields.forEach((textField) => {
      textField.classList.remove('mat-mdc-text-field-wrapper', 'mat-mdc-text-field--field');
    });
  }

  // Appel de la fonction pour supprimer les classes lors de l'initialisation du composant
  ngOnInit() {
    this.removeClasses();
    this.adjustTextFieldHeight();
  }
}
