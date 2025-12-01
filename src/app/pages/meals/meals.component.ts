import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MealsService, MealRequest } from '../../services/meals.service';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {

  // ⭐ UPDATED — dynamic logged-in user ID
  userId = Number(localStorage.getItem('userId'));

  meals: any[] = [];
  loading = false;
  message = '';
  editId: number | null = null;

  mealForm = new FormGroup({
    mealType: new FormControl('', Validators.required),
    items: new FormControl('', Validators.required),
    calories: new FormControl<number | null>(null, Validators.required),
    date: new FormControl('', Validators.required),
  });

  constructor(private mealsService: MealsService) {}

  ngOnInit(): void {

    // ⭐ UPDATED — session check
    if (!this.userId) {
      this.message = "Session expired. Please login again.";
      return;
    }

    this.loadMeals();
  }

  loadMeals() {
    this.loading = true;

    this.mealsService.getMeals(this.userId).subscribe({
      next: (res) => {
        this.meals = res;
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load meals';
        this.loading = false;
      }
    });
  }

  submitMeal() {
    if (this.mealForm.invalid) return;

    // ⭐ UPDATED — Correct payload using dynamic userId
    const payload: MealRequest = {
      userId: this.userId,
      mealType: this.mealForm.value.mealType!,
      items: this.mealForm.value.items!,
      calories: this.mealForm.value.calories!,
      date: this.mealForm.value.date!,
    };

    this.loading = true;

    if (this.editId) {
      // UPDATE request
      this.mealsService.updateMeal(this.editId, payload).subscribe({
        next: () => {
          this.message = 'Meal updated!';
          this.cancelEdit();
          this.loadMeals();
        },
        error: () => {
          this.message = 'Update failed';
          this.loading = false;
        }
      });

    } else {
      // CREATE request
      this.mealsService.addMeal(payload).subscribe({
        next: () => {
          this.message = 'Meal added!';
          this.mealForm.reset();
          this.loadMeals();
        },
        error: () => {
          this.message = 'Failed to add meal';
          this.loading = false;
        }
      });
    }
  }

  editMeal(meal: any) {
    this.editId = meal.id;

    // ⭐ Some APIs return foodItems instead of items
    this.mealForm.patchValue({
      mealType: meal.mealType,
      items: meal.items || meal.foodItems,
      calories: meal.calories,
      date: meal.date
    });
  }

  cancelEdit() {
    this.editId = null;
    this.mealForm.reset();
  }

  deleteMeal(id: number) {
    if (!confirm('Delete this meal?')) return;

    this.mealsService.deleteMeal(id).subscribe({
      next: () => {
        this.message = 'Meal deleted!';
        this.loadMeals();
      }
    });
  }
}
