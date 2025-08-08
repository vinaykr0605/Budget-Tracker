import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../features/component/signup-login/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isAuthenticated: Signal<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated;
  }

  logout(): void {
    this.authService.logout();
  }

}

