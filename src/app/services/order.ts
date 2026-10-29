import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from './auth';
import { ICartItem } from '../models/cart-item.model';

@Service()
export class OrderService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiURL = 'http://localhost:3000/order';

  // backend expects: { items: [{ productId, quantity }, ...], adress }
  placeOrder(items: ICartItem[], adress: string): Observable<any> {
    const body = {
      items: items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })),
      adress
    };

    return this.http.post<any>(this.apiURL, body, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken() ?? ''}`
      }
    });
  }
}
