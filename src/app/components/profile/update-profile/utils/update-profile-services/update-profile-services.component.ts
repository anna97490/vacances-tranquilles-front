import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Service, ServiceCategory } from '../../../../../models/Service';
import { UserInformationService } from '../../../../../services/user-information/user-information.service';

/**
 * Composant de modification des services proposés dans le profil utilisateur.
 * Permet d'éditer, ajouter et supprimer des services avec une interface utilisateur moderne.
 *
 * @example
 * <app-update-profile-services [services]="userServices" (servicesChange)="onServicesUpdate($event)"></app-update-profile-services>
 */
@Component({
  selector: 'app-update-profile-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './update-profile-services.component.html',
  styleUrl: './update-profile-services.component.scss'
})
export class UpdateProfileServicesComponent {
  @Input() services: Service[] = [];
  @Output() servicesChange = new EventEmitter<Service[]>();

  editingService: Service | null = null;
  isAddingNew = false;
  serviceForm: FormGroup;

  // Utilisation de l'enum ServiceCategory pour les catégories disponibles
  categories = Object.values(ServiceCategory);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userInformationService: UserInformationService
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0), Validators.max(10000)]]
    });
  }

  /**
   * Démarre l'édition d'un service existant
   * @param service - Le service à éditer
   */
  editService(service: Service): void {
    this.editingService = { ...service };
    this.serviceForm.patchValue({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price
    });
  }

  /**
   * Démarre l'ajout d'un nouveau service
   */
  addNewService(): void {
    this.isAddingNew = true;
    this.editingService = null;
    this.serviceForm.reset({
      price: 0
    });
  }

  /**
   * Annule l'édition ou l'ajout en cours
   */
  cancelEdit(): void {
    this.editingService = null;
    this.isAddingNew = false;
    this.serviceForm.reset({
      price: 0
    });
  }

  /**
   * Sauvegarde les modifications d'un service
   */
  saveService(): void {
    if (this.serviceForm.valid) {
      const formValue = this.serviceForm.value;
      
      if (this.isAddingNew) {
        // Ajouter un nouveau service
        const newService: Service = {
          id: 0, // L'ID sera généré par le backend
          providerId: 0, // Sera défini par le service backend
          ...formValue
        };
        
        this.userInformationService.createService(newService).subscribe({
          next: (createdService: Service) => {
            this.services = [...this.services, createdService];
            this.servicesChange.emit(this.services);
            this.snackBar.open('Service ajouté avec succès', 'Fermer', { duration: 3000 });
            this.cancelEdit();
          },
          error: (error: any) => {
            console.error('Erreur lors de la création du service:', error);
            this.snackBar.open('Erreur lors de l\'ajout du service', 'Fermer', { duration: 3000 });
          }
        });
      } else if (this.editingService) {
        // Modifier un service existant
        const updatedService: Service = {
          ...this.editingService,
          ...formValue
        };
        
        this.userInformationService.updateService(this.editingService.id, updatedService).subscribe({
          next: (savedService: Service) => {
            this.services = this.services.map(service => 
              service.id === this.editingService!.id ? savedService : service
            );
            this.servicesChange.emit(this.services);
            this.snackBar.open('Service modifié avec succès', 'Fermer', { duration: 3000 });
            this.cancelEdit();
          },
          error: (error: any) => {
            console.error('Erreur lors de la modification du service:', error);
            this.snackBar.open('Erreur lors de la modification du service', 'Fermer', { duration: 3000 });
          }
        });
      }
    } else {
      this.snackBar.open('Veuillez corriger les erreurs dans le formulaire', 'Fermer', { duration: 3000 });
    }
  }

  /**
   * Supprime un service de la liste
   * @param serviceId - L'ID du service à supprimer
   */
  deleteService(serviceId: number): void {
    this.userInformationService.deleteService(serviceId).subscribe({
      next: () => {
        this.services = this.services.filter(service => service.id !== serviceId);
        this.servicesChange.emit(this.services);
        this.snackBar.open('Service supprimé avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression du service:', error);
        this.snackBar.open('Erreur lors de la suppression du service', 'Fermer', { duration: 3000 });
      }
    });
  }

  /**
   * Vérifie si un champ du formulaire est invalide
   * @param fieldName - Le nom du champ à vérifier
   * @returns true si le champ est invalide et touché
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Obtient le message d'erreur pour un champ donné
   * @param fieldName - Le nom du champ
   * @returns Le message d'erreur approprié
   */
  getErrorMessage(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Ce champ est requis';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
    if (field.errors['min']) return `La valeur minimum est ${field.errors['min'].min}`;
    if (field.errors['max']) return `La valeur maximum est ${field.errors['max'].max}`;
    if (field.errors['pattern']) return 'Format d\'URL invalide';

    return 'Champ invalide';
  }
}
