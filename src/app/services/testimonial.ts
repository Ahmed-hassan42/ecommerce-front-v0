import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Auth } from './auth';
import { ITestimonial } from '../models/testimonial.model';

@Service()
export class TestimonialService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiURL = 'http://localhost:3000/testimonials';

  getTestimonials(): Observable<ITestimonial[]> {
    return this.http
      .get<{ data: ITestimonial[] }>(this.apiURL)
      .pipe(map(res => res.data));
  }

  addTestimonial(message: string, rating: number): Observable<any> {
    return this.http.post<any>(
      this.apiURL,
      { message, rating },
      { headers: { Authorization: `Bearer ${this.auth.getToken() ?? ''}` } }
    );
  }
}
