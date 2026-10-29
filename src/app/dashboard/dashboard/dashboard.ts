import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../models/product.model';
import { Product } from '../../services/product';
import { DashboardService, DashboardStats } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private productService = inject(Product);
  private dashboardService = inject(DashboardService);

  products: IProduct[] = [];
  stats: DashboardStats | null = null;
  errorMessage = '';
  successMessage = '';
  loading = true;

ngOnInit(): void {
  this.loadDashboard();
}

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Failed to load dashboard stats:', error);
        this.errorMessage = error.status === 401
          ? 'Please log in to access the dashboard.'
          : error.status === 403
            ? 'Your account must have the admin role.'
            : 'Could not load dashboard statistics.';
      }
    });

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load dashboard products:', error);
        this.errorMessage ||= 'Could not load products.';
        this.loading = false;
      }
    });
  }

  deleteProduct(product: IProduct): void {
    const confirmed = confirm(`Soft-delete "${product.name}"? It will be hidden from the store but remain in the database.`);
    if (!confirmed) return;

    this.productService.deleteProduct(String(product._id)).subscribe({
      next: () => {
        this.products = this.products.filter(item => item._id !== product._id);
        if (this.stats) {
          this.stats = {
            ...this.stats,
            totalProducts: Math.max(0, this.stats.totalProducts - 1),
            activeProducts: product.isActive
              ? Math.max(0, this.stats.activeProducts - 1)
              : this.stats.activeProducts,
            deletedProducts: this.stats.deletedProducts + 1
          };
        }
        this.successMessage = `"${product.name}" was soft-deleted.`;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Failed to soft-delete product:', error);
        this.errorMessage = error.status === 401
          ? 'Please log in again.'
          : error.status === 403
            ? 'Only an admin can delete products.'
            : error.error?.message ?? 'Could not delete this product.';
      }
    });
  }
}
