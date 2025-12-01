import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  message = '';
  loading = false;

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    role: new FormControl('USER'),
    specializations: new FormControl('', Validators.required),
    age: new FormControl(0, Validators.required),
    height: new FormControl(0, Validators.required),
    weight: new FormControl(0, Validators.required)
  });

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.auth.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.message = res.message;
        this.loading = false;
      },
      error: () => {
        this.message = "Registration failed!";
        this.loading = false;
      }
    });
  }
}
