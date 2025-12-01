import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: any;
  loading = false;
  message = '';
  editMode = false;

  // ⭐ UPDATED — full editable profile form
  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    specializations: new FormControl(''),
    age: new FormControl<number | null>(null),
    height: new FormControl<number | null>(null),
    weight: new FormControl<number | null>(null),
  });

  // ⭐ UPDATED — get real logged-in user
  userId = Number(localStorage.getItem('userId'));

  constructor(private userService: UserService) {}

  ngOnInit(): void {

    // ⭐ UPDATED — session check
    if (!this.userId) {
      this.message = "Session expired. Please login again.";
      return;
    }

    this.loadUser();
  }

  loadUser() {
    this.loading = true;

    // ⭐ UPDATED — dynamic ID
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res;

        // ⭐ UPDATED — load into form
        this.profileForm.patchValue({
          name: res.name,
          email: res.email,
          specializations: res.specializations,
          age: res.age,
          height: res.height,
          weight: res.weight
        });

        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.loadUser(); // reload original data
  }

  updateProfile() {
    this.loading = true;

    // ⭐ UPDATED — dynamic ID and proper payload
    this.userService.updateUser(this.userId, this.profileForm.value).subscribe({
      next: (res) => {
        this.user = res;
        this.message = 'Profile updated!';
        this.editMode = false;
        this.loading = false;
      },
      error: () => {
        this.message = 'Update failed!';
        this.loading = false;
      }
    });
  }
}
