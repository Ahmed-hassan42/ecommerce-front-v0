
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  deletedProducts: number;
  totalOrders: number;
  totalUsers: number;
}

@Service()
export class DashboardService {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private apiUrl = 'http://localhost:3000/dashboard';

getStats(): Observable<DashboardStats> {
  const token = this.auth.getToken();

  return this.http.get<DashboardStats>(this.apiUrl, {
    headers: {
      Authorization: `Bearer ${token ?? ''}`
    }
  });
}
}
