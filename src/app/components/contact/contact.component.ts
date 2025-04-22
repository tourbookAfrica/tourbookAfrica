import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AosConfig } from '../../../types/aos';

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  formSubmitted = false;
  formError = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();
  
  faqs: FAQ[] = [
    {
      question: 'How far in advance should I book my safari?',
      answer: 'We recommend booking your safari at least 6-12 months in advance, especially if you plan to travel during peak season (June-October). This ensures availability at the best lodges and camps. However, we can sometimes accommodate last-minute bookings depending on availability.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards (Visa, MasterCard, American Express), bank transfers, and PayPal. A 30% deposit is required to confirm your booking, with the balance due 60 days before your trip start date.'
    },
    {
      question: 'Do I need a visa to visit Kenya or Tanzania?',
      answer: 'Most visitors to Kenya and Tanzania require a visa. Many nationalities can obtain an e-visa online before travel or a visa on arrival. We provide detailed visa information specific to your nationality during the booking process.'
    },
    {
      question: 'What vaccinations do I need for East Africa?',
      answer: 'Yellow fever vaccination is often required, especially when traveling between African countries. Other recommended vaccinations include hepatitis A and B, typhoid, and tetanus. We recommend consulting with a travel medicine specialist before your trip.'
    },
    {
      question: 'Is it safe to travel in East Africa?',
      answer: 'The tourist areas of East Africa are generally safe for travelers. We prioritize your safety and only operate in stable regions with established tourism infrastructure. Our guides are trained in safety protocols, and we maintain constant communication with our teams on the ground.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Our standard cancellation policy provides a full refund (minus processing fees) for cancellations made 90 days or more before departure. Cancellations 60-89 days before departure receive a 70% refund, 30-59 days receive a 50% refund, and less than 30 days receive no refund. We strongly recommend purchasing comprehensive travel insurance.'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initAOS();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initAOS(): void {
    // Initialize AOS with proper type checking
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    }
  }

  initForm(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      privacy: [false, Validators.requiredTrue]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.contactForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.formError = false;
    this.errorMessage = '';

    // Stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API call with error handling
    setTimeout(() => {
      try {
        // Handle form submission logic here (would normally be a service call)
        console.log('Form submitted:', this.contactForm.value);
        
        // Simulate random success/failure for demonstration
        const success = Math.random() > 0.2; // 80% success rate
        
        if (success) {
          this.loading = false;
          this.formSubmitted = true;
          this.submitted = false;
          this.contactForm.reset();
          
          // Reset checkbox validation state
          this.contactForm.controls['privacy'].setValue(false);
          
          // Scroll to the success message
          this.scrollToElement('.alert-success');
        } else {
          throw new Error('Failed to submit form. Please try again later.');
        }
      } catch (error) {
        this.loading = false;
        this.formError = true;
        this.errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        
        // Scroll to the error message
        this.scrollToElement('.alert-danger');
      }
    }, 1500);
  }

  private scrollToElement(selector: string): void {
    const element = this.elementRef.nativeElement.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  refreshAOS(): void {
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.refresh();
    }
  }
} 