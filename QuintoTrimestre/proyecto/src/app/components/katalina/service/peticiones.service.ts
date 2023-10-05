import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {

  apiUrl = 'http://localhost:3000'

  constructor(private http:HttpClient) { }

  login(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/api/perfiles`, data)
  }
}
