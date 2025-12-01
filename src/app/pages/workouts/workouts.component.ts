import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkoutsService, WorkoutRequest } from '../../services/workouts.service';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {

  // ⭐ UPDATED — use logged-in user's ID
  userId = Number(localStorage.getItem('userId'));

  workouts: any[] = [];
  message = '';
  loading = false;

  editingWorkoutId: number | null = null;

  workoutForm = new FormGroup({
    type: new FormControl('', Validators.required),
    duration: new FormControl<number | null>(null, Validators.required),
    calories: new FormControl<number | null>(null, Validators.required),
    date: new FormControl('', Validators.required)
  });

  constructor(private workoutService: WorkoutsService) {}

  ngOnInit(): void {

    // ⭐ UPDATED — session check
    if (!this.userId) {
      this.message = "Session expired. Please login again.";
      return;
    }

    this.loadWorkouts();
  }

  loadWorkouts() {
    this.loading = true;

    this.workoutService.getWorkouts(this.userId).subscribe({
      next: (res) => {
        this.workouts = res;
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load workouts';
        this.loading = false;
      }
    });
  }

  submitWorkout() {
    if (this.workoutForm.invalid) return;

    this.loading = true;

    // ⭐ UPDATED — use dynamic userId
    const payload: WorkoutRequest = {
      userId: this.userId,
      type: this.workoutForm.value.type!,
      duration: this.workoutForm.value.duration!,
      calories: this.workoutForm.value.calories!,
      date: this.workoutForm.value.date!,
    };

    if (this.editingWorkoutId) {

      // UPDATE
      this.workoutService.updateWorkout(this.editingWorkoutId, payload).subscribe({
        next: () => {
          this.message = 'Workout updated!';
          this.cancelEdit();
          this.loadWorkouts();
        },
        error: () => {
          this.message = 'Update failed';
          this.loading = false;
        }
      });

    } else {

      // CREATE
      this.workoutService.createWorkout(payload).subscribe({
        next: () => {
          this.message = 'Workout created!';
          this.workoutForm.reset();
          this.loadWorkouts();
        },
        error: () => {
          this.message = 'Create failed';
          this.loading = false;
        }
      });
    }
  }

  editWorkout(w: any) {
    this.editingWorkoutId = w.id;

    this.workoutForm.patchValue({
      type: w.type,
      duration: w.duration,
      calories: w.calories,
      date: w.date
    });
  }

  cancelEdit() {
    this.editingWorkoutId = null;
    this.workoutForm.reset();
  }

  deleteWorkout(id: number) {
    if (!confirm('Are you sure?')) return;

    this.workoutService.deleteWorkout(id).subscribe({
      next: () => {
        this.message = 'Workout deleted!';
        this.loadWorkouts();
      }
    });
  }
}
