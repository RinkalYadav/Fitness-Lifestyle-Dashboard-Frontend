import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SessionRequest {
  userId: number;
  sessionType: string;
  duration: number;
  notes: string;
  date: string;
}

export interface SessionResponse {
  id: number;
  userId: number;
  sessionType: string;
  duration: number;
  notes: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private BASE_URL = 'http://fitness-lifestyle-dashboard-backend.onrender.com/api/sessions';

  constructor(private http: HttpClient) {}

  private auth() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  }

  addSession(payload: SessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(this.BASE_URL, payload, this.auth());
  }

  getSessions(userId: number): Observable<SessionResponse[]> {
    return this.http.get<SessionResponse[]>(`${this.BASE_URL}?userId=${userId}`, this.auth());
  }

  updateSession(id: number, payload: SessionRequest): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(`${this.BASE_URL}/${id}`, payload, this.auth());
  }

  deleteSession(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, this.auth());
  }
}
