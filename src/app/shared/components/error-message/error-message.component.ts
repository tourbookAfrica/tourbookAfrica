import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-message">
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <div class="error-content">
        <h3>Error</h3>
        <p>{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .error-message {
      display: flex;
      align-items: center;
      background-color: #ffebee;
      border-left: 4px solid #f44336;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
    
    .error-icon {
      color: #f44336;
      font-size: 1.5rem;
      margin-right: 1rem;
    }
    
    .error-content {
      h3 {
        margin: 0 0 0.5rem;
        color: #d32f2f;
        font-size: 1rem;
      }
      
      p {
        margin: 0;
        color: #333;
      }
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message = 'An error occurred. Please try again later.';
} 