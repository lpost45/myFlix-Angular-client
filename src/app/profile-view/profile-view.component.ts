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
  userData: any = {};
  favoriteMovies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }

  ngOnInit(): void {
    this.getUser();
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData, {
      Name: this.userData.Name,
      Password: this.userData.Password,
      Email: this.userData.Email,
      Birthday: this.userData.Birthday
    }).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.Password,
        token: this.userData.token,
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getFavoriteMovies();
    }, (err: any) => {
      console.log(err);
    })
  }

  getUser(): void {
    this.fetchApiData.getUser().subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.Password,
        token: this.userData.token,
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getFavoriteMovies();
    }, (err: any) => {
      console.log(err);
    })
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.favoriteMovies = res.filter((movie: any) => {
        return this.userData.FavoriteMovies.includes(movie._id);
      });
    }
      , (err: any) => {
        console.log(err);
      }
    )
  }

  removeFavoriteMovie(movie: any): void {
    this.fetchApiData.deleteUserFavoriteMovie(this.userData._id, movie.title).subscribe((res: any) => {
      this.userData.FavoriteMovies = res.FavoriteMovies;
      this.getFavoriteMovies();
    }, (err: any) => {
      console.log(err);
    })
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }

  goToMovies(): void {
    this.router.navigate(['movies']);
  }
}