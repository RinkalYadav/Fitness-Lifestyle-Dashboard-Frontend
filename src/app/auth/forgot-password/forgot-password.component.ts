import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  message = '';
  loading = false;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.auth.forgotPassword(this.form.value).subscribe({
      next: (res) => {
        this.message = `${res.message} (OTP: ${res.otp})`;
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to send OTP!';
        this.loading = false;
      }
    });
  }
}
