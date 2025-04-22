import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FaqComponent implements OnInit {
  faqs: FAQItem[] = [
    {
      question: 'What is included in the safari packages?',
      answer: 'Our safari packages typically include accommodation, transportation, park entrance fees, game drives, and meals as specified in each package. Some packages may also include airport transfers, flights, and additional activities.',
      isOpen: false
    },
    {
      question: 'How far in advance should I book my safari?',
      answer: 'We recommend booking at least 6-12 months in advance, especially for peak seasons (July-October). This ensures availability at the best lodges and camps. However, we can sometimes accommodate last-minute bookings depending on availability.',
      isOpen: false
    },
    {
      question: 'What is the best time of year to go on safari?',
      answer: 'The best time depends on what you want to see. The dry season (June-October) is ideal for wildlife viewing as animals gather around water sources. The wet season (November-May) offers lush landscapes, fewer tourists, and lower prices, but some roads may be challenging.',
      isOpen: false
    },
    {
      question: 'What should I pack for my safari?',
      answer: 'Essential items include lightweight, neutral-colored clothing, a wide-brimmed hat, sunscreen, insect repellent, binoculars, a camera with extra batteries, and comfortable walking shoes. We provide a detailed packing list upon booking.',
      isOpen: false
    },
    {
      question: 'Do I need vaccinations to travel to Africa?',
      answer: 'Yes, some vaccinations are recommended or required. Yellow fever vaccination is often required, especially when traveling between African countries. Other recommended vaccinations include hepatitis A and B, typhoid, and tetanus. We recommend consulting with a travel medicine specialist.',
      isOpen: false
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Our standard cancellation policy provides a full refund (minus processing fees) for cancellations made 90 days or more before departure. Cancellations 60-89 days before departure receive a 70% refund, 30-59 days receive a 50% refund, and less than 30 days receive no refund. We strongly recommend purchasing comprehensive travel insurance.',
      isOpen: false
    },
    {
      question: 'Can I customize my safari itinerary?',
      answer: 'Absolutely! We specialize in creating customized safari experiences tailored to your preferences, budget, and timeframe. Our travel experts will work with you to design the perfect itinerary that matches your interests and requirements.',
      isOpen: false
    },
    {
      question: 'Is it safe to travel in Africa?',
      answer: 'The tourist areas of Africa are generally safe for travelers. We prioritize your safety and only operate in stable regions with established tourism infrastructure. Our guides are trained in safety protocols, and we maintain constant communication with our teams on the ground.',
      isOpen: false
    }
  ];

  ngOnInit(): void {
    // Initialize AOS if available
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    }
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
} 