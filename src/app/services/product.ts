import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProduct } from '../models/product.model';
import { Auth } from './auth';

@service({ providedIn: 'root' })
export class Product {
  products: IProduct[] = [];

  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiURL = 'http://localhost:3000/products';

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiURL);
  }

  // backend answers { message, data: product }
  getProductById(id: string): Observable<IProduct> {
    return this.http
      .get<{ data: IProduct }>(`${this.apiURL}/${id}`)
      .pipe(map(res => res.data));
  }

  addProduct(product: Partial<IProduct>, image: File) {
    const formData = new FormData();
    formData.append('name', product.name ?? '');
    formData.append('price', String(product.price ?? 0));
    formData.append('slug', product.slug ?? '');
    formData.append('category', product.category ?? '');
    formData.append('subCategory', product.subCategory ?? '');
    formData.append('isActive', String(product.isActive ?? true));
    formData.append('isDeleted', String(product.isDeleted ?? false));
    formData.append('img', image);

    return this.http.post(this.apiURL, formData, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken() ?? ''}`
      }
    });
  }

  updateProduct(id: string, product: Partial<IProduct>) {
    return this.http.put<IProduct>(`${this.apiURL}/${id}`, product, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken() ?? ''}`
      }
    });
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.apiURL}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken() ?? ''}`
      }
    });
  }
}
function service(arg0: { providedIn: string; }): (target: typeof Product) => void | typeof Product {
  throw new Error('Function not implemented.');
}

