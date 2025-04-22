import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  newsletterForm: FormGroup;
  submitted = false;
  loading = false;
  success = false;
  successMessage = 'Thank you for subscribing to our newsletter!';
  error = '';
  errorMessage = '';
  
  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      consent: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Initialize AOS if available
    this.initializeAOS();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Getter for easy access to form fields in template
  get f() { return this.newsletterForm.controls; }

  private initializeAOS(): void {
    // Check if AOS is available
    if (typeof window !== 'undefined' && 'AOS' in window) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
      }, 0);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.newsletterForm.valid) {
      this.loading = true;
      this.error = '';
      this.errorMessage = '';

      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        this.success = true;
        this.newsletterForm.reset();
        this.submitted = false;
      }, 1000);
    }
  }

  resetForm(): void {
    this.success = false;
    this.error = '';
    this.errorMessage = '';
  }
} 