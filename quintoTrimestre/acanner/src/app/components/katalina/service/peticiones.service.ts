import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PeticionesService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  guardarPerfil(perfilData: any) {
    const url = `${this.apiUrl}/perfiles`; // Adjust the URL according to your API structure
    return this.http.post(url, perfilData);
  }
}

