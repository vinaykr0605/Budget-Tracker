import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/authresponse';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private tokenKey = 'auth_token';

  currentToken = signal<string | null>(localStorage.getItem(this.tokenKey));
  isAuthenticated = computed(() => !!this.currentToken());

  constructor(private http: HttpClient, private router: Router) {
    effect(() => {
      const token = this.currentToken();
      if (token) {
        localStorage.setItem(this.tokenKey, token);
      } else {
        localStorage.removeItem(this.tokenKey);
      }
    });
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Login`, credentials).pipe(
      tap(response => {
        this.currentToken.set(response.token);
        this.router.navigate(['/transactions']);
      })
    );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, userData).pipe(
      tap(response => {
        this.currentToken.set(response.token);
        this.router.navigate(['/transactions']);
      })
    );
  }

  logout(): void {
    this.currentToken.set(null);
    this.router.navigate(['/login']);
  }
}
