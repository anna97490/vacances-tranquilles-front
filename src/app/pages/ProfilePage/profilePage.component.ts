import { Component } from '@angular/core';
import { DisplayProfileComponent } from '../../components/profile/display-profile/display-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DisplayProfileComponent],
  templateUrl: './profilePage.component.html',
  styleUrl: './profilePage.component.scss'
})
export class ProfilePageComponent {
  
}
