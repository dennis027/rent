import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}clients/`); // No need to manually set headers (handled by interceptor)
  }


  addUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}clients/`, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}clients/${id}/`, data);
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}clients/${id}/`);
  }

}
