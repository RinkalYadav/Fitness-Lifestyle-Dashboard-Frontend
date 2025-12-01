import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  message = '';
  loading = false;

  loginForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {

        // ------------------------------
        // SAVE FULL USER DATA FROM LOGIN
        // ------------------------------
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.id);          // ⭐ IMPORTANT
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
        localStorage.setItem('role', res.role);
        localStorage.setItem('specializations', res.specializations);

        // Redirect to profile after login
        this.router.navigate(['/profile']);

        this.loading = false;
      },
      error: () => {
        this.message = "Login failed! Invalid credentials.";
        this.loading = false;
      }
    });
  }
}
