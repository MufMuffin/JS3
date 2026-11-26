import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsService, Product } from './products.service';

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');
  isEditing = signal<boolean>(false);

  editForm: FormGroup;
  private productId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProductsService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      const localProduct = this.service.productsSignal().find(p => p.id === this.productId);

      if (localProduct) {
        this.product.set(localProduct);
      } else {
        this.loading.set(true);
        this.service.get(this.productId).subscribe({
          next: data => {
            this.product.set(data);
            this.loading.set(false);
          },
          error: () => {
            this.error.set('Не вдалося завантажити дані про товар');
            this.loading.set(false);
          }
        });
      }
    }
  }

  startEdit(): void {
    const current = this.product();
    if (current) {
      this.editForm.patchValue({
        title: current.title || current.name,
        price: current.price,
        category: current.category
      });
      this.isEditing.set(true);
    }
  }

  onSaveEdit(): void {
    if (this.editForm.valid && this.productId) {
      const updatedData = this.editForm.value;
      this.service.update(this.productId, updatedData).subscribe({
        next: () => {
          this.product.set({ ...this.product()!, ...updatedData, title: updatedData.title });
          this.isEditing.set(false);
          alert('Зміни успішно збережено!');
        },
        error: () => alert('Помилка при збереженні')
      });
    }
  }

  onDelete(): void {
    if (confirm('Ви дійсно бажаєте видалити цей товар?') && this.productId) {
      this.service.delete(this.productId).subscribe({
        next: () => {
          alert('Товар видалено!');
          this.router.navigate(['/products']);
        },
        error: () => alert('Помилка при видаленні')
      });
    }
  }
}