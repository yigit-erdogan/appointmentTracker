import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Giriş Yap</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Kullanıcı Adı</mat-label>
              <input matInput formControlName="username" required>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                Kullanıcı adı zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Şifre</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Şifre zorunludur
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="login-button">
              Giriş Yap
            </button>

            <div class="register-link">
              Hesabınız yok mu? 
              <a mat-button color="primary" routerLink="/register">Üye Ol</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;

      mat-card-header {
        margin-bottom: 20px;
        
        mat-card-title {
          font-size: 24px;
          margin: 0;
        }
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 16px;

        mat-form-field {
          width: 100%;
        }
      }
    }

    .login-button {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }

    .register-link {
      text-align: center;
      margin-top: 16px;
      color: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const success = this.authService.login(username, password);
      
      if (success) {
        this.router.navigate(['/appointments']);
      } else {
        this.snackBar.open('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', 'Tamam', {
          duration: 3000
        });
      }
    }
  }
} 