import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const loginAPI = environment.apiUrl+'login/'


const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
}



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) {


   }

   loginUser(data: any): Observable<any> {
    return this.http.post(loginAPI, data); // Ensure this.apiUrl is correct
  }

}


