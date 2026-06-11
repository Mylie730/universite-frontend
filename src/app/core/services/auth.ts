import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LoginRequest } from '../../models/login-request';
import { AuthResponse } from '../../models/auth-response';
import { ChangePasswordRequest } from '../../models/change-password-request';
import { ApiMessageResponse } from '../../models/api-message-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  createUser(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/create-user`, userData);
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(`${this.apiUrl}/change-password`, payload);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  saveToken(token: string): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem('token', token);
  }

  saveUserInfo(userInfo: AuthResponse): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem('userEmail', userInfo.email);
    localStorage.setItem('userRole', userInfo.role);
    localStorage.setItem('userName', `${userInfo.prenom} ${userInfo.nom}`);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isEtudiant(): boolean {
    return this.getUserRole() === 'ETUDIANT';
  }

  isEnseignant(): boolean {
    return this.getUserRole() === 'ENSEIGNANT' || this.getUserRole() === 'ENSEIGNANT_ASSOCIE';
  }

  logout(): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }
}
