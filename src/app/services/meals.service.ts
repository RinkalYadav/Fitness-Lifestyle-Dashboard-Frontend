import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MealRequest {
  userId: number;
  mealType: string;
  items: string;
  calories: number;
  date: string;
}

export interface MealResponse {
  id: number;
  userId: number;
  mealType: string;
  foodItems: string | null;
  calories: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private BASE_URL = 'http://localhost:8080/api/meals';

  constructor(private http: HttpClient) {}

  private auth() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  }

  addMeal(payload: MealRequest): Observable<MealResponse> {
    return this.http.post<MealResponse>(this.BASE_URL, payload, this.auth());
  }

  getMeals(userId: number): Observable<MealResponse[]> {
    return this.http.get<MealResponse[]>(`${this.BASE_URL}?userId=${userId}`, this.auth());
  }

  updateMeal(id: number, payload: MealRequest): Observable<MealResponse> {
    return this.http.put<MealResponse>(`${this.BASE_URL}/${id}`, payload, this.auth());
  }

  deleteMeal(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, this.auth());
  }
}
