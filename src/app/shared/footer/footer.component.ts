import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: 'bi bi-facebook' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'bi bi-twitter' },
    { name: 'Instagram', url: 'https://instagram.com', icon: 'bi bi-instagram' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'bi bi-linkedin' }
  ];
  
  quickLinks = [
    { name: 'About Us', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms & Conditions', url: '/terms' }
  ];
}
