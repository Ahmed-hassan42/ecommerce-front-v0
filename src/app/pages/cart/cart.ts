import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cartservice } from '../../services/cart';
import { OrderService } from '../../services/order';
import { Auth } from '../../services/auth';

@Component({
  imports: [FormsModule],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  _myCart = inject(Cartservice);
  private orderService = inject(OrderService);
  private auth = inject(Auth);
  private router = inject(Router);

  adress = '';

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  checkout(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this._myCart.cart.length === 0) {
      return;
    }

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.adress.trim()) {
      this.errorMessage.set('Please enter your delivery address.');
      return;
    }

    this.loading.set(true);

    this.orderService.placeOrder(this._myCart.cart, this.adress).subscribe({
      next: () => {
        this._myCart.clearCart();
        this.adress = '';
        this.successMessage.set('Your order was placed successfully!');
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);

        if (error.status === 401) {
          this.errorMessage.set('Your session expired. Please log in again.');
        } else if (error.status === 403) {
          this.errorMessage.set('Only customer accounts can place orders.');
        } else {
          this.errorMessage.set(error.error?.msg ?? 'Could not place the order.');
        }
      }
    });
  }
}
