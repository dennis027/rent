import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}receipts/`); 
  }

  addReceipts(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}receipts/`, data);
  }

  updateReceipt(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}receipts/${id}/`, data);
  }
  deleteReceipt(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}receipts/${id}/`);
  }


}