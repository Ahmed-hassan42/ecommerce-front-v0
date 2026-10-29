
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../../services/product';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm {
  private productService = inject(Product);

  product = {
    name: '',
    price: 0,
    slug: '',
    category: '',
    subCategory: '',
    isActive: true,
    isDeleted: false
  };

  selectedImage: File | null = null;
  errorMessage = '';
  successMessage = '';

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
  }

  submitForm(form: NgForm, imgInput: HTMLInputElement): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid || !this.selectedImage) {
      if (!this.selectedImage) {
        this.errorMessage = 'Please select a product image.';
      }
      return;
    }

    this.productService
      .addProduct(this.product, this.selectedImage)
      .subscribe({
        next: () => {
          this.successMessage = 'Product added successfully!';
          form.resetForm({ name: '', price: 0, slug: '', category: '', subCategory: '' });
          imgInput.value = '';
          this.selectedImage = null;
        },
        error: (error) => {
          console.error('Failed to add product:', error);

          if (error.status === 401) {
            this.errorMessage = 'Please log in first.';
          } else if (error.status === 403) {
            this.errorMessage = 'Your account must have the admin role.';
          } else {
            this.errorMessage =
              error.error?.message ?? 'Failed to add product.';
          }
        }
      });
  }
}
