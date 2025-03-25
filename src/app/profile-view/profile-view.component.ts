import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogContent } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-view',
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogContent,
    MatIconModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  user: any;

  @Input() userData = { Name: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router 
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.getFavoriteMovies();
    });
  }

  getFavoriteMovies(): void {
    const user = localStorage.getItem('user') || '';
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.favoriteMovies = resp.FavoriteMovies;
    });
  }

  addFavoriteMovie(movieId: string): void {
    const user = localStorage.getItem('user') || '';
    this.fetchApiData.addUserFavoriteMovies(user, movieId).subscribe(() => {
      this.getFavoriteMovies();
      this.snackBar.open('Added to favorites', 'OK', {
        duration: 2000
      });
    });
  }

  removeFavoriteMovie(movieId: string): void {
    const user = localStorage.getItem('user') || '';
    this.fetchApiData.deleteUserFavoriteMovie(user, movieId).subscribe(() => {
      this.getFavoriteMovies();
      this.snackBar.open('Removed from favorites', 'OK', {
        duration: 2000
      });
    });
  }

  editUser(): void {
    this.router.navigate(['profile/edit']);
  }

  updateProfile(): void {
    const user = localStorage.getItem('user') || '';
    this.fetchApiData.editUser(user, this.userData).subscribe(() => {
      this.snackBar.open('Profile updated', 'OK', {
        duration: 2000
      });
    });
  }

  deleteUser(): void {
    const user = localStorage.getItem('user') || '';
    this.fetchApiData.deleteUser(user).subscribe(() => {
      localStorage.clear();
      this.router.navigate(['welcome']);
      this.snackBar.open('User deleted', 'OK', {
        duration: 2000
      });
    });
  }
}