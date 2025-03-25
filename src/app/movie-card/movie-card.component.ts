import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialogContent, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageBoxComponent } from '../message-box/message-box.component';

@Component({
  selector: 'app-movie-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogContent,
    MatIconModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  addFavoriteMovie(movieId: string): void {
    const user = localStorage.getItem('user') || '';
    this.fetchApiData.addUserFavoriteMovies(user, movieId).subscribe(() => {
      this.snackBar.open('Added to favorites', 'OK', {
        duration: 2000
      });
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // This function will open the movie details dialog
  openDetailsDialog(title: string, description: string, imagePath: string): void {
    this.dialog.open(MessageBoxComponent, {
      data: { title, description, imagePath },
      width: '500px'
    });
  }

  // This function will open the genre details dialog
  openGenreDialog(name: string, description: string): void {  
    this.dialog.open(MessageBoxComponent, {
      data: { name, description },
      width: '500px'
    });
  }

  // This function will open the director details dialog
  openDirectorDialog(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(MessageBoxComponent, {
      data: { name, bio, birth, death },
      width: '500px'
    });
  }

  // This function will open the user profile dialog
  openProfileDialog(): void {
    this.dialog.open(MessageBoxComponent, {
      width: '500px'
    });
  }
}