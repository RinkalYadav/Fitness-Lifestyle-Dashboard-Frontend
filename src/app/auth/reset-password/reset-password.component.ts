import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  message = '';
  loading = false;

  form = new FormGroup({
    otp: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required)
  });

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.auth.resetPassword(this.form.value).subscribe({
      next: (res) => {
        this.message = res.message;
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to reset password!';
        this.loading = false;
      }
    });
  }
}
