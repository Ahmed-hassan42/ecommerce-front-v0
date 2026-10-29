import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { Cartservice } from '../../services/cart';
import { Product } from '../../services/product';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products implements OnInit {


  //constructor(public _cartService: Cart) {}
  private _cartService = inject(Cartservice);
  private _productService = inject(Product);
  private cdr = inject(ChangeDetectorRef);

  products: IProduct[] = [];

    ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this._productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.cdr.detectChanges(); 

      },
      error: (error) => {
        console.error('Failed to load products:', error);
      }
    });
  }

  addToCart(product: IProduct): void {
    this._cartService.addToCart(product);
    
  }






searchText: string = '';
selectedCategory: string = 'all';
sortOrder: string = 'default';

get filteredProducts(): IProduct[] {
  let result = this.products;

  // Search by product name
  if (this.searchText.trim() !== '') {
    result = result.filter(product =>
      product.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase().trim())
    );
  }

  // Filter by category
  if (this.selectedCategory !== 'all') {
    result = result.filter(
      product => product.category === this.selectedCategory
    );
  }

  // Sort by price
  if (this.sortOrder === 'low-to-high') {
    result = [...result].sort(
      (a, b) => a.price - b.price
    );
  } else if (this.sortOrder === 'high-to-low') {
    result = [...result].sort(
      (a, b) => b.price - a.price
    );
  }

  return result;
}




}