import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'http://fitness-lifestyle-dashboard-backend.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/forgot-password`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/reset-password`, data);
  }

  getAuthHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
}
isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }

  getUserName(): string | null {
    return localStorage.getItem('name');
  }

}
