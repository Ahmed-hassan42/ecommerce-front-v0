import { Routes } from '@angular/router';
import { Home } from './pages/home/home'; 
import { Products } from './pages/products/products'; 
import { Login } from './pages/login/login'; 
import { ProductDetails } from './pages/product-details/product-details';
import { Cart } from './pages/cart/cart';
import { Registration } from './pages/registration/registration';
import { ProductForm } from './pages/product-form/product-form';
import { Testimonials } from './pages/testimonials/testimonials';
import { Dashboard } from './dashboard/dashboard/dashboard';
export const routes: Routes = [
    {path:'', component:Home},
    {path:'products', component: Products},
    {path:'login', component:Login},
    {path:'products/:id', component:ProductDetails},
    {path:'cart', component:Cart},
    {path:'registration', component:Registration},
    {path:'productform', component:ProductForm},
    {path:'testimonials', component:Testimonials},



    {
  path: 'dashboard',
  component: Dashboard
    },
    
    {path:'**', redirectTo:''}
];
