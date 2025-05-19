import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://logan-myflix-30a490a6c5c0.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {

  /**
   * Fetch a user by ID.
   * @param userId - The user's unique identifier.
   */
  getUserById(userId: string) {
    const token = localStorage.getItem('token');
    return this.http
      .get<HttpResponse<any>>(apiUrl + 'users/' + userId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch the current user.
   * @returns An observable containing the user data.
   */
  getUser() {
    const token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    return this.http
      .get<HttpResponse<any>>(apiUrl + 'users/' + user, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   * Register a new user.
   * @param userDetails - User details including name, email, etc.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log('Attempting to register with:', userDetails);

    return this.http
      .post(apiUrl + 'users', userDetails, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((response) => {
          console.log('Registration successful:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

    /**
   * Log in a user.
   * @param userDetails - Login credentials.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Store token after login
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch all movies.
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetch a movie by title.
   * @param title - The title of the movie.
   */
  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<HttpResponse<any>>(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch movies by director name.
   * @param name - Director's name.
   */
  public getDirector(name: string) {
    const token = localStorage.getItem('token');
    return this.http
      .get<HttpResponse<any>>(apiUrl + 'movies/director/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch movies by genre name.
   * @param name - Genre name.
   */
  public getGenre(name: string) {
    const token = localStorage.getItem('token');
    return this.http
      .get<HttpResponse<any>>(apiUrl + 'movies/genre/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch all users.
   */
  public getAllUsers() {
    const token = localStorage.getItem('token');
    return this.http
      .get<HttpResponse<any>>(apiUrl + 'users', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetch a user's favorite movie.
   * @param movieId - Movie ID to retrieve.
   */
  public getUserFavoriteMovies(movieId: string) {
    const token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    return this.http
      .get<HttpResponse<any>>(
        apiUrl + 'users/' + user + '/movies/' + movieId,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Add a movie to a user's favorites.
   * @param userId - User ID.
   * @param movieId - Movie ID.
   */
  public addUserFavoriteMovies(userId: string | null, movieId: string) {
    const token = localStorage.getItem('token');
    let user: any = localStorage.getItem('user');
    // console.log('user', user);
    user = JSON.parse(user);
    // console.log('user', user);
    return this.http
      .post<HttpResponse<any>>(
        apiUrl + 'users/' + user.Name + '/movies/' + movieId,
        {},
        // /users/:Name/movies/:MovieID
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Edit user information.
   * @param userDetails - Updated user data.
   */
  public editUser(
    userDetails: any,
    userData: {
      Name: string;
      Password: string;
      Email: string;
      Birthday: string;
    }
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    return this.http
      .put<HttpResponse<any>>(
        apiUrl + 'users/' + userDetails.Name,
        userDetails,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Delete a user account.
   * @param userDetails - The user to delete.
   */
  public deleteUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    return this.http
      .delete<HttpResponse<any>>(apiUrl + 'users/' + user, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Remove a movie from a user's favorites.
   * @param userId - User ID.
   * @param movieId - Movie ID.
   */
  public deleteUserFavoriteMovie(userId: string, movieId: string) {
    const token = localStorage.getItem('token');
    let user: any = localStorage.getItem('user');
    user = JSON.parse(user);
    // console.log('user', user);
    // console.log('movieId', movieId);
    return this.http
      .delete<HttpResponse<any>>(
        apiUrl + 'users/' + user.Name + '/movies/' + movieId,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Handle HTTP errors.
   * @param error - HTTP error response.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  /**
   * Extract data from the HTTP response.
   * @param res - HTTP response.
   */
  private extractResponseData(res: any): any {
    return res;
  }
}
