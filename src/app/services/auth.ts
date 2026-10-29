import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class Auth {
  private apiURL = 'http://localhost:3000/user';
  private http = inject(HttpClient);

  // signal so the navbar updates automatically on login / logout
  private token = signal<string | null>(this.getToken());

  isLoggedIn = computed(() => !!this.token());
  isAdmin = computed(() => this.getRole() === 'admin');

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/login`, {
      email,
      password
    });
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/register`, { name, email, password });
  }

  saveToken(token: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('token', token);
    }
    this.token.set(token);
  }

  getToken(): string | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    return sessionStorage.getItem('token');
  }

  logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('token');
    }
    this.token.set(null);
  }

  // reads the role out of the JWT payload (the backend puts { _id, role, name } in it)
  private getRole(): string | null {
    const token = this.token();
    if (!token) return null;

    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload)).role ?? null;
    } catch {
      return null;
    }
  }
}
