import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://127.0.0.1:8000/api/random-location';

  constructor(private http: HttpClient) {}

  getRandomLocation(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
