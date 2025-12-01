import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsService, SessionRequest } from '../../services/sessions.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  // ⭐ UPDATED — dynamic from login
  userId = Number(localStorage.getItem('userId'));

  sessions: any[] = [];
  editId: number | null = null;
  message = '';
  loading = false;

  sessionForm = new FormGroup({
    sessionType: new FormControl('', Validators.required),
    duration: new FormControl<number | null>(null, Validators.required),
    notes: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required)
  });

  constructor(private sessionService: SessionsService) {}

  ngOnInit(): void {

    // ⭐ UPDATED — session expired check
    if (!this.userId) {
      this.message = "Session expired. Please login again.";
      return;
    }

    this.loadSessions();
  }

  loadSessions() {
    this.loading = true;

    this.sessionService.getSessions(this.userId).subscribe({
      next: (res) => {
        this.sessions = res;
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load sessions';
        this.loading = false;
      }
    });
  }

  submitSession() {
    if (this.sessionForm.invalid) return;

    // ⭐ UPDATED — dynamic userId
    const payload: SessionRequest = {
      userId: this.userId,
      sessionType: this.sessionForm.value.sessionType!,
      duration: this.sessionForm.value.duration!,
      notes: this.sessionForm.value.notes!,
      date: this.sessionForm.value.date!
    };

    this.loading = true;

    if (this.editId) {
      // UPDATE
      this.sessionService.updateSession(this.editId, payload).subscribe({
        next: () => {
          this.message = 'Session updated!';
          this.cancelEdit();
          this.loadSessions();
        },
        error: () => {
          this.message = 'Update failed';
          this.loading = false;
        }
      });

    } else {
      // CREATE
      this.sessionService.addSession(payload).subscribe({
        next: () => {
          this.message = 'Session added!';
          this.sessionForm.reset();
          this.loadSessions();
        },
        error: () => {
          this.message = 'Failed to add session';
          this.loading = false;
        }
      });
    }
  }

  editSession(s: any) {
    this.editId = s.id;

    this.sessionForm.patchValue({
      sessionType: s.sessionType,
      duration: s.duration,
      notes: s.notes,
      date: s.date
    });
  }

  cancelEdit() {
    this.editId = null;
    this.sessionForm.reset();
  }

  deleteSession(id: number) {
    if (!confirm('Delete this session?')) return;

    this.sessionService.deleteSession(id).subscribe({
      next: () => {
        this.message = 'Session deleted!';
        this.loadSessions();
      }
    });
  }
}
