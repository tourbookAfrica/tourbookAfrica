import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-container">
      <div class="profile-sidebar">
        <div class="profile-header">
          <div class="profile-avatar">
            <img [src]="user?.profileImage || 'assets/images/default-avatar.png'" alt="Profile">
          </div>
          <h2>{{ user?.firstName }} {{ user?.lastName }}</h2>
          <p>{{ user?.email }}</p>
        </div>
        <nav class="profile-nav">
          <a routerLink="bookings" routerLinkActive="active">My Bookings</a>
          <a routerLink="reviews" routerLinkActive="active">My Reviews</a>
          <a routerLink="settings" routerLinkActive="active">Settings</a>
        </nav>
      </div>
      <div class="profile-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-sidebar {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 2rem;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 2rem;

      .profile-avatar {
        width: 120px;
        height: 120px;
        margin: 0 auto 1rem;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #f0f0f0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      h2 {
        margin: 0;
        color: #333;
        font-size: 1.5rem;
      }

      p {
        color: #666;
        margin: 0.5rem 0 0;
      }
    }

    .profile-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      a {
        padding: 0.75rem 1rem;
        text-decoration: none;
        color: #333;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background: #f5f5f5;
        }

        &.active {
          background: #e3f2fd;
          color: #1976d2;
          font-weight: 500;
        }
      }
    }

    .profile-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .profile-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
} 