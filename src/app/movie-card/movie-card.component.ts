import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialogContent, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { title } from 'process';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, MatCardModule, MatDialogContent, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      console.log('API Response:', resp);
      this.movies = resp;
    });
  }

  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem('user') || '');
    console.log('user', user);
    let icon = document.getElementById(`${movie._id}-favorite-icon`);

    if (user.FavMovies.includes(movie._id)) {
      this.fetchApiData.deleteUserFavoriteMovie(user.id, movie._id).subscribe(
        (res) => {
          icon?.setAttribute('fontIcon', 'favorite_border');

          console.log('del success');
          console.log(res);
          user = res;
          console.log('user', user);
          localStorage.setItem('user', JSON.stringify(user));
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.fetchApiData.addUserFavoriteMovies(user.id, movie._id).subscribe(
        (res) => {
          icon?.setAttribute('fontIcon', 'favorite');

          console.log('add success');
          console.log(res);
          // user.FavMovies = res.favoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
        },
        (err) => {
          console.error(err);
        }
      );
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // This function will open the movie details dialog
  openDetailsDialog(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: { title: movie.Title, content: movie.Description },
      width: '500px',
    });
  }

  // This function will open the genre details dialog
  openGenreDialog(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: { title: movie.Genre.Name, content: movie.Genre.Description },
      width: '500px',
    });
  }

  // This function will open the director details dialog
  openDirectorDialog(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: { title: movie.Director.Name, content: String(movie.Director.Bio) },
      width: '500px',
    });
  }

  // This function will open the user profile dialog
  openProfileDialog(): void {
    this.dialog.open(MessageBoxComponent, {
      width: '500px',
    });
  }

  // This function will allow the user to log out
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
    this.snackBar.open('Logged out successfully', 'OK', {
      duration: 2000,
    });
  }

  // This function will open the user profile dialog
  openUserProfileDialog(): void {
    this.router.navigate(['profile']);
  }
}
