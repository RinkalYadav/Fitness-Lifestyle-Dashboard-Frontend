import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyticsSummary {
  workoutMinutes: number;
  sessionMinutes: number;
  rangeStart: string;     // YYYY-MM-DD
  workoutCalories: number;
  mealsCount: number;
  workoutsCount: number;
  sessionsCount: number;
  rangeEnd: string;       // YYYY-MM-DD
  mealsCalories: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private BASE_URL = 'http://fitness-lifestyle-dashboard-backend.onrender.com/api/analytics/summary';

  constructor(private http: HttpClient) {}

  private auth() {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
    };
  }

  getSummary(userId: number): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${this.BASE_URL}?userId=${userId}`, this.auth());
    // If backend supports date filters: &start=YYYY-MM-DD&end=YYYY-MM-DD
  }
}
