import { Component, Input } from '@angular/core';
import { DisplayProfileHeaderComponent } from "../display-profile/utils/display-profile-header/display-profile-header.component";
import { DisplayProfileServicesComponent } from './utils/display-profile-services/display-profile-services.component';
import { User } from '../../../services/interfaces/interfaceUser';
import { Service } from '../../../services/interfaces/interfaceService';
import { UserRole } from '../../../services/interfaces/interfaceUser';

@Component({
  selector: 'app-display-profile',
  standalone: true,
  imports: [DisplayProfileHeaderComponent, DisplayProfileServicesComponent],
  templateUrl: './display-profile.component.html',
  styleUrl: './display-profile.component.scss'
})
export class DisplayProfileComponent {
  @Input() user!: User;
  @Input() services!: Service[];
  @Input() userRole!: UserRole;
}
