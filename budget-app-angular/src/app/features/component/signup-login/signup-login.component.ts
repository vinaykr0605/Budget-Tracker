import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { User } from './models/User';
import { AuthService } from './services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-login.component.html',
  styleUrls: ['./signup-login.component.css']
})
export class SignupLoginComponent implements OnInit {
  isLoginMode = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isLoginMode = data['isLoginMode'];
      this.errorMessage = '';
    });
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  hasError(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    return !!((control?.touched || control?.dirty) && control?.hasError(errorName));
  }

  onLoginSubmit(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const user: User = this.loginForm.value;

    this.authService.login(user).subscribe({
      error: (error: HttpErrorResponse) => {
        if (error.status === 0 || error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = error.error?.message || 'An unknown error occurred.';
        }
      }
    });
  }

  onSignupSubmit(): void {
    this.errorMessage = '';
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const user: User = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.authService.register(user).subscribe({
      error: (error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.errorMessage = 'Could not connect to the server.';
        } else if (error.error?.includes('already exists')) {
          this.errorMessage = 'This email address already exists.';
        } else {
          this.errorMessage = error.error?.message || 'An unknown error occurred.';
        }
      }
    });
  }
}
