import { Component } from '@angular/core';
import { DisplayProfileHeaderComponent } from "../display-profile/utils/display-profile-header/display-profile-header.component";
import { DisplayProfileServicesComponent } from './utils/display-profile-services/display-profile-services.component';
import { MOCK_USER } from '../mock-user';

@Component({
  selector: 'app-display-profile',
  standalone: true,
  imports: [DisplayProfileHeaderComponent, DisplayProfileServicesComponent],
  templateUrl: './display-profile.component.html',
  styleUrl: './display-profile.component.scss'
})
export class DisplayProfileComponent {
  user = MOCK_USER;
}
