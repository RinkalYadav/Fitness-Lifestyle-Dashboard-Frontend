import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ScheduleRequest {
  userId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  private BASE_URL = 'http://localhost:8080/api/schedules';

  constructor(private http: HttpClient) {}

  private auth() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  }

  addSchedule(payload: ScheduleRequest): Observable<ScheduleResponse> {
    return this.http.post<ScheduleResponse>(this.BASE_URL, payload, this.auth());
  }

  getSchedules(userId: number): Observable<ScheduleResponse[]> {
    return this.http.get<ScheduleResponse[]>(`${this.BASE_URL}?userId=${userId}`, this.auth());
  }

  updateSchedule(id: number, payload: ScheduleRequest): Observable<ScheduleResponse> {
    return this.http.put<ScheduleResponse>(`${this.BASE_URL}/${id}`, payload, this.auth());
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, this.auth());
  }
}
