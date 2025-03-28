import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HousesService {

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}houses/`); 
  }

  addHouses(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}houses/`, data);
  }

  updateHouse(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}houses/${id}/`, data);
  }
  deleteHouses(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}houses/${id}/`);
  }



}