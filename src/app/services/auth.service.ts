import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'user' | 'provider';
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private users: User[] = [];

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      console.log('Mevcut kullanıcı:', user);
      this.currentUserSubject.next(user);
    }

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
      console.log('Kayıtlı kullanıcılar:', this.users);
    }
  }

  register(username: string, password: string, fullName: string, role: 'user' | 'provider'): boolean {
    console.log('Kayıt isteği:', { username, fullName, role });
    
    // Kullanıcı adı kontrolü
    if (this.users.some(u => u.username === username)) {
      console.log('Kullanıcı adı zaten kullanımda');
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      fullName,
      role
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    console.log('Yeni kullanıcı kaydedildi:', newUser);
    return true;
  }

  login(username: string, password: string): boolean {
    console.log('Giriş denemesi:', username);
    
    const user = this.users.find(u => 
      u.username === username && 
      u.password === password
    );

    if (user) {
      console.log('Giriş başarılı. Kullanıcı:', user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    console.log('Giriş başarısız');
    return false;
  }

  logout(): void {
    console.log('Çıkış yapıldı');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    console.log('Mevcut kullanıcı bilgisi istendi:', user);
    return user;
  }

  isLoggedIn(): boolean {
    const isLoggedIn = !!this.currentUserSubject.value;
    console.log('Giriş durumu kontrolü:', isLoggedIn);
    return isLoggedIn;
  }

  isProvider(): boolean {
    const user = this.currentUserSubject.value;
    const isProvider = user?.role === 'provider';
    console.log('Hizmet sağlayıcı kontrolü:', { user, isProvider });
    return isProvider;
  }

  // Tüm kullanıcıları temizle
  clearAllUsers(): void {
    // LocalStorage'dan kullanıcı verilerini temizle
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userAppointments');
    
    // Servis değişkenlerini sıfırla
    this.users = [];
    this.currentUserSubject.next(null);
    
    console.log('Tüm kullanıcı verileri temizlendi');
  }
} 