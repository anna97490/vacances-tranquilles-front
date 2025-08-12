import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FAQUnifiedService } from '../../services/faq/faq-unified.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { FAQItemWithState, FAQItemFactory } from '../../models/FAQ';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    FooterComponent,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule
  ],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FAQComponent implements OnInit, OnDestroy {
  faqItems: FAQItemWithState[] = [];
  filteredFAQItems: FAQItemWithState[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';

  constructor(
    private readonly router: Router,
    private readonly faqUnifiedService: FAQUnifiedService
  ) {}

  ngOnInit(): void {
    this.loadFAQ();
    this.extractCategories();
  }

  ngOnDestroy(): void {
    // Cleanup si nécessaire
  }

  loadFAQ(): void {
    const unifiedFAQ = this.faqUnifiedService.getAllFAQ();
    this.faqItems = unifiedFAQ.map(item => FAQItemFactory.createFAQItemWithState(item));
    this.filteredFAQItems = [...this.faqItems];
  }

  extractCategories(): void {
    const categories = new Set(this.faqItems.map(item => item.categorie));
    this.categories = ['all', ...Array.from(categories)];
  }

  filterByCategory(event: any): void {
    this.selectedCategory = event.value || event;
    this.applyFilters();
  }

  searchFAQ(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.faqItems];

    // Filtrage par catégorie
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.categorie === this.selectedCategory);
    }

    // Filtrage par recherche
    if (this.searchQuery.trim()) {
      const searchTerm = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(searchTerm) || 
        item.reponse.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredFAQItems = filtered;
  }

  resetFilters(): void {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.filteredFAQItems = [...this.faqItems];
  }

  goToContactForm(): void {
    this.router.navigate(['/contact']);
  }

  trackByFn(index: number, item: FAQItemWithState): number {
    return item.question.length;
  }
}
