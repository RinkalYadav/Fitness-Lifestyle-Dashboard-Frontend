import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { GoalsService, GoalRequest, GoalResponse } from '../../services/goals.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {

  // ⭐ UPDATED — Get userId from login session
  userId = Number(localStorage.getItem('userId'));

  loading = false;
  message = '';
  goals: GoalResponse[] = [];

  goalForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    targetDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    currentWeight: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    targetWeight: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
  });

  constructor(private goalsService: GoalsService) {}

  ngOnInit(): void {

    // ⭐ UPDATED — Session expired check
    if (!this.userId) {
      this.message = "Session expired. Please login again.";
      return;
    }

    this.fetchGoals();
  }

  fetchGoals() {
    this.loading = true;

    this.goalsService.getGoals(this.userId).subscribe({
      next: (res) => {
        this.goals = res;
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load goals';
        this.loading = false;
      }
    });
  }

  submitGoal() {
    if (this.goalForm.invalid) {
      this.goalForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.goalForm.value as GoalRequest;

    this.goalsService.createGoal(this.userId, payload).subscribe({
      next: () => {
        this.message = 'Goal created successfully!';
        this.goalForm.reset();
        this.fetchGoals();
      },
      error: () => {
        this.message = 'Failed to create goal';
        this.loading = false;
      }
    });
  }

  hasError(name: string, error: string) {
    const c = this.goalForm.get(name);
    return !!(c && c.touched && c.hasError(error));
  }
}
