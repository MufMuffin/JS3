import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from './products.service';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private service: ProductsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.service.create(this.form.value).subscribe({
        next: () => {
          alert('Товар успішно додано!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error(err);
          alert('Помилка при додаванні');
        }
      });
    }
  }
}