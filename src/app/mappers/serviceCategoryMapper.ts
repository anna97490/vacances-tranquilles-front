import { ServiceCategory } from '../models/Service';

export const ServiceCategoryLabels: Record<keyof typeof ServiceCategory, string> = {
  HOME: ServiceCategory.HOME,
  OUTDOOR: ServiceCategory.OUTDOOR,
  REPAIRS: ServiceCategory.REPAIRS,
  SHOPPING: ServiceCategory.SHOPPING,
  ANIMALS: ServiceCategory.ANIMALS
};

export function getServiceCategoryKey(label: string): keyof typeof ServiceCategory | undefined {
  return Object.entries(ServiceCategoryLabels)
    .find(([_, value]) => value === label)?.[0] as keyof typeof ServiceCategory;
}
