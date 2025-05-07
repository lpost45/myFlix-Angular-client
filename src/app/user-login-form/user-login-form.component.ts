import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Name: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        const user = {
          ...result.user,
          id: result.user._id,
          password: this.userData.Password,
          token: result.token,
        };
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.dialogRef.close();
        this.router.navigate(['movies']);
        this.snackBar.open(`Login success, Welcome ${result.user.Name}`, 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        // Handle login failure
        console.error('Login failed:', error);
        this.snackBar.open(
          error.error?.message || 'Login failed. Please try again.',
          'OK',
          { duration: 2000 }
        );
      }
    );
  }
}
