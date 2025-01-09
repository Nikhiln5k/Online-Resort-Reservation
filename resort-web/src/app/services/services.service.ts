import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/enviornments/enviornment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic API call method
  commonAPI(
    httpRequest: string,
    url: string,
    reqBody: any = null,
    reqHeader: any = { 'Content-Type': 'application/json' }
  ): Observable<any> {
    const options = {
      headers: new HttpHeaders(reqHeader),
      body: reqBody,
    };

    switch (httpRequest.toUpperCase()) {
      case 'POST':
        return this.http.post(url, reqBody, { headers: options.headers });
      case 'GET':
        return this.http.get(url, { headers: options.headers });
      case 'PUT':
        return this.http.put(url, reqBody, { headers: options.headers });
      case 'DELETE':
        return this.http.delete(url, { headers: options.headers });
      default:
        throw new Error('Unsupported HTTP request method');
    }

  }

  // Register
  register(user: any): Observable<any> {
    return this.commonAPI('POST', `${this.apiUrl}/user/register`, user);
  }

  // Login
  login(user: any): Observable<any> {
    return this.commonAPI('POST', `${this.apiUrl}/user/login`, user);
  }
  
  // Google signup
  googleSignUp(idToken: string): Observable<any> {
    const body = {idToken};
    return this.commonAPI('POST',`${this.apiUrl}/user/google-signup`, body);
  }

  // Get user details
  getUser(userId: string): Observable<any> {
    return this.commonAPI('GET', `${this.apiUrl}/user/${userId}`);
  }

  // Get user details
  updateUser(userId: string, userDetails: any): Observable<any> {
    return this.commonAPI('PUT', `${this.apiUrl}/user/${userId}`, userDetails);
  }

  // Get all rooms
  getAllRooms(page:Number, limit:Number): Observable<any> {
    return this.commonAPI('GET', `${this.apiUrl}/rooms?page=${page}&limit=${limit}`);
  }

  // Get room details
  getRoomDetails(roomId: string): Observable<any> {
    return this.commonAPI('GET', `${this.apiUrl}/rooms/${roomId}`);
  }


}
