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

  // Making the api call for the user registration endpoint
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

  private extractResponseData(res: any): any {
    return res;
  }
}
