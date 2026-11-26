import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsService } from './products.service';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  selectedCategory = signal<string>('');
  
  categories = [
    'electronics', 
    'jewelery', 
    "men's clothing", 
    "women's clothing"
  ];

  constructor(public service: ProductsService) {}

  ngOnInit(): void {
    this.service.list().subscribe();
  }

  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const list = this.service.productsSignal();
    if (!category) {
      return list;
    }
    return list.filter(p => p.category === category);
  });

  trackById(index: number, item: any): number {
    return item.id;
  }
}