import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WorkoutRequest {
  userId: number;
  type: string;
  duration: number;
  calories: number;
  date: string;   // YYYY-MM-DD
}

export interface WorkoutResponse {
  id: number;
  userId: number;
  type: string;
  duration: number;
  calories: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {

  private BASE_URL = 'http://localhost:8080/api/workouts';

  constructor(private http: HttpClient) {}

  private auth() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  }

  createWorkout(payload: WorkoutRequest): Observable<WorkoutResponse> {
    return this.http.post<WorkoutResponse>(this.BASE_URL, payload, this.auth());
  }

  getWorkouts(userId: number): Observable<WorkoutResponse[]> {
    return this.http.get<WorkoutResponse[]>(`${this.BASE_URL}?userId=${userId}`, this.auth());
  }

  updateWorkout(id: number, payload: WorkoutRequest): Observable<WorkoutResponse> {
    return this.http.put<WorkoutResponse>(`${this.BASE_URL}/${id}`, payload, this.auth());
  }

  deleteWorkout(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, this.auth());
  }
}
