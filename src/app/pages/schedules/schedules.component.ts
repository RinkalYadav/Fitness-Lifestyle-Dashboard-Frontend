import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SchedulesService, ScheduleRequest } from '../../services/schedules.service';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {

  // ⭐ UPDATED — use logged-in userId from localStorage
  userId = Number(localStorage.getItem('userId'));

  schedules: any[] = [];
  editId: number | null = null;
  message = '';
  loading = false;

  scheduleForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.required),
    endTime: new FormControl('', Validators.required)
  });

  constructor(private scheduleService: SchedulesService) {}

  ngOnInit(): void {

    // ⭐ UPDATED — session expired check
    if (!this.userId) {
      this.message = "Session expired. Please login again.";
      return;
    }

    this.loadSchedules();
  }

  loadSchedules() {
    this.loading = true;

    this.scheduleService.getSchedules(this.userId).subscribe({
      next: (res) => {
        this.schedules = res;
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load schedules';
        this.loading = false;
      }
    });
  }

  submitSchedule() {
    if (this.scheduleForm.invalid) return;

    // ⭐ UPDATED — correct dynamic userId for production
    const payload: ScheduleRequest = {
      userId: this.userId,
      title: this.scheduleForm.value.title!,
      description: this.scheduleForm.value.description!,
      startTime: this.scheduleForm.value.startTime!,
      endTime: this.scheduleForm.value.endTime!,
    };

    this.loading = true;

    if (this.editId) {
      // UPDATE SCHEDULE
      this.scheduleService.updateSchedule(this.editId, payload).subscribe({
        next: () => {
          this.message = 'Schedule updated!';
          this.cancelEdit();
          this.loadSchedules();
        },
        error: () => {
          this.message = 'Update failed';
          this.loading = false;
        }
      });

    } else {
      // CREATE SCHEDULE
      this.scheduleService.addSchedule(payload).subscribe({
        next: () => {
          this.message = 'Schedule added!';
          this.scheduleForm.reset();
          this.loadSchedules();
        },
        error: () => {
          this.message = 'Failed to add schedule';
          this.loading = false;
        }
      });
    }
  }

  editSchedule(sc: any) {
    this.editId = sc.id;

    this.scheduleForm.patchValue({
      title: sc.title,
      description: sc.description,
      startTime: sc.startTime,
      endTime: sc.endTime
    });
  }

  cancelEdit() {
    this.editId = null;
    this.scheduleForm.reset();
  }

  deleteSchedule(id: number) {
    if (!confirm('Delete this schedule?')) return;

    this.scheduleService.deleteSchedule(id).subscribe({
      next: () => {
        this.message = 'Schedule deleted!';
        this.loadSchedules();
      }
    });
  }
}
