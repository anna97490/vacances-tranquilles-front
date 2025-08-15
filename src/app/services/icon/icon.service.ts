import { Injectable } from '@angular/core';
import { ServiceCategory } from '../../models/Service';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private readonly categoryIcons: Record<ServiceCategory, string> = {
    [ServiceCategory.HOME]: 'home',
    [ServiceCategory.OUTDOOR]: 'park',
    [ServiceCategory.REPAIRS]: 'construction',
    [ServiceCategory.SHOPPING]: 'shopping_cart',
    [ServiceCategory.ANIMALS]: 'pets'
  };

  /**
   * Obtient l'icône correspondante à une catégorie de service
   * @param category - La catégorie de service
   * @returns Le nom de l'icône Material Design
   */
  getIcon(category: ServiceCategory): string {
    return this.categoryIcons[category] || 'miscellaneous_services';
  }

  /**
   * Obtient toutes les catégories disponibles
   * @returns Un tableau des valeurs de l'enum ServiceCategory
   */
  getAvailableCategories(): ServiceCategory[] {
    return Object.values(ServiceCategory);
  }
}