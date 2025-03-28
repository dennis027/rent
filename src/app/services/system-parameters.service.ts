import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SystemParametersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}system-variables/`); 
  }

  updateSystemParams(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}system-variables/`, data);
  }
}
