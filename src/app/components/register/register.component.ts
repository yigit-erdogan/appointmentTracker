import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Üye Ol</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Kullanıcı Adı</mat-label>
              <input matInput formControlName="username" required>
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                Kullanıcı adı zorunludur
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Şifre</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Şifre zorunludur
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Şifre en az 6 karakter olmalıdır
              </mat-error>
            </mat-form-field>

            <div class="role-selection">
              <h3>Kullanıcı Tipi</h3>
              <div class="role-options">
                <div class="role-option" 
                     [class.selected]="selectedRole === 'user'"
                     (click)="selectRole('user')">
                  <mat-icon>person</mat-icon>
                  <span>Kişisel</span>
                </div>
                <div class="role-option"
                     [class.selected]="selectedRole === 'provider'"
                     (click)="selectRole('provider')">
                  <mat-icon>business</mat-icon>
                  <span>Hizmet Sağlayıcı</span>
                </div>
              </div>
              <mat-error *ngIf="showRoleError" class="role-error">
                Lütfen bir kullanıcı tipi seçin
              </mat-error>
            </div>

            <button mat-raised-button color="primary" type="submit" class="register-button">
              Üye Ol
            </button>

            <div class="login-link">
              Zaten hesabınız var mı? 
              <a mat-button color="primary" routerLink="/login">Giriş Yap</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }

    .register-card {
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

    .role-selection {
      h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .role-options {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }

    .role-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f5f5f5;
      }

      &.selected {
        border-color: #1976d2;
        background-color: #e3f2fd;

        mat-icon {
          color: #1976d2;
        }

        span {
          color: #1976d2;
        }
      }

      mat-icon {
        font-size: 24px;
        height: 24px;
        width: 24px;
        color: #666;
      }

      span {
        font-size: 14px;
        color: #666;
      }
    }

    .role-error {
      font-size: 12px;
      margin-top: 4px;
    }

    .register-button {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }

    .login-link {
      text-align: center;
      margin-top: 16px;
      color: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedRole: 'user' | 'provider' | null = null;
  showRoleError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  selectRole(role: 'user' | 'provider'): void {
    this.selectedRole = role;
    this.showRoleError = false;
  }

  onSubmit(): void {
    if (!this.selectedRole) {
      this.showRoleError = true;
      return;
    }

    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      const success = this.authService.register(username, password, username, this.selectedRole);
      
      if (success) {
        this.snackBar.open('Kayıt başarılı! Giriş yapabilirsiniz.', 'Tamam', {
          duration: 3000
        });
        this.router.navigate(['/login']);
      } else {
        this.snackBar.open('Kayıt başarısız. Bu kullanıcı adı zaten kullanılıyor olabilir.', 'Tamam', {
          duration: 3000
        });
      }
    }
  }
} 