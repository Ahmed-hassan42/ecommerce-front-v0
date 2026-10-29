import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ITestimonial } from '../../models/testimonial.model';
import { TestimonialService } from '../../services/testimonial';
import { Auth } from '../../services/auth';

@Component({
  imports: [FormsModule, RouterLink, DatePipe],
  selector: 'app-testimonials',
  styleUrl: './testimonials.css',
  templateUrl: './testimonials.html',
})
export class Testimonials implements OnInit {
  private testimonialService = inject(TestimonialService);
  auth = inject(Auth);

  testimonials = signal<ITestimonial[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  message = '';
  rating = 5;

  ngOnInit(): void {
    this.loadTestimonials();
  }

  loadTestimonials(): void {
    this.testimonialService.getTestimonials().subscribe({
      next: (data) => {
        this.testimonials.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load testimonials.');
        this.loading.set(false);
      }
    });
  }

  stars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  submit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.testimonialService.addTestimonial(this.message, this.rating).subscribe({
      next: () => {
        this.successMessage.set('Thank you for your feedback!');
        this.message = '';
        this.rating = 5;
        this.loadTestimonials();
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage.set('Your session expired. Please log in again.');
        } else {
          this.errorMessage.set(error.error?.message ?? 'Could not add your testimonial.');
        }
      }
    });
  }
}
