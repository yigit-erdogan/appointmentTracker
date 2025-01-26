import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar *ngIf="!isAuthPage" color="primary">
      <span routerLink="/appointments" style="cursor: pointer">Randevu Takipçisi</span>
      <span class="spacer"></span>
      
      <ng-container *ngIf="authService.isLoggedIn()">
        <!-- Hizmet sağlayıcılar için Randevu Talepleri linki -->
        <ng-container *ngIf="isProviderUser">
          <a 
            mat-button 
            routerLink="/provider"
            class="nav-link">
            <mat-icon>list_alt</mat-icon>
            Randevu Talepleri
          </a>
        </ng-container>

        <span class="user-info">
          <mat-icon>person</mat-icon>
          <span class="user-type">{{ isProviderUser ? 'Hizmet Sağlayıcı' : 'Kişisel Hesap' }}</span>
          <span class="username">{{ currentUser?.username }}</span>
        </span>
        
        <button mat-raised-button color="warn" (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          Çıkış
        </button>
      </ng-container>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      margin: 0 16px;
      font-size: 14px;
      
      mat-icon {
        margin-right: 8px;
      }

      .user-type {
        background: rgba(255, 255, 255, 0.1);
        padding: 4px 8px;
        border-radius: 12px;
        margin-right: 8px;
      }

      .username {
        font-weight: 500;
      }
    }

    .nav-link {
      margin-right: 16px;
      display: inline-flex;
      align-items: center;
      
      mat-icon {
        margin-right: 8px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isProviderUser = false;
  currentUser: { username: string } | null = null;
  isAuthPage = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // URL değişikliklerini takip et
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Login veya register sayfasında mıyız kontrol et
      this.isAuthPage = event.url === '/login' || event.url === '/register';
    });
  }

  ngOnInit() {
    // Kullanıcı değişikliklerini takip et
    this.authService.currentUser$.subscribe(user => {
      console.log('Kullanıcı değişti:', user);
      this.isProviderUser = user?.role === 'provider';
      this.currentUser = user;
      console.log('Hizmet sağlayıcı durumu:', this.isProviderUser);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
