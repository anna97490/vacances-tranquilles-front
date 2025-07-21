import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/User';
import { Service } from '../../../models/Service';
import { UserRole } from '../../../models/User';
import { UpdateProfileHeaderComponent } from './utils/update-profile-header/update-profile-header.component';
import { UpdateProfileServicesComponent } from './utils/update-profile-services/update-profile-services.component';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [UpdateProfileHeaderComponent, UpdateProfileServicesComponent],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent {
  @Input() user!: User;
  @Input() services!: Service[];
  @Input() userRole!: UserRole;
  @Output() profileDataChange = new EventEmitter<{ user?: User; services?: Service[] }>();

  onUserChange(newUser: User) {
    this.profileDataChange.emit({ user: newUser });
  }
  onServicesChange(newServices: Service[]) {
    this.profileDataChange.emit({ services: newServices });
  }
}
