
import { Service } from '@angular/core';
import { IProduct } from '../models/product.model';
import { ICartItem } from '../models/cart-item.model';

@Service()
export class Cartservice {
  cart: ICartItem[] = [];

  addToCart(product: IProduct): void {
    const item = this.cart.find(
      item => item.product._id === product._id
    );

    if (item) {
      item.quantity++;
    } else {
      this.cart.push({
        product: product,
        quantity: 1
      });
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(
      item => item.product._id !== productId
    );
  }

  getTotal(): number {
    return this.cart.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    );
  }

  getItemCount(): number {
    return this.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  clearCart(): void {
    this.cart = [];
  }
}
