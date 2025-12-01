import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GoalRequest {
  title: string;
  description: string;
  targetDate: string;      // YYYY-MM-DD
  currentWeight: number;
  targetWeight: number;
}

export interface GoalResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  targetDate: string;      // YYYY-MM-DD
  currentWeight: number;
  targetWeight: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | string;
}

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private USERS_BASE = 'http://fitness-lifestyle-dashboard-backend.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    };
  }

  /** Get all goals for a user */
  getGoals(userId: number): Observable<GoalResponse[]> {
    return this.http.get<GoalResponse[]>(
      `${this.USERS_BASE}/${userId}/goals`,
      this.authHeaders()
    );
  }

  /** Create a goal for a user */
  createGoal(userId: number, payload: GoalRequest): Observable<GoalResponse> {
    return this.http.post<GoalResponse>(
      `${this.USERS_BASE}/${userId}/goals`,
      payload,
      this.authHeaders()
    );
  }
}
